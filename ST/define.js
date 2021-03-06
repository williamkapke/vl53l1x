const REG = require('./registers.js')
const TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS  = 0x8000
const TUNINGPARM_PRIVATE_PAGE_BASE_ADDRESS = 0xC000


module.exports = {
  //from vl53l1_def.h
  DISTANCEMODE: {
    SHORT             : 1,
    MEDIUM            : 2,
    LONG              : 3,
  },
  PRESETMODE: {
    AUTONOMOUS                : 3,
    LITE_RANGING              : 4,
    LOWPOWER_AUTONOMOUS       : 8,
  },
  STATE: {
    POWERDOWN       :0,
    WAIT_STATICINIT :1,
    STANDBY         :2,
    IDLE            :3,
    RUNNING         :4,
    RESET           :5,
    UNKNOWN         :98,
    ERROR           :99,
  },
  CHECKENABLE: {
    SIGMA_FINAL_RANGE           : 0,
    SIGNAL_RATE_FINAL_RANGE     : 1,
    NUMBER_OF_CHECKS            : 2,
  },
  SEQUENCESTEP: {
    VHV		          : 0,
    PHASECAL        : 1,
    REFPHASE        : 2,
    DSS1            : 3,
    DSS2            : 4,
    MM1		          : 5,
    MM2		          : 6,
    RANGE		        : 7,
    NUMBER_OF_ITEMS	:	8
  },

  //from vl53l1_ll_def.h
  FIRMWARE_VER_MINIMUM: 398,
  FIRMWARE_VER_MAXIMUM: 400,
  MAX_OFFSET_RANGE_RESULTS: 3,
  NVM_MAX_FMT_RANGE_DATA: 4,
  NVM_PEAK_RATE_MAP_SAMPLES: 25,
  NVM_PEAK_RATE_MAP_WIDTH: 5,
  NVM_PEAK_RATE_MAP_HEIGHT: 5,

  //from vl53l1_ll_device.h
  DEVICESTATE: {
    POWERDOWN:                                          0,
    HW_STANDBY:                                         1,
    FW_COLDBOOT:                                        2,
    SW_STANDBY:                                         3,
    RANGING_DSS_AUTO:                                   4,
    RANGING_DSS_MANUAL:                                 5,
    RANGING_WAIT_GPH_SYNC:                              6,
    RANGING_GATHER_DATA:                                7,
    RANGING_OUTPUT_DATA:                                8,
    UNKNOWN:                                            98,
    ERROR:                                              99,
  },
  DEVICEPRESETMODE: {
    NONE:                                               0,
    STANDARD_RANGING:                                   1,
    STANDARD_RANGING_SHORT_RANGE:                       2,
    STANDARD_RANGING_LONG_RANGE:                        3,
    STANDARD_RANGING_MM1_CAL:                           4,
    STANDARD_RANGING_MM2_CAL:                           5,
    TIMED_RANGING:                                      6,
    TIMED_RANGING_SHORT_RANGE:                          7,
    TIMED_RANGING_LONG_RANGE:                           8,
    OLT:                                                17,
    SINGLESHOT_RANGING:                                 18,
    LOWPOWERAUTO_SHORT_RANGE:                           36,
    LOWPOWERAUTO_MEDIUM_RANGE:                          37,
    LOWPOWERAUTO_LONG_RANGE:                            38,
  },
  DEVICEMEASUREMENTMODE: {
    STOP:                                               0x00,
    SINGLESHOT:                                         0x10,
    BACKTOBACK:                                         0x20,
    TIMED:                                              0x40,
    ABORT:                                              0x80,
  },
  OFFSETCALIBRATIONMODE: {
    NONE:                                              0,
    MM1_MM2__STANDARD:                                 1,
    MM1_MM2__HISTOGRAM:                                2,
    MM1_MM2__STANDARD_PRE_RANGE_ONLY:                  3,
    MM1_MM2__HISTOGRAM_PRE_RANGE_ONLY:                 4,
    PER_ZONE:                                          5,
  },
  OFFSETCORRECTIONMODE: {
    NONE:                                              0,
    MM1_MM2_OFFSETS:                                   1,
    PER_ZONE_OFFSETS:                                  2,
  },
  DEVICESEQUENCECONFIG: {
    VHV:                                                0,
    PHASECAL:                                           1,
    REFERENCE_PHASE:                                    2,
    DSS1:                                               3,
    DSS2:                                               4,
    MM1:                                                5,
    MM2:                                                6,
    RANGE:                                              7,
  },
  DEVICEINTERRUPTPOLARITY: {
    ACTIVE_HIGH:                                        0x00,
    ACTIVE_LOW:                                         0x10,
    BIT_MASK:                                           0x10,
    CLEAR_MASK:                                         0xEF,
  },
  DEVICEGPIOMODE: {
    OUTPUT_CONSTANT_ZERO:                               0x00,
    OUTPUT_RANGE_AND_ERROR_INTERRUPTS:                  0x01,
    OUTPUT_TIMIER_INTERRUPTS:                           0x02,
    OUTPUT_RANGE_MODE_INTERRUPT_STATUS:                 0x03,
    OUTPUT_SLOW_OSCILLATOR_CLOCK:                       0x04,
    BIT_MASK:                                           0x0F,
    CLEAR_MASK:                                         0xF0,
  },
  DEVICEERROR: {
    NOUPDATE:                                           0,
    VCSELCONTINUITYTESTFAILURE:                         1,
    VCSELWATCHDOGTESTFAILURE:                           2,
    NOVHVVALUEFOUND:                                    3,
    MSRCNOTARGET:                                       4,
    RANGEPHASECHECK:                                    5,
    SIGMATHRESHOLDCHECK:                                6,
    PHASECONSISTENCY:                                   7,
    MINCLIP:                                            8,
    RANGECOMPLETE:                                      9,
    ALGOUNDERFLOW:                                      10,
    ALGOOVERFLOW:                                       11,
    RANGEIGNORETHRESHOLD:                               12,
    USERROICLIP:                                        13,
    REFSPADCHARNOTENOUGHDPADS:                          14,
    REFSPADCHARMORETHANTARGET:                          15,
    REFSPADCHARLESSTHANTARGET:                          16,
    MULTCLIPFAIL:                                       17,
    GPHSTREAMCOUNT0READY:                               18,
    RANGECOMPLETE_NO_WRAP_CHECK:                        19,
    EVENTCONSISTENCY:                                   20,
    MINSIGNALEVENTCHECK:                                21,
    RANGECOMPLETE_MERGED_PULSE:                         22,
    PREV_RANGE_NO_TARGETS:                              23,
  },
  DEVICEREPORTSTATUS: {
    NOUPDATE:                                           0,
    ROI_SETUP:                                          1,
    VHV:                                                2,
    PHASECAL:                                           3,
    REFERENCE_PHASE:                                    4,
    DSS1:                                               5,
    DSS2:                                               6,
    MM1:                                                7,
    MM2:                                                8,
    RANGE:                                              9,
    HISTOGRAM:                                          10,
  },
  DEVICEDSSMODE: {
    DISABLED:                                          0,
    TARGET_RATE:                                       1,
    REQUESTED_EFFFECTIVE_SPADS:                        2,
    BLOCK_SELECT:                                      3,
  },
  DEVICECONFIGLEVEL: {
    SYSTEM_CONTROL:                                     0,
    DYNAMIC_ONWARDS:                                    1,
    TIMING_ONWARDS:                                     2,
    GENERAL_ONWARDS:                                    3,
    STATIC_ONWARDS:                                     4,
    CUSTOMER_ONWARDS:                                   5,
    FULL:                                               6,
  },
  DEVICERESULTSLEVEL: {
    SYSTEM_RESULTS:                                     0,
    UPTO_CORE:                                          1,
    FULL:                                               2,
  },
  DEVICETESTMODE: {
    NONE:                                               0x00,
    NVM_ZERO:                                           0x01,
    NVM_COPY:                                           0x02,
    PATCH:                                              0x03,
    DCR:                                                0x04,
    LCR_VCSEL_OFF:                                      0x05,
    LCR_VCSEL_ON:                                       0x06,
    SPOT_CENTRE_LOCATE:                                 0x07,
    REF_SPAD_CHAR_WITH_PRE_VHV:                         0x08,
    REF_SPAD_CHAR_ONLY:                                 0x09,
  },
  DEVICESSCARRAY_RTN :                                  0x00,
  DEVICETESTMODE_REF :                                  0x01,
  RETURN_ARRAY_ONLY:                                    0x01,
  REFERENCE_ARRAY_ONLY:                                 0x10,
  BOTH_RETURN_AND_REFERENCE_ARRAYS:                     0x11,
  NEITHER_RETURN_AND_REFERENCE_ARRAYS:                  0x00,
  DEVICEINTERRUPTLEVEL: {
    ACTIVE_HIGH:                                        0x00,
    ACTIVE_LOW:                                         0x10,
    ACTIVE_MASK:                                        0x10,
  },
  POLLING_DELAY_US:                                     1000,
  SOFTWARE_RESET_DURATION_US:                           100,
  FIRMWARE_BOOT_TIME_US:                                1200,
  ENABLE_POWERFORCE_SETTLING_TIME_US:                   250,
  SPAD_ARRAY_WIDTH:                                     16,
  SPAD_ARRAY_HEIGHT:                                    16,
  NVM_SIZE_IN_BYTES:                                    512,
  NO_OF_SPAD_ENABLES:                                   256,
  RTN_SPAD_BUFFER_SIZE:                                 32,
  REF_SPAD_BUFFER_SIZE:                                 6,
  AMBIENT_WINDOW_VCSEL_PERIODS:                         256,
  RANGING_WINDOW_VCSEL_PERIODS:                         2048,
  MACRO_PERIOD_VCSEL_PERIODS:                           256 + 2048, // AMBIENT_WINDOW_VCSEL_PERIODS + RANGING_WINDOW_VCSEL_PERIODS
  MAX_ALLOWED_PHASE:                                    0xFFFF,
  RTN_SPAD_UNITY_TRANSMISSION:                          0x0100,
  RTN_SPAD_APERTURE_TRANSMISSION:                       0x0038,
  SPAD_TOTAL_COUNT_MAX:                                 ((0x01 << 29) - 1),
  SPAD_TOTAL_COUNT_RES_THRES:                           (0x01 << 24),
  COUNT_RATE_INTERNAL_MAX:                              ((0x01 << 24) - 1),
  SPEED_OF_LIGHT_IN_AIR:                                299704,
  SPEED_OF_LIGHT_IN_AIR_DIV_8:                          (299704 >> 3),
  GPIOINTMODE: {
    LEVEL_LOW:													                  0,
    LEVEL_HIGH:													                  1,
    OUT_OF_WINDOW:											                  2,
    IN_WINDOW:													                  3,
  },
  TUNINGPARMS: {
    LLD_PUBLIC_MIN_ADDRESS:																TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS,
    LLD_PUBLIC_MAX_ADDRESS:																TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 56,
    LLD_PRIVATE_MIN_ADDRESS:															TUNINGPARM_PRIVATE_PAGE_BASE_ADDRESS,
    LLD_PRIVATE_MAX_ADDRESS:															TUNINGPARM_PRIVATE_PAGE_BASE_ADDRESS,
  },
  TUNINGPARM: {
    VERSION:																              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 0),
    KEY_TABLE_VERSION:											              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 1),
    LLD_VERSION:														              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 2),
    CONSISTENCY_LITE_PHASE_TOLERANCE:				              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 3),
    PHASECAL_TARGET:												              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 4),
    LITE_CAL_REPEAT_RATE:										              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 5),
    LITE_RANGING_GAIN_FACTOR:								              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 6),
    LITE_MIN_CLIP_MM:												              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 7),
    LITE_LONG_SIGMA_THRESH_MM:							              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 8),
    LITE_MED_SIGMA_THRESH_MM:								              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 9),
    LITE_SHORT_SIGMA_THRESH_MM:							              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 10),
    LITE_LONG_MIN_COUNT_RATE_RTN_MCPS:			              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 11),
    LITE_MED_MIN_COUNT_RATE_RTN_MCPS:				              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 12),
    LITE_SHORT_MIN_COUNT_RATE_RTN_MCPS:			              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 13),
    LITE_SIGMA_EST_PULSE_WIDTH:							              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 14),
    LITE_SIGMA_EST_AMB_WIDTH_NS:						              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 15),
    LITE_SIGMA_REF_MM:											              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 16),
    LITE_RIT_MULT:													              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 17),
    LITE_SEED_CONFIG:												              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 18),
    LITE_QUANTIFIER:												              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 19),
    LITE_FIRST_ORDER_SELECT:								              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 20),
    LITE_XTALK_MARGIN_KCPS:									              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 21),
    INITIAL_PHASE_RTN_LITE_LONG_RANGE:			              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 22),
    INITIAL_PHASE_RTN_LITE_MED_RANGE:				              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 23),
    INITIAL_PHASE_RTN_LITE_SHORT_RANGE:			              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 24),
    INITIAL_PHASE_REF_LITE_LONG_RANGE:			              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 25),
    INITIAL_PHASE_REF_LITE_MED_RANGE:				              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 26),
    INITIAL_PHASE_REF_LITE_SHORT_RANGE:			              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 27),
    TIMED_SEED_CONFIG:											              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 28),
    VHV_LOOPBOUND:													              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 29),
    REFSPADCHAR_DEVICE_TEST_MODE:						              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 30),
    REFSPADCHAR_VCSEL_PERIOD:								              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 31),
    REFSPADCHAR_PHASECAL_TIMEOUT_US:				              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 32),
    REFSPADCHAR_TARGET_COUNT_RATE_MCPS:			              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 33),
    REFSPADCHAR_MIN_COUNTRATE_LIMIT_MCPS:		              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 34),
    REFSPADCHAR_MAX_COUNTRATE_LIMIT_MCPS:		              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 35),
    OFFSET_CAL_DSS_RATE_MCPS:								              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 36),
    OFFSET_CAL_PHASECAL_TIMEOUT_US:					              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 37),
    OFFSET_CAL_MM_TIMEOUT_US:								              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 38),
    OFFSET_CAL_RANGE_TIMEOUT_US:						              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 39),
    OFFSET_CAL_PRE_SAMPLES:									              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 40),
    OFFSET_CAL_MM1_SAMPLES:									              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 41),
    OFFSET_CAL_MM2_SAMPLES:									              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 42),
    SPADMAP_VCSEL_PERIOD:										              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 43),
    SPADMAP_VCSEL_START:										              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 44),
    SPADMAP_RATE_LIMIT_MCPS:								              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 45),
    LITE_DSS_CONFIG_TARGET_TOTAL_RATE_MCPS:	              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 46),
    TIMED_DSS_CONFIG_TARGET_TOTAL_RATE_MCPS:              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 47),
    LITE_PHASECAL_CONFIG_TIMEOUT_US:				              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 48),
    TIMED_PHASECAL_CONFIG_TIMEOUT_US:				              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 49),
    LITE_MM_CONFIG_TIMEOUT_US:							              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 50),
    TIMED_MM_CONFIG_TIMEOUT_US:							              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 51),
    LITE_RANGE_CONFIG_TIMEOUT_US:						              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 52),
    TIMED_RANGE_CONFIG_TIMEOUT_US:					              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 53),
    LOWPOWERAUTO_VHV_LOOP_BOUND:						              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 54),
    LOWPOWERAUTO_MM_CONFIG_TIMEOUT_US:			              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 55),
    LOWPOWERAUTO_RANGE_CONFIG_TIMEOUT_US:		              (TUNINGPARM_PUBLIC_PAGE_BASE_ADDRESS + 56),
  },

  // from vl53l1_tuning_parm_defaults.h
  DEFAULTS: {
    TUNINGPARM: {
      VERSION                                           : 32771,
      KEY_TABLE_VERSION                                 : 32769,
      LLD_VERSION                                       : 32833,
      CONSISTENCY_LITE_PHASE_TOLERANCE                  : 2,
      PHASECAL_TARGET                                   : 33,
      LITE_CAL_REPEAT_RATE                              : 0,
      LITE_RANGING_GAIN_FACTOR                          : 2011,
      LITE_MIN_CLIP_MM                                  : 0,
      LITE_LONG_SIGMA_THRESH_MM                         : 360,
      LITE_MED_SIGMA_THRESH_MM                          : 360,
      LITE_SHORT_SIGMA_THRESH_MM                        : 360,
      LITE_LONG_MIN_COUNT_RATE_RTN_MCPS                 : 192,
      LITE_MED_MIN_COUNT_RATE_RTN_MCPS                  : 192,
      LITE_SHORT_MIN_COUNT_RATE_RTN_MCPS                : 192,
      LITE_SIGMA_EST_PULSE_WIDTH                        : 8,
      LITE_SIGMA_EST_AMB_WIDTH_NS                       : 16,
      LITE_SIGMA_REF_MM                                 : 1,
      LITE_RIT_MULT                                     : 64,
      LITE_SEED_CONFIG                                  : 2,
      LITE_QUANTIFIER                                   : 2,
      LITE_FIRST_ORDER_SELECT                           : 0,
      LITE_XTALK_MARGIN_KCPS                            : 0,
      INITIAL_PHASE_RTN_LITE_LONG_RANGE                 : 14,
      INITIAL_PHASE_RTN_LITE_MED_RANGE                  : 10,
      INITIAL_PHASE_RTN_LITE_SHORT_RANGE                : 6,
      INITIAL_PHASE_REF_LITE_LONG_RANGE                 : 14,
      INITIAL_PHASE_REF_LITE_MED_RANGE                  : 10,
      INITIAL_PHASE_REF_LITE_SHORT_RANGE                : 6,
      TIMED_SEED_CONFIG                                 : 1,
      VHV_LOOPBOUND                                     : 32,
      REFSPADCHAR_DEVICE_TEST_MODE                      : 8,
      REFSPADCHAR_VCSEL_PERIOD                          : 11,
      REFSPADCHAR_PHASECAL_TIMEOUT_US                   : 1000,
      REFSPADCHAR_TARGET_COUNT_RATE_MCPS                : 2560,
      REFSPADCHAR_MIN_COUNTRATE_LIMIT_MCPS              : 1280,
      REFSPADCHAR_MAX_COUNTRATE_LIMIT_MCPS              : 5120,
      OFFSET_CAL_DSS_RATE_MCPS                          : 2560,
      OFFSET_CAL_PHASECAL_TIMEOUT_US                    : 1000,
      OFFSET_CAL_MM_TIMEOUT_US                          : 13000,
      OFFSET_CAL_RANGE_TIMEOUT_US                       : 13000,
      OFFSET_CAL_PRE_SAMPLES                            : 8,
      OFFSET_CAL_MM1_SAMPLES                            : 40,
      OFFSET_CAL_MM2_SAMPLES                            : 9,
      SPADMAP_VCSEL_PERIOD                              : 18,
      SPADMAP_VCSEL_START                               : 15,
      SPADMAP_RATE_LIMIT_MCPS                           : 12,
      LITE_DSS_CONFIG_TARGET_TOTAL_RATE_MCPS            : 2560,
      TIMED_DSS_CONFIG_TARGET_TOTAL_RATE_MCPS           : 2560,
      LITE_PHASECAL_CONFIG_TIMEOUT_US                   : 1000,
      TIMED_PHASECAL_CONFIG_TIMEOUT_US                  : 1000,
      LITE_MM_CONFIG_TIMEOUT_US                         : 2000,
      TIMED_MM_CONFIG_TIMEOUT_US                        : 2000,
      LITE_RANGE_CONFIG_TIMEOUT_US                      : 63000,
      TIMED_RANGE_CONFIG_TIMEOUT_US                     : 13000,
      LOWPOWERAUTO_VHV_LOOP_BOUND                       : 3,
      LOWPOWERAUTO_MM_CONFIG_TIMEOUT_US                 : 1,
      LOWPOWERAUTO_RANGE_CONFIG_TIMEOUT_US              : 8000,
    }
  },
  //from vl53l1_register_settings.h
  REGISTER_SETTINGS: {
    DEVICESCHEDULERMODE: {
      PSEUDO_SOLO                                       : 0x00,
      STREAMING                                         : 0x01,
      HISTOGRAM                                         : 0x02,
    },
    DEVICEREADOUTMODE: {
      SINGLE_SD                                         : (0x00 << 2),
      DUAL_SD                                           : (0x01 << 2),
      SPLIT_READOUT                                     : (0x02 << 2),
      SPLIT_MANUAL                                      : (0x03 << 2),
    },
    DEVICEMEASUREMENTMODE: {
      STOP                                              : 0x00,
      SINGLESHOT                                        : 0x10,
      BACKTOBACK                                        : 0x20,
      TIMED                                             : 0x40,
      ABORT                                             : 0x80,
      MODE_MASK                                         : 0xF0,
      STOP_MASK                                         : 0x0F,
    },
    GROUPEDPARAMETERHOLD_ID_MASK                        : 0x02,
    EWOK_I2C_DEV_ADDR_DEFAULT                           : 0x29,
    OSC_FREQUENCY                                       : 0x00,
    OSC_TRIM_DEFAULT                                    : 0x00,
    OSC_FREQ_SET_DEFAULT                                : 0x00,
    RANGE_HISTOGRAM_REF                                 : 0x08,
    RANGE_HISTOGRAM_RET                                 : 0x10,
    RANGE_HISTOGRAM_BOTH                                : 0x18,
    RANGE_HISTOGRAM_INIT                                : 0x20,
    RANGE_VHV_INIT                                      : 0x40,
    RESULT_RANGE_STATUS                                 : 0x1F,
    SYSTEM__SEED_CONFIG__MANUAL                         : 0x00,
    SYSTEM__SEED_CONFIG__STANDARD                       : 0x01,
    SYSTEM__SEED_CONFIG__EVEN_UPDATE_ONLY               : 0x02,
    INTERRUPT_CONFIG: {
      LEVEL_LOW                                         : 0x00,
      LEVEL_HIGH                                        : 0x01,
      OUT_OF_WINDOW                                     : 0x02,
      IN_WINDOW                                         : 0x03,
      NEW_SAMPLE_READY                                  : 0x20,
    },
    CLEAR_RANGE_INT                                     : 0x01,
    CLEAR_ERROR_INT                                     : 0x02,
    SEQUENCE: {
      VHV_EN                                            : 0x01,
      PHASECAL_EN                                       : 0x02,
      REFERENCE_PHASE_EN                                : 0x04,
      DSS1_EN                                           : 0x08,
      DSS2_EN                                           : 0x10,
      MM1_EN                                            : 0x20,
      MM2_EN                                            : 0x40,
      RANGE_EN                                          : 0x80,
    },
    DSS_CONTROL__ROI_SUBTRACT                           : 0x20,
    DSS_CONTROL__ROI_INTERSECT                          : 0x10,
    DSS_CONTROL__MODE_DISABLED                          : 0x00,
    DSS_CONTROL__MODE_TARGET_RATE                       : 0x01,
    DSS_CONTROL__MODE_EFFSPADS                          : 0x02,
    DSS_CONTROL__MODE_BLOCKSELECT                       : 0x03,
    RANGING_CORE__SPAD_READOUT__STANDARD                : 0x45,
    RANGING_CORE__SPAD_READOUT__RETURN_ARRAY_ONLY       : 0x05,
    RANGING_CORE__SPAD_READOUT__REFERENCE_ARRAY_ONLY    : 0x55,
    RANGING_CORE__SPAD_READOUT__RETURN_SPLIT_ARRAY      : 0x25,
    RANGING_CORE__SPAD_READOUT__CALIB_PULSES            : 0xF5,
    LASER_SAFETY__KEY_VALUE                             : 0x6C,
    RANGE_STATUS__RANGE_STATUS_MASK                     : 0x1F,
    RANGE_STATUS__MAX_THRESHOLD_HIT_MASK                : 0x20,
    RANGE_STATUS__MIN_THRESHOLD_HIT_MASK                : 0x40,
    RANGE_STATUS__GPH_ID_RANGE_STATUS_MASK              : 0x80,
    INTERRUPT_STATUS__INT_STATUS_MASK                   : 0x07,
    INTERRUPT_STATUS__INT_ERROR_STATUS_MASK             : 0x18,
    INTERRUPT_STATUS__GPH_ID_INT_STATUS_MASK            : 0x20,
  },

  //from register_structs.h
  I2C_INDEX: {
    STATIC_NVM_MANAGED                                  : REG.I2C_SLAVE__DEVICE_ADDRESS,
    CUSTOMER_NVM_MANAGED                                : REG.GLOBAL_CONFIG__SPAD_ENABLES_REF_0,
    STATIC_CONFIG                                       : REG.DSS_CONFIG__TARGET_TOTAL_RATE_MCPS,
    GENERAL_CONFIG                                      : REG.GPH_CONFIG__STREAM_COUNT_UPDATE_VALUE,
    TIMING_CONFIG                                       : REG.MM_CONFIG__TIMEOUT_MACROP_A_HI,
    DYNAMIC_CONFIG                                      : REG.SYSTEM__GROUPED_PARAMETER_HOLD_0,
    SYSTEM_CONTROL                                      : REG.POWER_MANAGEMENT__GO1_POWER_FORCE,
    SYSTEM_RESULTS                                      : REG.RESULT__INTERRUPT_STATUS,
    CORE_RESULTS                                        : REG.RESULT_CORE__AMBIENT_WINDOW_EVENTS_SD0,
    DEBUG_RESULTS                                       : REG.PHASECAL_RESULT__REFERENCE_PHASE,
    NVM_COPY_DATA                                       : REG.IDENTIFICATION__MODEL_ID,
    PREV_SHADOW_SYSTEM_RESULTS                          : REG.PREV_SHADOW_RESULT__INTERRUPT_STATUS,
    PREV_SHADOW_CORE_RESULTS                            : REG.PREV_SHADOW_RESULT_CORE__AMBIENT_WINDOW_EVENTS_SD0,
    PATCH_DEBUG                                         : REG.RESULT__DEBUG_STATUS,
    GPH_GENERAL_CONFIG                                  : REG.GPH__SYSTEM__THRESH_RATE_HIGH,
    GPH_STATIC_CONFIG                                   : REG.GPH__DSS_CONFIG__ROI_MODE_CONTROL,
    GPH_TIMING_CONFIG                                   : REG.GPH__MM_CONFIG__TIMEOUT_MACROP_A_HI,
    FW_INTERNAL                                         : REG.FIRMWARE__INTERNAL_STREAM_COUNT_DIV,
    PATCH_RESULTS                                       : REG.DSS_CALC__ROI_CTRL,
    SHADOW_SYSTEM_RESULTS                               : REG.SHADOW_PHASECAL_RESULT__VCSEL_START,
    SHADOW_CORE_RESULTS                                 : REG.SHADOW_RESULT_CORE__AMBIENT_WINDOW_EVENTS_SD0,
  },
  I2C_SIZE: {
    STATIC_NVM_MANAGED                                  : 11,
    CUSTOMER_NVM_MANAGED                                : 23,
    STATIC_CONFIG                                       : 32,
    GENERAL_CONFIG                                      : 22,
    TIMING_CONFIG                                       : 23,
    DYNAMIC_CONFIG                                      : 18,
    SYSTEM_CONTROL                                      :  5,
    SYSTEM_RESULTS                                      : 44,
    CORE_RESULTS                                        : 33,
    DEBUG_RESULTS                                       : 56,
    NVM_COPY_DATA                                       : 49,
    PREV_SHADOW_SYSTEM_RESULTS                          : 44,
    PREV_SHADOW_CORE_RESULTS                            : 33,
    PATCH_DEBUG                                         :  2,
    GPH_GENERAL_CONFIG                                  :  5,
    GPH_STATIC_CONFIG                                   :  6,
    GPH_TIMING_CONFIG                                   : 16,
    FW_INTERNAL                                         :  2,
    PATCH_RESULTS                                       : 90,
    SHADOW_SYSTEM_RESULTS                               : 82,
    SHADOW_CORE_RESULTS                                 : 33,
  }
}




