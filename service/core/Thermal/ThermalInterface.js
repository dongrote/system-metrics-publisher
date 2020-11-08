'use strict';
const _ = require('lodash');
const ThermalFile = require('./ThermalFile');
function ThermalInterface (options) {
  this.thermalFiles = _.get(options, 'thermalFiles', []);
}
exports = module.exports = ThermalInterface;

ThermalInterface.prototype.queryThermalZones = async function () {
  const thermals = [];
  for (const thermalFile of this.thermalFiles) {
    const celsius = await thermalFile.readCelsius(),
      critical = thermalFile.criticalTemperatureCelsius();
    thermals.push({
      name: thermalFile.name(),
      source: thermalFile.path(),
      celsius: {
        critical,
        temp: celsius,
      },
      fahrenheit: {
        critical: ThermalFile.ctof(critical),
        temp: ThermalFile.ctof(celsius),
      },
    });
  }
  return thermals;
};
