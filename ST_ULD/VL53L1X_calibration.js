const REG = require('./define.js')
const api = require('./VL53L1X_api.js')
const debug = require('debug')('VL53L1X:calibration');

const VL53L1_WrWord = async (dev, reg, value) => dev.writeReg16(reg, value)

const VL53L1X_CalibrateOffset = async (dev, TargetDistInMm) => {
  debug('Start - VL53L1X_CalibrateOffset(%s)', TargetDistInMm)
  await VL53L1_WrWord(dev, REG.ALGO__PART_TO_PART_RANGE_OFFSET_MM, 0x0)
  await VL53L1_WrWord(dev, REG.MM_CONFIG__INNER_OFFSET_MM, 0x0)
  await VL53L1_WrWord(dev, REG.MM_CONFIG__OUTER_OFFSET_MM, 0x0)
  await api.VL53L1X_StartRanging(dev)	/* Enable VL53L1X sensor */

  let AverageDistance = 0;
  const polarity = await api.VL53L1X_GetInterruptPolarity(dev)
  for (let i = -2; i < 50; i++) {
    while(!(await api.VL53L1X_CheckForDataReady(dev, polarity))){}

    const distance = await api.VL53L1X_GetDistance(dev)
    if(i > 0) {
      debug('distance[%s]: ', i, distance)
    //the first few are off... so ignore them
      AverageDistance += distance
    }
    await api.VL53L1X_ClearInterrupt(dev)
  }
  await api.VL53L1X_StopRanging(dev)
  AverageDistance = AverageDistance / 50
  let offset = Math.trunc((TargetDistInMm - AverageDistance) * 4)
  await VL53L1_WrWord(dev, REG.ALGO__PART_TO_PART_RANGE_OFFSET_MM, offset)
  debug('End - VL53L1X_CalibrateOffset(%s) = %s', TargetDistInMm, offset / 4)
  return offset
}

const VL53L1X_CalibrateXtalk = async (dev, TargetDistInMm) => {
  debug('Start - VL53L1X_CalibrateXtalk(%s)', TargetDistInMm)
  let AverageSignalRate = 0
  let AverageDistance = 0
  let AverageSpadNb = 0

  await VL53L1_WrWord(dev, 0x0016,0)
  await api.VL53L1X_StartRanging(dev)

  const polarity = await api.VL53L1X_GetInterruptPolarity(dev)
  for (let i = 0; i < 50; i++) {
    while(!(await api.VL53L1X_CheckForDataReady(dev, polarity))){}

    const distance = await api.VL53L1X_GetDistance(dev)
    debug('distance[%s]: ', i, distance)
    AverageDistance += distance
    AverageSpadNb = AverageSpadNb + await api.VL53L1X_GetSpadNb(dev)
    AverageSignalRate = AverageSignalRate + await api.VL53L1X_GetSignalRate(dev)
    await api.VL53L1X_ClearInterrupt(dev)
  }

  await api.VL53L1X_StopRanging(dev)
  AverageDistance = AverageDistance / 50;
  AverageSpadNb = AverageSpadNb / 50;
  AverageSignalRate = AverageSignalRate / 50;

  const calXtalk = (512*(AverageSignalRate*(1-(AverageDistance/TargetDistInMm)))/AverageSpadNb);
  await VL53L1_WrWord(dev, 0x0016, calXtalk);
  const xtalk = (calXtalk*1000)>>9;
  debug('End - VL53L1X_CalibrateXtalk(%s) = %s', TargetDistInMm, xtalk)
  return xtalk
}

module.exports = {
  VL53L1X_CalibrateOffset,
  VL53L1X_CalibrateXtalk
}

