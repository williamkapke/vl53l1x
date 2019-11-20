// based on VL53L1_LL_API_IMPLEMENTATION_VER_STRING "1.2.11.1840"
const debug = require('../debug.js')
const {
  DEVICEMEASUREMENTMODE,
  DEVICEPRESETMODE,
  DISTANCEMODE: {SHORT, MEDIUM, LONG},
  PRESETMODE: {LITE_RANGING, AUTONOMOUS, LOWPOWER_AUTONOMOUS},
  DEVICECONFIGLEVEL,
  DEVICERESULTSLEVEL,
  STATE,
  CHECKENABLE,
  OFFSETCALIBRATIONMODE,
  TUNINGPARM,
  DEVICEERROR,
  SEQUENCESTEP
} = require('./define.js')
const REG = require('./registers.js')

const LOWPOWER_AUTO_VHV_LOOP_DURATION_US  = 245
const LOWPOWER_AUTO_OVERHEAD_BEFORE_A_RANGING = 1448
const LOWPOWER_AUTO_OVERHEAD_BETWEEN_A_B_RANGING = 2100


const api_calibration = require('./api_calibration.js')
const api_core = require('./api_core.js')
const wait = require('./wait.js')


//VL53L1_DataInit
const DataInit = async (device, use2v8) => {
  debug.info('DataInit')
  if (use2v8) {
    let byte = await device.i2c.readReg(REG.PAD_I2C_HV__EXTSUP_CONFIG)
    byte = (byte & 0xfe) | 0x01;
    await device.i2c.writeReg(REG.PAD_I2C_HV__EXTSUP_CONFIG, byte)
  }

  await api_core.data_init(device, true)

  // VL53L1DevDataSet(Dev, PalState, STATE.WAIT_STATICINIT)
  device.PalState = STATE.WAIT_STATICINIT

  // VL53L1DevDataSet(Dev, CurrentParameters.PresetMode, LOWPOWER_AUTONOMOUS)
  device.CurrentParameters.PresetMode = LOWPOWER_AUTONOMOUS

  for (let i = 0; i < CHECKENABLE.NUMBER_OF_CHECKS; i++) {
    SetLimitCheckEnable(device, i, 1)
  }

  SetLimitCheckValue(device, CHECKENABLE.SIGMA_FINAL_RANGE, 18 * 65536)
  SetLimitCheckValue(device, CHECKENABLE.SIGNAL_RATE_FINAL_RANGE, 25 * 65536 / 100)
}

//VL53L1_StaticInit
const StaticInit = (device) => {
  debug.info('StaticInit')
  device.PalState = STATE.IDLE
  device.LLData.measurement_mode = DEVICEMEASUREMENTMODE.BACKTOBACK
  device.CurrentParameters.NewDistanceMode = LONG
  device.CurrentParameters.InternalDistanceMode = LONG
  device.CurrentParameters.DistanceMode = LONG

  _setPresetMode(device, LOWPOWER_AUTONOMOUS);
}

//VL53L1_PerformOffsetCalibration
const PerformOffsetCalibration = async (device, CalDistanceMilliMeter) => {
  debug.info('PerformOffsetCalibration')
  const offset_cal_mode = api_core.get_offset_calibration_mode(device.LLData)

  if (offset_cal_mode !== OFFSETCALIBRATIONMODE.MM1_MM2__STANDARD && offset_cal_mode !== OFFSETCALIBRATIONMODE.MM1_MM2__STANDARD_PRE_RANGE_ONLY) {
    throw new Error('ERROR_INVALID_PARAMS')
  }

  // needed device properties:
  return await api_calibration.run_offset_calibration(device, CalDistanceMilliMeter)
}

// VL53L1_SetPresetMode
const _setPresetMode = (device, mode) => {
  const DistanceMode = LONG;
  SetPresetMode(device, mode, DistanceMode, 1000);

  // VL53L1DevDataSet(Dev, CurrentParameters.InternalDistanceMode, DistanceMode);
  device.CurrentParameters.InternalDistanceMode = DistanceMode
  // VL53L1DevDataSet(Dev, CurrentParameters.NewDistanceMode, DistanceMode);
  device.CurrentParameters.NewDistanceMode = DistanceMode

  const us = mode === LITE_RANGING || mode === AUTONOMOUS || mode === LOWPOWER_AUTONOMOUS ? 41000 : 33333;
  SetMeasurementTimingBudgetMicroSeconds(device, us)

  SetInterMeasurementPeriodMilliSeconds(device, 1000)
}

//static
const SetPresetMode = (device, PresetMode, DistanceMode, inter_measurement_period_ms) => {
  debug.info('SetPresetMode')
  const device_preset_mode = ComputeDevicePresetMode(PresetMode, DistanceMode)

  const {
    dss_config__target_total_rate_mcps,
    phasecal_config_timeout_us,
    mm_config_timeout_us,
    range_config_timeout_us
  } = api_core.get_preset_mode_timing_cfg(device.LLData.tuning_parms, device_preset_mode)

  api_core.set_preset_mode(
      device.LLData,
      device_preset_mode,
      dss_config__target_total_rate_mcps,
      phasecal_config_timeout_us,
      mm_config_timeout_us,
      range_config_timeout_us,
      inter_measurement_period_ms
  );

  // VL53L1DevDataSet(Dev, LLData.measurement_mode, measurement_mode);
  if (PresetMode === AUTONOMOUS || PresetMode === LOWPOWER_AUTONOMOUS)
    device.LLData.measurement_mode = DEVICEMEASUREMENTMODE.TIMED
  else
    device.LLData.measurement_mode = DEVICEMEASUREMENTMODE.BACKTOBACK

  // VL53L1DevDataSet(Dev, CurrentParameters.PresetMode, PresetMode);
  device.CurrentParameters.PresetMode = PresetMode
}

//static
const ComputeDevicePresetMode = (PresetMode, DistanceMode) => {
  debug.info('ComputeDevicePresetMode')
  const devicePresetMode = {
    [LITE_RANGING]: [
      DEVICEPRESETMODE.STANDARD_RANGING_SHORT_RANGE,
      DEVICEPRESETMODE.STANDARD_RANGING,
      DEVICEPRESETMODE.STANDARD_RANGING_LONG_RANGE
    ],
    [AUTONOMOUS]: [
      DEVICEPRESETMODE.TIMED_RANGING_SHORT_RANGE,
      DEVICEPRESETMODE.TIMED_RANGING,
      DEVICEPRESETMODE.TIMED_RANGING_LONG_RANGE
    ],
    [LOWPOWER_AUTONOMOUS]: [
      DEVICEPRESETMODE.LOWPOWERAUTO_SHORT_RANGE,
      DEVICEPRESETMODE.LOWPOWERAUTO_MEDIUM_RANGE,
      DEVICEPRESETMODE.LOWPOWERAUTO_LONG_RANGE
    ]
  }
  // DISTANCEMODE values are 1,2,3... so just subtract one to pull from the array above
  return devicePresetMode[PresetMode][DistanceMode - 1]
}

//VL53L1_SetLimitCheckEnable
const SetLimitCheckEnable = (device, LimitCheckId, LimitCheckEnable) => {
  debug.info('SetLimitCheckEnable')
  let TempFix1616 = 0;

  if (LimitCheckId >= CHECKENABLE.NUMBER_OF_CHECKS) {
    throw new Error('ERROR_INVALID_PARAMS')
  }

  if (LimitCheckEnable !== 0) {
    TempFix1616 = device.CurrentParameters.LimitChecksValue[LimitCheckId]
  }

  SetLimitValue(device.LLData, LimitCheckId, TempFix1616);

  device.CurrentParameters.LimitChecksEnable[LimitCheckId] = (LimitCheckEnable === 0) ? 0 : 1
}

//static
const SetLimitValue = (LLData, LimitCheckId, value) => {
  debug.info('SetLimitValue')
  if (CHECKENABLE.SIGMA_FINAL_RANGE) {
    return api_core.set_lite_sigma_threshold(LLData, FIXPOINT1616TOFIXPOINT142(value));
  }
  if (CHECKENABLE.SIGNAL_RATE_FINAL_RANGE) {
    return api_core.set_lite_min_count_rate(LLData, FIXPOINT1616TOFIXPOINT97(value));
  }
  throw new Error('ERROR_INVALID_PARAMS')
}

// VL53L1_SetLimitCheckValue
const SetLimitCheckValue = (device, LimitCheckId, LimitCheckValue) => {
  debug.info('SetLimitCheckValue')
  if (LimitCheckId >= CHECKENABLE.NUMBER_OF_CHECKS) {
    throw new Error('ERROR_INVALID_PARAMS')
  }

  if (device.CurrentParameters.LimitChecksEnable[LimitCheckId] !== 0) {
    SetLimitValue(device.LLData, LimitCheckId, LimitCheckValue);
  }
  device.CurrentParameters.LimitChecksValue[LimitCheckId] = LimitCheckValue
}

//VL53L1_SetMeasurementTimingBudgetMicroSeconds
const SetMeasurementTimingBudgetMicroSeconds = (device, timing_budget_us) => {
  debug.info('SetMeasurementTimingBudgetMicroSeconds')
  let max_timing_budget = 550000 // FDA_MAX_TIMING_BUDGET_US

  if (timing_budget_us > 10000000) {
    throw new Error('ERROR_INVALID_PARAMS')
  }

  let mm1_enabled = GetSequenceStepEnable(device.LLData, SEQUENCESTEP.MM1)
  let mm2_enabled = GetSequenceStepEnable(device.LLData, SEQUENCESTEP.MM2)

  const timeouts = api_core.get_timeouts_us(device.LLData)

  let timing_guard = 0
  let divisor = 1

  switch (device.CurrentParameters.PresetMode) {
    case LITE_RANGING:
      timing_guard = (mm1_enabled === 1 || mm2_enabled === 1) ? 5000 : 1000
      break

    case AUTONOMOUS:
      max_timing_budget *= 2
      timing_guard = (mm1_enabled === 1 || mm2_enabled === 1) ? 26600 : 21600
      divisor = 2
      break

    case LOWPOWER_AUTONOMOUS:
      max_timing_budget *= 2
      let vhv = LOWPOWER_AUTO_VHV_LOOP_DURATION_US
      const vhv_loops = api_core.get_tuning_parm(device.LLData, TUNINGPARM.LOWPOWERAUTO_VHV_LOOP_BOUND)

      if (vhv_loops > 0) {
        vhv += vhv_loops * LOWPOWER_AUTO_VHV_LOOP_DURATION_US
      }

      timing_guard = LOWPOWER_AUTO_OVERHEAD_BEFORE_A_RANGING + LOWPOWER_AUTO_OVERHEAD_BETWEEN_A_B_RANGING + vhv
      divisor = 2
      break

    default:
      throw new Error('ERROR_MODE_NOT_SUPPORTED')
  }

  if (timing_budget_us <= timing_guard) {
    throw new Error('ERROR_INVALID_PARAMS')
  }

  let range_timeout = (timing_budget_us - timing_guard)

  if (range_timeout > max_timing_budget) {
    throw new Error('ERROR_INVALID_PARAMS')
  }

  range_timeout /= divisor

  api_core.set_timeouts_us(
    device.LLData,
    timeouts.phasecal_config_timeout_us,
    timeouts.mm_config_timeout_us,
    range_timeout
  )

  // VL53L1DevDataSet(Dev, LLData.range_config_timeout_us, TimingBudget)
  device.LLData.range_config_timeout_us = range_timeout
  // VL53L1DevDataSet(Dev, CurrentParameters.MeasurementTimingBudgetMicroSeconds, MeasurementTimingBudgetMicroSeconds)
  device.CurrentParameters.MeasurementTimingBudgetMicroSeconds = timing_budget_us
}

//VL53L1_SetInterMeasurementPeriodMilliSeconds
const SetInterMeasurementPeriodMilliSeconds = (device, intermeasurement_period) => {
  debug.info('SetInterMeasurementPeriodMilliSeconds')
  intermeasurement_period += (intermeasurement_period * 64) / 1000;
  return api_core.set_inter_measurement_period_ms(device.LLData, intermeasurement_period)
}

//VL53L1_GetSequenceStepEnable
const GetSequenceStepEnable = api_core.get_sequence_config_bit

//VL53L1_WaitDeviceBooted
const WaitDeviceBooted = (device) => {
  debug.info('WaitDeviceBooted')
  return wait.poll_for_boot_completion(device.i2c, 500); // VL53L1_BOOT_COMPLETION_POLLING_TIMEOUT_MS
}

//VL53L1_SetDistanceMode
const SetDistanceMode = (device, DistanceMode) => {
  debug.info('SetDistanceMode')
  if (DistanceMode !== SHORT &&  DistanceMode !== MEDIUM &&  DistanceMode !== LONG) {
    throw new Error('ERROR_INVALID_PARAMS')
  }

  let user_zone = api_core.get_user_zone(device.LLData.dyn_cfg)
  let inter_measurement_period_ms =  device.LLData.inter_measurement_period_ms

  const timeouts = api_core.get_timeouts_us(device.LLData)

  SetPresetMode(device,
    device.CurrentParameters.PresetMode,
    DistanceMode,
    inter_measurement_period_ms
  );

  device.CurrentParameters.InternalDistanceMode = DistanceMode
  device.CurrentParameters.NewDistanceMode = DistanceMode
  device.CurrentParameters.DistanceMode = DistanceMode

  api_core.set_timeouts_us(
    device.LLData,
    timeouts.phasecal_config_timeout_us, //PhaseCalTimeoutUs
    timeouts.mm_config_timeout_us,  //MmTimeoutUs
    timeouts.range_config_timeout_us //TimingBudget
  )

  // this was just set in set_timeouts_us(). No need to do it again.
  // VL53L1DevDataSet(Dev, LLData.range_config_timeout_us, timeouts.range_config_timeout_us);

  api_core.set_user_zone(device.LLData.dyn_cfg, user_zone);
}

//VL53L1_StartMeasurement
const StartMeasurement = async (device) => {
  debug.info('StartMeasurement')
  if (device.PalState !== STATE.IDLE) {
    throw new Error('ERROR_INVALID_COMMAND')
  }
  await api_core.init_and_start_range(device, device.LLData.measurement_mode, DEVICECONFIGLEVEL.FULL);
  device.PalState = STATE.RUNNING
}

//VL53L1_StopMeasurement
const StopMeasurement = async (device) => {
  debug.info('StopMeasurement')
  await api_core.stop_range(device)
  device.PalState = STATE.IDLE
}

//VL53L1_GetRangingMeasurementData
const GetRangingMeasurementData = async (device) => {
  debug.info('GetRangingMeasurementData')
  const results = await api_core.get_device_results(device, DEVICERESULTSLEVEL.FULL)
  const simple_data = SetSimpleData(device, 1, results.device_status, results.data0);
  simple_data.StreamCount = results.stream_count;
  return simple_data;
}

//static
const SetSimpleData = (device, active_results, device_status, presults_data) => {
  debug.info('SetSimpleData')
  let FilteredRangeStatus = presults_data.range_status & 0x1F;

  const RangeData = {
    //TimeStamp             : presults_data.time_stamp,
    RangeQualityLevel     : ComputeRQL(active_results, FilteredRangeStatus, presults_data),
    SignalRateRtnMegaCps  : FIXPOINT97TOFIXPOINT1616(presults_data.peak_signal_count_rate_mcps),
    AmbientRateRtnMegaCps : FIXPOINT97TOFIXPOINT1616(presults_data.ambient_count_rate_mcps),
    EffectiveSpadRtnCount : presults_data.actual_effective_spads,
    SigmaMilliMeter       : FIXPOINT97TOFIXPOINT1616(presults_data.sigma_mm),
    RangeMilliMeter       : presults_data.median_range_mm,
    RangeFractionalPart   : 0,
    RangeStatus           : 'RANGESTATUS_RANGE_VALID'
  }

  switch (device_status) {
    case DEVICEERROR.MULTCLIPFAIL:
    case DEVICEERROR.VCSELWATCHDOGTESTFAILURE:
    case DEVICEERROR.VCSELCONTINUITYTESTFAILURE:
    case DEVICEERROR.NOVHVVALUEFOUND:
      RangeData.RangeStatus = 'RANGESTATUS_HARDWARE_FAIL'
      break
    case DEVICEERROR.USERROICLIP:
      RangeData.RangeStatus = 'RANGESTATUS_MIN_RANGE_FAIL'
      break
  }

  if (RangeData.RangeStatus === 'RANGESTATUS_RANGE_VALID') {
    RangeData.RangeStatus = ConvertStatusLite[FilteredRangeStatus]
  }


  const { SIGMA_FINAL_RANGE, SIGNAL_RATE_FINAL_RANGE } = CHECKENABLE
  let LimitChecksCurrent = device.CurrentParameters.LimitChecksCurrent
  let LimitChecksStatus = device.CurrentParameters.LimitChecksStatus

  LimitChecksCurrent[SIGMA_FINAL_RANGE] = FIXPOINT97TOFIXPOINT1616(presults_data.sigma_mm)
  GetLimitCheckValue(device, SIGMA_FINAL_RANGE)
  let Temp8Enable = GetLimitCheckEnable(device, SIGMA_FINAL_RANGE)
  let SigmaLimitflag = (FilteredRangeStatus === DEVICEERROR.SIGMATHRESHOLDCHECK) ? 1 : 0
  LimitChecksStatus[SIGMA_FINAL_RANGE] = (Temp8Enable === 1 && SigmaLimitflag === 1) ? 1 : 0

  LimitChecksCurrent[SIGNAL_RATE_FINAL_RANGE] = FIXPOINT97TOFIXPOINT1616(presults_data.peak_signal_count_rate_mcps)
  GetLimitCheckValue(device, SIGNAL_RATE_FINAL_RANGE)
  Temp8Enable = GetLimitCheckEnable(device, SIGNAL_RATE_FINAL_RANGE)
  let SignalLimitflag = (FilteredRangeStatus === DEVICEERROR.MSRCNOTARGET) ? 1 : 0
  LimitChecksStatus[SIGNAL_RATE_FINAL_RANGE] = (Temp8Enable === 1 && SignalLimitflag === 1) ? 1 : 0

  let range = RangeData.RangeMilliMeter
  if (RangeData.RangeStatus === 'RANGESTATUS_RANGE_VALID' && range < 0) {
    if (range < BDTable.TUNING_PROXY_MIN) {
      RangeData.RangeStatus = 'RANGESTATUS_RANGE_INVALID'
    }
    else {
      RangeData.RangeMilliMeter = 0
    }
  }
  return RangeData
}

//VL53L1_GetLimitCheckEnable
const GetLimitCheckEnable = (device, LimitCheckId) => {
  debug.info('GetLimitCheckEnable')
  if (LimitCheckId >= CHECKENABLE.NUMBER_OF_CHECKS) {
    throw new Error('ERROR_INVALID_PARAMS')
  }

  return device.CurrentParameters.LimitChecksEnable[LimitCheckId]
}

//VL53L1_GetLimitCheckValue
const GetLimitCheckValue = (device, LimitCheckId) => {
  debug.info('GetLimitCheckValue')
  let TempFix1616 = 0;

  if (LimitCheckId === CHECKENABLE.SIGMA_FINAL_RANGE) {
    TempFix1616 = FIXPOINT142TOFIXPOINT1616(api_core.get_lite_sigma_threshold(device.LLData));
  }
  else if (LimitCheckId === CHECKENABLE.SIGNAL_RATE_FINAL_RANGE) {
    TempFix1616 = FIXPOINT97TOFIXPOINT1616(api_core.get_lite_min_count_rate(device.LLData));
  }

  if (TempFix1616 === 0) {
    // bug? original code had:
    //    VL53L1_GETARRAYPARAMETERFIELD(Dev, LimitChecksValue, LimitCheckId, TempFix1616);
    // setting to 0 instead...
    device.CurrentParameters.LimitChecksValue[LimitCheckId] = 0
    device.CurrentParameters.LimitChecksEnable[LimitCheckId] = 0
  }
  else {
    device.CurrentParameters.LimitChecksValue[LimitCheckId] = TempFix1616
    device.CurrentParameters.LimitChecksEnable[LimitCheckId] = 1
  }
  return TempFix1616;
}

// static
const ComputeRQL = (active_results, FilteredRangeStatus, presults_data) => {
  debug.info('ComputeRQL')
  if (active_results === 0) {
    return 0
  }
  if (FilteredRangeStatus === DEVICEERROR.PHASECONSISTENCY) {
    return 50
  }

  let SRL = 300;
  let SRAS = 30;
  let GI =   7713587; /* 117.7 * 65536 */
  let GGm =  3198157; /* 48.8 * 65536 */
  let LRAP = 6554;    /* 0.1 * 65536 */

  let SRQL
  let RAS = presults_data.median_range_mm < SRL ? SRAS * 65536 : LRAP * presults_data.median_range_mm
  if (RAS !== 0) {
    let partial = (((GGm * presults_data.sigma_mm) + (RAS >> 1)) / RAS) * 65536
    SRQL = (partial <= GI) ? GI - partial : 50 * 65536
  }
  else {
    SRQL = 100 * 65536
  }

  return Math.max(50, Math.min(100, SRQL >> 16))

}

//VL53L1_ClearInterruptAndStartMeasurement
const ClearInterruptAndStartMeasurement = async (device) => {
  debug.info('ClearInterruptAndStartMeasurement')
  let CurrentParameters = device.CurrentParameters
  if (CurrentParameters.NewDistanceMode !== CurrentParameters.InternalDistanceMode)
    return ChangePresetMode(device);

  await api_core.clear_interrupt_and_enable_next_range(device, device.LLData.measurement_mode);
}

// static
const ChangePresetMode = async (device) => {
  debug.info('ChangePresetMode')
  let user_zone = get_user_zone(device.LLData.dyn_cfg);
  const timeouts = api_core.get_timeouts_us(device.LLData)

  await api_core.stop_range(device)
  await wait.sleep(500)

  SetPresetMode(device,
    device.CurrentParameters.PresetMode,
    device.CurrentParameters.NewDistanceMode,
    device.LLData.inter_measurement_period_ms
  )

  api_core.set_timeouts_us(
    device.LLData,
    timeouts.phasecal_config_timeout_us, //PhaseCalTimeoutUs
    timeouts.mm_config_timeout_us,  //MmTimeoutUs
    timeouts.range_config_timeout_us //TimingBudget
  )
  device.LLData.range_config_timeout_us = timeouts.range_config_timeout_us

  api_core.set_user_zone(device.LLData.dyn_cfg, user_zone)

  await api_core.init_and_start_range(
    device,
    device.LLData.measurement_mode,
    DEVICECONFIGLEVEL.FULL
  )

  device.CurrentParameters.InternalDistanceMode = NewDistanceMode
}

//VL53L1_WaitMeasurementDataReady
const WaitMeasurementDataReady = (device) => {
  debug.info('WaitMeasurementDataReady')
  return wait.poll_for_range_completion(device, 10000); //VL53L1_RANGE_COMPLETION_POLLING_TIMEOUT_MS
}



// static
const ConvertStatusLite = {
  [DEVICEERROR.GPHSTREAMCOUNT0READY]        : 'RANGESTATUS_SYNCRONISATION_INT',
  [DEVICEERROR.RANGECOMPLETE_NO_WRAP_CHECK] : 'RANGESTATUS_RANGE_VALID_NO_WRAP_CHECK_FAIL',
  [DEVICEERROR.RANGEPHASECHECK]             : 'RANGESTATUS_OUTOFBOUNDS_FAIL',
  [DEVICEERROR.MSRCNOTARGET]                : 'RANGESTATUS_SIGNAL_FAIL',
  [DEVICEERROR.SIGMATHRESHOLDCHECK]         : 'RANGESTATUS_SIGMA_FAIL',
  [DEVICEERROR.PHASECONSISTENCY]            : 'RANGESTATUS_WRAP_TARGET_FAIL',
  [DEVICEERROR.RANGEIGNORETHRESHOLD]        : 'RANGESTATUS_XTALK_SIGNAL_FAIL',
  [DEVICEERROR.MINCLIP]                     : 'RANGESTATUS_RANGE_VALID_MIN_RANGE_CLIPPED',
  [DEVICEERROR.RANGECOMPLETE]               : 'RANGESTATUS_RANGE_VALID',
}

const BDTable = {
  TUNING_VERSION                                     : 0x0003,
  TUNING_PROXY_MIN                                   : - 30,
  TUNING_SINGLE_TARGET_XTALK_TARGET_DISTANCE_MM      : 600,
  TUNING_SINGLE_TARGET_XTALK_SAMPLE_NUMBER           : 50,
  TUNING_MIN_AMBIENT_DMAX_VALID                      : 8,
  TUNING_MAX_SIMPLE_OFFSET_CALIBRATION_SAMPLE_NUMBER : 50,
  TUNING_XTALK_FULL_ROI_TARGET_DISTANCE_MM           : 600,
}



//VL53L1_FIXPOINT1616TOFIXPOINT142
const FIXPOINT1616TOFIXPOINT142 = (value) => (value >> 14) & 0xFFFF
//VL53L1_FIXPOINT1616TOFIXPOINT97
const FIXPOINT1616TOFIXPOINT97 = (value) => (value >> 9) & 0xFFFF
//VL53L1_FIXPOINT142TOFIXPOINT1616
const FIXPOINT142TOFIXPOINT1616 = (value) => value<<14
//VL53L1_FIXPOINT97TOFIXPOINT1616
const FIXPOINT97TOFIXPOINT1616 = (value) => value<<9



// const VL53L1_GETARRAYPARAMETERFIELD = ({CurrentParameters}, field, index) => CurrentParameters[field][index]
// const VL53L1_SETARRAYPARAMETERFIELD = ({CurrentParameters}, field, index, value) => CurrentParameters[field][index] = value


module.exports = {
  ClearInterruptAndStartMeasurement,
  PerformOffsetCalibration,
  DataInit,
  StaticInit,
  SetMeasurementTimingBudgetMicroSeconds,
  SetInterMeasurementPeriodMilliSeconds,
  WaitDeviceBooted,
  WaitMeasurementDataReady,
  SetDistanceMode,
  SetPresetMode,
  StartMeasurement,
  StopMeasurement,
  GetRangingMeasurementData
}