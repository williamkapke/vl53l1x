

module.exports = {
  //VL53L1_calc_pll_period_us
  calc_pll_period_us: (fast_osc_frequency) => (0x01 << 30) / fast_osc_frequency,

  //VL53L1_decode_vcsel_period
  decode_vcsel_period: (vcsel_period_reg) => (vcsel_period_reg + 1) << 1,

  //VL53L1_decode_row_col
  decode_row_col: (spad_number) => ({
    row: (spad_number > 127) ? (8 + ((255 - spad_number) & 0x07))  : spad_number & 0x07,
    col: (spad_number > 127) ? ((spad_number - 128) >> 3)        : (127 - spad_number) >> 3
  })
}
