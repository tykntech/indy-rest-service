const zmqlib = require('@tykntech/indy-zmq-lib');
const getLedger = require('../lib/getLedger');

module.exports = function setTxEndpoint(router) {
    router.get('/tx/:ledger?/:number/:amount?/:forward?', async (req, res) => {
        let { ledger, number, amount, forward } = req.params;
        amount = amount || 1;
        forward = forward === 'false' ? false : true;

        if (amount > 20) {
            return res.status(429).json({ message: 'Amount should be <20.' });
        }

        console.debug(`Getting ${amount} txs ${forward ? 'from' : 'until'} #${number} from ${ledger}`);
        let resp = [];

        for (let it = 0; it < amount; it++) {
            try {
                const cfg = req.parsedConfig[Math.floor(Math.random() * Math.floor(req.parsedConfig.length))];
                console.log(cfg);
                const ledgerConnection = zmqlib.Wrap(cfg);
                resp.push(ledgerConnection.send({
                    "operation": {
                        "type": "3",
                        "ledgerId": getLedger(ledger || 1),
                        "data": forward ? parseInt(number) + it : parseInt(number) - it
                    },
                    "identifier": "LibindyDid211111111111",
                    "protocolVersion": 2
                }));
            } catch (e) {
                console.error(e);
            }
        }
        try {
            resp = await Promise.all(resp);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
        res.status(200).json(resp.map(tx => tx.result.data));
    });
}