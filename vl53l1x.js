const i2c = require('./i2c.js')
const debug = require('./debug.js')
const REG = require('./ST_ULD/define.js')
const st_uld = require('./ST_ULD/VL53L1X_api.js')
const st_uld_calibration = require('./ST_ULD/VL53L1X_calibration.js')
const EventEmitter = require('events').EventEmitter;

const VL53L1X = (bus, addr=0x29, options = {}) => {
  if (typeof bus !== 'object') {
    if (!options.driver) options.driver = 'i2c-bus'
    return require(options.driver).openPromisified(bus).then((bus) => VL53L1X(bus, addr, options))
  }

  const dev = i2c(addr, bus)
  let polarity;

  const init = async () => {
    while(!(await st_uld.VL53L1X_BootState(dev))) {
      debug.verbose('Wait for device boot - retry')
    }

    await st_uld.VL53L1X_SensorInit(dev, options.config)
    polarity = await st_uld.VL53L1X_GetInterruptPolarity(dev)
  }

  const start = () => {
    debug.info('start()')
    return st_uld.VL53L1X_StartRanging(dev)
  }
  const stop = () => {
    debug.info('stop()')
    return st_uld.VL53L1X_StopRanging(dev)
  }
  const clear = () => {
    debug.info('clear()')
    return st_uld.VL53L1X_ClearInterrupt(dev)
  }

  const checkForDataReady = () => {
    return st_uld.VL53L1X_CheckForDataReady(dev, polarity)
  }
  const pollUntilDataReady = async () => {
    debug.info('pollUntilDataReady()')
    while(!(await checkForDataReady())){
      debug.verbose('pollUntilDataReady() - retry')
    }
  }
  const getResults = async () => {
    debug.info('getResults()')
    await pollUntilDataReady()
    const results = await st_uld.VL53L1X_GetResult(dev)
    iface.emit('data', results)
    iface.emit('distance', results.distance)
    return results
  }



  // once ranging is started- this poller will retrieve the results
  let poller;
  const poll = async () => {
    await getResults() // emits the data
    await clear()
    poller = setTimeout(poll, 1)
  }

  // create a mechanism to queue commands until init is done
  const initialize = init();

  const modes = {'short':1,'long':2}
  const dwell_times = [20, 50, 100, 200, 500]
  const iface = {
    //expose to allow doing whatever you want
    _: {
      i2c : dev,
      bus,
      initialize,
      st_uld,
      st_uld_calibration,
    },
    mode: async (mode) => {
      debug.info('mode(%s)', mode)
      mode = modes[mode]
      if(!mode) throw new Error("Argument 'mode' must be either 'short' or 'long'")
      await st_uld.VL53L1X_SetDistanceMode(dev, mode)
    },
    timing: async (dwell, sleep = 1) => {
      if(dwell === undefined) {
        dwell = await st_uld.VL53L1X_GetTimingBudgetInMs(dev)
        return {
          dwell,
          sleep: (await st_uld.VL53L1X_GetInterMeasurementInMs(dev)) - dwell
        }
      }
      debug.info('interval(%s, %s)', dwell, sleep)
      if (!dwell_times.includes(dwell)) throw new Error("Argument 'dwell' must be one of: " + dwell_times)
      await st_uld.VL53L1X_SetTimingBudgetInMs(dev, dwell)
      await st_uld.VL53L1X_SetInterMeasurementInMs(dev,dwell + sleep)
    },
    // From User Manual UM2555...
    /* Table of SPAD locations. Each SPAD has a number which is not obvious.
    *
    * 128,136,144,152,160,168,176,184, 192,200,208,216,224,232,240,248
    * 129,137,145,153,161,169,177,185, 193,201,209,217,225,233,241,249
    * 130,138,146,154,162,170,178,186, 194,202,210,218,226,234,242,250
    * 131,139,147,155,163,171,179,187, 195,203,211,219,227,235,243,251
    * 132,140,148,156,164,172,180,188, 196,204,212,220,228,236,244,252
    * 133,141,149,157,165,173,181,189, 197,205,213,221,229,237,245,253
    * 134,142,150,158,166,174,182,190, 198,206,214,222,230,238,246,254
    * 135,143,151,159,167,175,183,191, 199,207,215,223,231,239,247,255
    * 127,119,111,103, 95, 87, 79, 71, 63, 55, 47, 39, 31, 23, 15, 7
    * 126,118,110,102, 94, 86, 78, 70, 62, 54, 46, 38, 30, 22, 14, 6
    * 125,117,109,101, 93, 85, 77, 69, 61, 53, 45, 37, 29, 21, 13, 5
    * 124,116,108,100, 92, 84, 76, 68, 60, 52, 44, 36, 28, 20, 12, 4
    * 123,115,107, 99, 91, 83, 75, 67, 59, 51, 43, 35, 27, 19, 11, 3
    * 122,114,106, 98, 90, 82, 74, 66, 58, 50, 42, 34, 26, 18, 10, 2
    * 121,113,105, 97, 89, 81, 73, 65, 57, 49, 41, 33, 25, 17, 9, 1
    * 120,112,104, 96, 88, 80, 72, 64, 56, 48, 40, 32, 24, 16, 8, 0 /*Pin 1*/
    roi: async (width, height, center = 199) => {
      debug.info('roi(%s, %s, %s)', width, height, center)
      if (width > 16) width = 16
      if (height > 16) height = 16

      if (width > 10 || height > 10){
        center = 199
      }

      const XY = ((height - 1) << 4)| (width - 1)
      await dev.writeReg(REG.ROI_CONFIG__USER_ROI_CENTRE_SPAD, center)
      await dev.writeReg(REG.ROI_CONFIG__USER_ROI_REQUESTED_GLOBAL_XY_SIZE, XY)
    },
    offset: (mm) => {
      return st_uld.VL53L1X_SetOffset(dev, mm)
    },
    xtalk: (cps) => {
      return st_uld.VL53L1X_SetXtalk(dev, cps)
    },
    //TODO
    // get xtalk
    // get ROI
    // get mode
    // get device api version
    // get/set polarity
    // get sensor id?
    // get/set min clip

    start: async (interval = 1) => {
      debug.info('start()')
      await clear()
      await start()
      poller = setTimeout(poll, interval)
    },
    stop: async () => {
      debug.info('stop()')
      clearTimeout(poller)
      poller = undefined
      await stop()
    },

    measure: async () => {
      if (!poller) {
        await clear()
        debug.info('start SINGLESHOT')
        await dev.writeReg(REG.SYSTEM__MODE_START, 0x10)//SINGLESHOT
        return (await getResults()).distance
      }
      return new Promise((resolve) => {
        iface.once('data', resolve)
      })
    },

    calibrate_offset: (distance) => st_uld_calibration.VL53L1X_CalibrateOffset(dev, distance),
    calibrate_xtalk: (distance) => st_uld_calibration.VL53L1X_CalibrateXtalk(dev, distance),
  }

  // Create wrappers around the api functions to make them wait
  // until init() is complete. Then remove the wrapper after first use.
  Object.keys(iface).forEach((key) => {
    if (key === '_') return
    const fn = iface[key]
    iface[key] = async (...args) => {
      await initialize // wait until the initialize promise is resolved
      iface[key] = fn // remove the overhead of this check
      return fn.apply(fn, args)
    }
  })
  Object.setPrototypeOf(iface, new EventEmitter())
  return iface;
}

module.exports = VL53L1X