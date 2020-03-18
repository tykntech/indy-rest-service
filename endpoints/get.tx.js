const getSizes = require('../services/getSizes');
const getTxs = require('../services/getTx');

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

    let resp = {};
    try {
      resp = await getTxs(req.parsedConfig, ledger, number, amount, forward);
    } catch (e) {
      console.error({ message: e.message });
      return res.status(500).json({ message: `Error reading transactions from ledger.` });
    }

    res.status(200).json(resp.filter(tx => tx.result.data).map(tx => tx.result.data));
  });
};
