const REG = require('./define.js')
const VL51L1X_DEFAULT_CONFIGURATION = [
	0x00, /* 0x2d : set bit 2 and 5 to 1 for fast plus mode (1MHz I2C), else don't touch */
	0x01, /* 0x2e : bit 0 if I2C pulled up at 1.8V, else set bit 0 to 1 (pull up at AVDD) */
	0x00, /* 0x2f : bit 0 if GPIO pulled up at 1.8V, else set bit 0 to 1 (pull up at AVDD) */
	0x01, /* 0x30 : set bit 4 to 0 for active high interrupt and 1 for active low (bits 3:0 must be 0x1), use SetInterruptPolarity() */
	0x02, /* 0x31 : bit 1 = interrupt depending on the polarity, use CheckForDataReady() */
	0x00, /* 0x32 : not user-modifiable */
	0x02, /* 0x33 : not user-modifiable */
	0x08, /* 0x34 : not user-modifiable */
	0x00, /* 0x35 : not user-modifiable */
	0x08, /* 0x36 : not user-modifiable */
	0x10, /* 0x37 : not user-modifiable */
	0x01, /* 0x38 : not user-modifiable */
	0x01, /* 0x39 : not user-modifiable */
	0x00, /* 0x3a : not user-modifiable */
	0x00, /* 0x3b : not user-modifiable */
	0x00, /* 0x3c : not user-modifiable */
	0x00, /* 0x3d : not user-modifiable */
	0xff, /* 0x3e : not user-modifiable */
	0x00, /* 0x3f : not user-modifiable */
	0x0F, /* 0x40 : not user-modifiable */
	0x00, /* 0x41 : not user-modifiable */
	0x00, /* 0x42 : not user-modifiable */
	0x00, /* 0x43 : not user-modifiable */
	0x00, /* 0x44 : not user-modifiable */
	0x00, /* 0x45 : not user-modifiable */
	0x20, /* 0x46 : interrupt configuration 0->level low detection, 1-> level high, 2-> Out of window, 3->In window, 0x20-> New sample ready , TBC */
	0x0b, /* 0x47 : not user-modifiable */
	0x00, /* 0x48 : not user-modifiable */
	0x00, /* 0x49 : not user-modifiable */
	0x02, /* 0x4a : not user-modifiable */
	0x0a, /* 0x4b : not user-modifiable */
	0x21, /* 0x4c : not user-modifiable */
	0x00, /* 0x4d : not user-modifiable */
	0x00, /* 0x4e : not user-modifiable */
	0x05, /* 0x4f : not user-modifiable */
	0x00, /* 0x50 : not user-modifiable */
	0x00, /* 0x51 : not user-modifiable */
	0x00, /* 0x52 : not user-modifiable */
	0x00, /* 0x53 : not user-modifiable */
	0xc8, /* 0x54 : not user-modifiable */
	0x00, /* 0x55 : not user-modifiable */
	0x00, /* 0x56 : not user-modifiable */
	0x38, /* 0x57 : not user-modifiable */
	0xff, /* 0x58 : not user-modifiable */
	0x01, /* 0x59 : not user-modifiable */
	0x00, /* 0x5a : not user-modifiable */
	0x08, /* 0x5b : not user-modifiable */
	0x00, /* 0x5c : not user-modifiable */
	0x00, /* 0x5d : not user-modifiable */
	0x01, /* 0x5e : not user-modifiable */
	0xcc, /* 0x5f : not user-modifiable */
	0x0f, /* 0x60 : not user-modifiable */
	0x01, /* 0x61 : not user-modifiable */
	0xf1, /* 0x62 : not user-modifiable */
	0x0d, /* 0x63 : not user-modifiable */
	0x01, /* 0x64 : Sigma threshold MSB (mm in 14.2 format for MSB+LSB), use SetSigmaThreshold(), default value 90 mm  */
	0x68, /* 0x65 : Sigma threshold LSB */
	0x00, /* 0x66 : Min count Rate MSB (MCPS in 9.7 format for MSB+LSB), use SetSignalThreshold() */
	0x80, /* 0x67 : Min count Rate LSB */
	0x08, /* 0x68 : not user-modifiable */
	0xb8, /* 0x69 : not user-modifiable */
	0x00, /* 0x6a : not user-modifiable */
	0x00, /* 0x6b : not user-modifiable */
	0x00, /* 0x6c : Intermeasurement period MSB, 32 bits register, use SetIntermeasurementInMs() */
	0x00, /* 0x6d : Intermeasurement period */
	0x0f, /* 0x6e : Intermeasurement period */
	0x89, /* 0x6f : Intermeasurement period LSB */
	0x00, /* 0x70 : not user-modifiable */
	0x00, /* 0x71 : not user-modifiable */
	0x00, /* 0x72 : distance threshold high MSB (in mm, MSB+LSB), use SetD:tanceThreshold() */
	0x00, /* 0x73 : distance threshold high LSB */
	0x00, /* 0x74 : distance threshold low MSB ( in mm, MSB+LSB), use SetD:tanceThreshold() */
	0x00, /* 0x75 : distance threshold low LSB */
	0x00, /* 0x76 : not user-modifiable */
	0x01, /* 0x77 : not user-modifiable */
	0x0f, /* 0x78 : not user-modifiable */
	0x0d, /* 0x79 : not user-modifiable */
	0x0e, /* 0x7a : not user-modifiable */
	0x0e, /* 0x7b : not user-modifiable */
	0x00, /* 0x7c : not user-modifiable */
	0x00, /* 0x7d : not user-modifiable */
	0x02, /* 0x7e : not user-modifiable */
	0xc7, /* 0x7f : ROI center, use SetROI() */
	0xff, /* 0x80 : XY ROI (X=Width, Y=Height), use SetROI() */
	0x9B, /* 0x81 : not user-modifiable */
	0x00, /* 0x82 : not user-modifiable */
	0x00, /* 0x83 : not user-modifiable */
	0x00, /* 0x84 : not user-modifiable */
	0x01, /* 0x85 : not user-modifiable */
	0x01, /* 0x86 : clear interrupt, use ClearInterrupt() */
	0x40  /* 0x87 : start ranging, use StartRanging() or StopRanging(), If you want an automatic start after VL53L1X_init() call, put 0x40 in location 0x87 */
]

const status_rtn = [ 255, 255, 255, 5, 2, 4, 1, 7, 3, 0, 255, 255, 9, 13, 255, 255, 255, 255, 10, 6, 255, 255, 11, 12 ]

const VL53L1X_GetSWVersion = () => ({
	major    : 3,
	minor    : 3,
	build    : 0,
	revision : 0,
})

const VL53L1_WrByte = async (dev, reg, value) => dev.writeReg(reg, value)
const VL53L1_WrWord = async (dev, reg, value) => dev.writeReg16(reg, value)
const VL53L1_WrDWord = async (dev, reg, value) => dev.writeReg32(reg, value)
const VL53L1_WrMulti = async (dev, reg, buffer) => dev.writeMulti(reg, buffer)


const VL53L1_RdByte = async (dev, reg) => dev.readReg(reg)
const VL53L1_RdWord = async (dev, reg) => dev.readReg16(reg)
const VL53L1_RdDWord = async (dev, reg) => dev.readReg32(reg)
const VL53L1_ReadMulti = async (dev, reg, length) => dev.readMulti(reg, length)



const VL53L1X_SetI2CAddress = (dev, new_address) => {
	return VL53L1_WrByte(dev, REG.I2C_SLAVE__DEVICE_ADDRESS, new_address >> 1)
}

const VL53L1X_SensorInit = async (dev, configuration = VL51L1X_DEFAULT_CONFIGURATION) => {
	await VL53L1_WrMulti(dev, 0x2D, Buffer.from(configuration))
	await VL53L1X_StartRanging(dev)

	const polarity = await VL53L1X_GetInterruptPolarity(dev)
	while(!(await VL53L1X_CheckForDataReady(dev, polarity))){}

	await VL53L1X_StopRanging(dev)
	await VL53L1X_ClearInterrupt(dev)
	await VL53L1_WrByte(dev, REG.VHV_CONFIG__TIMEOUT_MACROP_LOOP_BOUND, 0x09) /* two bounds VHV */
	await VL53L1_WrByte(dev, 0x0B, 0) /* start VHV from the previous temperature */
}

const VL53L1X_ClearInterrupt = (dev) => {
	return VL53L1_WrByte(dev, REG.SYSTEM__INTERRUPT_CLEAR, 0x01)
}

const VL53L1X_SetInterruptPolarity = (dev, new_polarity) => {
	new_polarity = (~(new_polarity & 1)) & 1
	const temp = VL53L1_RdByte(dev, REG.GPIO_HV_MUX__CTRL) & 0xEF;
	return VL53L1_WrByte(dev, REG.GPIO_HV_MUX__CTRL, temp | (new_polarity) << 4);
}

const VL53L1X_GetInterruptPolarity = async (dev) => {
	const polarity = await VL53L1_RdByte(dev, REG.GPIO_HV_MUX__CTRL)
	return ((polarity & 0x10) === 0x10) ? 0 : 1
}

const VL53L1X_StartRanging = (dev) => {
	return VL53L1_WrByte(dev, REG.SYSTEM__MODE_START, 0x40)	/* Enable VL53L1X */
}

const VL53L1X_StopRanging = (dev) => {
	return VL53L1_WrByte(dev, REG.SYSTEM__MODE_START, 0x00)	/* Disable VL53L1X */
}

const VL53L1X_CheckForDataReady = async (dev, polarity) => {
	const temp = await VL53L1_RdByte(dev, REG.GPIO__TIO_HV_STATUS)
	return (temp & 1) === polarity
}

const VL53L1X_SetTimingBudgetInMs = async (dev, TimingBudgetInMs) => {
	const DM = await VL53L1X_GetDistanceMode(dev)
	if (DM === 0) {
		return 1
	}

	if (DM === 1) {	/* Short DistanceMode */
		switch (TimingBudgetInMs) {
			case 15: /* only available in short distance mode */
				await VL53L1_WrWord(dev, REG.RANGE_CONFIG__TIMEOUT_MACROP_A_HI, 0x01D);
				await VL53L1_WrWord(dev, REG.RANGE_CONFIG__TIMEOUT_MACROP_B_HI, 0x0027);
				return
			case 20:
				await VL53L1_WrWord(dev, REG.RANGE_CONFIG__TIMEOUT_MACROP_A_HI, 0x0051);
				await VL53L1_WrWord(dev, REG.RANGE_CONFIG__TIMEOUT_MACROP_B_HI, 0x006E);
				return
			case 33:
				await VL53L1_WrWord(dev, REG.RANGE_CONFIG__TIMEOUT_MACROP_A_HI, 0x00D6);
				await VL53L1_WrWord(dev, REG.RANGE_CONFIG__TIMEOUT_MACROP_B_HI, 0x006E);
				return
			case 50:
				await VL53L1_WrWord(dev, REG.RANGE_CONFIG__TIMEOUT_MACROP_A_HI, 0x1AE);
				await VL53L1_WrWord(dev, REG.RANGE_CONFIG__TIMEOUT_MACROP_B_HI, 0x01E8);
				return
			case 100:
				await VL53L1_WrWord(dev, REG.RANGE_CONFIG__TIMEOUT_MACROP_A_HI, 0x02E1);
				await VL53L1_WrWord(dev, REG.RANGE_CONFIG__TIMEOUT_MACROP_B_HI, 0x0388);
				return
			case 200:
				await VL53L1_WrWord(dev, REG.RANGE_CONFIG__TIMEOUT_MACROP_A_HI, 0x03E1);
				await VL53L1_WrWord(dev, REG.RANGE_CONFIG__TIMEOUT_MACROP_B_HI, 0x0496);
				return
			case 500:
				await VL53L1_WrWord(dev, REG.RANGE_CONFIG__TIMEOUT_MACROP_A_HI, 0x0591);
				await VL53L1_WrWord(dev, REG.RANGE_CONFIG__TIMEOUT_MACROP_B_HI, 0x05C1);
				return
			default:
				return
		}
	}

	switch (TimingBudgetInMs) {
		case 20:
			await VL53L1_WrWord(dev, REG.RANGE_CONFIG__TIMEOUT_MACROP_A_HI, 0x001E);
			await VL53L1_WrWord(dev, REG.RANGE_CONFIG__TIMEOUT_MACROP_B_HI, 0x0022);
			return
		case 33:
			await VL53L1_WrWord(dev, REG.RANGE_CONFIG__TIMEOUT_MACROP_A_HI, 0x0060);
			await VL53L1_WrWord(dev, REG.RANGE_CONFIG__TIMEOUT_MACROP_B_HI, 0x006E);
			return
		case 50:
			await VL53L1_WrWord(dev, REG.RANGE_CONFIG__TIMEOUT_MACROP_A_HI, 0x00AD);
			await VL53L1_WrWord(dev, REG.RANGE_CONFIG__TIMEOUT_MACROP_B_HI, 0x00C6);
			return
		case 100:
			await VL53L1_WrWord(dev, REG.RANGE_CONFIG__TIMEOUT_MACROP_A_HI, 0x01CC);
			await VL53L1_WrWord(dev, REG.RANGE_CONFIG__TIMEOUT_MACROP_B_HI, 0x01EA);
			return
		case 200:
			await VL53L1_WrWord(dev, REG.RANGE_CONFIG__TIMEOUT_MACROP_A_HI, 0x02D9);
			await VL53L1_WrWord(dev, REG.RANGE_CONFIG__TIMEOUT_MACROP_B_HI, 0x02F8);
			return
		case 500:
			await VL53L1_WrWord(dev, REG.RANGE_CONFIG__TIMEOUT_MACROP_A_HI, 0x048F);
			await VL53L1_WrWord(dev, REG.RANGE_CONFIG__TIMEOUT_MACROP_B_HI, 0x04A4);
			return
	}
}

const VL53L1X_GetTimingBudgetInMs = async (dev) => {
	switch (await VL53L1_RdWord(dev, REG.RANGE_CONFIG__TIMEOUT_MACROP_A_HI)) {
		case 0x001D :
			return 15
		case 0x0051 :
		case 0x001E :
			return 20
		case 0x00D6 :
		case 0x0060 :
			return 33
		case 0x01AE :
		case 0x00AD :
			return 50
		case 0x02E1 :
		case 0x01CC :
			return 100
		case 0x03E1 :
		case 0x02D9 :
			return 200
		case 0x0591 :
		case 0x048F :
			return 500
	}
	return 0
}

const VL53L1X_SetDistanceMode = async (dev, DM) => {
	const TB = await VL53L1X_GetTimingBudgetInMs(dev)

	switch (DM) {
		case 1:
			await VL53L1_WrByte(dev, REG.PHASECAL_CONFIG__TIMEOUT_MACROP, 0x14)
			await VL53L1_WrByte(dev, REG.RANGE_CONFIG__VCSEL_PERIOD_A, 0x07)
			await VL53L1_WrByte(dev, REG.RANGE_CONFIG__VCSEL_PERIOD_B, 0x05)
			await VL53L1_WrByte(dev, REG.RANGE_CONFIG__VALID_PHASE_HIGH, 0x38)
			await VL53L1_WrWord(dev, REG.SD_CONFIG__WOI_SD0, 0x0705)
			await VL53L1_WrWord(dev, REG.SD_CONFIG__INITIAL_PHASE_SD0, 0x0606)
			break;
		case 2:
			await VL53L1_WrByte(dev, REG.PHASECAL_CONFIG__TIMEOUT_MACROP, 0x0A)
			await VL53L1_WrByte(dev, REG.RANGE_CONFIG__VCSEL_PERIOD_A, 0x0F)
			await VL53L1_WrByte(dev, REG.RANGE_CONFIG__VCSEL_PERIOD_B, 0x0D)
			await VL53L1_WrByte(dev, REG.RANGE_CONFIG__VALID_PHASE_HIGH, 0xB8)
			await VL53L1_WrWord(dev, REG.SD_CONFIG__WOI_SD0, 0x0F0D)
			await VL53L1_WrWord(dev, REG.SD_CONFIG__INITIAL_PHASE_SD0, 0x0E0E)
			break;
	}

	return VL53L1X_SetTimingBudgetInMs(dev, TB)
}

const VL53L1X_GetDistanceMode = async (dev) => {
	const temp = await VL53L1_RdByte(dev, REG.PHASECAL_CONFIG__TIMEOUT_MACROP)
	return temp === 0x14 ? 1 : temp === 0x0A ? 2 : 0
}

const VL53L1X_SetInterMeasurementInMs = async (dev, InterMeasMs) => {
	const ClockPLL = (await VL53L1_RdWord(dev, REG.RESULT__OSC_CALIBRATE_VAL)) & 0x3FF
	return VL53L1_WrDWord(dev, REG.SYSTEM__INTERMEASUREMENT_PERIOD, ClockPLL * InterMeasMs * 1.075);
}

const VL53L1X_GetInterMeasurementInMs = async (dev) => {
	const pIM = await VL53L1_RdDWord(dev, REG.SYSTEM__INTERMEASUREMENT_PERIOD)
	const ClockPLL = (await VL53L1_RdWord(dev, REG.RESULT__OSC_CALIBRATE_VAL)) & 0x3FF
	return pIM / (ClockPLL * 1.075) // ST code had 1.065?
}

const VL53L1X_BootState = (dev) => {
	return VL53L1_RdByte(dev, REG.FIRMWARE__SYSTEM_STATUS)
}

const VL53L1X_GetSensorId = (dev) => {
	return VL53L1_RdWord(dev, REG.IDENTIFICATION__MODEL_ID)
}

const VL53L1X_GetDistance = (dev) => {
	return VL53L1_RdWord(dev, REG.RESULT__FINAL_CROSSTALK_CORRECTED_RANGE_MM_SD0)
}

const VL53L1X_GetSignalPerSpad = async (dev) => {
	let signal = await VL53L1_RdWord(dev, REG.RESULT__PEAK_SIGNAL_COUNT_RATE_CROSSTALK_CORRECTED_MCPS_SD0)
	let SpNb = await VL53L1_RdWord(dev, REG.RESULT__DSS_ACTUAL_EFFECTIVE_SPADS_SD0)
	return 2000.0 * signal / SpNb
}

const VL53L1X_GetAmbientPerSpad = async (dev) => {
	let AmbientRate = await VL53L1_RdWord(dev, REG.RESULT__AMBIENT_COUNT_RATE_MCPS_SD)
	let SpNb = await VL53L1_RdWord(dev, REG.RESULT__DSS_ACTUAL_EFFECTIVE_SPADS_SD0)
	return 2000.0 * AmbientRate / SpNb
}

const VL53L1X_GetSignalRate = async (dev) => {
	return (await VL53L1_RdWord(dev, REG.RESULT__PEAK_SIGNAL_COUNT_RATE_CROSSTALK_CORRECTED_MCPS_SD0)) * 8
}

const VL53L1X_GetSpadNb = async (dev) => {
	return (await VL53L1_RdWord(dev, REG.RESULT__DSS_ACTUAL_EFFECTIVE_SPADS_SD0)) >> 8
}

const VL53L1X_GetAmbientRate = async (dev) => {
	return (await VL53L1_RdWord(dev, REG.RESULT__AMBIENT_COUNT_RATE_MCPS_SD)) * 8
}

const VL53L1X_GetRangeStatus = async (dev) => {
	let RgSt = (await VL53L1_RdByte(dev, REG.RESULT__RANGE_STATUS)) & 0x1F
	return (RgSt < 24) ? status_rtn[RgSt] : 255
}

const VL53L1X_GetResult = async (dev) => {
	const Temp = await VL53L1_ReadMulti(dev, REG.RESULT__RANGE_STATUS, 17);
	let RgSt = Temp[0] & 0x1F;

	if (RgSt < 24) {
		RgSt = status_rtn[RgSt];
	}

	return {
		status     : RgSt,
		ambient    : Temp.readUInt16BE(7) * 8,
		numSPADs   : Temp[3],
		sigPerSPAD : Temp.readUInt16BE(15) * 8,
		distance   : Temp.readUInt16BE(13),
	}
}

const VL53L1X_SetOffset = async (dev, OffsetValue) => {
	await VL53L1_WrWord(dev, REG.ALGO__PART_TO_PART_RANGE_OFFSET_MM, OffsetValue * 4)
	await VL53L1_WrWord(dev, REG.MM_CONFIG__INNER_OFFSET_MM, 0x0)
	await VL53L1_WrWord(dev, REG.MM_CONFIG__OUTER_OFFSET_MM, 0x0)
}

const  VL53L1X_GetOffset = async (dev) => {
	let Temp = VL53L1_RdWord(dev, REG.ALGO__PART_TO_PART_RANGE_OFFSET_MM)
	Temp = Temp<<3
	Temp = Temp>>5
	return Temp
}

const VL53L1X_SetXtalk = async (dev, XtalkValue) => {
	/* XTalkValue in count per second to avoid float type */
	await VL53L1_WrWord(dev, REG.ALGO__CROSSTALK_COMPENSATION_X_PLANE_GRADIENT_KCPS, 0x0000)
	await VL53L1_WrWord(dev, REG.ALGO__CROSSTALK_COMPENSATION_Y_PLANE_GRADIENT_KCPS, 0x0000)
	/* * << 9 (7.9 format) and /1000 to convert cps to kpcs */
	await VL53L1_WrWord(dev, REG.ALGO__CROSSTALK_COMPENSATION_PLANE_OFFSET_KCPS, (XtalkValue<<9)/1000)
}

const VL53L1X_GetXtalk = async (dev) => {
	const tmp = await VL53L1_RdDWord(dev, REG.ALGO__CROSSTALK_COMPENSATION_PLANE_OFFSET_KCPS)
	/* * 1000 to convert kcps to cps and >> 9 (7.9 format) */
	return (tmp * 1000) >> 9
}

const VL53L1X_SetDistanceThreshold = async (dev, ThreshLow, ThreshHigh, Window, IntOnNoTarget) => {
	const Temp = (await VL53L1_RdByte(dev, REG.SYSTEM__INTERRUPT_CONFIG_GPIO)) & 0x47
	if (IntOnNoTarget === 0) {
		await VL53L1_WrByte(dev, REG.SYSTEM__INTERRUPT_CONFIG_GPIO, Temp | (Window & 0x07))
	}
	else {
		await VL53L1_WrByte(dev, REG.SYSTEM__INTERRUPT_CONFIG_GPIO, (Temp | (Window & 0x07)) | 0x40)
	}
	await VL53L1_WrWord(dev, REG.SYSTEM__THRESH_HIGH, ThreshHigh)
	await VL53L1_WrWord(dev, REG.SYSTEM__THRESH_LOW, ThreshLow)
}

const VL53L1X_GetDistanceThresholdWindow = async (dev) => {
	return (await VL53L1_RdByte(dev, REG.SYSTEM__INTERRUPT_CONFIG_GPIO)) & 0x7
}

const VL53L1X_GetDistanceThresholdLow = (dev) => {
	return VL53L1_RdWord(dev, REG.SYSTEM__THRESH_LOW)
}

const VL53L1X_GetDistanceThresholdHigh = (dev) => {
	return VL53L1_RdWord(dev, REG.SYSTEM__THRESH_HIGH)
}

const VL53L1X_SetROICenter = (dev, ROICenter) => {
	return VL53L1_WrByte(dev, REG.ROI_CONFIG__USER_ROI_CENTRE_SPAD, ROICenter)
}

const VL53L1X_GetROICenter = (dev) => {
	return VL53L1_RdByte(dev, REG.ROI_CONFIG__USER_ROI_CENTRE_SPAD)
}

const VL53L1X_SetROI = async (dev, X, Y) => {
	let OpticalCenter = await VL53L1_RdByte(dev, REG.ROI_CONFIG__MODE_ROI_CENTRE_SPAD)
	if (X > 16) X = 16
	if (Y > 16) Y = 16

	if (X > 10 || Y > 10){
		OpticalCenter = 199
	}

	const XY = ((Y - 1) << 4)| (X - 1)
	await VL53L1_WrByte(dev, REG.ROI_CONFIG__USER_ROI_CENTRE_SPAD, OpticalCenter)
	await VL53L1_WrByte(dev, REG.ROI_CONFIG__USER_ROI_REQUESTED_GLOBAL_XY_SIZE, XY)
}

const VL53L1X_GetROI_XY = async (dev) => {
	const tmp = VL53L1_RdByte(dev, REG.ROI_CONFIG__USER_ROI_REQUESTED_GLOBAL_XY_SIZE)
	return {
		ROI_X: (tmp & 0x0F) + 1,
		ROI_Y: ((tmp & 0xF0) >> 4) + 1
	}
}

const VL53L1X_SetSignalThreshold = (dev, Signal) => {
	return VL53L1_WrWord(dev, REG.RANGE_CONFIG__MIN_COUNT_RATE_RTN_LIMIT_MCPS,Signal >> 3)
}

const VL53L1X_GetSignalThreshold = async (dev) => {
	return (await VL53L1_RdWord(dev, REG.RANGE_CONFIG__MIN_COUNT_RATE_RTN_LIMIT_MCPS)) << 3
}

const VL53L1X_SetSigmaThreshold = (dev, Sigma) => {

	if(Sigma>(0xFFFF>>2)) {
		return 1
	}
	/* 16 bits register 14.2 format */
	return VL53L1_WrWord(dev, REG.RANGE_CONFIG__SIGMA_THRESH,Sigma << 2)
}

const VL53L1X_GetSigmaThreshold = async (dev) => {
	return (await VL53L1_RdWord(dev, REG.RANGE_CONFIG__SIGMA_THRESH)) >> 2
}

const VL53L1X_StartTemperatureUpdate = async (dev) => {
	await VL53L1_WrByte(dev, REG.VHV_CONFIG__TIMEOUT_MACROP_LOOP_BOUND,0x81) /* full VHV */
	await VL53L1_WrByte(dev,0x0B,0x92)
	await VL53L1X_StartRanging(dev)
	const polarity = await VL53L1X_GetInterruptPolarity(dev)
	while(!(await VL53L1X_CheckForDataReady(dev, polarity))){}

	await VL53L1X_ClearInterrupt(dev)
	await VL53L1X_StopRanging(dev)
	await VL53L1_WrByte(dev, REG.VHV_CONFIG__TIMEOUT_MACROP_LOOP_BOUND, 0x09) /* two bounds VHV */
	await VL53L1_WrByte(dev, 0x0B, 0) /* start VHV from the previous temperature */
}


module.exports = {
	VL53L1X_GetSWVersion,
	VL53L1X_SetI2CAddress,
	VL53L1X_SensorInit,
	VL53L1X_ClearInterrupt,
	VL53L1X_SetInterruptPolarity,
	VL53L1X_GetInterruptPolarity,
	VL53L1X_StartRanging,
	VL53L1X_StopRanging,
	VL53L1X_CheckForDataReady,
	VL53L1X_SetTimingBudgetInMs,
	VL53L1X_GetTimingBudgetInMs,
	VL53L1X_SetDistanceMode,
	VL53L1X_GetDistanceMode,
	VL53L1X_SetInterMeasurementInMs,
	VL53L1X_GetInterMeasurementInMs,
	VL53L1X_BootState,
	VL53L1X_GetSensorId,
	VL53L1X_GetDistance,
	VL53L1X_GetSignalPerSpad,
	VL53L1X_GetAmbientPerSpad,
	VL53L1X_GetSignalRate,
	VL53L1X_GetSpadNb,
	VL53L1X_GetAmbientRate,
	VL53L1X_GetRangeStatus,
	VL53L1X_GetResult,
	VL53L1X_SetOffset,
	VL53L1X_GetOffset,
	VL53L1X_SetXtalk,
	VL53L1X_GetXtalk,
	VL53L1X_SetDistanceThreshold,
	VL53L1X_GetDistanceThresholdWindow,
	VL53L1X_GetDistanceThresholdLow,
	VL53L1X_GetDistanceThresholdHigh,
	VL53L1X_SetROICenter,
	VL53L1X_GetROICenter,
	VL53L1X_SetROI,
	VL53L1X_GetROI_XY,
	VL53L1X_SetSignalThreshold,
	VL53L1X_GetSignalThreshold,
	VL53L1X_SetSigmaThreshold,
	VL53L1X_GetSigmaThreshold,
	VL53L1X_StartTemperatureUpdate
}
