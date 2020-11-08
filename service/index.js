'use strict';
require('dotenv').config();
const os = require('os'),
  env = require('./env'),
  dgram = require('dgram'),
  core = require('./core');

const hostname = os.hostname();
const multicast = dgram.createSocket('udp4');

multicast.bind({}, () => {
  multicast.setMulticastInterface(env.multicastInterface());
  Promise
  .all([core.Thermal.findInterface(), core.Processor.findInterface()])
  .then(([thermals, processors]) => {
    setInterval(() => {
      Promise
        .all([thermals.queryThermalZones(), processors.queryFrequencies()])
        .then(([temps, procs]) => {
          const packetData = {hostname, temps,procs};
          console.log(JSON.stringify(packetData));
          multicast.send(Buffer.from(JSON.stringify(packetData)), env.publishPort(), env.publishAddress());
        });
    }, 10000);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
})
