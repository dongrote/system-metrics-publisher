'use strict';
const _ = require('lodash'),
  ThermalInterface = require('../ThermalInterface');

const thermalFilesDirectory = '/sys/devices/platform/coretemp.0/hwmon/hwmon0/';

function CoretempThermalInterface (options) {
  ThermalInterface.call(this, options);
}

exports = module.exports = CoretempThermalInterface;

CoretempThermalInterface.prototype = Object.create(ThermalInterface.prototype);
Object.defineProperty(CoretempThermalInterface.prototype, 'constructor', {
  value: CoretempThermalInterface,
  enumerable: false,
  writable: true,
});

const fs = require('fs-extra'),
  path = require('path'),
  ThermalFile = require('../ThermalFile');

CoretempThermalInterface.create = async () => {
  try {
    const thermalDirectoryEntries = await fs.readdir(thermalFilesDirectory);
    const thermalzonecount = thermalDirectoryEntries.filter(fname => fname.startsWith('temp') && fname.endsWith('_input')).length;
    const thermalFileDescriptors = [];
    for (var i = 0; i < thermalzonecount; i++) {
      thermalFileDescriptors.push({
        input: `temp${i + 1}_input`,
        label: `temp${i + 1}_label`,
        crit: `temp${i + 1}_crit`,
      });
    }
    const thermalFiles = [];
    for (const thermalFileDescriptor of thermalFileDescriptors) {
      const nameBuffer = await fs.readFile(path.join(thermalFilesDirectory, thermalFileDescriptor.label));
      const criticalBuffer = await fs.readFile(path.join(thermalFilesDirectory, thermalFileDescriptor.crit));
      const inputPath = path.join(thermalFilesDirectory, thermalFileDescriptor.input);
      thermalFiles.push(new ThermalFile(
        nameBuffer.toString().trim(),
        inputPath,
        Number(criticalBuffer.toString()) / 1000
      ));
    }
    return new CoretempThermalInterface({thermalFiles});
  } catch (e) {
    console.error(e);
    return null;
  }
};
