'use strict';
const _ = require('lodash');

const thermalFilesDirectory = '/sys/devices/virtual/thermal/thermal_zone0/hwmon0';

function RaspberryPiThermalInterface (options) {
  this.criticalTemperature = _.get(options, 'criticalTemperature', 85.0);
  this.thermalFiles = _.get(options, 'thermalFiles', []);
}

exports = module.exports = RaspberryPiThermalInterface;

const fs = require('fs-extra'),
  path = require('path'),
  ThermalFile = require('../ThermalFile');

RaspberryPiThermalInterface.create = async () => {
  try {
    const name = await fs.readFile(path.join(thermalFilesDirectory, 'name'));
    const tempInputPath = path.join(thermalFilesDirectory, 'temp1_input');
    const hasTempFile = await fs.access(tempInputPath);
    if (!hasTempFile) throw new Error('missing temp1_input');
    return new RaspberryPiThermalInterface({
      // 85C per raspberrypi faq (https://www.raspberrypi.org/documentation/faqs)
      thermalFiles: [new ThermalFile(name, tempInputPath, 85.0)],
    });
  } catch (e) {
    console.error(e);
    return null;
  }
};

RaspberryPiThermalInterface.prototype.criticalTemperature = function () {
  return this.criticalTemperature;
};

RaspberryPiThermalInterface.prototype.queryThermalZones = async function () {
  const thermals = [];
  for (thermalFile in this.thermalFiles) {
    thermals.push({
      name: thermalFile.name(),
      source: thermalFile.path(),
      celsius: await thermalFile.readCelsius(),
      critical: thermalFile.criticalTemperatureCelsius(),
    });
  }
  return thermals;
};
