const debug = require('./debug.js')


module.exports = (addr, bus) => {
  // i2c READ/WRITE functions
  const write = (data) => {
    debug.verbose('write [%h]', data)
    return bus.i2cWrite(addr, data.length, data)
  }
  const writeMulti = async (register, buffer) => {
    const buff = Buffer.allocUnsafe(buffer.length + 2)
    buffer.copy(buff, 2)
    buff[0] = (register >> 8) & 0xFF
    buff[1] = register & 0xFF
    await write(buff)
  }
  const writeReg = (register, value) => write(Buffer.from([(register >> 8) & 0xFF, register & 0xFF, value ]))
  const writeReg16 = (register, value) => write(Buffer.from([(register >> 8) & 0xFF, register & 0xFF , value >> 8, value & 0xFF ]))
  const writeReg32 = (register, value) => write(Buffer.from([
    (register >> 8) & 0xFF,
    register & 0xFF,
    (value >> 24) & 0xFF,
    (value >> 16) & 0xFF,
    (value >>  8) & 0xFF,
    value        & 0xFF,
  ]))

  const readMulti = async (register, length = 1) => {
    await bus.i2cWrite(addr, 2, Buffer.from([(register >> 8) & 0xFF, register & 0xFF])) // tell it the read index
    const buff = (await bus.i2cRead(addr, length, Buffer.allocUnsafe(length))).buffer
    debug.verbose('read [%h] from 0x%h', buff, register)
    return buff
  }
  const readReg = async (register) => (await readMulti(register))[0]
  const readReg16 = async (register) => {
    const buff = await readMulti(register, 2)
    return buff.readUInt16BE(0)
  }
  const readReg32 = async (register) => {
    const buff = await readMulti(register, 4)
    return buff.readUInt32BE(0)//buff[0] << 24) | (buff[1] << 16) | (buff[2] <<  8) | buff[3]
  }

  return {
    write,
    writeMulti,
    writeReg,
    writeReg16,
    writeReg32,
    readMulti,
    readReg,
    readReg16,
    readReg32,
  }
}