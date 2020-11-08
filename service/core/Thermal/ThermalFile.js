'use strict';
function ThermalFile (name, path, crit) {
  this.thermalZoneName = name;
  this.thermalZonePath = path;
  this.crit = crit;
}
exports = module.exports = ThermalFile;
const fs = require('fs-extra');

ThermalFile.ctof = c => (c * 1.8) + 32;

ThermalFile.prototype.name = function () { return this.thermalZoneName; }
ThermalFile.prototype.path = function () { return this.thermalZonePath; }
ThermalFile.prototype.read = async function () {
  const buffer = await fs.readFile(this.path());
  return Number(buffer.toString());
};
ThermalFile.prototype.readCelsius = async function () {
  const raw = await this.read();
  return raw / 1000;
};
ThermalFile.prototype.readFahrenheit = async function () {
  const celsius = await this.readCelsius();
  return ThermalFile.ctof(celsius);
};
ThermalFile.prototype.criticalTemperature = function () { return this.crit; };
ThermalFile.prototype.criticalTemperatureCelsius = function ()  { return this.criticalTemperature(); };
ThermalFile.prototype.criticalTemperatureFahrenheit = function () { return ThermalFile.ctof(this.criticalTemperatureCelsius()); };
