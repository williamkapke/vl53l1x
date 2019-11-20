const REG = require('./registers.js');
const debug = require('../debug.js');

//VL53L1_is_firmware_ready_silicon
module.exports.is_firmware_ready_silicon = async (device) => {
  debug.info('is_firmware_ready_silicon')
  const dbg_results = device.LLData.dbg_results
  const buffer = await device.i2c.readMulti(REG.INTERRUPT_MANAGER__ENABLES, 5)
  dbg_results.interrupt_manager__enables         = buffer[0];
  dbg_results.interrupt_manager__clear           = buffer[1];
  dbg_results.interrupt_manager__status          = buffer[2];
  dbg_results.mcu_to_host_bank__wr_access_en     = buffer[3];
  dbg_results.power_management__go1_reset_status = buffer[4];

  if ((device.LLData.sys_ctrl.power_management__go1_power_force & 0x01) === 0x01) {
    return (dbg_results.interrupt_manager__enables & 0x1F) === 0x1F && (dbg_results.interrupt_manager__clear & 0x1F) === 0x1F
  }
  return (dbg_results.power_management__go1_reset_status & 0x01) === 0x00
}

