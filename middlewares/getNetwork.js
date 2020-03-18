const zmqlib = require('@tykntech/indy-zmq-lib');
const networks = require('../networks');

exports.getNetwork = async function(req, res, next) {
  const { network } = req.params;

  if (!networks[network]) {
    return res
      .status(404)
      .json({ message: `The network ${network} is not available in this API.` });
  }

  req.network = network;
  req.parsedConfig = await Promise.all(
    networks[network].map(async net => await zmqlib.ParseGenesisTx(net))
  );
  next();
};
