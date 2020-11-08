'use strict';
const ProcessorInterface = require('../ProcessorInterface');
function IntelProcessorInterface (processors) {
  ProcessorInterface.call(this, processors);
}

exports = module.exports = IntelProcessorInterface;
IntelProcessorInterface.prototype = Object.create(ProcessorInterface.prototype);
Object.defineProperty(IntelProcessorInterface.prototype, 'constructor', {
  value: IntelProcessorInterface,
  enumerable: false,
  writable: true,
});

const _ = require('lodash'),
  fs = require('fs-extra'),
  path = require('path'),
  CPUFreqPolicy = require('../CPUFreqPolicy');

const cpufreqDirectory = `/sys/devices/system/cpu/cpufreq/policy0`;

IntelProcessorInterface.create = async () => {
  return null;
};
