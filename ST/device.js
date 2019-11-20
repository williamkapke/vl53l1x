const i2c = require('../i2c.js')


// VL53L1_DevData_t
module.exports = (addr, bus) => ({
  i2c: i2c(addr, bus),
  // from vl53l1_platform_user_config.h
  // ... these are not part of the "device" object in the STM code. (They're global #define'd)
  config: {
    OFFSET_CAL: {
      MAX_SIGMA_MM: 0x0040,
      MAX_PRE_PEAK_RATE_MCPS: 0x1900,
      MIN_EFFECTIVE_SPADS: 0x0500,
    }
  },

  //VL53L1_LLDriverData_t
  LLData: {
    wait_method                                               : 0, // uint8_t
    phasecal_config_timeout_us                                : 0, // uint32_t
    mm_config_timeout_us                                      : 0, // uint32_t
    range_config_timeout_us                                   : 0, // uint32_t
    inter_measurement_period_ms                               : 0, // uint32_t
    dss_config__target_total_rate_mcps                        : 0, // uint16_t
    fw_ready_poll_duration_ms                                 : 0, // uint32_t
    fw_ready                                                  : 0, // uint8_t
    debug_mode                                                : 0, // uint8_t
    rtn_good_spads                                            : [], // uint8_t [L53L1_RTN_SPAD_BUFFER_SIZE]

    preset_mode                                               : 0, // VL53L1_DevicePresetModes (enum)
    measurement_mode                                          : 0, // VL53L1_DeviceMeasurementModes (enum)
    offset_calibration_mode                                   : 0, // VL53L1_OffsetCalibrationMode (enum)
    offset_correction_mode                                    : 0, // VL53L1_OffsetCorrectionMode (enum)
    // VL53L1_ll_version_t
    version                                                   : {
      ll_revision       : 0, // uint32_t
      ll_major        : 0, // uint8_t
      ll_minor        : 0, // uint8_t
      ll_build        : 0, // uint8_t
    },
    // VL53L1_ll_driver_state_t
    ll_state                                                  : {
      cfg_device_state     : 0, // VL53L1_DeviceState (enum)
      cfg_stream_count     : 0, // uint8_t
      cfg_gph_id           : 0, // uint8_t
      cfg_timing_status    : 0, // uint8_t
      rd_device_state      : 0, // VL53L1_DeviceState (enum)
      rd_stream_count      : 0, // uint8_t
      rd_gph_id            : 0, // uint8_t
      rd_timing_status     : 0, // uint8_t
    },
    // VL53L1_GPIO_interrupt_config_t
    gpio_interrupt_config: {
      intr_mode_distance      : 0, // VL53L1_GPIO_Interrupt_Mode (enum)
      intr_mode_rate          : 0, // VL53L1_GPIO_Interrupt_Mode (enum)
      intr_new_measure_ready  : 0, // uint8_t
      intr_no_target          : 0, // uint8_t
      intr_combined_mode      : 0, // uint8_t
      threshold_distance_high : 0, // uint16_t
      threshold_distance_low  : 0, // uint16_t
      threshold_rate_high     : 0, // uint16_t
      threshold_rate_low      : 0, // uint16_t
    },
    // VL53L1_customer_nvm_managed_t
    customer: {
      global_config__spad_enables_ref_0                  : 0, // uint8_t
      global_config__spad_enables_ref_1                  : 0, // uint8_t
      global_config__spad_enables_ref_2                  : 0, // uint8_t
      global_config__spad_enables_ref_3                  : 0, // uint8_t
      global_config__spad_enables_ref_4                  : 0, // uint8_t
      global_config__spad_enables_ref_5                  : 0, // uint8_t
      global_config__ref_en_start_select                 : 0, // uint8_t
      ref_spad_man__num_requested_ref_spads              : 0, // uint8_t
      ref_spad_man__ref_location                         : 0, // uint8_t
      algo__crosstalk_compensation_plane_offset_kcps     : 0, // uint16_t
      algo__crosstalk_compensation_x_plane_gradient_kcps : 0, // int16_t
      algo__crosstalk_compensation_y_plane_gradient_kcps : 0, // int16_t
      ref_spad_char__total_rate_target_mcps              : 0, // uint16_t
      algo__part_to_part_range_offset_mm                 : 0, // int16_t
      mm_config__inner_offset_mm                         : 0, // int16_t
      mm_config__outer_offset_mm                         : 0, // int16_t
    },
    // VL53L1_cal_peak_rate_map_t
    cal_peak_rate_map: {
      cal_distance_mm   : 0, // int16_t
      max_samples       : 0, // uint16_t
      width             : 0, // uint16_t
      height            : 0, // uint16_t
      peak_rate_mcps    : 0, // [VL53L1_NVM_PEAK_RATE_MAP_SAMPLES] uint16_t
    },
    // VL53L1_additional_offset_cal_data_t
    add_off_cal_data:   {
      result__mm_inner_actual_effective_spads     : 0, // uint16_t
      result__mm_outer_actual_effective_spads     : 0, // uint16_t
      result__mm_inner_peak_signal_count_rtn_mcps : 0, // uint16_t
      result__mm_outer_peak_signal_count_rtn_mcps : 0, // uint16_t
    },
    // VL53L1_gain_calibration_data_t
    gain_cal: {
      standard_ranging_gain_factor  :0, //uint16_t
    },
    // VL53L1_user_zone_t -- never used
    // mm_roi: {
    //   x_centre : 0, // uint8_t
    //   y_centre : 0, // uint8_t
    //   width    : 0, // uint8_t
    //   height   : 0, // uint8_t
    // },
    // VL53L1_optical_centre_t
    optical_centre: {
      x_centre: 0, // uint8_t
      y_centre: 0, // uint8_t
    },
    // VL53L1_tuning_parm_storage_t
    tuning_parms: {
      tp_tuning_parm_version                 : 0, // uint16_t
      tp_tuning_parm_key_table_version       : 0, // uint16_t
      tp_tuning_parm_lld_version             : 0, // uint16_t
      tp_init_phase_rtn_lite_long            : 0, // uint8_t
      tp_init_phase_rtn_lite_med             : 0, // uint8_t
      tp_init_phase_rtn_lite_short           : 0, // uint8_t
      tp_init_phase_ref_lite_long            : 0, // uint8_t
      tp_init_phase_ref_lite_med             : 0, // uint8_t
      tp_init_phase_ref_lite_short           : 0, // uint8_t
      tp_consistency_lite_phase_tolerance    : 0, // uint8_t
      tp_phasecal_target                     : 0, // uint8_t
      tp_cal_repeat_rate                     : 0, // uint16_t
      tp_lite_min_clip                       : 0, // uint8_t
      tp_lite_long_sigma_thresh_mm           : 0, // uint16_t
      tp_lite_med_sigma_thresh_mm            : 0, // uint16_t
      tp_lite_short_sigma_thresh_mm          : 0, // uint16_t
      tp_lite_long_min_count_rate_rtn_mcps   : 0, // uint16_t
      tp_lite_med_min_count_rate_rtn_mcps    : 0, // uint16_t
      tp_lite_short_min_count_rate_rtn_mcps  : 0, // uint16_t
      tp_lite_sigma_est_pulse_width_ns       : 0, // uint8_t
      tp_lite_sigma_est_amb_width_ns         : 0, // uint8_t
      tp_lite_sigma_ref_mm                   : 0, // uint8_t
      tp_lite_seed_cfg                       : 0, // uint8_t
      tp_timed_seed_cfg                      : 0, // uint8_t
      tp_lite_quantifier                     : 0, // uint8_t
      tp_lite_first_order_select             : 0, // uint8_t
      tp_dss_target_lite_mcps                : 0, // uint16_t
      tp_dss_target_timed_mcps               : 0, // uint16_t
      tp_phasecal_timeout_lite_us            : 0, // uint32_t
      tp_phasecal_timeout_timed_us           : 0, // uint32_t
      tp_mm_timeout_lite_us                  : 0, // uint32_t
      tp_mm_timeout_timed_us                 : 0, // uint32_t
      tp_mm_timeout_lpa_us                   : 0, // uint32_t
      tp_range_timeout_lite_us               : 0, // uint32_t
      tp_range_timeout_timed_us              : 0, // uint32_t
      tp_range_timeout_lpa_us                : 0, // uint32_t
    },
    // VL53L1_refspadchar_config_t
    refspadchar: {
      device_test_mode          : 0, // uint8_t
      vcsel_period              : 0, // uint8_t
      timeout_us                : 0, // uint32_t
      target_count_rate_mcps    : 0, // uint16_t
      min_count_rate_limit_mcps : 0, // uint16_t
      max_count_rate_limit_mcps : 0, // uint16_t
    },
    // VL53L1_ssc_config_t
    ssc_cfg: {
      array_select          : 0, // VL53L1_DeviceSscArray (enum)
      vcsel_period          : 0, // uint8_t
      vcsel_start           : 0, // uint8_t
      vcsel_width           : 0, // uint8_t
      timeout_us            : 0, // uint32_t
      rate_limit_mcps       : 0, // uint16_t
    },
    // VL53L1_xtalk_config_t
    xtalk_cfg: {
      algo__crosstalk_compensation_plane_offset_kcps            : 0, // uint32_t
      algo__crosstalk_compensation_x_plane_gradient_kcps        : 0, // int16_t
      algo__crosstalk_compensation_y_plane_gradient_kcps        : 0, // int16_t
      nvm_default__crosstalk_compensation_plane_offset_kcps     : 0, // uint32_t
      nvm_default__crosstalk_compensation_x_plane_gradient_kcps : 0, // int16_t
      nvm_default__crosstalk_compensation_y_plane_gradient_kcps : 0, // int16_t
      global_crosstalk_compensation_enable                      : 0, // uint8_t
      lite_mode_crosstalk_margin_kcps                           : 0, // int16_t
      crosstalk_range_ignore_threshold_mult                     : 0, // uint8_t
      crosstalk_range_ignore_threshold_rate_mcps                : 0, // uint16_t
    },
    // VL53L1_offsetcal_config_t
    offsetcal_cfg: {
      dss_config__target_total_rate_mcps : 0, // uint16_t
      phasecal_config_timeout_us         : 0, // uint32_t
      range_config_timeout_us            : 0, // uint32_t
      mm_config_timeout_us               : 0, // uint32_t
      pre_num_of_samples                 : 0, // uint8_t
      mm1_num_of_samples                 : 0, // uint8_t
      mm2_num_of_samples                 : 0, // uint8_t
    },
    // VL53L1_static_nvm_managed_t
    stat_nvm: {
      i2c_slave__device_address             : 0, // uint8_t
      ana_config__vhv_ref_sel_vddpix        : 0, // uint8_t
      ana_config__vhv_ref_sel_vquench       : 0, // uint8_t
      ana_config__reg_avdd1v2_sel           : 0, // uint8_t
      ana_config__fast_osc__trim            : 0, // uint8_t
      osc_measured__fast_osc__frequency     : 0, // uint16_t
      vhv_config__timeout_macrop_loop_bound : 0, // uint8_t
      vhv_config__count_thresh              : 0, // uint8_t
      vhv_config__offset                    : 0, // uint8_t
      vhv_config__init                      : 0, // uint8_t
    },
    // VL53L1_static_config_t
    stat_cfg: {
      dss_config__target_total_rate_mcps           : 0, // uint16_t
      debug__ctrl                                  : 0, // uint8_t
      test_mode__ctrl                              : 0, // uint8_t
      clk_gating__ctrl                             : 0, // uint8_t
      nvm_bist__ctrl                               : 0, // uint8_t
      nvm_bist__num_nvm_words                      : 0, // uint8_t
      nvm_bist__start_address                      : 0, // uint8_t
      host_if__status                              : 0, // uint8_t
      pad_i2c_hv__config                           : 0, // uint8_t
      pad_i2c_hv__extsup_config                    : 0, // uint8_t
      gpio_hv_pad__ctrl                            : 0, // uint8_t
      gpio_hv_mux__ctrl                            : 0, // uint8_t
      gpio__tio_hv_status                          : 0, // uint8_t
      gpio__fio_hv_status                          : 0, // uint8_t
      ana_config__spad_sel_pswidth                 : 0, // uint8_t
      ana_config__vcsel_pulse_width_offset         : 0, // uint8_t
      ana_config__fast_osc__config_ctrl            : 0, // uint8_t
      sigma_estimator__effective_pulse_width_ns    : 0, // uint8_t
      sigma_estimator__effective_ambient_width_ns  : 0, // uint8_t
      sigma_estimator__sigma_ref_mm                : 0, // uint8_t
      algo__crosstalk_compensation_valid_height_mm : 0, // uint8_t
      spare_host_config__static_config_spare_0     : 0, // uint8_t
      spare_host_config__static_config_spare_1     : 0, // uint8_t
      algo__range_ignore_threshold_mcps            : 0, // uint16_t
      algo__range_ignore_valid_height_mm           : 0, // uint8_t
      algo__range_min_clip                         : 0, // uint8_t
      algo__consistency_check__tolerance           : 0, // uint8_t
      spare_host_config__static_config_spare_2     : 0, // uint8_t
      sd_config__reset_stages_msb                  : 0, // uint8_t
      sd_config__reset_stages_lsb                  : 0, // uint8_t
    },
    // VL53L1_general_config_t
    gen_cfg: {
      gph_config__stream_count_update_value     : 0, // uint8_t
      global_config__stream_divider             : 0, // uint8_t
      system__interrupt_config_gpio             : 0, // uint8_t
      cal_config__vcsel_start                   : 0, // uint8_t
      cal_config__repeat_rate                   : 0, // uint16_t
      global_config__vcsel_width                : 0, // uint8_t
      phasecal_config__timeout_macrop           : 0, // uint8_t
      phasecal_config__target                   : 0, // uint8_t
      phasecal_config__override                 : 0, // uint8_t
      dss_config__roi_mode_control              : 0, // uint8_t
      system__thresh_rate_high                  : 0, // uint16_t
      system__thresh_rate_low                   : 0, // uint16_t
      dss_config__manual_effective_spads_select : 0, // uint16_t
      dss_config__manual_block_select           : 0, // uint8_t
      dss_config__aperture_attenuation          : 0, // uint8_t
      dss_config__max_spads_limit               : 0, // uint8_t
      dss_config__min_spads_limit               : 0, // uint8_t
    },
    // VL53L1_timing_config_t
    tim_cfg: {
      mm_config__timeout_macrop_a                 : 0, // uint16_t
      mm_config__timeout_macrop_b                 : 0, // uint16_t
      range_config__timeout_macrop_a              : 0, // uint16_t
      range_config__vcsel_period_a                : 0, // uint8_t
      range_config__timeout_macrop_b              : 0, // uint16_t
      range_config__vcsel_period_b                : 0, // uint8_t
      range_config__sigma_thresh                  : 0, // uint16_t
      range_config__min_count_rate_rtn_limit_mcps : 0, // uint16_t
      range_config__valid_phase_low               : 0, // uint8_t
      range_config__valid_phase_high              : 0, // uint8_t
      system__intermeasurement_period             : 0, // uint32_t
      system__fractional_enable                   : 0, // uint8_t
    },
    // VL53L1_dynamic_config_t
    dyn_cfg: {
      system__grouped_parameter_hold_0              : 0, // uint8_t
      system__thresh_high                           : 0, // uint16_t
      system__thresh_low                            : 0, // uint16_t
      system__enable_xtalk_per_quadrant             : 0, // uint8_t
      system__seed_config                           : 0, // uint8_t
      sd_config__woi_sd0                            : 0, // uint8_t
      sd_config__woi_sd1                            : 0, // uint8_t
      sd_config__initial_phase_sd0                  : 0, // uint8_t
      sd_config__initial_phase_sd1                  : 0, // uint8_t
      system__grouped_parameter_hold_1              : 0, // uint8_t
      sd_config__first_order_select                 : 0, // uint8_t
      sd_config__quantifier                         : 0, // uint8_t
      roi_config__user_roi_centre_spad              : 0, // uint8_t
      roi_config__user_roi_requested_global_xy_size : 0, // uint8_t
      system__sequence_config                       : 0, // uint8_t
      system__grouped_parameter_hold                : 0, // uint8_t
    },
    // VL53L1_system_control_t
    sys_ctrl: {
      power_management__go1_power_force : 0, // uint8_t
      system__stream_count_ctrl         : 0, // uint8_t
      firmware__enable                  : 0, // uint8_t
      system__interrupt_clear           : 0, // uint8_t
      system__mode_start                : 0, // uint8_t
    },
    // VL53L1_system_results_t
    sys_results: {
      result__interrupt_status                                    : 0, // uint8_t
      result__range_status                                        : 0, // uint8_t
      result__report_status                                       : 0, // uint8_t
      result__stream_count                                        : 0, // uint8_t
      result__dss_actual_effective_spads_sd0                      : 0, // uint16_t
      result__peak_signal_count_rate_mcps_sd0                     : 0, // uint16_t
      result__ambient_count_rate_mcps_sd0                         : 0, // uint16_t
      result__sigma_sd0                                           : 0, // uint16_t
      result__phase_sd0                                           : 0, // uint16_t
      result__final_crosstalk_corrected_range_mm_sd0              : 0, // uint16_t
      result__peak_signal_count_rate_crosstalk_corrected_mcps_sd0 : 0, // uint16_t
      result__mm_inner_actual_effective_spads_sd0                 : 0, // uint16_t
      result__mm_outer_actual_effective_spads_sd0                 : 0, // uint16_t
      result__avg_signal_count_rate_mcps_sd0                      : 0, // uint16_t
      result__dss_actual_effective_spads_sd1                      : 0, // uint16_t
      result__peak_signal_count_rate_mcps_sd1                     : 0, // uint16_t
      result__ambient_count_rate_mcps_sd1                         : 0, // uint16_t
      result__sigma_sd1                                           : 0, // uint16_t
      result__phase_sd1                                           : 0, // uint16_t
      result__final_crosstalk_corrected_range_mm_sd1              : 0, // uint16_t
      result__spare_0_sd1                                         : 0, // uint16_t
      result__spare_1_sd1                                         : 0, // uint16_t
      result__spare_2_sd1                                         : 0, // uint16_t
      result__spare_3_sd1                                         : 0, // uint8_t
      result__thresh_info                                         : 0, // uint8_t
    },
    // VL53L1_nvm_copy_data_t
    nvm_copy_data: {
      identification__model_id           : 0, // uint8_t
      identification__module_type        : 0, // uint8_t
      identification__revision_id        : 0, // uint8_t
      identification__module_id          : 0, // uint16_t
      ana_config__fast_osc__trim_max     : 0, // uint8_t
      ana_config__fast_osc__freq_set     : 0, // uint8_t
      ana_config__vcsel_trim             : 0, // uint8_t
      ana_config__vcsel_selion           : 0, // uint8_t
      ana_config__vcsel_selion_max       : 0, // uint8_t
      protected_laser_safety__lock_bit   : 0, // uint8_t
      laser_safety__key                  : 0, // uint8_t
      laser_safety__key_ro               : 0, // uint8_t
      laser_safety__clip                 : 0, // uint8_t
      laser_safety__mult                 : 0, // uint8_t
      global_config__spad_enables_rtn_0  : 0, // uint8_t
      global_config__spad_enables_rtn_1  : 0, // uint8_t
      global_config__spad_enables_rtn_2  : 0, // uint8_t
      global_config__spad_enables_rtn_3  : 0, // uint8_t
      global_config__spad_enables_rtn_4  : 0, // uint8_t
      global_config__spad_enables_rtn_5  : 0, // uint8_t
      global_config__spad_enables_rtn_6  : 0, // uint8_t
      global_config__spad_enables_rtn_7  : 0, // uint8_t
      global_config__spad_enables_rtn_8  : 0, // uint8_t
      global_config__spad_enables_rtn_9  : 0, // uint8_t
      global_config__spad_enables_rtn_10 : 0, // uint8_t
      global_config__spad_enables_rtn_11 : 0, // uint8_t
      global_config__spad_enables_rtn_12 : 0, // uint8_t
      global_config__spad_enables_rtn_13 : 0, // uint8_t
      global_config__spad_enables_rtn_14 : 0, // uint8_t
      global_config__spad_enables_rtn_15 : 0, // uint8_t
      global_config__spad_enables_rtn_16 : 0, // uint8_t
      global_config__spad_enables_rtn_17 : 0, // uint8_t
      global_config__spad_enables_rtn_18 : 0, // uint8_t
      global_config__spad_enables_rtn_19 : 0, // uint8_t
      global_config__spad_enables_rtn_20 : 0, // uint8_t
      global_config__spad_enables_rtn_21 : 0, // uint8_t
      global_config__spad_enables_rtn_22 : 0, // uint8_t
      global_config__spad_enables_rtn_23 : 0, // uint8_t
      global_config__spad_enables_rtn_24 : 0, // uint8_t
      global_config__spad_enables_rtn_25 : 0, // uint8_t
      global_config__spad_enables_rtn_26 : 0, // uint8_t
      global_config__spad_enables_rtn_27 : 0, // uint8_t
      global_config__spad_enables_rtn_28 : 0, // uint8_t
      global_config__spad_enables_rtn_29 : 0, // uint8_t
      global_config__spad_enables_rtn_30 : 0, // uint8_t
      global_config__spad_enables_rtn_31 : 0, // uint8_t
      roi_config__mode_roi_centre_spad   : 0, // uint8_t
      roi_config__mode_roi_xy_size       : 0, // uint8_t
    },
    // VL53L1_offset_range_results_t
    offset_results: {
      cal_distance_mm   : 0, // int16_t
      cal_status        : 0, // VL53L1_Error
      cal_report        : 0, // uint8_t
      max_results       : 0, // uint8_t
      active_results    : 0, // uint8_t
      // VL53L1_offset_range_data_t
      data              : [], // [VL53L1_MAX_OFFSET_RANGE_RESULTS]
    },
    // VL53L1_core_results_t
    core_results: {
      result_core__ambient_window_events_sd0 : 0, // uint32_t
      result_core__ranging_total_events_sd0  : 0, // uint32_t
      result_core__signal_total_events_sd0   : 0, // int32_t
      result_core__total_periods_elapsed_sd0 : 0, // uint32_t
      result_core__ambient_window_events_sd1 : 0, // uint32_t
      result_core__ranging_total_events_sd1  : 0, // uint32_t
      result_core__signal_total_events_sd1   : 0, // int32_t
      result_core__total_periods_elapsed_sd1 : 0, // uint32_t
      result_core__spare_0                   : 0, // uint8_t
    },
    // VL53L1_debug_results_t
    dbg_results: {
      phasecal_result__reference_phase                   : 0, // uint16_t
      phasecal_result__vcsel_start                       : 0, // uint8_t
      ref_spad_char_result__num_actual_ref_spads         : 0, // uint8_t
      ref_spad_char_result__ref_location                 : 0, // uint8_t
      vhv_result__coldboot_status                        : 0, // uint8_t
      vhv_result__search_result                          : 0, // uint8_t
      vhv_result__latest_setting                         : 0, // uint8_t
      result__osc_calibrate_val                          : 0, // uint16_t
      ana_config__powerdown_go1                          : 0, // uint8_t
      ana_config__ref_bg_ctrl                            : 0, // uint8_t
      ana_config__regdvdd1v2_ctrl                        : 0, // uint8_t
      ana_config__osc_slow_ctrl                          : 0, // uint8_t
      test_mode__status                                  : 0, // uint8_t
      firmware__system_status                            : 0, // uint8_t
      firmware__mode_status                              : 0, // uint8_t
      firmware__secondary_mode_status                    : 0, // uint8_t
      firmware__cal_repeat_rate_counter                  : 0, // uint16_t
      gph__system__thresh_high                           : 0, // uint16_t
      gph__system__thresh_low                            : 0, // uint16_t
      gph__system__enable_xtalk_per_quadrant             : 0, // uint8_t
      gph__spare_0                                       : 0, // uint8_t
      gph__sd_config__woi_sd0                            : 0, // uint8_t
      gph__sd_config__woi_sd1                            : 0, // uint8_t
      gph__sd_config__initial_phase_sd0                  : 0, // uint8_t
      gph__sd_config__initial_phase_sd1                  : 0, // uint8_t
      gph__sd_config__first_order_select                 : 0, // uint8_t
      gph__sd_config__quantifier                         : 0, // uint8_t
      gph__roi_config__user_roi_centre_spad              : 0, // uint8_t
      gph__roi_config__user_roi_requested_global_xy_size : 0, // uint8_t
      gph__system__sequence_config                       : 0, // uint8_t
      gph__gph_id                                        : 0, // uint8_t
      system__interrupt_set                              : 0, // uint8_t
      interrupt_manager__enables                         : 0, // uint8_t
      interrupt_manager__clear                           : 0, // uint8_t
      interrupt_manager__status                          : 0, // uint8_t
      mcu_to_host_bank__wr_access_en                     : 0, // uint8_t
      power_management__go1_reset_status                 : 0, // uint8_t
      pad_startup_mode__value_ro                         : 0, // uint8_t
      pad_startup_mode__value_ctrl                       : 0, // uint8_t
      pll_period_us                                      : 0, // uint32_t
      interrupt_scheduler__data_out                      : 0, // uint32_t
      nvm_bist__complete                                 : 0, // uint8_t
      nvm_bist__status                                   : 0, // uint8_t
    },
    // VL53L1_low_power_auto_data_t
    low_power_auto_data: {
      vhv_loop_bound                : 0, // uint8_t
      is_low_power_auto_mode        : 0, // uint8_t
      low_power_auto_range_count    : 0, // uint8_t
      saved_interrupt_config        : 0, // uint8_t
      saved_vhv_init                : 0, // uint8_t
      saved_vhv_timeout             : 0, // uint8_t
      first_run_phasecal_result     : 0, // uint8_t
      dss__total_rate_per_spad_mcps : 0, // uint32_t
      dss__required_spads           : 0, // uint16_t

    },
    // VL53L1_patch_results_t
    patch_results: {
      dss_calc__roi_ctrl                        : 0, // uint8_t
      dss_calc__spare_1                         : 0, // uint8_t
      dss_calc__spare_2                         : 0, // uint8_t
      dss_calc__spare_3                         : 0, // uint8_t
      dss_calc__spare_4                         : 0, // uint8_t
      dss_calc__spare_5                         : 0, // uint8_t
      dss_calc__spare_6                         : 0, // uint8_t
      dss_calc__spare_7                         : 0, // uint8_t
      dss_calc__user_roi_spad_en_0              : 0, // uint8_t
      dss_calc__user_roi_spad_en_1              : 0, // uint8_t
      dss_calc__user_roi_spad_en_2              : 0, // uint8_t
      dss_calc__user_roi_spad_en_3              : 0, // uint8_t
      dss_calc__user_roi_spad_en_4              : 0, // uint8_t
      dss_calc__user_roi_spad_en_5              : 0, // uint8_t
      dss_calc__user_roi_spad_en_6              : 0, // uint8_t
      dss_calc__user_roi_spad_en_7              : 0, // uint8_t
      dss_calc__user_roi_spad_en_8              : 0, // uint8_t
      dss_calc__user_roi_spad_en_9              : 0, // uint8_t
      dss_calc__user_roi_spad_en_10             : 0, // uint8_t
      dss_calc__user_roi_spad_en_11             : 0, // uint8_t
      dss_calc__user_roi_spad_en_12             : 0, // uint8_t
      dss_calc__user_roi_spad_en_13             : 0, // uint8_t
      dss_calc__user_roi_spad_en_14             : 0, // uint8_t
      dss_calc__user_roi_spad_en_15             : 0, // uint8_t
      dss_calc__user_roi_spad_en_16             : 0, // uint8_t
      dss_calc__user_roi_spad_en_17             : 0, // uint8_t
      dss_calc__user_roi_spad_en_18             : 0, // uint8_t
      dss_calc__user_roi_spad_en_19             : 0, // uint8_t
      dss_calc__user_roi_spad_en_20             : 0, // uint8_t
      dss_calc__user_roi_spad_en_21             : 0, // uint8_t
      dss_calc__user_roi_spad_en_22             : 0, // uint8_t
      dss_calc__user_roi_spad_en_23             : 0, // uint8_t
      dss_calc__user_roi_spad_en_24             : 0, // uint8_t
      dss_calc__user_roi_spad_en_25             : 0, // uint8_t
      dss_calc__user_roi_spad_en_26             : 0, // uint8_t
      dss_calc__user_roi_spad_en_27             : 0, // uint8_t
      dss_calc__user_roi_spad_en_28             : 0, // uint8_t
      dss_calc__user_roi_spad_en_29             : 0, // uint8_t
      dss_calc__user_roi_spad_en_30             : 0, // uint8_t
      dss_calc__user_roi_spad_en_31             : 0, // uint8_t
      dss_calc__user_roi_0                      : 0, // uint8_t
      dss_calc__user_roi_1                      : 0, // uint8_t
      dss_calc__mode_roi_0                      : 0, // uint8_t
      dss_calc__mode_roi_1                      : 0, // uint8_t
      sigma_estimator_calc__spare_0             : 0, // uint8_t
      vhv_result__peak_signal_rate_mcps         : 0, // uint16_t
      vhv_result__signal_total_events_ref       : 0, // uint32_t
      phasecal_result__phase_output_ref         : 0, // uint16_t
      dss_result__total_rate_per_spad           : 0, // uint16_t
      dss_result__enabled_blocks                : 0, // uint8_t
      dss_result__num_requested_spads           : 0, // uint16_t
      mm_result__inner_intersection_rate        : 0, // uint16_t
      mm_result__outer_complement_rate          : 0, // uint16_t
      mm_result__total_offset                   : 0, // uint16_t
      xtalk_calc__xtalk_for_enabled_spads       : 0, // uint32_t
      xtalk_result__avg_xtalk_user_roi_kcps     : 0, // uint32_t
      xtalk_result__avg_xtalk_mm_inner_roi_kcps : 0, // uint32_t
      xtalk_result__avg_xtalk_mm_outer_roi_kcps : 0, // uint32_t
      range_result__accum_phase                 : 0, // uint32_t
      range_result__offset_corrected_range      : 0, // uint16_t
    },
    // VL53L1_shadow_core_results_t
    shadow_core_results: {
      shadow_result_core__ambient_window_events_sd0 : 0, // uint32_t
      shadow_result_core__ranging_total_events_sd0  : 0, // uint32_t
      shadow_result_core__signal_total_events_sd0   : 0, // int32_t
      shadow_result_core__total_periods_elapsed_sd0 : 0, // uint32_t
      shadow_result_core__ambient_window_events_sd1 : 0, // uint32_t
      shadow_result_core__ranging_total_events_sd1  : 0, // uint32_t
      shadow_result_core__signal_total_events_sd1   : 0, // int32_t
      shadow_result_core__total_periods_elapsed_sd1 : 0, // uint32_t
      shadow_result_core__spare_0                   : 0, // uint8_t
    },
    // VL53L1_shadow_system_results_t
    shadow_sys_results: {
      shadow_phasecal_result__vcsel_start                                : 0, // uint8_t
      shadow_result__interrupt_status                                    : 0, // uint8_t
      shadow_result__range_status                                        : 0, // uint8_t
      shadow_result__report_status                                       : 0, // uint8_t
      shadow_result__stream_count                                        : 0, // uint8_t
      shadow_result__dss_actual_effective_spads_sd0                      : 0, // uint16_t
      shadow_result__peak_signal_count_rate_mcps_sd0                     : 0, // uint16_t
      shadow_result__ambient_count_rate_mcps_sd0                         : 0, // uint16_t
      shadow_result__sigma_sd0                                           : 0, // uint16_t
      shadow_result__phase_sd0                                           : 0, // uint16_t
      shadow_result__final_crosstalk_corrected_range_mm_sd0              : 0, // uint16_t
      shadow_result__peak_signal_count_rate_crosstalk_corrected_mcps_sd0 : 0, // uint16_t
      shadow_result__mm_inner_actual_effective_spads_sd0                 : 0, // uint16_t
      shadow_result__mm_outer_actual_effective_spads_sd0                 : 0, // uint16_t
      shadow_result__avg_signal_count_rate_mcps_sd0                      : 0, // uint16_t
      shadow_result__dss_actual_effective_spads_sd1                      : 0, // uint16_t
      shadow_result__peak_signal_count_rate_mcps_sd1                     : 0, // uint16_t
      shadow_result__ambient_count_rate_mcps_sd1                         : 0, // uint16_t
      shadow_result__sigma_sd1                                           : 0, // uint16_t
      shadow_result__phase_sd1                                           : 0, // uint16_t
      shadow_result__final_crosstalk_corrected_range_mm_sd1              : 0, // uint16_t
      shadow_result__spare_0_sd1                                         : 0, // uint16_t
      shadow_result__spare_1_sd1                                         : 0, // uint16_t
      shadow_result__spare_2_sd1                                         : 0, // uint16_t
      shadow_result__spare_3_sd1                                         : 0, // uint8_t
      shadow_result__thresh_info                                         : 0, // uint8_t
      shadow_phasecal_result__reference_phase_hi                         : 0, // uint8_t
      shadow_phasecal_result__reference_phase_lo                         : 0, // uint8_t
    },
    // VL53L1_prev_shadow_core_results_t
    prev_shadow_core_results: {
      prev_shadow_result_core__ambient_window_events_sd0 : 0, // uint32_t
      prev_shadow_result_core__ranging_total_events_sd0  : 0, // uint32_t
      prev_shadow_result_core__signal_total_events_sd0   : 0, // int32_t
      prev_shadow_result_core__total_periods_elapsed_sd0 : 0, // uint32_t
      prev_shadow_result_core__ambient_window_events_sd1 : 0, // uint32_t
      prev_shadow_result_core__ranging_total_events_sd1  : 0, // uint32_t
      prev_shadow_result_core__signal_total_events_sd1   : 0, // int32_t
      prev_shadow_result_core__total_periods_elapsed_sd1 : 0, // uint32_t
      prev_shadow_result_core__spare_0                   : 0, // uint8_t
    },
    // VL53L1_prev_shadow_system_results_t
    prev_shadow_sys_results: {
      prev_shadow_result__interrupt_status                                    : 0, // uint8_t
      prev_shadow_result__range_status                                        : 0, // uint8_t
      prev_shadow_result__report_status                                       : 0, // uint8_t
      prev_shadow_result__stream_count                                        : 0, // uint8_t
      prev_shadow_result__dss_actual_effective_spads_sd0                      : 0, // uint16_t
      prev_shadow_result__peak_signal_count_rate_mcps_sd0                     : 0, // uint16_t
      prev_shadow_result__ambient_count_rate_mcps_sd0                         : 0, // uint16_t
      prev_shadow_result__sigma_sd0                                           : 0, // uint16_t
      prev_shadow_result__phase_sd0                                           : 0, // uint16_t
      prev_shadow_result__final_crosstalk_corrected_range_mm_sd0              : 0, // uint16_t
      prev_shadow_result__peak_signal_count_rate_crosstalk_corrected_mcps_sd0 : 0, // uint16_t
      prev_shadow_result__mm_inner_actual_effective_spads_sd0                 : 0, // uint16_t
      prev_shadow_result__mm_outer_actual_effective_spads_sd0                 : 0, // uint16_t
      prev_shadow_result__avg_signal_count_rate_mcps_sd0                      : 0, // uint16_t
      prev_shadow_result__dss_actual_effective_spads_sd1                      : 0, // uint16_t
      prev_shadow_result__peak_signal_count_rate_mcps_sd1                     : 0, // uint16_t
      prev_shadow_result__ambient_count_rate_mcps_sd1                         : 0, // uint16_t
      prev_shadow_result__sigma_sd1                                           : 0, // uint16_t
      prev_shadow_result__phase_sd1                                           : 0, // uint16_t
      prev_shadow_result__final_crosstalk_corrected_range_mm_sd1              : 0, // uint16_t
      prev_shadow_result__spare_0_sd1                                         : 0, // uint16_t
      prev_shadow_result__spare_1_sd1                                         : 0, // uint16_t
      prev_shadow_result__spare_2_sd1                                         : 0, // uint16_t
      prev_shadow_result__spare_3_sd1                                         : 0, // uint16_t
    },
  },
  //VL53L1_LLDriverResults_t
  // llresults: {
  //   // VL53L1_range_results_t
  //   range_results: {
  //     stream_count          : 0, // uint8_t
  //     device_status         : 0, // uint8_t
  //     cfg_device_state      : 0, // VL53L1_DeviceState (enum)
  //     rd_device_state       : 0, // VL53L1_DeviceState (enum)
  //     data                  : [
  //       range_data(),
  //       range_data()
  //     ],
  //   },
  // },
  PalState: 0, // VL53L1_State (enum)
  //VL53L1_DeviceParameters_t
  CurrentParameters: {
    PresetMode                                   : 0, // VL53L1_PresetModes (enum)
    DistanceMode                                 : 0, // VL53L1_DistanceModes (enum)
    InternalDistanceMode                         : 0, // VL53L1_DistanceModes (enum)
    NewDistanceMode                              : 0, // VL53L1_DistanceModes (enum)
    MeasurementTimingBudgetMicroSeconds          : 0, //uint32_t
    LimitChecksEnable                            : [], // [VL53L1_CHECKENABLE_NUMBER_OF_CHECKS] uint8_t
    LimitChecksStatus                            : [], // [VL53L1_CHECKENABLE_NUMBER_OF_CHECKS] uint8_t
    LimitChecksValue                             : [], // [VL53L1_CHECKENABLE_NUMBER_OF_CHECKS] FixPoint1616_t
    LimitChecksCurrent                           : [], // [VL53L1_CHECKENABLE_NUMBER_OF_CHECKS] FixPoint1616_t
  }
})

// VL53L1_range_data_t
// const range_data = () => ({
//   range_id                    : 0, // uint8_t
//   time_stamp                  : 0, // uint32_t
//   width                       : 0, // uint16_t
//   woi                         : 0, // uint8_t
//   fast_osc_frequency          : 0, // uint16_t
//   zero_distance_phase         : 0, // uint16_t
//   actual_effective_spads      : 0, // uint16_t
//   total_periods_elapsed       : 0, // uint32_t
//   peak_duration_us            : 0, // uint32_t
//   woi_duration_us             : 0, // uint32_t
//   ambient_window_events       : 0, // uint32_t
//   ranging_total_events        : 0, // uint32_t
//   signal_total_events         : 0, // int32_t
//   peak_signal_count_rate_mcps : 0, // uint16_t
//   avg_signal_count_rate_mcps  : 0, // uint16_t
//   ambient_count_rate_mcps     : 0, // uint16_t
//   total_rate_per_spad_mcps    : 0, // uint16_t
//   peak_rate_per_spad_kcps     : 0, // uint32_t
//   sigma_mm                    : 0, // uint16_t
//   median_phase                : 0, // uint16_t
//   median_range_mm             : 0, // int16_t
//   range_status                : 0, // uint8_t
// })

//VL53L1_offset_range_data_t
const offset_range_data = () => ({
  preset_mode                               : 0, // uint8_t
  dss_config__roi_mode_control              : 0, // uint8_t
  dss_config__manual_effective_spads_select : 0, // uint16_t
  no_of_samples                             : 0, // uint8_t
  effective_spads                           : 0, // uint32_t
  peak_rate_mcps                            : 0, // uint32_t
  sigma_mm                                  : 0, // uint32_t
  median_range_mm                           : 0, // int32_t
  range_mm_offset                           : 0, // int32_t
})
