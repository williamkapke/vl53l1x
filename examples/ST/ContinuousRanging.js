const stm_api = require('../../ST/api.js')
const Device = require('../../ST/device.js');
const {DISTANCEMODE, PRESETMODE} = require('../../ST/define.js');

require('i2cdriver/i2c-bus').openPromisified('/dev/tty.usbserial-DO01INSW').then(async (bus) => {
  const device = Device(0x29, bus)
  await stm_api.WaitDeviceBooted(device);
  await stm_api.DataInit(device);
  await stm_api.StaticInit(device);
  await stm_api.SetPresetMode(device, PRESETMODE.AUTONOMOUS, DISTANCEMODE.MEDIUM, 1);
  await stm_api.StartMeasurement(device);

  // const b1 = require('./tuning.js')
  // await device.i2c.write(Buffer.from(b1))

  for (let i = 0; i < 1000; i++) {
    await stm_api.WaitMeasurementDataReady(device);
    const results = await stm_api.GetRangingMeasurementData(device)
    const msg = results.RangeStatus === 'RANGESTATUS_RANGE_VALID' ? results.RangeMilliMeter : results.RangeStatus
    console.log(msg)
    await stm_api.ClearInterruptAndStartMeasurement(device);
  }
  await stm_api.StopMeasurement(device);
})

