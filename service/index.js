'use strict';
require('dotenv').config();
const core = require('./core');

Promise
  .all([core.Thermal.findInterface(), core.Processor.findInterface()])
  .then(([thermals, processors]) => {
    setInterval(() => {
      Promise
        .all([thermals.queryThermalZones(), processors.queryFrequencies()])
        .then(([temps, procs]) => {
          console.log(`temps: ${JSON.stringify(temps)}`);
          console.log(`procs: ${JSON.stringify(procs)}`);
        });
    }, 10000);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
