# VL53L1X
A Node.js library for a vl53l1x TOF distance sensor

```js
const VL53L1X = require('vl53l1x')

//Development i2c board: https://www.npmjs.com/package/i2cdriver
// const driver = 'i2cdriver/i2c-bus'
// const busNumber = '/dev/tty.usbserial-DO01INSW'

//Builtin i2c bus: //https://www.npmjs.com/package/i2c-bus
const driver = 'i2c-bus'
const busNumber = 1

VL53L1X(busNumber, 0x29, {driver:driver}).then(async (device) => {

  device.on('data', (data) =>
    console.log(data)
  )

  await device.start()

  process.on('exit', async (code) => {
    await device.stop()
  })
})
```

## API
All functions return a Promise.

### VL53L1X(busNumber[,address[,options]])
`busNumber`: The bus number to use<br>
`address`: The i2c address of the device. (Default `0x29`)<br>
`options`:
- `driver`: The Node.js module that communicates with the i2c bus.
 (Default: ['i2c-bus'](https://www.npmjs.com/package/i2c-bus))<br>
 Any module that matches the ['i2c-bus'](https://www.npmjs.com/package/i2c-bus)
 interface can be used.
- `config`: An `Array` of bytes to initialize the device.
 (Default: [VL51L1X_DEFAULT_CONFIGURATION](https://github.com/williamkapke/vl53l1x/blob/master/ST_ULD/VL53L1X_api.js#L2))

### vl53l1x.mode(mode)

`mode`: `'short'` or `'long'`

### vl53l1x.timing()
Gets the current timing settings.
**returns**: An **object** with `{ dwell: int, sleep: int }`

### vl53l1x.vl53l1x.timing(dwell, sleep = 1)
Sets the timing settings.

`dwell`: Time in milliseconds the device will spend collecting signals<br>
`mode`: Time in milliseconds the device will wait between measurements

### vl53l1x.roi(width, height, center = 199)
Sets the Region Of Interest.

`width`: Number of SPADs to use horizontally. (min 4, max 16)<br>
`height`: Number of SPADs to use vertically. (min 4, max 16)

### vl53l1x.offset(distance)
Sets the calibration offset.

`distance`: The offset distance in millimeters. Max resolution is `.25 mm`.

Use [calibrate_offset()](#vl53l1xcalibrate_offset) to determine the offset.


### vl53l1x.offset(cps)
Sets the crosstalk compensation.

`cps`: The compensation value in cps (counts per second).

Use [calibrate_xtalk()](#vl53l1xcalibrate_xtalk) to determine the value.

### vl53l1x.start()
Starts polling for data. Results are emitted to the `data` event.

### vl53l1x.stop()
Stops polling for data.

### vl53l1x.measure()
Performs a single measurement and returns the result.  Results are also emitted to the `data` event.

**returns**: An object with the measurement data.

### vl53l1x.calibrate_offset()
Performs offset calibration. When complete, returns the value that was written to the device.
You should pass this value to [vl53l1x.offset(distance)](#vl53l1xoffsetdistance) on device start.

### vl53l1x.calibrate_xtalk()
Performs crosstalk calibration. When complete, returns the value that was written to the device.
You should pass this value to [vl53l1x.xtalk(cps)](#vl53l1xxtalkcps) on device start.

### vl53l1x.on('data', (data) => {})
Receives measurement data. Use [vl53l1x.start()](#vl53l1xstart) to start polling.

Example data:
```js
{
  status: 0,
  ambient: 8,
  numSPADs: 4,
  sigPerSPAD: 19944,
  distance: 115
}
```

# License

MIT
