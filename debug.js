

const _debug = require('debug')
const hex = (v) => v.toString(16).padStart(2, '0')
_debug.formatters.h = (v) => v.length ? Array.prototype.map.call(v, b => hex(b)).join(' ') : hex(v)
module.exports = {
  info: _debug('VL53L1X_info'),
  verbose: _debug('VL53L1X_verbose')
}

