'use strict';
const _ = require('lodash'),
  ThermalInterface = require('../ThermalInterface');

const thermalFilesDirectory = '/sys/devices/virtual/thermal/thermal_zone0/hwmon0';

function RaspberryPiThermalInterface (options) {
  ThermalInterface.call(this, options);
}

exports = module.exports = RaspberryPiThermalInterface;

RaspberryPiThermalInterface.prototype = Object.create(ThermalInterface.prototype);
Object.defineProperty(RaspberryPiThermalInterface.prototype, 'constructor', {
  value: RaspberryPiThermalInterface,
  enumerable: false,
  writable: true,
});

const fs = require('fs-extra'),
  path = require('path'),
  ThermalFile = require('../ThermalFile');

RaspberryPiThermalInterface.create = async () => {
  try {
    const cpuinfo = await fs.readFile('/proc/cpuinfo');
    if (!_.includes(cpuinfo.toString(), 'Raspberry Pi')) throw new Error('not raspberry pi');
    const name = await fs.readFile(path.join(thermalFilesDirectory, 'name'));
    const tempInputPath = path.join(thermalFilesDirectory, 'temp1_input');
    const hasTempFile = await fs.pathExists(tempInputPath);
    if (!hasTempFile) throw new Error('missing temp1_input');
    return new RaspberryPiThermalInterface({
      // critical temperature of 85C per raspberrypi faq (https://www.raspberrypi.org/documentation/faqs)
      thermalFiles: [new ThermalFile(name.toString().trim(), tempInputPath, 85.0)],
    });
  } catch (e) {
    console.error(e);
    return null;
  }
};
