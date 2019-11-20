


const VL53L1X_CalibrateOffset = async (dev, TargetDistInMm) => {
  await VL53L1_WrWord(dev, ALGO__PART_TO_PART_RANGE_OFFSET_MM, 0x0)
  await VL53L1_WrWord(dev, MM_CONFIG__INNER_OFFSET_MM, 0x0)
  await VL53L1_WrWord(dev, MM_CONFIG__OUTER_OFFSET_MM, 0x0)
  await VL53L1X_StartRanging(dev)	/* Enable VL53L1X sensor */

  let AverageDistance = 0;
  for (let i = 0; i < 50; i++) {
    while(!(await VL53L1X_CheckForDataReady(dev))){}

    AverageDistance += await VL53L1X_GetDistance(dev)
    await VL53L1X_ClearInterrupt(dev)
  }
  await VL53L1X_StopRanging(dev)
  AverageDistance = AverageDistance / 50
  let offset = TargetDistInMm - AverageDistance
  await VL53L1_WrWord(dev, ALGO__PART_TO_PART_RANGE_OFFSET_MM, offset * 4)
  return offset
}

const VL53L1X_CalibrateXtalk = async (dev, TargetDistInMm) => {
  let AverageSignalRate = 0
  let AverageDistance = 0
  let AverageSpadNb = 0

  await VL53L1_WrWord(dev, 0x0016,0)
  await VL53L1X_StartRanging(dev)

  for (let i = 0; i < 50; i++) {
    while(!(await VL53L1X_CheckForDataReady(dev))){}

    AverageDistance = AverageDistance + await VL53L1X_GetDistance(dev)
    AverageSpadNb = AverageSpadNb + await VL53L1X_GetSpadNb(dev)
    AverageSignalRate = AverageSignalRate + await VL53L1X_GetSignalRate(dev)
    await VL53L1X_ClearInterrupt(dev)
  }

  await VL53L1X_StopRanging(dev)
  AverageDistance = AverageDistance / 50;
  AverageSpadNb = AverageSpadNb / 50;
  AverageSignalRate = AverageSignalRate / 50;

  const calXtalk = (512*(AverageSignalRate*(1-(AverageDistance/TargetDistInMm)))/AverageSpadNb);
  await VL53L1_WrWord(dev, 0x0016, calXtalk);
  return (calXtalk*1000)>>9;
}



