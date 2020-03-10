const zmqlib = require('@tykntech/indy-zmq-lib');

module.exports = function setPostTxEndpoint(router) {
    router.post('/tx', async (req, res) => {
        const ledger = zmqlib.Wrap(req.parsedConfig[Math.floor(Math.random() * Math.floor(req.parsedConfig.length))]);
        let resp;
        try {
            resp = await ledger.send(req.body);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
        res.status(200).json(resp.result.data);
    });
}