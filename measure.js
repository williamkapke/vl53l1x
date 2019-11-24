const VL53L1X = require('./vl53l1x.js')

//Development i2c board: https://www.npmjs.com/package/i2cdriver
const driver = 'i2cdriver/i2c-bus'
const busNumber = '/dev/tty.usbserial-DO01INSW'

//Builtin i2c bus: //https://www.npmjs.com/package/i2c-bus
// const driver = 'i2c-bus'
// const busNumber = 1


VL53L1X(busNumber, 0x29, {driver:driver}).then(async (device) => {

  await device.roi(4,4)
  await device.mode('short')
  await device.offset(44)
  await device.timing(500, 40)

  device.on('data', (d) => console.log)

  await device.start()

  process.on('exit', async (code) => {
    await device.stop()
  });
})
