const core = require('./core.js')
const {
  DEFAULTS,
  DEVICEINTERRUPTPOLARITY,
  DEVICEGPIOMODE,
  REGISTER_SETTINGS,
  DEVICEDSSMODE
} = require('./define.js')

const {
  SEQUENCE,
  DEVICESCHEDULERMODE,
  DEVICEREADOUTMODE,
  DEVICEMEASUREMENTMODE,
  CLEAR_RANGE_INT,
  INTERRUPT_CONFIG
} = REGISTER_SETTINGS

// extracted from vl53l1_api_preset_modes.c

//VL53L1_preset_mode_standard_ranging
const standard_ranging = (tuning_parms) => ({
  stat_cfg: {
    dss_config__target_total_rate_mcps            : 0x0A00,
    debug__ctrl                                   : 0x00,
    test_mode__ctrl                               : 0x00,
    clk_gating__ctrl                              : 0x00,
    nvm_bist__ctrl                                : 0x00,
    nvm_bist__num_nvm_words                       : 0x00,
    nvm_bist__start_address                       : 0x00,
    host_if__status                               : 0x00,
    pad_i2c_hv__config                            : 0x00,
    pad_i2c_hv__extsup_config                     : 0x00,
    gpio_hv_pad__ctrl                             : 0x00,
    gpio_hv_mux__ctrl                             : DEVICEINTERRUPTPOLARITY.ACTIVE_LOW | DEVICEGPIOMODE.OUTPUT_RANGE_AND_ERROR_INTERRUPTS,
    gpio__tio_hv_status                           : 0x02,
    gpio__fio_hv_status                           : 0x00,
    ana_config__spad_sel_pswidth                  : 0x02,
    ana_config__vcsel_pulse_width_offset          : 0x08,
    ana_config__fast_osc__config_ctrl             : 0x00,
    sigma_estimator__effective_pulse_width_ns     : tuning_parms.tp_lite_sigma_est_pulse_width_ns,
    sigma_estimator__effective_ambient_width_ns   : tuning_parms.tp_lite_sigma_est_amb_width_ns,
    sigma_estimator__sigma_ref_mm                 : tuning_parms.tp_lite_sigma_ref_mm,
    algo__crosstalk_compensation_valid_height_mm  : 0x01,
    spare_host_config__static_config_spare_0      : 0x00,
    spare_host_config__static_config_spare_1      : 0x00,
    algo__range_ignore_threshold_mcps             : 0x0000,
    algo__range_ignore_valid_height_mm            : 0xff,
    algo__range_min_clip                          : tuning_parms.tp_lite_min_clip,
    algo__consistency_check__tolerance            : tuning_parms.tp_consistency_lite_phase_tolerance,
    spare_host_config__static_config_spare_2      : 0x00,
    sd_config__reset_stages_msb                   : 0x00,
    sd_config__reset_stages_lsb                   : 0x00,
  },
  gen_cfg: {
    gph_config__stream_count_update_value         : 0x00,
    global_config__stream_divider                 : 0x00,
    system__interrupt_config_gpio                 : INTERRUPT_CONFIG.NEW_SAMPLE_READY,
    cal_config__vcsel_start                       : 0x0B,
    cal_config__repeat_rate                       : tuning_parms.tp_cal_repeat_rate,
    global_config__vcsel_width                    : 0x02,
    phasecal_config__timeout_macrop               : 0x0D,
    phasecal_config__target                       : tuning_parms.tp_phasecal_target,
    phasecal_config__override                     : 0x00,
    dss_config__roi_mode_control                  : DEVICEDSSMODE.TARGET_RATE,
    system__thresh_rate_high                      : 0x0000,
    system__thresh_rate_low                       : 0x0000,
    dss_config__manual_effective_spads_select     : 0x8C00,
    dss_config__manual_block_select               : 0x00,
    dss_config__aperture_attenuation              : 0x38,
    dss_config__max_spads_limit                   : 0xFF,
    dss_config__min_spads_limit                   : 0x01,
  },
  tim_cfg: {
    mm_config__timeout_macrop_a                   : 0x001a,
    mm_config__timeout_macrop_b                   : 0x0020,
    range_config__timeout_macrop_a                : 0x01CC,
    range_config__vcsel_period_a                  : 0x0B,
    range_config__timeout_macrop_b                : 0x01F5,
    range_config__vcsel_period_b                  : 0x09,
    range_config__sigma_thresh                    : tuning_parms.tp_lite_med_sigma_thresh_mm,
    range_config__min_count_rate_rtn_limit_mcps   : tuning_parms.tp_lite_med_min_count_rate_rtn_mcps,
    range_config__valid_phase_low                 : 0x08,
    range_config__valid_phase_high                : 0x78,
    system__intermeasurement_period               : 0x00000000,
    system__fractional_enable                     : 0x00,
  },
  dyn_cfg: {
    system__grouped_parameter_hold_0              : 0x01,
    system__thresh_high                           : 0x0000,
    system__thresh_low                            : 0x0000,
    system__enable_xtalk_per_quadrant             : 0x00,
    system__seed_config                           : tuning_parms.tp_lite_seed_cfg,
    sd_config__woi_sd0                            : 0x0B,
    sd_config__woi_sd1                            : 0x09,
    sd_config__initial_phase_sd0                  : tuning_parms.tp_init_phase_rtn_lite_med,
    sd_config__initial_phase_sd1                  : tuning_parms.tp_init_phase_ref_lite_med,
    system__grouped_parameter_hold_1              : 0x01,
    sd_config__first_order_select                 : tuning_parms.tp_lite_first_order_select,
    sd_config__quantifier                         : tuning_parms.tp_lite_quantifier,
    roi_config__user_roi_centre_spad              : 0xC7,
    roi_config__user_roi_requested_global_xy_size : 0xFF,
    system__sequence_config                       : SEQUENCE.VHV_EN | SEQUENCE.PHASECAL_EN | SEQUENCE.DSS1_EN | SEQUENCE.DSS2_EN | SEQUENCE.MM2_EN | SEQUENCE.RANGE_EN,
    system__grouped_parameter_hold                : 0x02,
  },
  sys_ctrl: {
    system__stream_count_ctrl                     : 0x00,
    firmware__enable                              : 0x01,
    system__interrupt_clear                       : CLEAR_RANGE_INT,
    system__mode_start                            : DEVICESCHEDULERMODE.STREAMING | DEVICEREADOUTMODE.SINGLE_SD | DEVICEMEASUREMENTMODE.BACKTOBACK,
  },
  low_power_auto_data: {}
})

//VL53L1_preset_mode_standard_ranging_short_range
const standard_ranging_short_range = (tuning_parms) => {
  const config = standard_ranging(tuning_parms);
  config.tim_cfg.range_config__vcsel_period_a                = 0x07;
  config.tim_cfg.range_config__vcsel_period_b                = 0x05;
  config.tim_cfg.range_config__sigma_thresh                  = tuning_parms.tp_lite_short_sigma_thresh_mm;
  config.tim_cfg.range_config__min_count_rate_rtn_limit_mcps = tuning_parms.tp_lite_short_min_count_rate_rtn_mcps;
  config.tim_cfg.range_config__valid_phase_low               = 0x08;
  config.tim_cfg.range_config__valid_phase_high              = 0x38;
  config.dyn_cfg.sd_config__woi_sd0                         = 0x07;
  config.dyn_cfg.sd_config__woi_sd1                         = 0x05;
  config.dyn_cfg.sd_config__initial_phase_sd0               = tuning_parms.tp_init_phase_rtn_lite_short;
  config.dyn_cfg.sd_config__initial_phase_sd1               = tuning_parms.tp_init_phase_ref_lite_short;
  return config
}

//VL53L1_preset_mode_standard_ranging_long_range
const standard_ranging_long_range = (tuning_parms) => {
  const config = standard_ranging(tuning_parms)
  config.tim_cfg.range_config__vcsel_period_a                = 0x0F;
  config.tim_cfg.range_config__vcsel_period_b                = 0x0D;
  config.tim_cfg.range_config__sigma_thresh                  = tuning_parms.tp_lite_long_sigma_thresh_mm;
  config.tim_cfg.range_config__min_count_rate_rtn_limit_mcps = tuning_parms.tp_lite_long_min_count_rate_rtn_mcps;
  config.tim_cfg.range_config__valid_phase_low               = 0x08;
  config.tim_cfg.range_config__valid_phase_high              = 0xB8;
  config.dyn_cfg.sd_config__woi_sd0                         = 0x0F;
  config.dyn_cfg.sd_config__woi_sd1                         = 0x0D;
  config.dyn_cfg.sd_config__initial_phase_sd0               = tuning_parms.tp_init_phase_rtn_lite_long;
  config.dyn_cfg.sd_config__initial_phase_sd1               = tuning_parms.tp_init_phase_ref_lite_long;
  return config
}

//VL53L1_preset_mode_standard_ranging_mm1_cal
const standard_ranging_mm1_cal = (tuning_parms) => {
  const config = standard_ranging(tuning_parms)
  config.gen_cfg.dss_config__roi_mode_control               = DEVICEDSSMODE.REQUESTED_EFFFECTIVE_SPADS;
  config.dyn_cfg.system__sequence_config                    = SEQUENCE.VHV_EN | SEQUENCE.PHASECAL_EN | SEQUENCE.DSS1_EN | SEQUENCE.DSS2_EN | SEQUENCE.MM1_EN;
  return config;
}

//VL53L1_preset_mode_standard_ranging_mm2_cal
const standard_ranging_mm2_cal = (tuning_parms) => {
  const config = standard_ranging(tuning_parms)
  config.gen_cfg.dss_config__roi_mode_control               = DEVICEDSSMODE.REQUESTED_EFFFECTIVE_SPADS;
  config.dyn_cfg.system__sequence_config                    = SEQUENCE.VHV_EN | SEQUENCE.PHASECAL_EN | SEQUENCE.DSS1_EN | SEQUENCE.DSS2_EN | SEQUENCE.MM2_EN;
  return config
}

// VL53L1_preset_mode_timed_ranging
const timed_ranging = (tuning_parms) => {
  const config = standard_ranging(tuning_parms);
  config.dyn_cfg.system__grouped_parameter_hold   = 0x00;
  config.tim_cfg.range_config__timeout_macrop_a_hi = 0x00;
  config.tim_cfg.range_config__timeout_macrop_a_lo = 0xB1;
  config.tim_cfg.range_config__timeout_macrop_b_hi = 0x00;
  config.tim_cfg.range_config__timeout_macrop_b_lo = 0xD4;
  config.tim_cfg.system__intermeasurement_period   = 0x00000600;
  config.dyn_cfg.system__seed_config              = tuning_parms.tp_timed_seed_cfg;
  config.sys_ctrl.system__mode_start                = DEVICESCHEDULERMODE.PSEUDO_SOLO | DEVICEREADOUTMODE.SINGLE_SD | DEVICEMEASUREMENTMODE.TIMED;
  return config;
}

// VL53L1_preset_mode_timed_ranging_short_range
const timed_ranging_short_range = (tuning_parms) => {
  const config = standard_ranging_short_range(tuning_parms);
  config.dyn_cfg.system__grouped_parameter_hold   = 0x00;
  config.tim_cfg.range_config__timeout_macrop_a_hi = 0x01;
  config.tim_cfg.range_config__timeout_macrop_a_lo = 0x84;
  config.tim_cfg.range_config__timeout_macrop_b_hi = 0x01;
  config.tim_cfg.range_config__timeout_macrop_b_lo = 0xB1;
  config.tim_cfg.system__intermeasurement_period   = 0x00000600;
  config.dyn_cfg.system__seed_config              = tuning_parms.tp_timed_seed_cfg;
  config.sys_ctrl.system__mode_start                = DEVICESCHEDULERMODE.PSEUDO_SOLO | DEVICEREADOUTMODE.SINGLE_SD | DEVICEMEASUREMENTMODE.TIMED;
  return config;
}

// VL53L1_preset_mode_timed_ranging_long_range
const timed_ranging_long_range = (tuning_parms) => {
  const config = standard_ranging_long_range(tuning_parms);
  config.dyn_cfg.system__grouped_parameter_hold    = 0x00;
  config.tim_cfg.range_config__timeout_macrop_a_hi = 0x00;
  config.tim_cfg.range_config__timeout_macrop_a_lo = 0x97;
  config.tim_cfg.range_config__timeout_macrop_b_hi = 0x00;
  config.tim_cfg.range_config__timeout_macrop_b_lo = 0xB1;
  config.tim_cfg.system__intermeasurement_period   = 0x00000600;
  config.dyn_cfg.system__seed_config               = tuning_parms.tp_timed_seed_cfg;
  config.sys_ctrl.system__mode_start               = DEVICESCHEDULERMODE.PSEUDO_SOLO | DEVICEREADOUTMODE.SINGLE_SD | DEVICEMEASUREMENTMODE.TIMED;
  return config;
}

// VL53L1_preset_mode_low_power_auto_ranging/* Start Patch_LowPowerAutoMode */
const low_power_auto_ranging = (tuning_parms) => {
  const config = timed_ranging(tuning_parms);
  core.config_low_power_auto_mode(config);
  return config;
}

// VL53L1_preset_mode_low_power_auto_short_ranging
const low_power_auto_short_ranging = (tuning_parms) => {
  const config = timed_ranging_short_range(tuning_parms);
  core.config_low_power_auto_mode(config);
  return config;
}

// VL53L1_preset_mode_low_power_auto_long_ranging
const low_power_auto_long_ranging = (tuning_parms) => {
  const config = timed_ranging_long_range(tuning_parms);
  core.config_low_power_auto_mode(config);
  return config;
}

// VL53L1_preset_mode_singleshot_ranging
const singleshot_ranging = (tuning_parms) => {
  const config = standard_ranging(tuning_parms);
  config.dyn_cfg.system__grouped_parameter_hold    = 0x00;
  config.tim_cfg.range_config__timeout_macrop_a_hi = 0x00;
  config.tim_cfg.range_config__timeout_macrop_a_lo = 0xB1;
  config.tim_cfg.range_config__timeout_macrop_b_hi = 0x00;
  config.tim_cfg.range_config__timeout_macrop_b_lo = 0xD4;
  config.dyn_cfg.system__seed_config               = tuning_parms.tp_timed_seed_cfg;
  config.sys_ctrl.system__mode_start               = DEVICESCHEDULERMODE.PSEUDO_SOLO | DEVICEREADOUTMODE.SINGLE_SD | DEVICEMEASUREMENTMODE.SINGLESHOT;
  return config;
}

// VL53L1_preset_mode_olt
const olt = (tuning_parms) => {
  const config = standard_ranging(tuning_parms);
  config.sys_ctrl.system__stream_count_ctrl  = 0x01;
  return config;
}

//VL53L1_init_tuning_parm_storage_struct
const init_tuning_parm_storage_struct = () => ({
  tp_tuning_parm_version                 : DEFAULTS.TUNINGPARM.VERSION,
  tp_tuning_parm_key_table_version       : DEFAULTS.TUNINGPARM.KEY_TABLE_VERSION,
  tp_tuning_parm_lld_version             : DEFAULTS.TUNINGPARM.LLD_VERSION,
  tp_init_phase_rtn_lite_long            : DEFAULTS.TUNINGPARM.INITIAL_PHASE_RTN_LITE_LONG_RANGE,
  tp_init_phase_rtn_lite_med             : DEFAULTS.TUNINGPARM.INITIAL_PHASE_RTN_LITE_MED_RANGE,
  tp_init_phase_rtn_lite_short           : DEFAULTS.TUNINGPARM.INITIAL_PHASE_RTN_LITE_SHORT_RANGE,
  tp_init_phase_ref_lite_long            : DEFAULTS.TUNINGPARM.INITIAL_PHASE_REF_LITE_LONG_RANGE,
  tp_init_phase_ref_lite_med             : DEFAULTS.TUNINGPARM.INITIAL_PHASE_REF_LITE_MED_RANGE,
  tp_init_phase_ref_lite_short           : DEFAULTS.TUNINGPARM.INITIAL_PHASE_REF_LITE_SHORT_RANGE,
  tp_consistency_lite_phase_tolerance    : DEFAULTS.TUNINGPARM.CONSISTENCY_LITE_PHASE_TOLERANCE,
  tp_phasecal_target                     : DEFAULTS.TUNINGPARM.PHASECAL_TARGET,
  tp_cal_repeat_rate                     : DEFAULTS.TUNINGPARM.LITE_CAL_REPEAT_RATE,
  tp_lite_min_clip                       : DEFAULTS.TUNINGPARM.LITE_MIN_CLIP_MM,
  tp_lite_long_sigma_thresh_mm           : DEFAULTS.TUNINGPARM.LITE_LONG_SIGMA_THRESH_MM,
  tp_lite_med_sigma_thresh_mm            : DEFAULTS.TUNINGPARM.LITE_MED_SIGMA_THRESH_MM,
  tp_lite_short_sigma_thresh_mm          : DEFAULTS.TUNINGPARM.LITE_SHORT_SIGMA_THRESH_MM,
  tp_lite_long_min_count_rate_rtn_mcps   : DEFAULTS.TUNINGPARM.LITE_LONG_MIN_COUNT_RATE_RTN_MCPS,
  tp_lite_med_min_count_rate_rtn_mcps    : DEFAULTS.TUNINGPARM.LITE_MED_MIN_COUNT_RATE_RTN_MCPS,
  tp_lite_short_min_count_rate_rtn_mcps  : DEFAULTS.TUNINGPARM.LITE_SHORT_MIN_COUNT_RATE_RTN_MCPS,
  tp_lite_sigma_est_pulse_width_ns       : DEFAULTS.TUNINGPARM.LITE_SIGMA_EST_PULSE_WIDTH,
  tp_lite_sigma_est_amb_width_ns         : DEFAULTS.TUNINGPARM.LITE_SIGMA_EST_AMB_WIDTH_NS,
  tp_lite_sigma_ref_mm                   : DEFAULTS.TUNINGPARM.LITE_SIGMA_REF_MM,
  tp_lite_seed_cfg                       : DEFAULTS.TUNINGPARM.LITE_SEED_CONFIG,
  tp_timed_seed_cfg                      : DEFAULTS.TUNINGPARM.TIMED_SEED_CONFIG,
  tp_lite_quantifier                     : DEFAULTS.TUNINGPARM.LITE_QUANTIFIER,
  tp_lite_first_order_select             : DEFAULTS.TUNINGPARM.LITE_FIRST_ORDER_SELECT,
  tp_dss_target_lite_mcps                : DEFAULTS.TUNINGPARM.LITE_DSS_CONFIG_TARGET_TOTAL_RATE_MCPS,
  tp_dss_target_timed_mcps               : DEFAULTS.TUNINGPARM.TIMED_DSS_CONFIG_TARGET_TOTAL_RATE_MCPS,
  tp_phasecal_timeout_lite_us            : DEFAULTS.TUNINGPARM.LITE_PHASECAL_CONFIG_TIMEOUT_US,
  tp_phasecal_timeout_timed_us           : DEFAULTS.TUNINGPARM.TIMED_PHASECAL_CONFIG_TIMEOUT_US,
  tp_mm_timeout_lite_us                  : DEFAULTS.TUNINGPARM.LITE_MM_CONFIG_TIMEOUT_US,
  tp_mm_timeout_timed_us                 : DEFAULTS.TUNINGPARM.TIMED_MM_CONFIG_TIMEOUT_US,
  tp_range_timeout_lite_us               : DEFAULTS.TUNINGPARM.LITE_RANGE_CONFIG_TIMEOUT_US,
  tp_range_timeout_timed_us              : DEFAULTS.TUNINGPARM.TIMED_RANGE_CONFIG_TIMEOUT_US,
  tp_mm_timeout_lpa_us                   : DEFAULTS.TUNINGPARM.LOWPOWERAUTO_MM_CONFIG_TIMEOUT_US,
  tp_range_timeout_lpa_us                : DEFAULTS.TUNINGPARM.LOWPOWERAUTO_RANGE_CONFIG_TIMEOUT_US,
})

//VL53L1_init_offset_cal_config_struct
const init_offset_cal_config_struct = () => ({
  dss_config__target_total_rate_mcps : DEFAULTS.TUNINGPARM.OFFSET_CAL_DSS_RATE_MCPS,
  phasecal_config_timeout_us         : DEFAULTS.TUNINGPARM.OFFSET_CAL_PHASECAL_TIMEOUT_US,
  range_config_timeout_us            : DEFAULTS.TUNINGPARM.OFFSET_CAL_RANGE_TIMEOUT_US,
  mm_config_timeout_us               : DEFAULTS.TUNINGPARM.OFFSET_CAL_MM_TIMEOUT_US,
  pre_num_of_samples                 : DEFAULTS.TUNINGPARM.OFFSET_CAL_PRE_SAMPLES,
  mm1_num_of_samples                 : DEFAULTS.TUNINGPARM.OFFSET_CAL_MM1_SAMPLES,
  mm2_num_of_samples                 : DEFAULTS.TUNINGPARM.OFFSET_CAL_MM2_SAMPLES,
})

//VL53L1_init_xtalk_config_struct
const init_xtalk_config_struct = (pnvm, xtalk_cfg) => {
  const central_rate = pnvm.algo__crosstalk_compensation_plane_offset_kcps
  const x_gradient = pnvm.algo__crosstalk_compensation_x_plane_gradient_kcps
  const y_gradient = pnvm.algo__crosstalk_compensation_y_plane_gradient_kcps
  const rate_mult = DEFAULTS.TUNINGPARM.LITE_RIT_MULT

  xtalk_cfg.algo__crosstalk_compensation_plane_offset_kcps            = central_rate
  xtalk_cfg.algo__crosstalk_compensation_x_plane_gradient_kcps        = x_gradient
  xtalk_cfg.algo__crosstalk_compensation_y_plane_gradient_kcps        = y_gradient
  xtalk_cfg.nvm_default__crosstalk_compensation_plane_offset_kcps     = pnvm.algo__crosstalk_compensation_plane_offset_kcps
  xtalk_cfg.nvm_default__crosstalk_compensation_x_plane_gradient_kcps = pnvm.algo__crosstalk_compensation_x_plane_gradient_kcps
  xtalk_cfg.nvm_default__crosstalk_compensation_y_plane_gradient_kcps = pnvm.algo__crosstalk_compensation_y_plane_gradient_kcps
  xtalk_cfg.lite_mode_crosstalk_margin_kcps                           = DEFAULTS.TUNINGPARM.LITE_XTALK_MARGIN_KCPS
  xtalk_cfg.crosstalk_range_ignore_threshold_mult                     = rate_mult

  xtalk_cfg.global_crosstalk_compensation_enable = (!central_rate && !x_gradient && !y_gradient)? 0 : 1;

  xtalk_cfg.crosstalk_range_ignore_threshold_rate_mcps =
    xtalk_cfg.global_crosstalk_compensation_enable ?
    core.calc_range_ignore_threshold(central_rate, x_gradient, y_gradient, rate_mult)
    : 0
}


module.exports = {
  standard_ranging,
  standard_ranging_short_range,
  standard_ranging_long_range,
  standard_ranging_mm1_cal,
  standard_ranging_mm2_cal,
  timed_ranging,
  timed_ranging_short_range,
  timed_ranging_long_range,
  olt,
  singleshot_ranging,
  low_power_auto_short_ranging,
  low_power_auto_ranging,
  low_power_auto_long_ranging,

  init_tuning_parm_storage_struct,
  init_offset_cal_config_struct,
  init_xtalk_config_struct
}
