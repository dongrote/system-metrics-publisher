'use strict';
const ProcessorInterface = require('../ProcessorInterface');
function RaspberryPiProcessorInterface (processors) {
  ProcessorInterface.call(this, processors);
}

exports = module.exports = RaspberryPiProcessorInterface;
RaspberryPiProcessorInterface.prototype = Object.create(ProcessorInterface.prototype);
Object.defineProperty(RaspberryPiProcessorInterface.prototype, 'constructor', {
  value: RaspberryPiProcessorInterface,
  enumerable: false,
  writable: true,
});

const _ = require('lodash'),
  fs = require('fs-extra'),
  path = require('path'),
  CPUFreqPolicy = require('../CPUFreqPolicy');

const cpufreqDirectory = `/sys/devices/system/cpu/cpufreq/policy0`;

RaspberryPiProcessorInterface.create = async () => {
  try {
    const cpuinfo = await fs.readFile('/proc/cpuinfo');
    if (!_.includes(cpuinfo.toString(), 'Raspberry Pi')) throw new Error('cpuinfo did not indicate Raspberry Pi');
    const affectedCpusBuffer = await fs.readFile(path.join(cpufreqDirectory, 'affected_cpus'));
    const affectedCpus = affectedCpusBuffer.toString().split(' ').map(n => Number(n));
    const maxFrequencyBuffer = await fs.readFile(path.join(cpufreqDirectory, 'cpuinfo_max_freq'));
    const max = Number(maxFrequencyBuffer.toString());
    const minFrequencyBuffer = await fs.readFile(path.join(cpufreqDirectory, 'cpuinfo_min_freq'));
    const min = Number(minFrequencyBuffer.toString());
    const processors = [];
    for (const cpuNumber in affectedCpus) {
      processors.push(new CPUFreqPolicy({
        cpuNumber,
        max,
        min,
        curpath: path.join(cpufreqDirectory, 'cpuinfo_cur_freq'),
      }));
    }
    return processors;
  } catch (e) {
    console.error(e);
    return null;
  }
};
