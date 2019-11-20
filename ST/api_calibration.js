const register_funcs = require('./register_funcs.js');
const debug = require('../debug.js');
const api_core = require('./api_core.js')
const wait = require('./wait.js')

const {
  MAX_OFFSET_RANGE_RESULTS,
  DEVICEERROR,
  DEVICEMEASUREMENTMODE,
  DEVICEPRESETMODE,
  OFFSETCALIBRATIONMODE,
  DEVICECONFIGLEVEL,
  DEVICERESULTSLEVEL
} = require('./define.js');

//VL53L1_run_offset_calibration
const run_offset_calibration = async (device, cal_distance_mm) => {
  let device_preset_modes = [
    DEVICEPRESETMODE.STANDARD_RANGING,
    DEVICEPRESETMODE.STANDARD_RANGING_MM1_CAL,
    DEVICEPRESETMODE.STANDARD_RANGING_MM2_CAL,
  ];
  const {
    gen_cfg,
    customer,
    add_off_cal_data,
    offsetcal_cfg,
    offset_calibration_mode
  } = device.LLData

  let manual_effective_spads = gen_cfg.dss_config__manual_effective_spads_select
  const measurement_mode = DEVICEMEASUREMENTMODE.BACKTOBACK
  const results = {
    active_results: MAX_OFFSET_RANGE_RESULTS,
    max_results: MAX_OFFSET_RANGE_RESULTS,
    cal_distance_mm: cal_distance_mm,
    data: [],
    cal_report: 0
  }

  let num_of_samples = [
    offsetcal_cfg.pre_num_of_samples,
    offsetcal_cfg.mm1_num_of_samples,
    offsetcal_cfg.mm2_num_of_samples,
  ]

  if (offset_calibration_mode === OFFSETCALIBRATIONMODE.MM1_MM2__STANDARD_PRE_RANGE_ONLY) {
    results.active_results = 1
  }
  else { //OFFSETCALIBRATIONMODE.MM1_MM2__STANDARD_PRE_RANGE_ONLY
    customer.mm_config__inner_offset_mm = 0
    customer.mm_config__outer_offset_mm = 0
  }

  customer.algo__part_to_part_range_offset_mm = 0

  // take measurements for each `device_preset_modes`
  for (let m = 0; m < results.active_results; m++) {

    const poffset = results.data[m] = {
      preset_mode: device_preset_modes[m],
      no_of_samples: 0,
      effective_spads: 0,
      peak_rate_mcps: 0,
      sigma_mm: 0,
      median_range_mm: 0,
      dss_config__roi_mode_control: 0,
      dss_config__manual_effective_spads_select: 0,
      range_mm_offset: 0
    }

    api_core.set_preset_mode(device.LLData,
      device_preset_modes[m],
      offsetcal_cfg.dss_config__target_total_rate_mcps,
      offsetcal_cfg.phasecal_config_timeout_us,
      offsetcal_cfg.mm_config_timeout_us,
      offsetcal_cfg.range_config_timeout_us,
      100
    )

    gen_cfg.dss_config__manual_effective_spads_select = manual_effective_spads

    await api_core.init_and_start_range(device, measurement_mode, DEVICECONFIGLEVEL.CUSTOMER_ONWARDS)

    for (let i = 0; i <= (num_of_samples[m] + 2); i++) {
      await wait.wait_for_range_completion(device)

      let prange_results = await api_core.get_device_results(device, DEVICERESULTSLEVEL.FULL);
      const prange_data = prange_results.data0

      if (prange_results.stream_count > 1 && prange_data.range_status === DEVICEERROR.RANGECOMPLETE) {
        poffset.no_of_samples++;
        poffset.effective_spads += prange_data.actual_effective_spads;
        poffset.peak_rate_mcps += prange_data.peak_signal_count_rate_mcps;
        poffset.sigma_mm += prange_data.sigma_mm;
        poffset.median_range_mm += prange_data.median_range_mm;
        poffset.dss_config__roi_mode_control = gen_cfg.dss_config__roi_mode_control;
        poffset.dss_config__manual_effective_spads_select = gen_cfg.dss_config__manual_effective_spads_select;
      }

      if (poffset.preset_mode === DEVICEPRESETMODE.STANDARD_RANGING) {
        manual_effective_spads = poffset.effective_spads
      }

      await wait.wait_for_firmware_ready(device)
      await api_core.clear_interrupt_and_enable_next_range(device, measurement_mode)
    }

    await api_core.stop_range(device)
    await wait.sleep(1000)

    if (poffset.no_of_samples > 0) {
      poffset.effective_spads += (poffset.no_of_samples / 2) / poffset.no_of_samples
      poffset.peak_rate_mcps  += (poffset.no_of_samples / 2) / poffset.no_of_samples
      poffset.sigma_mm        += (poffset.no_of_samples / 2) / poffset.no_of_samples
      poffset.median_range_mm += (poffset.no_of_samples / 2) / poffset.no_of_samples
      poffset.range_mm_offset = cal_distance_mm - poffset.median_range_mm

      if (poffset.preset_mode === DEVICEPRESETMODE.STANDARD_RANGING) {
        manual_effective_spads = poffset.effective_spads
      }
    }
  }

  if (offset_calibration_mode === OFFSETCALIBRATIONMODE.MM1_MM2__STANDARD_PRE_RANGE_ONLY) {
    customer.mm_config__inner_offset_mm += results.data[0].range_mm_offset;
    customer.mm_config__outer_offset_mm += results.data[0].range_mm_offset;
  }
  else { //OFFSETCALIBRATIONMODE.MM1_MM2__STANDARD_PRE_RANGE_ONLY
    customer.mm_config__inner_offset_mm = results.data[1].range_mm_offset;
    customer.mm_config__outer_offset_mm = results.data[2].range_mm_offset;
    customer.algo__part_to_part_range_offset_mm = 0;
    add_off_cal_data.result__mm_inner_actual_effective_spads = results.data[1].effective_spads;
    add_off_cal_data.result__mm_outer_actual_effective_spads = results.data[2].effective_spads;
    add_off_cal_data.result__mm_inner_peak_signal_count_rtn_mcps = results.data[1].peak_rate_mcps;
    add_off_cal_data.result__mm_outer_peak_signal_count_rtn_mcps = results.data[2].peak_rate_mcps;
  }


  await register_funcs.set_customer_nvm_managed(device)

  for (let m = 0; m < results.active_results; m++) {

    const poffset = results.data[m]

    results.cal_report = m;
    if (poffset.no_of_samples < num_of_samples[m]) {
      debug.info('run_offset_calibration: WARNING_OFFSET_CAL_MISSING_SAMPLES')
    }
    if (m === 0 && poffset.sigma_mm > device.config.OFFSET_CAL.MAX_SIGMA_MM << 5) {
      debug.info('run_offset_calibration: WARNING_OFFSET_CAL_SIGMA_TOO_HIGH')
    }
    if (poffset.peak_rate_mcps > device.config.OFFSET_CAL.MAX_PRE_PEAK_RATE_MCPS) {
      debug.info('run_offset_calibration: WARNING_OFFSET_CAL_RATE_TOO_HIGH')
    }
    if (poffset.dss_config__manual_effective_spads_select < device.config.OFFSET_CAL.MIN_EFFECTIVE_SPADS) {
      debug.info('run_offset_calibration: WARNING_OFFSET_CAL_SPAD_COUNT_TOO_LOW')
    }
    if (poffset.dss_config__manual_effective_spads_select === 0) {
      throw new Error('ERROR_OFFSET_CAL_NO_SPADS_ENABLED_FAIL')
    }
    if (poffset.no_of_samples === 0) {
      throw new Error('ERROR_OFFSET_CAL_NO_SAMPLE_FAIL')
    }
  }
  return results
}

module.exports = {
  run_offset_calibration
}

