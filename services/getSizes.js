const getLedger = require('../lib/getLedger');
const zmqlib = require('@tykntech/indy-zmq-lib');
const defaultLedgers = require('../lib/ledgers');

module.exports = async function(parsedConfig, ledgers) {
  let resp = [];
  ledgers = ledgers || defaultLedgers;

  if (!Array.isArray(ledgers)) {
    ledgers = [ledgers];
  }

  for (let it = 0; it < ledgers.length; it++) {
    try {
      const ledgerConnection = zmqlib.Wrap(
        parsedConfig[Math.floor(Math.random() * Math.floor(parsedConfig.length))]
      );
      resp.push(
        ledgerConnection.send({
          operation: {
            type: '3',
            ledgerId: getLedger(ledgers[it]),
            data: 1,
          },
          identifier: 'LibindyDid211111111111',
          protocolVersion: 2,
        })
      );
    } catch (e) {
      console.error(e);
    }
  }

  console.debug('Querying ...');
  resp = await Promise.all(resp);

  const response = resp.map(tx => {
    return {
      ledger: ledgers[tx.result.state_proof.multi_signature.value.ledger_id],
      size: tx.result.data.ledgerSize,
    };
  });

  return response;
};