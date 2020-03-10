const zmqlib = require('@tykntech/indy-zmq-lib');
const getLedger = require('../lib/getLedger');
const ledgers = require('../lib/ledgers');

module.exports = function setGetSizesEndpoint(router) {
    router.get('/sizes', async (req, res) => {
        console.debug('Sizes called.')
        let resp = [];

        for (let it = 0; it < ledgers.length; it++) {
            try {
                const ledgerConnection = zmqlib.Wrap(req.parsedConfig[Math.floor(Math.random() * Math.floor(req.parsedConfig.length))]);
                resp.push(ledgerConnection.send({
                    "operation": {
                        "type": "3",
                        "ledgerId": getLedger(ledgers[it]),
                        "data": 1
                    },
                    "identifier": "LibindyDid211111111111",
                    "protocolVersion": 2
                }));
            } catch (e) {
                console.error(e);
            }
        }
        console.debug('Querying ...')
        try {
            resp = await Promise.all(resp);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
        console.debug(`resp as ${resp}`)
        const response = resp.map(tx => {
            return {
                ledger: ledgers[tx.result.state_proof.multi_signature.value.ledger_id],
                size: tx.result.data.ledgerSize
            }
        });
        console.debug(response)
        res.status(200).json(response);
    })
}