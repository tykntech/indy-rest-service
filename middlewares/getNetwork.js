const zmqlib = require('@tykntech/indy-zmq-lib');

const networks = {
    sovbuilder: require('../networks/sovbuilder.json'),
    sovstaging: require('../networks/sovstaging.json'),
    sovmain: require('../networks/sovmain.json'),
    sovlocal: require('../networks/sovlocal.json')
}

exports.getNetwork =
    async function (req, res, next) {
        const { network } = req.params
        console.log(`Using ${network} as network.`)

        req.parsedConfig = await Promise.all(networks[network].map(async net => await zmqlib.ParseGenesisTx(net)))

        next();
    }