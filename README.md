# vl53l1x
A Node.js library for a vl53l1x TOF distance sensor

## API
All functions return a Promise.

### vl53l1x.mode(mode)

- `mode` (**string**): 'short' or 'long'

### vl53l1x.timing()
Passing no arguments will return the current timming settings.
**returns**: An **object** with `{ dwell: int, sleep: int }`

### vl53l1x.vl53l1x.timing(dwell, sleep = 1)
- `dwell` (**int**): time in milliseconds the device will spend collecting return signals
- `mode` (**int**): time in milliseconds the device will wait between measurements

### vl53l1x.roi(width, height, center = 199)
- `width` (**int**): Number of spads to use horizontally. (min 4, max 16)
- `height` (**int**): Number of spads to use vertically. (min 4, max 16)

### vl53l1x.offset(distance)
- `distance` (**float**): The offset distance in millimeters.

Use [calibrate_offset()](#calibrate-offset) to determine the offset.

### vl53l1x.start()
### vl53l1x.stop()
### vl53l1x.measure()
### vl53l1x.calibrate_offset()
### vl53l1x.calibrate_xtalk()

# License

MIT
