'use strict';
const _ = require('lodash');

exports = module.exports = {
  multicastInterface: () => _.get(process.env, 'MULTICAST_INTERFACE_ADDRESS'),
  publishAddress: () => _.get(process.env, 'PUBLISH_ADDRESS', '224.0.0.100'),
  publishPort: () => Number(_.get(process.env, 'PUBLISH_PORT', 1024)),
};
