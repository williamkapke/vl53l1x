const { calc_pll_period_us, decode_vcsel_period } = require('./core_support.js');
const { MACRO_PERIOD_VCSEL_PERIODS, DEVICEDSSMODE, REGISTER_SETTINGS: { SEQUENCE } } = require('./define.js');


// VL53L1_calc_encoded_timeout
const calc_encoded_timeout = (timeout_us, macro_period_us) => {
  const timeout_mclks   = calc_timeout_mclks(timeout_us, macro_period_us);
  return encode_timeout(timeout_mclks);
}

//VL53L1_calc_timeout_mclks
const calc_timeout_mclks = (timeout_us, macro_period_us) => {
  return ((timeout_us << 12) + (macro_period_us >> 1)) / macro_period_us;
}

//VL53L1_encode_timeout
const encode_timeout = (timeout_mclks) => {
  if (timeout_mclks <= 0) return 0;

  let lsb = timeout_mclks - 1, msb = 0
  while ((lsb & 0xFFFFFF00) > 0) {
    lsb >>= 1
    msb++
  }

  return (msb << 8) | (lsb & 0xFF)
}

//VL53L1_calc_timeout_register_values
const calc_timeout_register_values = (
  phasecal_config_timeout_us,
  mm_config_timeout_us,
  range_config_timeout_us,
  fast_osc_frequency,
  period_a,
  period_b
) => {
  if (fast_osc_frequency === 0) {
    throw new Error('ERROR_DIVISION_BY_ZERO')
  }

  let macro_period_us_a = calc_macro_period_us(fast_osc_frequency, period_a);
  let macro_period_us_b = calc_macro_period_us(fast_osc_frequency, period_b);

  return {
    gen_cfg: {
      phasecal_config__timeout_macrop: Math.min(calc_timeout_mclks(phasecal_config_timeout_us, macro_period_us_a), 0xFF)
    },
    tim_cfg: {
      mm_config__timeout_macrop_a: calc_encoded_timeout(mm_config_timeout_us, macro_period_us_a),
      range_config__timeout_macrop_a: calc_encoded_timeout(range_config_timeout_us, macro_period_us_a),
      mm_config__timeout_macrop_b: calc_encoded_timeout(mm_config_timeout_us, macro_period_us_b),
      range_config__timeout_macrop_b: calc_encoded_timeout(range_config_timeout_us, macro_period_us_b)
    }
  }
}

//VL53L1_calc_macro_period_us
const calc_macro_period_us = (fast_osc_frequency, vcsel_period) => {
  let pll_period_us = calc_pll_period_us(fast_osc_frequency);
  let vcsel_period_pclks = decode_vcsel_period(vcsel_period);
  let macro_period_us = MACRO_PERIOD_VCSEL_PERIODS * pll_period_us;
  macro_period_us = macro_period_us >> 6;
  macro_period_us = macro_period_us * vcsel_period_pclks;
  macro_period_us = macro_period_us >> 6;
  return macro_period_us;
}

//VL53L1_config_low_power_auto_mode
const config_low_power_auto_mode = (LLData) => {
  LLData.low_power_auto_data.is_low_power_auto_mode        = 1
  LLData.low_power_auto_data.low_power_auto_range_count    = 0
  LLData.dyn_cfg.system__sequence_config                   = SEQUENCE.VHV_EN | SEQUENCE.PHASECAL_EN | SEQUENCE.DSS1_EN | SEQUENCE.RANGE_EN
  LLData.gen_cfg.dss_config__manual_effective_spads_select = 200 << 8
  LLData.gen_cfg.dss_config__roi_mode_control              = DEVICEDSSMODE.REQUESTED_EFFFECTIVE_SPADS
}


//VL53L1_low_power_auto_setup_manual_calibration
const low_power_auto_setup_manual_calibration = (LLData) => {
  const {low_power_auto_data, stat_nvm, gen_cfg, dbg_results} = LLData

  low_power_auto_data.saved_vhv_init = stat_nvm.vhv_config__init;
  low_power_auto_data.saved_vhv_timeout = stat_nvm.vhv_config__timeout_macrop_loop_bound;
  low_power_auto_data.first_run_phasecal_result = dbg_results.phasecal_result__vcsel_start;
  stat_nvm.vhv_config__init &= 0x7F;
  stat_nvm.vhv_config__timeout_macrop_loop_bound = (stat_nvm.vhv_config__timeout_macrop_loop_bound & 0x03) + (low_power_auto_data.vhv_loop_bound << 2);
  gen_cfg.phasecal_config__override = 0x01;
  gen_cfg.cal_config__vcsel_start = dbg_results.phasecal_result__vcsel_start;
}

//VL53L1_low_power_auto_update_DSS
const low_power_auto_update_DSS = (LLData) => {
  const {sys_results, low_power_auto_data, stat_cfg, gen_cfg} = LLData
  let error = false

  let utemp32a = sys_results.result__peak_signal_count_rate_crosstalk_corrected_mcps_sd0 + sys_results.result__ambient_count_rate_mcps_sd0;
  utemp32a = Math.min(utemp32a, 0xFFFF);
  utemp32a = utemp32a << 16;

  if (sys_results.result__dss_actual_effective_spads_sd0 === 0) {
    error = true
  }
  else {
    utemp32a = utemp32a / sys_results.result__dss_actual_effective_spads_sd0;
    low_power_auto_data.dss__total_rate_per_spad_mcps = utemp32a;

    utemp32a = stat_cfg.dss_config__target_total_rate_mcps << 16;

    if (low_power_auto_data.dss__total_rate_per_spad_mcps === 0) {
      error = true
    }
    else {
      utemp32a = utemp32a / low_power_auto_data.dss__total_rate_per_spad_mcps;
      utemp32a = Math.min(utemp32a, 0xFFFF);

      low_power_auto_data.dss__required_spads = utemp32a;

      gen_cfg.dss_config__manual_effective_spads_select = low_power_auto_data.dss__required_spads;
      gen_cfg.dss_config__roi_mode_control = DEVICEDSSMODE.REQUESTED_EFFFECTIVE_SPADS;
    }
  }

  if (error) {
    low_power_auto_data.dss__required_spads = 0x8000;

    gen_cfg.dss_config__manual_effective_spads_select = low_power_auto_data.dss__required_spads;
    gen_cfg.dss_config__roi_mode_control = DEVICEDSSMODE.REQUESTED_EFFFECTIVE_SPADS;
  }
}

//VL53L1_low_power_auto_data_stop_range
const low_power_auto_data_stop_range = ({low_power_auto_data, gen_cfg, stat_nvm}) => {
  low_power_auto_data.low_power_auto_range_count = 0xFF;
  low_power_auto_data.first_run_phasecal_result = 0;
  low_power_auto_data.dss__total_rate_per_spad_mcps = 0;
  low_power_auto_data.dss__required_spads = 0;
  gen_cfg.phasecal_config__override = 0;

  if (low_power_auto_data.saved_vhv_init !== 0) {
    stat_nvm.vhv_config__init = low_power_auto_data.saved_vhv_init
  }
  if (low_power_auto_data.saved_vhv_timeout !== 0) {
    stat_nvm.vhv_config__timeout_macrop_loop_bound = low_power_auto_data.saved_vhv_timeout
  }
}

//VL53L1_calc_range_ignore_threshold
const calc_range_ignore_threshold = (central_rate, x_gradient, y_gradient, rate_mult) => {
  const central_rate_int = (central_rate * (1 << 4)) / (1000)
  const x_gradient_int = (x_gradient < 0) ? x_gradient * -1 : 0
  const y_gradient_int = (y_gradient < 0) ? y_gradient * -1 : 0

  let range_ignore_thresh_int = (8 * x_gradient_int * 4) + (8 * y_gradient_int * 4)
  range_ignore_thresh_int = ((range_ignore_thresh_int / 1000) + central_rate_int) * rate_mult
  range_ignore_thresh_int = (range_ignore_thresh_int + (1<<4)) / (1<<5)

  return Math.min(0xFFFF, range_ignore_thresh_int)
}

//VL53L1_calc_timeout_us
const calc_timeout_us = (timeout_mclks, macro_period_us) => {
  return ((timeout_mclks * macro_period_us) + 0x00800) >> 12
}

//VL53L1_calc_decoded_timeout_us
const calc_decoded_timeout_us = (timeout_encoded, macro_period_us) => {
  let timeout_mclks = decode_timeout(timeout_encoded)
  return calc_timeout_us(timeout_mclks, macro_period_us)
}

//VL53L1_decode_timeout
const decode_timeout = (encoded_timeout) => {
  return ((encoded_timeout & 0x00FF) << ((encoded_timeout & 0xFF00) >> 8)) + 1
}

//VL53L1_decode_zone_size
const decode_zone_size = (encoded_xy_size) => ({
  height: encoded_xy_size >> 4,
  width : encoded_xy_size & 0x0F
})

//VL53L1_encode_row_col
const encode_row_col = (row, col) => {
  return (row > 7) ? 128 + (col << 3) + (15-row) : ((15-col) << 3) + row
}

//VL53L1_encode_zone_size
const encode_zone_size = (width, height) => {
  return (height << 4) + width;
}


module.exports = {
  encode_timeout,
  encode_zone_size,
  encode_row_col,

  decode_timeout,
  decode_zone_size,

  calc_encoded_timeout,
  calc_timeout_mclks,
  calc_timeout_register_values,
  calc_macro_period_us,
  calc_range_ignore_threshold,
  calc_timeout_us,
  calc_decoded_timeout_us,

  config_low_power_auto_mode,
  low_power_auto_setup_manual_calibration,
  low_power_auto_update_DSS,
  low_power_auto_data_stop_range,
}