'use strict';
function ProcessorInterface (processors) {
  console.dir(processors);
  this.processors = processors;
}
exports = module.exports = ProcessorInterface;

ProcessorInterface.prototype.queryFrequencies = async function () {
  const procs = [];
  for (const proc of this.processors) {
    procs.push({
      cpu: proc.cpu(),
      min: proc.minimumFrequency(),
      max: proc.maximumFrequency(),
      current: await proc.currentFrequency(),
    });
  }
  return procs;
};
