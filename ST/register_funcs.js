const {I2C_SIZE} = require('./define.js')
const REG = require('./registers.js')
const debug = require('../debug.js')


//VL53L1_i2c_decode_static_nvm_managed
exports.decode_static_nvm_managed = (buffer, offset = 0) => ({
  i2c_slave__device_address             : buffer.readUInt8(    offset) & 0x7F,
  ana_config__vhv_ref_sel_vddpix        : buffer.readUInt8(    offset + 1) & 0xF,
  ana_config__vhv_ref_sel_vquench       : buffer.readUInt8(    offset + 2) & 0x7F,
  ana_config__reg_avdd1v2_sel           : buffer.readUInt8(    offset + 3) & 0x3,
  ana_config__fast_osc__trim            : buffer.readUInt8(    offset + 4) & 0x7F,
  osc_measured__fast_osc__frequency     : buffer.readUInt16BE( offset + 5),
  vhv_config__timeout_macrop_loop_bound : buffer.readUInt8(    offset + 7),
  vhv_config__count_thresh              : buffer.readUInt8(    offset + 8),
  vhv_config__offset                    : buffer.readUInt8(    offset + 9) & 0x3F,
  vhv_config__init                      : buffer.readUInt8(    offset + 10),
})

//VL53L1_i2c_decode_customer_nvm_managed
exports.decode_customer_nvm_managed = (buffer, offset = 0) => ({
  global_config__spad_enables_ref_0                  : buffer.readUInt8(    offset),
  global_config__spad_enables_ref_1                  : buffer.readUInt8(    offset +  1),
  global_config__spad_enables_ref_2                  : buffer.readUInt8(    offset +  2),
  global_config__spad_enables_ref_3                  : buffer.readUInt8(    offset +  3),
  global_config__spad_enables_ref_4                  : buffer.readUInt8(    offset +  4),
  global_config__spad_enables_ref_5                  : buffer.readUInt8(    offset +  5) & 0xF,
  global_config__ref_en_start_select                 : buffer.readUInt8(    offset +  6),
  ref_spad_man__num_requested_ref_spads              : buffer.readUInt8(    offset +  7) & 0x3F,
  ref_spad_man__ref_location                         : buffer.readUInt8(    offset +  8) & 0x3,
  algo__crosstalk_compensation_plane_offset_kcps     : buffer.readUInt16BE( offset +  9),
  algo__crosstalk_compensation_x_plane_gradient_kcps : buffer.readUInt16BE( offset + 11),
  algo__crosstalk_compensation_y_plane_gradient_kcps : buffer.readUInt16BE( offset + 13),
  ref_spad_char__total_rate_target_mcps              : buffer.readUInt16BE( offset + 15),
  algo__part_to_part_range_offset_mm                 : buffer.readUInt16BE( offset + 17) & 0x1FFF,
  mm_config__inner_offset_mm                         : buffer.readUInt16BE( offset + 19),
  mm_config__outer_offset_mm                         : buffer.readUInt16BE( offset + 21),
})

//VL53L1_i2c_decode_system_results
exports.decode_system_results = (buff, offset) => ({
  result__interrupt_status                                    : buff[offset] & 0x3F,
  result__range_status                                        : buff[offset +   1],
  result__report_status                                       : buff[offset +   2] & 0xF,
  result__stream_count                                        : buff[offset +   3],
  result__dss_actual_effective_spads_sd0                      : buff.readUInt16BE(offset +   4),
  result__peak_signal_count_rate_mcps_sd0                     : buff.readUInt16BE(offset +   6),
  result__ambient_count_rate_mcps_sd0                         : buff.readUInt16BE(offset +   8),
  result__sigma_sd0                                           : buff.readUInt16BE(offset +  10),
  result__phase_sd0                                           : buff.readUInt16BE(offset +  12),
  result__final_crosstalk_corrected_range_mm_sd0              : buff.readUInt16BE(offset +  14),
  result__peak_signal_count_rate_crosstalk_corrected_mcps_sd0 : buff.readUInt16BE(offset +  16),
  result__mm_inner_actual_effective_spads_sd0                 : buff.readUInt16BE(offset +  18),
  result__mm_outer_actual_effective_spads_sd0                 : buff.readUInt16BE(offset +  20),
  result__avg_signal_count_rate_mcps_sd0                      : buff.readUInt16BE(offset +  22),
  result__dss_actual_effective_spads_sd1                      : buff.readUInt16BE(offset +  24),
  result__peak_signal_count_rate_mcps_sd1                     : buff.readUInt16BE(offset +  26),
  result__ambient_count_rate_mcps_sd1                         : buff.readUInt16BE(offset +  28),
  result__sigma_sd1                                           : buff.readUInt16BE(offset +  30),
  result__phase_sd1                                           : buff.readUInt16BE(offset +  32),
  result__final_crosstalk_corrected_range_mm_sd1              : buff.readUInt16BE(offset +  34),
  result__spare_0_sd1                                         : buff.readUInt16BE(offset +  36),
  result__spare_1_sd1                                         : buff.readUInt16BE(offset +  38),
  result__spare_2_sd1                                         : buff.readUInt16BE(offset +  40),
  result__spare_3_sd1                                         : buff[offset +  42],
  result__thresh_info                                         : buff[offset +  43],
})

//VL53L1_i2c_decode_core_results
exports.decode_core_results = (buff, offset) => ({
  result_core__ambient_window_events_sd0 : buff.readUInt32BE(offset + 0),
  result_core__ranging_total_events_sd0  : buff.readUInt32BE(offset + 4),
  result_core__signal_total_events_sd0   : buff.readInt32BE(offset + 8),
  result_core__total_periods_elapsed_sd0 : buff.readUInt32BE(offset + 12),
  result_core__ambient_window_events_sd1 : buff.readUInt32BE(offset + 16),
  result_core__ranging_total_events_sd1  : buff.readUInt32BE(offset + 20),
  result_core__signal_total_events_sd1   : buff.readInt32BE(offset + 24),
  result_core__total_periods_elapsed_sd1 : buff.readUInt32BE(offset + 28),
  result_core__spare_0                   : buff[offset + 32],
})

//VL53L1_i2c_decode_debug_results
exports.decode_debug_results = (buff, offset) => ({
  phasecal_result__reference_phase                    : buff.readUInt16BE(offset),
  phasecal_result__vcsel_start                        : buff[offset +  2] & 0x7F,
  ref_spad_char_result__num_actual_ref_spads          : buff[offset +  3] & 0x3F,
  ref_spad_char_result__ref_location                  : buff[offset +  4] & 0x3,
  vhv_result__coldboot_status                         : buff[offset +  5] & 0x1,
  vhv_result__search_result                           : buff[offset +  6] & 0x3F,
  vhv_result__latest_setting                          : buff[offset +  7] & 0x3F,
  result__osc_calibrate_val                           : buff.readUInt16BE(offset + 8) & 0x3FF,
  ana_config__powerdown_go1                           : buff[offset + 10] & 0x3,
  ana_config__ref_bg_ctrl                             : buff[offset + 11] & 0x3,
  ana_config__regdvdd1v2_ctrl                         : buff[offset + 12] & 0xF,
  ana_config__osc_slow_ctrl                           : buff[offset + 13] & 0x7,
  test_mode__status                                   : buff[offset + 14] & 0x1,
  firmware__system_status                             : buff[offset + 15] & 0x3,
  firmware__mode_status                               : buff[offset + 16],
  firmware__secondary_mode_status                     : buff[offset + 17],
  firmware__cal_repeat_rate_counter                   : buff.readUInt16BE(offset + 18) & 0xFFF,
  gph__system__thresh_high                            : buff.readUInt16BE(offset + 22),
  gph__system__thresh_low                             : buff.readUInt16BE(offset + 24),
  gph__system__enable_xtalk_per_quadrant              : buff[offset + 26] & 0x1,
  gph__spare_0                                        : buff[offset + 27] & 0x7,
  gph__sd_config__woi_sd0                             : buff[offset + 28],
  gph__sd_config__woi_sd1                             : buff[offset + 29],
  gph__sd_config__initial_phase_sd0                   : buff[offset + 30] & 0x7F,
  gph__sd_config__initial_phase_sd1                   : buff[offset + 31] & 0x7F,
  gph__sd_config__first_order_select                  : buff[offset + 32] & 0x3,
  gph__sd_config__quantifier                          : buff[offset + 33] & 0xF,
  gph__roi_config__user_roi_centre_spad               : buff[offset + 34],
  gph__roi_config__user_roi_requested_global_xy_size  : buff[offset + 35],
  gph__system__sequence_config                        : buff[offset + 36],
  gph__gph_id                                         : buff[offset + 37] & 0x1,
  system__interrupt_set                               : buff[offset + 38] & 0x3,
  interrupt_manager__enables                          : buff[offset + 39] & 0x1F,
  interrupt_manager__clear                            : buff[offset + 40] & 0x1F,
  interrupt_manager__status                           : buff[offset + 41] & 0x1F,
  mcu_to_host_bank__wr_access_en                      : buff[offset + 42] & 0x1,
  power_management__go1_reset_status                  : buff[offset + 43] & 0x1,
  pad_startup_mode__value_ro                          : buff[offset + 44] & 0x3,
  pad_startup_mode__value_ctrl                        : buff[offset + 45] & 0x3F,
  pll_period_us                                       : buff.readUInt32BE(offset + 46) & 0x3FFFF,
  interrupt_scheduler__data_out                       : buff.readUInt32BE(offset + 50),
  nvm_bist__complete                                  : buff[offset + 54] & 0x1,
  nvm_bist__status                                    : buff[offset + 55] & 0x1
})

//VL53L1_i2c_decode_nvm_copy_data
exports.decode_nvm_copy_data = (buffer, offset = 0) => ({
  identification__model_id           : buffer.readUInt8(    offset),
  identification__module_type        : buffer.readUInt8(    offset +  1),
  identification__revision_id        : buffer.readUInt8(    offset +  2),
  identification__module_id          : buffer.readUInt16BE( offset +  3),
  ana_config__fast_osc__trim_max     : buffer.readUInt8(    offset +  5) & 0x7F,
  ana_config__fast_osc__freq_set     : buffer.readUInt8(    offset +  6) & 0x7,
  ana_config__vcsel_trim             : buffer.readUInt8(    offset +  7) & 0x7,
  ana_config__vcsel_selion           : buffer.readUInt8(    offset +  8) & 0x3F,
  ana_config__vcsel_selion_max       : buffer.readUInt8(    offset +  9) & 0x3F,
  protected_laser_safety__lock_bit   : buffer.readUInt8(    offset + 10) & 0x1,
  laser_safety__key                  : buffer.readUInt8(    offset + 11) & 0x7F,
  laser_safety__key_ro               : buffer.readUInt8(    offset + 12) & 0x1,
  laser_safety__clip                 : buffer.readUInt8(    offset + 13) & 0x3F,
  laser_safety__mult                 : buffer.readUInt8(    offset + 14) & 0x3F,
  global_config__spad_enables_rtn_0  : buffer.readUInt8(    offset + 15),
  global_config__spad_enables_rtn_1  : buffer.readUInt8(    offset + 16),
  global_config__spad_enables_rtn_2  : buffer.readUInt8(    offset + 17),
  global_config__spad_enables_rtn_3  : buffer.readUInt8(    offset + 18),
  global_config__spad_enables_rtn_4  : buffer.readUInt8(    offset + 19),
  global_config__spad_enables_rtn_5  : buffer.readUInt8(    offset + 20),
  global_config__spad_enables_rtn_6  : buffer.readUInt8(    offset + 21),
  global_config__spad_enables_rtn_7  : buffer.readUInt8(    offset + 22),
  global_config__spad_enables_rtn_8  : buffer.readUInt8(    offset + 23),
  global_config__spad_enables_rtn_9  : buffer.readUInt8(    offset + 24),
  global_config__spad_enables_rtn_10 : buffer.readUInt8(    offset + 25),
  global_config__spad_enables_rtn_11 : buffer.readUInt8(    offset + 26),
  global_config__spad_enables_rtn_12 : buffer.readUInt8(    offset + 27),
  global_config__spad_enables_rtn_13 : buffer.readUInt8(    offset + 28),
  global_config__spad_enables_rtn_14 : buffer.readUInt8(    offset + 29),
  global_config__spad_enables_rtn_15 : buffer.readUInt8(    offset + 30),
  global_config__spad_enables_rtn_16 : buffer.readUInt8(    offset + 31),
  global_config__spad_enables_rtn_17 : buffer.readUInt8(    offset + 32),
  global_config__spad_enables_rtn_18 : buffer.readUInt8(    offset + 33),
  global_config__spad_enables_rtn_19 : buffer.readUInt8(    offset + 34),
  global_config__spad_enables_rtn_20 : buffer.readUInt8(    offset + 35),
  global_config__spad_enables_rtn_21 : buffer.readUInt8(    offset + 36),
  global_config__spad_enables_rtn_22 : buffer.readUInt8(    offset + 37),
  global_config__spad_enables_rtn_23 : buffer.readUInt8(    offset + 38),
  global_config__spad_enables_rtn_24 : buffer.readUInt8(    offset + 39),
  global_config__spad_enables_rtn_25 : buffer.readUInt8(    offset + 40),
  global_config__spad_enables_rtn_26 : buffer.readUInt8(    offset + 41),
  global_config__spad_enables_rtn_27 : buffer.readUInt8(    offset + 42),
  global_config__spad_enables_rtn_28 : buffer.readUInt8(    offset + 43),
  global_config__spad_enables_rtn_29 : buffer.readUInt8(    offset + 44),
  global_config__spad_enables_rtn_30 : buffer.readUInt8(    offset + 45),
  global_config__spad_enables_rtn_31 : buffer.readUInt8(    offset + 46),
  roi_config__mode_roi_centre_spad   : buffer.readUInt8(    offset + 47),
  roi_config__mode_roi_xy_size       : buffer.readUInt8(    offset + 48),
})








//VL53L1_set_system_control
exports.set_system_control = (device) => {
  debug.info('set_system_control')
  const buffer = Buffer.alloc(I2C_SIZE.SYSTEM_CONTROL)
  exports.encode_system_control(device.LLData.sys_ctrl, buffer, 0)
  return device.i2c.writeMulti(REG.POWER_MANAGEMENT__GO1_POWER_FORCE, buffer)
}

//VL53L1_set_customer_nvm_managed
exports.set_customer_nvm_managed = (device) => {
  debug.info('set_customer_nvm_managed')
  const buffer = Buffer.alloc(I2C_SIZE.CUSTOMER_NVM_MANAGED)
  exports.encode_system_control(device.LLData.customer, buffer, 0)
  return device.i2c.writeMulti(REG.GLOBAL_CONFIG__SPAD_ENABLES_REF_0, buffer)
}







//VL53L1_get_static_nvm_managed
exports.get_static_nvm_managed = async (i2c) => {
  debug.info('get_static_nvm_managed')
  const buffer = await i2c.readMulti(REG.I2C_SLAVE__DEVICE_ADDRESS, I2C_SIZE.STATIC_NVM_MANAGED)
  return exports.decode_static_nvm_managed(buffer)
}

//VL53L1_get_customer_nvm_managed
exports.get_customer_nvm_managed = async (i2c) => {
  debug.info('get_customer_nvm_managed')
  const buffer = await i2c.readMulti(REG.GLOBAL_CONFIG__SPAD_ENABLES_REF_0, I2C_SIZE.CUSTOMER_NVM_MANAGED)
  return exports.decode_customer_nvm_managed(buffer)
}

//VL53L1_get_nvm_copy_data
exports.get_nvm_copy_data = async (i2c) => {
  debug.info('get_nvm_copy_data')
  const buffer = await i2c.readMulti(REG.IDENTIFICATION__MODEL_ID, I2C_SIZE.NVM_COPY_DATA)
  return exports.decode_nvm_copy_data(buffer)
}



//VL53L1_i2c_encode_static_nvm_managed
exports.encode_static_nvm_managed = (stat_nvm, buffer, offset) => {
  buffer.writeUInt8(    stat_nvm.i2c_slave__device_address & 0x7F,       offset + 0)
  buffer.writeUInt8(    stat_nvm.ana_config__vhv_ref_sel_vddpix & 0xF,   offset + 1)
  buffer.writeUInt8(    stat_nvm.ana_config__vhv_ref_sel_vquench & 0x7F, offset + 2)
  buffer.writeUInt8(    stat_nvm.ana_config__reg_avdd1v2_sel & 0x3,      offset + 3)
  buffer.writeUInt8(    stat_nvm.ana_config__fast_osc__trim & 0x7F,      offset + 4)
  buffer.writeUInt16BE( stat_nvm.osc_measured__fast_osc__frequency,      offset + 5)
  buffer.writeUInt8(    stat_nvm.vhv_config__timeout_macrop_loop_bound,  offset + 7)
  buffer.writeUInt8(    stat_nvm.vhv_config__count_thresh,               offset + 8)
  buffer.writeUInt8(    stat_nvm.vhv_config__offset & 0x3F,              offset + 9)
  buffer.writeUInt8(    stat_nvm.vhv_config__init,                       offset + 10)
  return buffer
}

//VL53L1_i2c_encode_customer_nvm_managed
exports.encode_customer_nvm_managed = (customer, buffer, offset) => {
  buffer.writeUInt8(    customer.global_config__spad_enables_ref_0,                  offset +  0)
  buffer.writeUInt8(    customer.global_config__spad_enables_ref_1,                  offset +  1)
  buffer.writeUInt8(    customer.global_config__spad_enables_ref_2,                  offset +  2)
  buffer.writeUInt8(    customer.global_config__spad_enables_ref_3,                  offset +  3)
  buffer.writeUInt8(    customer.global_config__spad_enables_ref_4,                  offset +  4)
  buffer.writeUInt8(    customer.global_config__spad_enables_ref_5 & 0xF,            offset +  5)
  buffer.writeUInt8(    customer.global_config__ref_en_start_select,                 offset +  6)
  buffer.writeUInt8(    customer.ref_spad_man__num_requested_ref_spads & 0x3F,       offset +  7)
  buffer.writeUInt8(    customer.ref_spad_man__ref_location & 0x3,                   offset +  8)
  buffer.writeUInt16BE( customer.algo__crosstalk_compensation_plane_offset_kcps,     offset +  9)
  buffer.writeInt16BE(  customer.algo__crosstalk_compensation_x_plane_gradient_kcps, offset + 11)
  buffer.writeInt16BE(  customer.algo__crosstalk_compensation_y_plane_gradient_kcps, offset + 13)
  buffer.writeUInt16BE( customer.ref_spad_char__total_rate_target_mcps,              offset + 15)
  buffer.writeInt16BE(  customer.algo__part_to_part_range_offset_mm & 0x1FFF,        offset + 17)
  buffer.writeInt16BE(  customer.mm_config__inner_offset_mm,                         offset + 19)
  buffer.writeInt16BE(  customer.mm_config__outer_offset_mm,                         offset + 21)
  return buffer
}

//VL53L1_i2c_encode_static_config
exports.encode_static_config = (stat_cfg, buffer, offset) => {
  buffer.writeUInt16BE( stat_cfg.dss_config__target_total_rate_mcps,           offset +  0)
  buffer.writeUInt8(    stat_cfg.debug__ctrl & 0x1,                            offset +  2)
  buffer.writeUInt8(    stat_cfg.test_mode__ctrl & 0xF,                        offset +  3)
  buffer.writeUInt8(    stat_cfg.clk_gating__ctrl & 0xF,                       offset +  4)
  buffer.writeUInt8(    stat_cfg.nvm_bist__ctrl & 0x1F,                        offset +  5)
  buffer.writeUInt8(    stat_cfg.nvm_bist__num_nvm_words & 0x7F,               offset +  6)
  buffer.writeUInt8(    stat_cfg.nvm_bist__start_address & 0x7F,               offset +  7)
  buffer.writeUInt8(    stat_cfg.host_if__status & 0x1,                        offset +  8)
  buffer.writeUInt8(    stat_cfg.pad_i2c_hv__config,                           offset +  9)
  buffer.writeUInt8(    stat_cfg.pad_i2c_hv__extsup_config & 0x1,              offset + 10)
  buffer.writeUInt8(    stat_cfg.gpio_hv_pad__ctrl & 0x3,                      offset + 11)
  buffer.writeUInt8(    stat_cfg.gpio_hv_mux__ctrl & 0x1F,                     offset + 12)
  buffer.writeUInt8(    stat_cfg.gpio__tio_hv_status & 0x3,                    offset + 13)
  buffer.writeUInt8(    stat_cfg.gpio__fio_hv_status & 0x3,                    offset + 14)
  buffer.writeUInt8(    stat_cfg.ana_config__spad_sel_pswidth & 0x7,           offset + 15)
  buffer.writeUInt8(    stat_cfg.ana_config__vcsel_pulse_width_offset & 0x1F,  offset + 16)
  buffer.writeUInt8(    stat_cfg.ana_config__fast_osc__config_ctrl & 0x1,      offset + 17)
  buffer.writeUInt8(    stat_cfg.sigma_estimator__effective_pulse_width_ns,    offset + 18)
  buffer.writeUInt8(    stat_cfg.sigma_estimator__effective_ambient_width_ns,  offset + 19)
  buffer.writeUInt8(    stat_cfg.sigma_estimator__sigma_ref_mm,                offset + 20)
  buffer.writeUInt8(    stat_cfg.algo__crosstalk_compensation_valid_height_mm, offset + 21)
  buffer.writeUInt8(    stat_cfg.spare_host_config__static_config_spare_0,     offset + 22)
  buffer.writeUInt8(    stat_cfg.spare_host_config__static_config_spare_1,     offset + 23)
  buffer.writeUInt16BE( stat_cfg.algo__range_ignore_threshold_mcps,            offset + 24)
  buffer.writeUInt8(    stat_cfg.algo__range_ignore_valid_height_mm,           offset + 26)
  buffer.writeUInt8(    stat_cfg.algo__range_min_clip,                         offset + 27)
  buffer.writeUInt8(    stat_cfg.algo__consistency_check__tolerance & 0xF,     offset + 28)
  buffer.writeUInt8(    stat_cfg.spare_host_config__static_config_spare_2,     offset + 29)
  buffer.writeUInt8(    stat_cfg.sd_config__reset_stages_msb & 0xF,            offset + 30)
  buffer.writeUInt8(    stat_cfg.sd_config__reset_stages_lsb,                  offset + 31)
  return buffer
}

//VL53L1_i2c_encode_general_config
exports.encode_general_config = (gen_cfg, buffer, offset) => {
  buffer.writeUInt8(    gen_cfg.gph_config__stream_count_update_value,       offset +   0)
  buffer.writeUInt8(    gen_cfg.global_config__stream_divider,               offset +   1)
  buffer.writeUInt8(    gen_cfg.system__interrupt_config_gpio,               offset +   2)
  buffer.writeUInt8(    gen_cfg.cal_config__vcsel_start & 0x7F,              offset +   3)
  buffer.writeUInt16BE( gen_cfg.cal_config__repeat_rate & 0xFFF,             offset +   4)
  buffer.writeUInt8(    gen_cfg.global_config__vcsel_width & 0x7F,           offset +   6)
  buffer.writeUInt8(    gen_cfg.phasecal_config__timeout_macrop,             offset +   7)
  buffer.writeUInt8(    gen_cfg.phasecal_config__target,                     offset +   8)
  buffer.writeUInt8(    gen_cfg.phasecal_config__override & 0x1,             offset +   9)
  buffer.writeUInt8(    gen_cfg.dss_config__roi_mode_control & 0x7,          offset +  11)
  buffer.writeUInt16BE( gen_cfg.system__thresh_rate_high,                    offset +  12)
  buffer.writeUInt16BE( gen_cfg.system__thresh_rate_low,                     offset +  14)
  buffer.writeUInt16BE( gen_cfg.dss_config__manual_effective_spads_select,   offset +  16)
  buffer.writeUInt8(    gen_cfg.dss_config__manual_block_select,             offset +  18)
  buffer.writeUInt8(    gen_cfg.dss_config__aperture_attenuation,            offset +  19)
  buffer.writeUInt8(    gen_cfg.dss_config__max_spads_limit,                 offset +  20)
  buffer.writeUInt8(    gen_cfg.dss_config__min_spads_limit,                 offset +  21)
  return buffer
}

//VL53L1_i2c_encode_timing_config
exports.encode_timing_config = (tim_cfg, buffer, offset) => {
  buffer.writeUInt16BE( tim_cfg.mm_config__timeout_macrop_a,                 offset +   0)
  buffer.writeUInt16BE( tim_cfg.mm_config__timeout_macrop_b,                 offset +   2)
  buffer.writeUInt16BE( tim_cfg.range_config__timeout_macrop_a,              offset +   4)
  buffer.writeUInt8(    tim_cfg.range_config__vcsel_period_a & 0x3F,         offset +   6)
  buffer.writeUInt16BE( tim_cfg.range_config__timeout_macrop_b,              offset +   7)
  buffer.writeUInt8(    tim_cfg.range_config__vcsel_period_b & 0x3F,         offset +   9)
  buffer.writeUInt16BE( tim_cfg.range_config__sigma_thresh,                  offset +  10)
  buffer.writeUInt16BE( tim_cfg.range_config__min_count_rate_rtn_limit_mcps, offset +  12)
  buffer.writeUInt8(    tim_cfg.range_config__valid_phase_low,               offset +  14)
  buffer.writeUInt8(    tim_cfg.range_config__valid_phase_high,              offset +  15)
  buffer.writeUInt32BE( tim_cfg.system__intermeasurement_period,             offset +  18)
  buffer.writeUInt8(    tim_cfg.system__fractional_enable & 0x1,             offset +  22)
  return buffer
}

//VL53L1_i2c_encode_dynamic_config
exports.encode_dynamic_config = (dyn_cfg, buffer, offset) => {
  buffer.writeUInt8(    dyn_cfg.system__grouped_parameter_hold_0 & 0x3,        offset +   0)
  buffer.writeUInt16BE( dyn_cfg.system__thresh_high,                           offset +   1)
  buffer.writeUInt16BE( dyn_cfg.system__thresh_low,                            offset +   3)
  buffer.writeUInt8(    dyn_cfg.system__enable_xtalk_per_quadrant & 0x1,       offset +   5)
  buffer.writeUInt8(    dyn_cfg.system__seed_config & 0x7,                     offset +   6)
  buffer.writeUInt8(    dyn_cfg.sd_config__woi_sd0,                            offset +   7)
  buffer.writeUInt8(    dyn_cfg.sd_config__woi_sd1,                            offset +   8)
  buffer.writeUInt8(    dyn_cfg.sd_config__initial_phase_sd0 & 0x7F,           offset +   9)
  buffer.writeUInt8(    dyn_cfg.sd_config__initial_phase_sd1 & 0x7F,           offset +  10)
  buffer.writeUInt8(    dyn_cfg.system__grouped_parameter_hold_1 & 0x3,        offset +  11)
  buffer.writeUInt8(    dyn_cfg.sd_config__first_order_select & 0x3,           offset +  12)
  buffer.writeUInt8(    dyn_cfg.sd_config__quantifier & 0xF,                   offset +  13)
  buffer.writeUInt8(    dyn_cfg.roi_config__user_roi_centre_spad,              offset +  14)
  buffer.writeUInt8(    dyn_cfg.roi_config__user_roi_requested_global_xy_size, offset +  15)
  buffer.writeUInt8(    dyn_cfg.system__sequence_config,                       offset +  16)
  buffer.writeUInt8(    dyn_cfg.system__grouped_parameter_hold & 0x3,          offset +  17)
  return buffer
}

//VL53L1_i2c_encode_system_control
exports.encode_system_control = (sys_ctrl, buffer, offset) => {
  buffer.writeUInt8(    sys_ctrl.power_management__go1_power_force & 0x1,    offset + 0)
  buffer.writeUInt8(    sys_ctrl.system__stream_count_ctrl & 0x1,            offset + 1)
  buffer.writeUInt8(    sys_ctrl.firmware__enable & 0x1,                     offset + 2)
  buffer.writeUInt8(    sys_ctrl.system__interrupt_clear & 0x3,              offset + 3)
  buffer.writeUInt8(    sys_ctrl.system__mode_start,                         offset + 4)
  return buffer
}