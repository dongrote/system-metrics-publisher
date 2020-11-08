'use strict';
exports = module.exports = async interfaces => {
  for (const iface of interfaces) {
    const i = await iface.create();
    if (i) {
      return i;
    };
  }
  return null;
};
