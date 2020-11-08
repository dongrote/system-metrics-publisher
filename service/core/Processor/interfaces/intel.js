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
  try {
    const cpuinfo = await fs.readFile('/proc/cpuinfo');
    if (!_.includes(cpuinfo.toString(), 'GenuineIntel')) throw new Error('cpuinfo did not indicate Intel');
    const cpufreqDirectories = await fs.readdir(cpufreqDirectory);
    const policyDirectories = cpufreqDirectories.filter(fname => fname.startsWith('policy'));
    const processors = [];
    for (const policyDirectory of policyDirectories) {
      const affectedCpusBuffer = await fs.readFile(path.join(cpufreqDirectory, policyDirectory, 'affected_cpus'));
      const affectedCpus = affectedCpusBuffer.toString().split(' ').map(n => Number(n));
      for (const cpuNumber of affectedCpus) {
        const maxFrequencyBuffer = await fs.readFile(path.join(cpufreqDirectory, policyDirectory, 'cpuinfo_max_freq'));
        const minFrequencyBuffer = await fs.readFile(path.join(cpufreqDirectory, policyDirectory, 'cpuinfo_min_freq'));
        processors.push(new CPUFreqPolicy({
          cpuNumber,
          max: Number(maxFrequencyBuffer.toString()),
          min: Number(minFrequencyBuffer.toString()),
          curpath: path.join(cpufreqDirectory, policyDirectory, 'scaling_cur_freq'),
        }));
      }
    }
    return new IntelProcessorInterface(processors);
  } catch (e) {
    console.error(e);
    return null;
  }
};
