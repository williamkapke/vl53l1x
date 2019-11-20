const REG = require('./registers.js');
const debug = require('../debug.js')
const silicone_core = require('./silicone_core.js');
const sleep = (t) => new Promise((resolve) => setTimeout(resolve, t));
const { DEVICEINTERRUPTLEVEL, REGISTER_SETTINGS: {DEVICEMEASUREMENTMODE} } = require('./define.js');

// VL53L1_wait_for_range_completion
const wait_for_range_completion = async (device) => {
  debug.info('wait_for_range_completion()')
  while (!(await is_new_data_ready(device))) {
    await sleep(1) //VL53L1_POLLING_DELAY_MS
    debug.verbose('wait_for_range_completion() - retry')
  }
}

// VL53L1_is_new_data_ready
const is_new_data_ready = async (device) => {
  let gpio__mux_active_high_hv = device.LLData.stat_cfg.gpio_hv_mux__ctrl & DEVICEINTERRUPTLEVEL.ACTIVE_MASK;
  let interrupt_ready = gpio__mux_active_high_hv === DEVICEINTERRUPTLEVEL.ACTIVE_HIGH ? 1 : 0
  let gpio__tio_hv_status = await device.i2c.readReg(REG.GPIO__TIO_HV_STATUS)
  return (gpio__tio_hv_status & 0x01) === interrupt_ready
}

//VL53L1_wait_for_firmware_ready
const wait_for_firmware_ready = async (device) => {
  debug.info('wait_for_firmware_ready()')
  const mode_start = device.LLData.sys_ctrl.system__mode_start & DEVICEMEASUREMENTMODE.MODE_MASK;
  if (mode_start === DEVICEMEASUREMENTMODE.TIMED || mode_start === DEVICEMEASUREMENTMODE.SINGLESHOT) {
    while (!(await is_firmware_ready(device))) {
      await sleep(1) //VL53L1_POLLING_DELAY_MS
      debug.verbose('wait_for_firmware_ready() - retry')
    }
  }
}

//VL53L1_poll_for_boot_completion + VL53L1_WaitValueMaskEx
const poll_for_boot_completion = async (i2c, timeout) => {
  debug.info('poll_for_boot_completion()')
  timeout = Date.now() + timeout
  await sleep(1200) // VL53L1_FIRMWARE_BOOT_TIME_US
  while(!(await is_boot_complete(i2c))) {
    if (Date.now() > timeout) {
      throw new Error('ERROR_TIME_OUT')
    }
    await sleep(1) //VL53L1_POLLING_DELAY_MS
    debug.verbose('poll_for_boot_completion() - retry')
  }
  // VL53L1_init_ll_driver_state(Dev, VL53L1_DEVICESTATE_SW_STANDBY);
}

const is_boot_complete = async (i2c) => ((await i2c.readReg(REG.FIRMWARE__SYSTEM_STATUS)) & 0x01) === 0x01

//VL53L1_poll_for_range_completion
const poll_for_range_completion = async (device, timeout) => {
  debug.info('poll_for_range_completion()')
  timeout = Date.now() + timeout
  let gpio__mux_active_high_hv = device.LLData.stat_cfg.gpio_hv_mux__ctrl & DEVICEINTERRUPTLEVEL.ACTIVE_MASK;
  let  interrupt_ready = gpio__mux_active_high_hv === DEVICEINTERRUPTLEVEL.ACTIVE_HIGH ? 1 : 0;

  while(!(await is_interrupt_triggered(device.i2c, interrupt_ready))) {
    if (Date.now() > timeout) {
      throw new Error('ERROR_TIME_OUT')
    }
    await sleep(1) //VL53L1_POLLING_DELAY_MS
    debug.verbose('poll_for_range_completion() - retry')
  }
}
const is_interrupt_triggered = async (i2c, comparor) => (await i2c.readReg(REG.GPIO__TIO_HV_STATUS) & 0x01) === comparor

//VL53L1_is_firmware_ready
const is_firmware_ready = silicone_core.is_firmware_ready_silicon


module.exports = {
  poll_for_boot_completion,
  poll_for_range_completion,
  wait_for_range_completion,
  wait_for_firmware_ready,
  // is_new_data_ready,
  // is_firmware_ready,
  sleep
}


