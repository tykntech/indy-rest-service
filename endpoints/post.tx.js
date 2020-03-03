const zmqlib = require('@tykntech/indy-zmq-lib');

module.exports = function setPostTxEndpoint(app, conf) {
    app.post('/tx', async(req, res) => {
        const parsedConf = await zmqlib.ParseGenesisTx(conf);
        const ledger = zmqlib.Wrap(parsedConf);
        let resp;
        try {
            resp = await ledger.send(req.body);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
        res.status(200).json(resp.result.data);
    });
}