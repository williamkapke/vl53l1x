const register_funcs = require('./register_funcs.js')
const api_preset_modes = require('./api_preset_modes.js')
const core = require('./core.js')
const core_support = require('./core_support.js')
const REG = require('./registers.js')
const debug = require('../debug.js');

const {
  DEVICESEQUENCECONFIG,
  DEVICEREPORTSTATUS,
  DEVICEPRESETMODE,
  DEVICECONFIGLEVEL,
  OFFSETCALIBRATIONMODE,
  OFFSETCORRECTIONMODE,
  DEVICESSCARRAY_RTN,
  DEVICEERROR,
  DEVICERESULTSLEVEL,
  DEFAULTS,
  REGISTER_SETTINGS: {
    DEVICEMEASUREMENTMODE,
    RANGE_STATUS__RANGE_STATUS_MASK: RANGE_STATUS_MASK,
    SEQUENCE
  },
  I2C_INDEX,
  I2C_SIZE,
  TUNINGPARM
} = require('./define.js');

const preset_map = {
  [DEVICEPRESETMODE.STANDARD_RANGING]            : api_preset_modes.standard_ranging,
  [DEVICEPRESETMODE.STANDARD_RANGING_SHORT_RANGE]: api_preset_modes.standard_ranging_short_range,
  [DEVICEPRESETMODE.STANDARD_RANGING_LONG_RANGE] : api_preset_modes.standard_ranging_long_range,
  [DEVICEPRESETMODE.STANDARD_RANGING_MM1_CAL]    : api_preset_modes.standard_ranging_mm1_cal,
  [DEVICEPRESETMODE.STANDARD_RANGING_MM2_CAL]    : api_preset_modes.standard_ranging_mm2_cal,
  [DEVICEPRESETMODE.TIMED_RANGING]               : api_preset_modes.timed_ranging,
  [DEVICEPRESETMODE.TIMED_RANGING_SHORT_RANGE]   : api_preset_modes.timed_ranging_short_range,
  [DEVICEPRESETMODE.TIMED_RANGING_LONG_RANGE]    : api_preset_modes.timed_ranging_long_range,
  [DEVICEPRESETMODE.OLT]                         : api_preset_modes.olt,
  [DEVICEPRESETMODE.SINGLESHOT_RANGING]          : api_preset_modes.singleshot_ranging,
  [DEVICEPRESETMODE.LOWPOWERAUTO_SHORT_RANGE]    : api_preset_modes.low_power_auto_short_ranging,
  [DEVICEPRESETMODE.LOWPOWERAUTO_MEDIUM_RANGE]   : api_preset_modes.low_power_auto_ranging,
  [DEVICEPRESETMODE.LOWPOWERAUTO_LONG_RANGE]     : api_preset_modes.low_power_auto_long_ranging,
}
const i2c_indexes = [
  I2C_INDEX.SYSTEM_CONTROL,
  I2C_INDEX.DYNAMIC_CONFIG,
  I2C_INDEX.TIMING_CONFIG,
  I2C_INDEX.GENERAL_CONFIG,
  I2C_INDEX.STATIC_CONFIG,
  I2C_INDEX.CUSTOMER_NVM_MANAGED,
  I2C_INDEX.STATIC_NVM_MANAGED
]

// VL53L1_get_device_results
const get_device_results = async (device, device_results_level) => {
  const {LLData, i2c} = device
  const raw_results = await get_measurement_results(i2c, device_results_level)
  const gain = DEFAULTS.TUNINGPARM.LITE_RANGING_GAIN_FACTOR
  const results = copy_sys_and_core_results_to_range_results(gain, raw_results)

  if (LLData.low_power_auto_data.is_low_power_auto_mode === 1) {

    if (LLData.low_power_auto_data.low_power_auto_range_count === 0) {
      core.low_power_auto_setup_manual_calibration(LLData)
      LLData.low_power_auto_data.low_power_auto_range_count = 1
    }
    else if (LLData.low_power_auto_data.low_power_auto_range_count === 1) {
      LLData.low_power_auto_data.low_power_auto_range_count = 2
    }

    if (LLData.low_power_auto_data.low_power_auto_range_count !== 0xFF) {
      core.low_power_auto_update_DSS(LLData)
    }
  }
  // results.cfg_device_state = device.ll_state.cfg_device_state;
  // results.rd_device_state  = device.ll_state.rd_device_state;

  return results
}

// VL53L1_get_measurement_results
const get_measurement_results = async (i2c, level) => {
  debug.info('get_measurement_results', level)
  const size = level === DEVICERESULTSLEVEL.FULL ? 134 : level === DEVICERESULTSLEVEL.UPTO_CORE ? 77 : 44
  const buff = await i2c.readMulti(0x0088, size);
  const results = {
    system: register_funcs.decode_system_results(buff, 0) // reads 44 bytes
  }

  if (level === DEVICERESULTSLEVEL.FULL || level === DEVICERESULTSLEVEL.UPTO_CORE) {
    results.core = register_funcs.decode_core_results(buff, 44) // reads 32 bytes
  }
  if (level === DEVICERESULTSLEVEL.FULL) {
    results.debug = register_funcs.decode_debug_results(buff, 78); // reads 56 bytes
  }
  return results
}

// VL53L1_copy_sys_and_core_results_to_range_results
const copy_sys_and_core_results_to_range_results = (gain_factor, {system, core}) => {

  //helper
  const applyCorrectionGain = (range_mm) => ((range_mm * gain_factor) + 0x0400) / 0x0800

  let range_status = system.result__range_status & RANGE_STATUS_MASK
  if (system.result__stream_count === 0 && range_status === DEVICEERROR.RANGECOMPLETE) {
    range_status = DEVICEERROR.RANGECOMPLETE_NO_WRAP_CHECK
  }

  const results = {
    stream_count: system.result__stream_count,
    device_status: DEVICEERROR.NOUPDATE,
    data0: {
      range_id: 0,
      // time_stamp: 0,
      range_status: range_status,
      actual_effective_spads:
        system.result__report_status === DEVICEREPORTSTATUS.MM1 ? system.result__mm_inner_actual_effective_spads_sd0 :
        system.result__report_status === DEVICEREPORTSTATUS.MM2 ? system.result__mm_outer_actual_effective_spads_sd0 :
                                                                  system.result__dss_actual_effective_spads_sd0,
      peak_signal_count_rate_mcps: system.result__peak_signal_count_rate_crosstalk_corrected_mcps_sd0,
      avg_signal_count_rate_mcps: system.result__avg_signal_count_rate_mcps_sd0,
      ambient_count_rate_mcps: system.result__ambient_count_rate_mcps_sd0,
      sigma_mm: Math.min(system.result__sigma_sd0 << 5, 0xFFFF),
      median_phase: system.result__phase_sd0,
      median_range_mm: applyCorrectionGain(system.result__final_crosstalk_corrected_range_mm_sd0),
      ranging_total_events: core.result_core__ranging_total_events_sd0,
      signal_total_events: core.result_core__signal_total_events_sd0,
      total_periods_elapsed: core.result_core__total_periods_elapsed_sd0,
      ambient_window_events: core.result_core__ambient_window_events_sd0,
    },
    data1: {
      range_id: 1,
      // time_stamp: 0,
      range_status: range_status,
      actual_effective_spads: system.result__dss_actual_effective_spads_sd1,
      peak_signal_count_rate_mcps: system.result__peak_signal_count_rate_mcps_sd1,
      avg_signal_count_rate_mcps: 0xFFFF,
      ambient_count_rate_mcps: system.result__ambient_count_rate_mcps_sd1,
      sigma_mm: Math.min(system.result__sigma_sd1 << 5, 0xFFFF),
      median_phase: system.result__phase_sd1,
      median_range_mm: applyCorrectionGain(system.result__final_crosstalk_corrected_range_mm_sd1),
      ranging_total_events: core.result_core__ranging_total_events_sd1,
      signal_total_events: core.result_core__signal_total_events_sd1,
      total_periods_elapsed: core.result_core__total_periods_elapsed_sd1,
      ambient_window_events: core.result_core__ambient_window_events_sd1,
    }
  }


  switch (range_status) {
    case DEVICEERROR.VCSELCONTINUITYTESTFAILURE:
    case DEVICEERROR.VCSELWATCHDOGTESTFAILURE:
    case DEVICEERROR.NOVHVVALUEFOUND:
    case DEVICEERROR.USERROICLIP:
    case DEVICEERROR.MULTCLIPFAIL:
      results.device_status = range_status
      results.data0.range_status = DEVICEERROR.NOUPDATE
  }
  return results
}

//VL53L1_set_preset_mode
const set_preset_mode = (
  LLData,
  mode,
  dss_config__target_total_rate_mcps,
  phasecal_timeout,
  mm_timeout,
  range_timeout,
  inter_measurement_period
) => {
  // VL53L1_init_ll_driver_state(Dev, VL53L1_DEVICESTATE_SW_STANDBY);

  const preset = preset_map[mode](LLData.tuning_parms)
  Object.assign(LLData.stat_cfg, preset.stat_cfg)
  Object.assign(LLData.gen_cfg, preset.gen_cfg)
  Object.assign(LLData.tim_cfg, preset.tim_cfg)
  Object.assign(LLData.dyn_cfg, preset.dyn_cfg)
  Object.assign(LLData.sys_ctrl, preset.sys_ctrl)

  LLData.preset_mode = mode
  LLData.stat_cfg.dss_config__target_total_rate_mcps = dss_config__target_total_rate_mcps
  LLData.dss_config__target_total_rate_mcps = dss_config__target_total_rate_mcps

  set_timeouts_us(LLData, phasecal_timeout, mm_timeout, range_timeout)
  set_inter_measurement_period_ms(LLData, inter_measurement_period)
  return LLData
}

// VL53L1_get_preset_mode_timing_cfg
const get_preset_mode_timing_cfg = (tuning_parms, device_preset_mode) => {

  switch (device_preset_mode) {
    case DEVICEPRESETMODE.STANDARD_RANGING:
    case DEVICEPRESETMODE.STANDARD_RANGING_SHORT_RANGE:
    case DEVICEPRESETMODE.STANDARD_RANGING_LONG_RANGE:
    case DEVICEPRESETMODE.STANDARD_RANGING_MM1_CAL:
    case DEVICEPRESETMODE.STANDARD_RANGING_MM2_CAL:
    case DEVICEPRESETMODE.OLT:
      return {
        dss_config__target_total_rate_mcps: tuning_parms.tp_dss_target_lite_mcps,
        phasecal_config_timeout_us: tuning_parms.tp_phasecal_timeout_lite_us,
        mm_config_timeout_us: tuning_parms.tp_mm_timeout_lite_us,
        range_config_timeout_us: tuning_parms.tp_range_timeout_lite_us,
      }

    case DEVICEPRESETMODE.TIMED_RANGING:
    case DEVICEPRESETMODE.TIMED_RANGING_SHORT_RANGE:
    case DEVICEPRESETMODE.TIMED_RANGING_LONG_RANGE:
    case DEVICEPRESETMODE.SINGLESHOT_RANGING:
      return {
        dss_config__target_total_rate_mcps: tuning_parms.tp_dss_target_timed_mcps,
        phasecal_config_timeout_us: tuning_parms.tp_phasecal_timeout_timed_us,
        mm_config_timeout_us: tuning_parms.tp_mm_timeout_timed_us,
        range_config_timeout_us: tuning_parms.tp_range_timeout_timed_us,
      }

    case DEVICEPRESETMODE.LOWPOWERAUTO_SHORT_RANGE:
    case DEVICEPRESETMODE.LOWPOWERAUTO_MEDIUM_RANGE:
    case DEVICEPRESETMODE.LOWPOWERAUTO_LONG_RANGE:
      return {
        dss_config__target_total_rate_mcps: tuning_parms.tp_dss_target_timed_mcps,
        phasecal_config_timeout_us: tuning_parms.tp_phasecal_timeout_timed_us,
        mm_config_timeout_us: tuning_parms.tp_mm_timeout_lpa_us,
        range_config_timeout_us: tuning_parms.tp_range_timeout_lpa_us,
      }
  }
  throw new Error('ERROR_INVALID_PARAMS')
}

//VL53L1_set_timeouts_us
const set_timeouts_us = (LLData, phasecal_timeout, mm_timeout, range_timeout) => {
  const osc_frequency = LLData.stat_nvm.osc_measured__fast_osc__frequency
  if (osc_frequency === 0) {
    throw new Error('ERROR_DIVISION_BY_ZERO')
  }

  const period_a = LLData.tim_cfg.range_config__vcsel_period_a
  const period_b = LLData.tim_cfg.range_config__vcsel_period_b

  LLData.phasecal_config_timeout_us = phasecal_timeout
  LLData.mm_config_timeout_us       = mm_timeout
  LLData.range_config_timeout_us    = range_timeout
  const timeouts = core.calc_timeout_register_values(phasecal_timeout, mm_timeout, range_timeout, osc_frequency, period_a, period_b)
  Object.assign(LLData.gen_cfg, timeouts.gen_cfg)
  Object.assign(LLData.tim_cfg, timeouts.tim_cfg)
}

//VL53L1_set_inter_measurement_period_ms
const set_inter_measurement_period_ms = (LLData, intermeasurement_period) => {
  const osc_calibrate_val = LLData.dbg_results.result__osc_calibrate_val;
  if (osc_calibrate_val === 0) {
    throw new Error('ERROR_DIVISION_BY_ZERO')
  }
  LLData.inter_measurement_period_ms = intermeasurement_period
  LLData.tim_cfg.system__intermeasurement_period = intermeasurement_period * osc_calibrate_val
}

//VL53L1_get_offset_calibration_mode
const get_offset_calibration_mode = (LLData) => LLData.offset_calibration_mode

//VL53L1_init_and_start_range
const init_and_start_range = async (device, measurement_mode, device_config_level) => {

  const {stat_nvm, customer, stat_cfg, gen_cfg, tim_cfg, dyn_cfg, sys_ctrl, low_power_auto_data} = device.LLData

  device.measurement_mode = measurement_mode
  sys_ctrl.system__mode_start = (sys_ctrl.system__mode_start & DEVICEMEASUREMENTMODE.STOP_MASK) | measurement_mode;
  stat_cfg.algo__range_ignore_threshold_mcps = device.LLData.xtalk_cfg.crosstalk_range_ignore_threshold_rate_mcps;


  if (low_power_auto_data.low_power_auto_range_count === 0xFF) {
    low_power_auto_data.low_power_auto_range_count = 0x0;
  }

  if (low_power_auto_data.is_low_power_auto_mode === 1) {
    if (low_power_auto_data.low_power_auto_range_count === 0) {

      low_power_auto_data.saved_interrupt_config = gen_cfg.system__interrupt_config_gpio;
      gen_cfg.system__interrupt_config_gpio = 1 << 5;

      if ((dyn_cfg.system__sequence_config & (SEQUENCE.MM1_EN | SEQUENCE.MM2_EN)) === 0x0) {
        customer.algo__part_to_part_range_offset_mm = customer.mm_config__outer_offset_mm * 4;
      }
      else {
        customer.algo__part_to_part_range_offset_mm = 0x0;
      }

      if (device_config_level < DEVICECONFIGLEVEL.CUSTOMER_ONWARDS) {
        device_config_level = DEVICECONFIGLEVEL.CUSTOMER_ONWARDS;
      }
    }

    if (low_power_auto_data.low_power_auto_range_count === 1) {
      gen_cfg.system__interrupt_config_gpio = low_power_auto_data.saved_interrupt_config;
      device_config_level = DEVICECONFIGLEVEL.FULL;
    }
  }

  const i2c_index = i2c_indexes[device_config_level]
  const i2c_buffer_size_bytes = (I2C_INDEX.SYSTEM_CONTROL + I2C_SIZE.SYSTEM_CONTROL) - i2c_index;

  let buffer = Buffer.alloc(i2c_buffer_size_bytes)

  //noinspection FallThroughInSwitchStatementJS
  switch (device_config_level) {
    case DEVICECONFIGLEVEL.FULL:
      register_funcs.encode_static_nvm_managed(stat_nvm, buffer, I2C_INDEX.STATIC_NVM_MANAGED - i2c_index)

    case DEVICECONFIGLEVEL.CUSTOMER_ONWARDS:
      register_funcs.encode_customer_nvm_managed(customer, buffer, I2C_INDEX.CUSTOMER_NVM_MANAGED - i2c_index)

    case DEVICECONFIGLEVEL.STATIC_ONWARDS:
      register_funcs.encode_static_config(stat_cfg, buffer, I2C_INDEX.STATIC_CONFIG - i2c_index)

    case DEVICECONFIGLEVEL.GENERAL_ONWARDS:
      register_funcs.encode_general_config(gen_cfg, buffer, I2C_INDEX.GENERAL_CONFIG - i2c_index)

    case DEVICECONFIGLEVEL.TIMING_ONWARDS:
      register_funcs.encode_timing_config(tim_cfg, buffer, I2C_INDEX.TIMING_CONFIG - i2c_index)

    case DEVICECONFIGLEVEL.DYNAMIC_ONWARDS:
      // if (psystem.system__mode_start & DEVICEMEASUREMENTMODE.BACKTOBACK === DEVICEMEASUREMENTMODE.BACKTOBACK) {
      //   pdynamic.system__grouped_parameter_hold_0 = device.LLData.ll_state.cfg_gph_id | 0x01;
      //   pdynamic.system__grouped_parameter_hold_1 = device.LLData.ll_state.cfg_gph_id | 0x01;
      //   pdynamic.system__grouped_parameter_hold = device.LLData.ll_state.cfg_gph_id;
      // }
      register_funcs.encode_dynamic_config(dyn_cfg, buffer, I2C_INDEX.DYNAMIC_CONFIG - i2c_index)

    default:
      register_funcs.encode_system_control(sys_ctrl, buffer, I2C_INDEX.SYSTEM_CONTROL - i2c_index)
  }

  await device.i2c.writeMulti(i2c_index, buffer);

  // status = VL53L1_update_ll_driver_rd_state(Dev);
  // status = VL53L1_update_ll_driver_cfg_state(Dev);
}

//VL53L1_clear_interrupt_and_enable_next_range
const clear_interrupt_and_enable_next_range = (device, measurement_mode) => {
  return init_and_start_range(device, measurement_mode, DEVICECONFIGLEVEL.GENERAL_ONWARDS)
}

//VL53L1_stop_range
const stop_range = async (device) => {
  const {STOP_MASK, ABORT} = DEVICEMEASUREMENTMODE
  const sys_ctrl = device.LLData.sys_ctrl

  sys_ctrl.system__mode_start = (sys_ctrl.system__mode_start & STOP_MASK) | ABORT;
  await register_funcs.set_system_control(device)
  sys_ctrl.system__mode_start = sys_ctrl.system__mode_start & STOP_MASK;

  // VL53L1_init_ll_driver_state(DEVICESTATE.SW_STANDBY);

  if (device.LLData.low_power_auto_data.is_low_power_auto_mode === 1) {
    core.low_power_auto_data_stop_range(device.LLData);
  }
}

//VL53L1_data_init
const data_init = async (device, get_p2p_data) => {
  // VL53L1_init_ll_driver_state(VL53L1_DEVICESTATE_UNKNOWN);
  const LLData = device.LLData
  //device.wait_method                        = VL53L1_WAIT_METHOD_BLOCKING // not supported in this lib
  LLData.preset_mode                        = DEVICEPRESETMODE.STANDARD_RANGING
  LLData.measurement_mode                   = DEVICEMEASUREMENTMODE.STOP
  LLData.offset_calibration_mode            = OFFSETCALIBRATIONMODE.MM1_MM2__STANDARD
  LLData.offset_correction_mode             = OFFSETCORRECTIONMODE.MM1_MM2_OFFSETS
  LLData.phasecal_config_timeout_us         =  1000
  LLData.mm_config_timeout_us               =  2000
  LLData.range_config_timeout_us            = 13000
  LLData.inter_measurement_period_ms        =   100
  LLData.dss_config__target_total_rate_mcps = 0x0A00
  LLData.debug_mode                         =  0x00
  LLData.gain_cal.standard_ranging_gain_factor = DEFAULTS.TUNINGPARM.LITE_RANGING_GAIN_FACTOR

  // VL53L1_init_version()

  if (get_p2p_data) {
    await read_p2p_data(device)
  }

  //VL53L1_init_refspadchar_config_struct
  LLData.refspadchar.device_test_mode          = DEFAULTS.TUNINGPARM.REFSPADCHAR_DEVICE_TEST_MODE
  LLData.refspadchar.vcsel_period              = DEFAULTS.TUNINGPARM.REFSPADCHAR_VCSEL_PERIOD
  LLData.refspadchar.timeout_us                = DEFAULTS.TUNINGPARM.REFSPADCHAR_PHASECAL_TIMEOUT_US
  LLData.refspadchar.target_count_rate_mcps    = DEFAULTS.TUNINGPARM.REFSPADCHAR_TARGET_COUNT_RATE_MCPS
  LLData.refspadchar.min_count_rate_limit_mcps = DEFAULTS.TUNINGPARM.REFSPADCHAR_MIN_COUNTRATE_LIMIT_MCPS
  LLData.refspadchar.max_count_rate_limit_mcps = DEFAULTS.TUNINGPARM.REFSPADCHAR_MAX_COUNTRATE_LIMIT_MCPS

  //VL53L1_init_ssc_config_struct
  LLData.ssc_cfg.array_select    = DEVICESSCARRAY_RTN
  LLData.ssc_cfg.vcsel_period    = DEFAULTS.TUNINGPARM.SPADMAP_VCSEL_PERIOD
  LLData.ssc_cfg.vcsel_start     = DEFAULTS.TUNINGPARM.SPADMAP_VCSEL_START
  LLData.ssc_cfg.vcsel_width     = 0x02
  LLData.ssc_cfg.timeout_us      = 36000
  LLData.ssc_cfg.rate_limit_mcps = DEFAULTS.TUNINGPARM.SPADMAP_RATE_LIMIT_MCPS

  api_preset_modes.init_xtalk_config_struct(LLData.customer, LLData.xtalk_cfg)

  //VL53L1_init_offset_cal_config_struct
  LLData.offsetcal_cfg.dss_config__target_total_rate_mcps   = DEFAULTS.TUNINGPARM.OFFSET_CAL_DSS_RATE_MCPS
  LLData.offsetcal_cfg.phasecal_config_timeout_us           = DEFAULTS.TUNINGPARM.OFFSET_CAL_PHASECAL_TIMEOUT_US
  LLData.offsetcal_cfg.range_config_timeout_us              = DEFAULTS.TUNINGPARM.OFFSET_CAL_RANGE_TIMEOUT_US
  LLData.offsetcal_cfg.mm_config_timeout_us                 = DEFAULTS.TUNINGPARM.OFFSET_CAL_MM_TIMEOUT_US
  LLData.offsetcal_cfg.pre_num_of_samples                   = DEFAULTS.TUNINGPARM.OFFSET_CAL_PRE_SAMPLES
  LLData.offsetcal_cfg.mm1_num_of_samples                   = DEFAULTS.TUNINGPARM.OFFSET_CAL_MM1_SAMPLES
  LLData.offsetcal_cfg.mm2_num_of_samples                   = DEFAULTS.TUNINGPARM.OFFSET_CAL_MM2_SAMPLES

  // VL53L1_init_tuning_parm_storage_struct
  LLData.tuning_parms.tp_tuning_parm_version                = DEFAULTS.TUNINGPARM.VERSION
  LLData.tuning_parms.tp_tuning_parm_key_table_version      = DEFAULTS.TUNINGPARM.KEY_TABLE_VERSION
  LLData.tuning_parms.tp_tuning_parm_lld_version            = DEFAULTS.TUNINGPARM.LLD_VERSION
  LLData.tuning_parms.tp_init_phase_rtn_lite_long           = DEFAULTS.TUNINGPARM.INITIAL_PHASE_RTN_LITE_LONG_RANGE
  LLData.tuning_parms.tp_init_phase_rtn_lite_med            = DEFAULTS.TUNINGPARM.INITIAL_PHASE_RTN_LITE_MED_RANGE
  LLData.tuning_parms.tp_init_phase_rtn_lite_short          = DEFAULTS.TUNINGPARM.INITIAL_PHASE_RTN_LITE_SHORT_RANGE
  LLData.tuning_parms.tp_init_phase_ref_lite_long           = DEFAULTS.TUNINGPARM.INITIAL_PHASE_REF_LITE_LONG_RANGE
  LLData.tuning_parms.tp_init_phase_ref_lite_med            = DEFAULTS.TUNINGPARM.INITIAL_PHASE_REF_LITE_MED_RANGE
  LLData.tuning_parms.tp_init_phase_ref_lite_short          = DEFAULTS.TUNINGPARM.INITIAL_PHASE_REF_LITE_SHORT_RANGE
  LLData.tuning_parms.tp_consistency_lite_phase_tolerance   = DEFAULTS.TUNINGPARM.CONSISTENCY_LITE_PHASE_TOLERANCE
  LLData.tuning_parms.tp_phasecal_target                    = DEFAULTS.TUNINGPARM.PHASECAL_TARGET
  LLData.tuning_parms.tp_cal_repeat_rate                    = DEFAULTS.TUNINGPARM.LITE_CAL_REPEAT_RATE
  LLData.tuning_parms.tp_lite_min_clip                      = DEFAULTS.TUNINGPARM.LITE_MIN_CLIP_MM
  LLData.tuning_parms.tp_lite_long_sigma_thresh_mm          = DEFAULTS.TUNINGPARM.LITE_LONG_SIGMA_THRESH_MM
  LLData.tuning_parms.tp_lite_med_sigma_thresh_mm           = DEFAULTS.TUNINGPARM.LITE_MED_SIGMA_THRESH_MM
  LLData.tuning_parms.tp_lite_short_sigma_thresh_mm         = DEFAULTS.TUNINGPARM.LITE_SHORT_SIGMA_THRESH_MM
  LLData.tuning_parms.tp_lite_long_min_count_rate_rtn_mcps  = DEFAULTS.TUNINGPARM.LITE_LONG_MIN_COUNT_RATE_RTN_MCPS
  LLData.tuning_parms.tp_lite_med_min_count_rate_rtn_mcps   = DEFAULTS.TUNINGPARM.LITE_MED_MIN_COUNT_RATE_RTN_MCPS
  LLData.tuning_parms.tp_lite_short_min_count_rate_rtn_mcps = DEFAULTS.TUNINGPARM.LITE_SHORT_MIN_COUNT_RATE_RTN_MCPS
  LLData.tuning_parms.tp_lite_sigma_est_pulse_width_ns      = DEFAULTS.TUNINGPARM.LITE_SIGMA_EST_PULSE_WIDTH
  LLData.tuning_parms.tp_lite_sigma_est_amb_width_ns        = DEFAULTS.TUNINGPARM.LITE_SIGMA_EST_AMB_WIDTH_NS
  LLData.tuning_parms.tp_lite_sigma_ref_mm                  = DEFAULTS.TUNINGPARM.LITE_SIGMA_REF_MM
  LLData.tuning_parms.tp_lite_seed_cfg                      = DEFAULTS.TUNINGPARM.LITE_SEED_CONFIG
  LLData.tuning_parms.tp_timed_seed_cfg                     = DEFAULTS.TUNINGPARM.TIMED_SEED_CONFIG
  LLData.tuning_parms.tp_lite_quantifier                    = DEFAULTS.TUNINGPARM.LITE_QUANTIFIER
  LLData.tuning_parms.tp_lite_first_order_select            = DEFAULTS.TUNINGPARM.LITE_FIRST_ORDER_SELECT
  LLData.tuning_parms.tp_dss_target_lite_mcps               = DEFAULTS.TUNINGPARM.LITE_DSS_CONFIG_TARGET_TOTAL_RATE_MCPS
  LLData.tuning_parms.tp_dss_target_timed_mcps              = DEFAULTS.TUNINGPARM.TIMED_DSS_CONFIG_TARGET_TOTAL_RATE_MCPS
  LLData.tuning_parms.tp_phasecal_timeout_lite_us           = DEFAULTS.TUNINGPARM.LITE_PHASECAL_CONFIG_TIMEOUT_US
  LLData.tuning_parms.tp_phasecal_timeout_timed_us          = DEFAULTS.TUNINGPARM.TIMED_PHASECAL_CONFIG_TIMEOUT_US
  LLData.tuning_parms.tp_mm_timeout_lite_us                 = DEFAULTS.TUNINGPARM.LITE_MM_CONFIG_TIMEOUT_US
  LLData.tuning_parms.tp_mm_timeout_timed_us                = DEFAULTS.TUNINGPARM.TIMED_MM_CONFIG_TIMEOUT_US
  LLData.tuning_parms.tp_range_timeout_lite_us              = DEFAULTS.TUNINGPARM.LITE_RANGE_CONFIG_TIMEOUT_US
  LLData.tuning_parms.tp_range_timeout_timed_us             = DEFAULTS.TUNINGPARM.TIMED_RANGE_CONFIG_TIMEOUT_US
  LLData.tuning_parms.tp_mm_timeout_lpa_us                  = DEFAULTS.TUNINGPARM.LOWPOWERAUTO_MM_CONFIG_TIMEOUT_US
  LLData.tuning_parms.tp_range_timeout_lpa_us               = DEFAULTS.TUNINGPARM.LOWPOWERAUTO_RANGE_CONFIG_TIMEOUT_US

  //VL53L1_set_vhv_loopbound
  LLData.stat_nvm.vhv_config__timeout_macrop_loop_bound &= 0x03
  LLData.stat_nvm.vhv_config__timeout_macrop_loop_bound += DEFAULTS.TUNINGPARM.VHV_LOOPBOUND * 4

  set_preset_mode(LLData,
    LLData.preset_mode,
    LLData.dss_config__target_total_rate_mcps,
    LLData.phasecal_config_timeout_us,
    LLData.mm_config_timeout_us,
    LLData.range_config_timeout_us,
    LLData.inter_measurement_period_ms
  )

  //VL53L1_low_power_auto_data_init
  LLData.low_power_auto_data.vhv_loop_bound                = DEFAULTS.TUNINGPARM.LOWPOWERAUTO_VHV_LOOP_BOUND;
  LLData.low_power_auto_data.is_low_power_auto_mode        = 0;
  LLData.low_power_auto_data.low_power_auto_range_count    = 0;
  LLData.low_power_auto_data.saved_interrupt_config        = 0;
  LLData.low_power_auto_data.saved_vhv_init                = 0;
  LLData.low_power_auto_data.saved_vhv_timeout             = 0;
  LLData.low_power_auto_data.first_run_phasecal_result     = 0;
  LLData.low_power_auto_data.dss__total_rate_per_spad_mcps = 0;
  LLData.low_power_auto_data.dss__required_spads           = 0;
}

//VL53L1_read_p2p_data
const read_p2p_data = async (device) => {
  Object.assign(device.LLData.stat_nvm, await register_funcs.get_static_nvm_managed(device.i2c))
  Object.assign(device.LLData.customer, await register_funcs.get_customer_nvm_managed(device.i2c))
  Object.assign(device.LLData.nvm_copy_data, await register_funcs.get_nvm_copy_data(device.i2c))

  // This copies the data to a buffer (device.rtn_good_spads)- but there are no uses of it!
  //VL53L1_copy_rtn_good_spads_to_buffer(device.nvm_copy_data, device.rtn_good_spads[0])

  device.LLData.dbg_results.result__osc_calibrate_val = await device.i2c.readReg16(REG.RESULT__OSC_CALIBRATE_VAL)

  if (device.LLData.stat_nvm.osc_measured__fast_osc__frequency < 0x1000) {
    device.LLData.stat_nvm.osc_measured__fast_osc__frequency = 0xBCCC;
  }

  const mm_roi = get_mode_mitigation_roi(device.LLData.nvm_copy_data)
  if (device.LLData.optical_centre.x_centre === 0 && device.LLData.optical_centre.y_centre === 0) {
    device.LLData.optical_centre.x_centre = mm_roi.x_centre << 4;
    device.LLData.optical_centre.y_centre = mm_roi.y_centre << 4;
  }
}

//VL53L1_get_mode_mitigation_roi
const get_mode_mitigation_roi = (nvm_copy_data) => {
  const xy_size = nvm_copy_data.roi_config__mode_roi_xy_size
  const rc = core_support.decode_row_col(nvm_copy_data.roi_config__mode_roi_centre_spad)
  return {
    x_centre : rc.col,
    y_centre : rc.row,
    height   : xy_size >> 4, // never used?
    width    : xy_size & 0x0F, // never used?
  }
}

//VL53L1_set_lite_sigma_threshold
const set_lite_sigma_threshold = (LLData, lite_sigma) => {
  LLData.tim_cfg.range_config__sigma_thresh = lite_sigma;
}

//VL53L1_set_lite_min_count_rate
const set_lite_min_count_rate = (LLData, lite_mincountrate) => {
  LLData.tim_cfg.range_config__min_count_rate_rtn_limit_mcps = lite_mincountrate;
}

//VL53L1_get_sequence_config_bit
const get_sequence_config_bit = (LLData, bit_id) => {
  if (bit_id > DEVICESEQUENCECONFIG.RANGE) {
    throw new Error('ERROR_INVALID_PARAMS');
  }
  const bit_mask = (bit_id > 0) ? (0x01 << bit_id) : 0x01
  let value = LLData.dyn_cfg.system__sequence_config & bit_mask;
  return value >> bit_id;
}

//VL53L1_get_timeouts_us
const get_timeouts_us = (LLData) => {
  const {stat_nvm,tim_cfg,gen_cfg} = LLData
  const osc_frequency = stat_nvm.osc_measured__fast_osc__frequency
  if (osc_frequency === 0) {
    throw new Error('ERROR_DIVISION_BY_ZERO')
  }

  let macro_period_us = core.calc_macro_period_us(osc_frequency, tim_cfg.range_config__vcsel_period_a)
  let timeout_encoded_a = tim_cfg.mm_config__timeout_macrop_a
  let timeout_encoded_b = tim_cfg.range_config__timeout_macrop_a

  LLData.phasecal_config_timeout_us = core.calc_timeout_us(gen_cfg.phasecal_config__timeout_macrop, macro_period_us);
  LLData.mm_config_timeout_us       = core.calc_decoded_timeout_us(timeout_encoded_a, macro_period_us);
  LLData.range_config_timeout_us    = core.calc_decoded_timeout_us(timeout_encoded_b, macro_period_us);

  return LLData
}

//VL53L1_get_tuning_parm
const get_tuning_parm = (LLData, tuning_parm_key) => {
  return tuning_parm_lookup[tuning_parm_key](LLData)
}
const tuning_parm_lookup = {
  [TUNINGPARM.VERSION]                                 : (LLData) => LLData.tuning_parms.tp_tuning_parm_version,
  [TUNINGPARM.KEY_TABLE_VERSION]                       : (LLData) => LLData.tuning_parms.tp_tuning_parm_key_table_version,
  [TUNINGPARM.LLD_VERSION]                             : (LLData) => LLData.tuning_parms.tp_tuning_parm_lld_version,
  [TUNINGPARM.CONSISTENCY_LITE_PHASE_TOLERANCE]        : (LLData) => LLData.tuning_parms.tp_consistency_lite_phase_tolerance,
  [TUNINGPARM.PHASECAL_TARGET]                         : (LLData) => LLData.tuning_parms.tp_phasecal_target,
  [TUNINGPARM.LITE_CAL_REPEAT_RATE]                    : (LLData) => LLData.tuning_parms.tp_cal_repeat_rate,
  [TUNINGPARM.LITE_RANGING_GAIN_FACTOR]                : (LLData) => LLData.gain_cal.standard_ranging_gain_factor,
  [TUNINGPARM.LITE_MIN_CLIP_MM]                        : (LLData) => LLData.tuning_parms.tp_lite_min_clip,
  [TUNINGPARM.LITE_LONG_SIGMA_THRESH_MM]               : (LLData) => LLData.tuning_parms.tp_lite_long_sigma_thresh_mm,
  [TUNINGPARM.LITE_MED_SIGMA_THRESH_MM]                : (LLData) => LLData.tuning_parms.tp_lite_med_sigma_thresh_mm,
  [TUNINGPARM.LITE_SHORT_SIGMA_THRESH_MM]              : (LLData) => LLData.tuning_parms.tp_lite_short_sigma_thresh_mm,
  [TUNINGPARM.LITE_LONG_MIN_COUNT_RATE_RTN_MCPS]       : (LLData) => LLData.tuning_parms.tp_lite_long_min_count_rate_rtn_mcps,
  [TUNINGPARM.LITE_MED_MIN_COUNT_RATE_RTN_MCPS]        : (LLData) => LLData.tuning_parms.tp_lite_med_min_count_rate_rtn_mcps,
  [TUNINGPARM.LITE_SHORT_MIN_COUNT_RATE_RTN_MCPS]      : (LLData) => LLData.tuning_parms.tp_lite_short_min_count_rate_rtn_mcps,
  [TUNINGPARM.LITE_SIGMA_EST_PULSE_WIDTH]              : (LLData) => LLData.tuning_parms.tp_lite_sigma_est_pulse_width_ns,
  [TUNINGPARM.LITE_SIGMA_EST_AMB_WIDTH_NS]             : (LLData) => LLData.tuning_parms.tp_lite_sigma_est_amb_width_ns,
  [TUNINGPARM.LITE_SIGMA_REF_MM]                       : (LLData) => LLData.tuning_parms.tp_lite_sigma_ref_mm,
  [TUNINGPARM.LITE_RIT_MULT]                           : (LLData) => LLData.xtalk_cfg.crosstalk_range_ignore_threshold_mult,
  [TUNINGPARM.LITE_SEED_CONFIG]                        : (LLData) => LLData.tuning_parms.tp_lite_seed_cfg ,
  [TUNINGPARM.LITE_QUANTIFIER]                         : (LLData) => LLData.tuning_parms.tp_lite_quantifier,
  [TUNINGPARM.LITE_FIRST_ORDER_SELECT]                 : (LLData) => LLData.tuning_parms.tp_lite_first_order_select,
  [TUNINGPARM.LITE_XTALK_MARGIN_KCPS]                  : (LLData) => LLData.xtalk_cfg.lite_mode_crosstalk_margin_kcps,
  [TUNINGPARM.INITIAL_PHASE_RTN_LITE_LONG_RANGE]       : (LLData) => LLData.tuning_parms.tp_init_phase_rtn_lite_long,
  [TUNINGPARM.INITIAL_PHASE_RTN_LITE_MED_RANGE]        : (LLData) => LLData.tuning_parms.tp_init_phase_rtn_lite_med,
  [TUNINGPARM.INITIAL_PHASE_RTN_LITE_SHORT_RANGE]      : (LLData) => LLData.tuning_parms.tp_init_phase_rtn_lite_short,
  [TUNINGPARM.INITIAL_PHASE_REF_LITE_LONG_RANGE]       : (LLData) => LLData.tuning_parms.tp_init_phase_ref_lite_long,
  [TUNINGPARM.INITIAL_PHASE_REF_LITE_MED_RANGE]        : (LLData) => LLData.tuning_parms.tp_init_phase_ref_lite_med,
  [TUNINGPARM.INITIAL_PHASE_REF_LITE_SHORT_RANGE]      : (LLData) => LLData.tuning_parms.tp_init_phase_ref_lite_short,
  [TUNINGPARM.TIMED_SEED_CONFIG]                       : (LLData) => LLData.tuning_parms.tp_timed_seed_cfg,
  [TUNINGPARM.VHV_LOOPBOUND]                           : (LLData) => LLData.stat_nvm.vhv_config__timeout_macrop_loop_bound,
  [TUNINGPARM.REFSPADCHAR_DEVICE_TEST_MODE]            : (LLData) => LLData.refspadchar.device_test_mode,
  [TUNINGPARM.REFSPADCHAR_VCSEL_PERIOD]                : (LLData) => LLData.refspadchar.vcsel_period,
  [TUNINGPARM.REFSPADCHAR_PHASECAL_TIMEOUT_US]         : (LLData) => LLData.refspadchar.timeout_us,
  [TUNINGPARM.REFSPADCHAR_TARGET_COUNT_RATE_MCPS]      : (LLData) => LLData.refspadchar.target_count_rate_mcps,
  [TUNINGPARM.REFSPADCHAR_MIN_COUNTRATE_LIMIT_MCPS]    : (LLData) => LLData.refspadchar.min_count_rate_limit_mcps,
  [TUNINGPARM.REFSPADCHAR_MAX_COUNTRATE_LIMIT_MCPS]    : (LLData) => LLData.refspadchar.max_count_rate_limit_mcps,
  [TUNINGPARM.OFFSET_CAL_DSS_RATE_MCPS]                : (LLData) => LLData.offsetcal_cfg.dss_config__target_total_rate_mcps,
  [TUNINGPARM.OFFSET_CAL_PHASECAL_TIMEOUT_US]          : (LLData) => LLData.offsetcal_cfg.phasecal_config_timeout_us,
  [TUNINGPARM.OFFSET_CAL_MM_TIMEOUT_US]                : (LLData) => LLData.offsetcal_cfg.mm_config_timeout_us,
  [TUNINGPARM.OFFSET_CAL_RANGE_TIMEOUT_US]             : (LLData) => LLData.offsetcal_cfg.range_config_timeout_us,
  [TUNINGPARM.OFFSET_CAL_PRE_SAMPLES]                  : (LLData) => LLData.offsetcal_cfg.pre_num_of_samples,
  [TUNINGPARM.OFFSET_CAL_MM1_SAMPLES]                  : (LLData) => LLData.offsetcal_cfg.mm1_num_of_samples,
  [TUNINGPARM.OFFSET_CAL_MM2_SAMPLES]                  : (LLData) => LLData.offsetcal_cfg.mm2_num_of_samples,
  [TUNINGPARM.SPADMAP_VCSEL_PERIOD]                    : (LLData) => LLData.ssc_cfg.vcsel_period,
  [TUNINGPARM.SPADMAP_VCSEL_START]                     : (LLData) => LLData.ssc_cfg.vcsel_start,
  [TUNINGPARM.SPADMAP_RATE_LIMIT_MCPS]                 : (LLData) => LLData.ssc_cfg.rate_limit_mcps,
  [TUNINGPARM.LITE_DSS_CONFIG_TARGET_TOTAL_RATE_MCPS]  : (LLData) => LLData.tuning_parms.tp_dss_target_lite_mcps,
  [TUNINGPARM.TIMED_DSS_CONFIG_TARGET_TOTAL_RATE_MCPS] : (LLData) => LLData.tuning_parms.tp_dss_target_timed_mcps,
  [TUNINGPARM.LITE_PHASECAL_CONFIG_TIMEOUT_US]         : (LLData) => LLData.tuning_parms.tp_phasecal_timeout_lite_us,
  [TUNINGPARM.TIMED_PHASECAL_CONFIG_TIMEOUT_US]        : (LLData) => LLData.tuning_parms.tp_phasecal_timeout_timed_us,
  [TUNINGPARM.LITE_MM_CONFIG_TIMEOUT_US]               : (LLData) => LLData.tuning_parms.tp_mm_timeout_lite_us,
  [TUNINGPARM.TIMED_MM_CONFIG_TIMEOUT_US]              : (LLData) => LLData.tuning_parms.tp_mm_timeout_timed_us,
  [TUNINGPARM.LITE_RANGE_CONFIG_TIMEOUT_US]            : (LLData) => LLData.tuning_parms.tp_range_timeout_lite_us,
  [TUNINGPARM.TIMED_RANGE_CONFIG_TIMEOUT_US]           : (LLData) => LLData.tuning_parms.tp_range_timeout_timed_us,
  [TUNINGPARM.LOWPOWERAUTO_VHV_LOOP_BOUND]             : (LLData) => LLData.low_power_auto_data.vhv_loop_bound,
  [TUNINGPARM.LOWPOWERAUTO_MM_CONFIG_TIMEOUT_US]       : (LLData) => LLData.tuning_parms.tp_mm_timeout_lpa_us,
  [TUNINGPARM.LOWPOWERAUTO_RANGE_CONFIG_TIMEOUT_US]    : (LLData) => LLData.tuning_parms.tp_range_timeout_lpa_us,
}

//VL53L1_get_user_zone
const get_user_zone = (dyn_cfg) => {
  const rc = core_support.decode_row_col(dyn_cfg.roi_config__user_roi_centre_spad)
  const encoded_xy_size = dyn_cfg.roi_config__user_roi_requested_global_xy_size
  return {
    x: rc.col,
    y: rc.row,
    // from VL53L1_decode_zone_size...
    height: encoded_xy_size >> 4,
    width : encoded_xy_size & 0x0F
  };
}

//VL53L1_set_user_zone
const set_user_zone = (dyn_cfg, user_zone) => {
  dyn_cfg.roi_config__user_roi_centre_spad = core.encode_row_col(user_zone.y, user_zone.x)
  dyn_cfg.roi_config__user_roi_requested_global_xy_size = core.encode_zone_size(user_zone.width, user_zone.height)
}

//VL53L1_get_lite_sigma_threshold
const get_lite_sigma_threshold = (LLData) =>{
  return LLData.tim_cfg.range_config__sigma_thresh
}

//VL53L1_get_lite_min_count_rate
const get_lite_min_count_rate = (LLData) => {
  return LLData.tim_cfg.range_config__min_count_rate_rtn_limit_mcps
}


module.exports = {
  get_device_results,
  get_offset_calibration_mode,
  get_preset_mode_timing_cfg,
  get_sequence_config_bit,
  get_timeouts_us,
  get_tuning_parm,
  get_user_zone,
  get_lite_sigma_threshold,
  get_lite_min_count_rate,

  set_preset_mode,
  set_timeouts_us,
  set_lite_sigma_threshold,
  set_lite_min_count_rate,
  set_inter_measurement_period_ms,
  set_user_zone,

  init_and_start_range,
  stop_range,
  clear_interrupt_and_enable_next_range,
  // read_p2p_data,
  data_init,
}
