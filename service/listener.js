'use strict';
require('dotenv').config();
const dgram = require('dgram'),
  env = require('./env');

const multicast = dgram.createSocket('udp4');

multicast
  .bind(env.publishPort(), () => {
    console.log('bound; adding membership to', env.publishAddress());
    multicast.addMembership(env.publishAddress());
  })
  .on('message', msg => {
    const s = msg.toString();
    console.dir(JSON.parse(s));
  });
