'use strict';
function CPUFreqPolicy (options) {
  this.cpuNumber = options.cpuNumber;
  this.currentFrequencyFilePath = options.curpath;
  this.max = options.max;
  this.min = options.min;
}
exports = module.exports = CPUFreqPolicy;
const fs = require('fs-extra');

CPUFreqPolicy.prototype.cpu = function () { return this.cpuNumber; };
CPUFreqPolicy.prototype.minimumFrequency = function () { return this.min; };
CPUFreqPolicy.prototype.maximumFrequency = function () { return this.max; };
CPUFreqPolicy.prototype.currentFrequency = async function () {
  const rawfreq = await fs.readFile(this.currentFrequencyFilePath);
  return Number(rawfreq.toString());
};
