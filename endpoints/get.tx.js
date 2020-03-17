const zmqlib = require('@tykntech/indy-zmq-lib');
const getSizes = require('../services/getSizes');
const getLedger = require('../lib/getLedger');

module.exports = function setTxEndpoint(router) {
  router.get('/tx/:ledger?/:number/:amount?/:forward?', async (req, res) => {
    let { ledger, number, amount, forward } = req.params;

    amount = amount || 1;
    forward = forward === 'false' ? false : true;

    if (!forward && number != 'latest' && amount && parseInt(amount) > parseInt(number)) {
      amount = number;
    }
    if (amount > 20) {
      return res.status(429).json({ message: 'Amount should be <20.' });
    }

    if (number === 'latest') {
      const sizes = await getSizes(req.parsedConfig, ledger);
      number = sizes[0].size;
    }

    console.debug(`Getting ${amount} txs ${forward ? 'from' : 'until'} #${number} from ${ledger}`);
    let resp = [];
    let toClose = [];

    for (let it = 0; it < amount; it++) {
      try {
        const cfg =
          req.parsedConfig[Math.floor(Math.random() * Math.floor(req.parsedConfig.length))];
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
    try {
      resp = await Promise.all(resp);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }

    toClose.forEach(connection => connection.close());
    res.status(200).json(resp.filter(tx => tx.result.data).map(tx => tx.result.data));
  });
};
