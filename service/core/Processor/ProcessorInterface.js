'use strict';
function ProcessorInterface (processors) {
  this.processors = processors;
}
exports = module.exports = ProcessorInterface;

ProcessorInterface.prototype.queryFrequencies = async function () {
  const procs = [];
  for (const proc in this.processors) {
    console.dir(proc);
    procs.push({
      cpu: proc.cpu(),
      min: proc.minimumFrequency(),
      max: proc.maximumFrequency(),
      current: await proc.currentFrequency(),
    });
  }
  return procs;
};
