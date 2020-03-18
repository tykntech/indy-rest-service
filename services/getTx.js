const getLedger = require('../lib/getLedger');
const zmqlib = require('@tykntech/indy-zmq-lib');

module.exports = async function(parsedConfig, ledger, number, amount, forward) {
  let resp = [];
  let toClose = [];

  for (let it = 0; it < amount; it++) {
    try {
      const cfg = parsedConfig[Math.floor(Math.random() * Math.floor(parsedConfig.length))];
      const ledgerConnection = zmqlib.Wrap(cfg);
      toClose.push(ledgerConnection);
      const tx = {
        operation: {
          type: '3',
          ledgerId: getLedger(ledger || 1),
          data: forward ? parseInt(number) + it : parseInt(number) - it,
        },
        identifier: 'LibindyDid211111111111',
        protocolVersion: 2,
        reqId: Date.now(),
      };
      resp.push(ledgerConnection.send(tx));
    } catch (e) {
      return console.error(e);
    }
  }
  resp = await Promise.all(resp);

  toClose.forEach(connection => connection.close());

  return resp;
};
