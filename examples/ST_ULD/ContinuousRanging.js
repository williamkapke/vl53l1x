const sleep = (t) => new Promise((resolve) => setTimeout(resolve, t));

const {
  VL53L1X_SensorInit,
  VL53L1X_ClearInterrupt,
  VL53L1X_GetInterruptPolarity,
  VL53L1X_StartRanging,
  VL53L1X_StopRanging,
  VL53L1X_CheckForDataReady,
  VL53L1X_SetTimingBudgetInMs,
  VL53L1X_SetDistanceMode,
  VL53L1X_SetOffset,
  VL53L1X_SetInterMeasurementInMs,
  VL53L1X_BootState,
  VL53L1X_GetResult,
  VL53L1X_SetROICenter,
  VL53L1X_SetROI,
} = require('../../ST_ULD/VL53L1X_api.js')

//Development i2c board: https://www.npmjs.com/package/i2cdriver
const driver = 'i2cdriver/i2c-bus'
const busNumber = '/dev/tty.usbserial-DO01INSW'

//Builtin i2c bus: //https://www.npmjs.com/package/i2c-bus
// const driver = 'i2c-bus'
// const busNumber = 1

require(driver).openPromisified(busNumber).then(async (bus) => {
  const dev = require('../../i2c.js')(0x29, bus)

  process.on('exit', async (code) => {
    await VL53L1X_StopRanging(dev)
  });

  while(!(await VL53L1X_BootState(dev))) {
    console.log('VL53L1X_BootState - retry') // seeing this logged is normal!
  }

  // This function must to be called to
  // initialize the sensor with the default settings
  await VL53L1X_SensorInit(dev);

  // Optional functions to be used to change the main ranging parameters
  // according the application requirements to get the best ranging performances
  await VL53L1X_SetDistanceMode(dev, 1); /* 1=short, 2=long */
  await VL53L1X_SetTimingBudgetInMs(dev, 500); /* in ms possible values [20, 50, 100, 200, 500] */
  await VL53L1X_SetInterMeasurementInMs(dev, 530); /* in ms, IM must be > = TB */

  await VL53L1X_SetOffset(dev, 47); /* offset compensation in mm */
  await VL53L1X_SetROICenter(dev, 143)
  await VL53L1X_SetROI(dev, 4, 4); /* minimum ROI 4,4 */
  await VL53L1X_StartRanging(dev);   /* This function has to be called to enable the ranging */

  const polarity = await VL53L1X_GetInterruptPolarity(dev)
  while(1){ /* read and display data */
    sleep(500)
    while(!(await VL53L1X_CheckForDataReady(dev, polarity))){
      console.log('VL53L1X_CheckForDataReady - retry')
    }

    console.log(await VL53L1X_GetResult(dev))

    // clear interrupt has to be called to enable next interrupt
    await VL53L1X_ClearInterrupt(dev);
  }

})





