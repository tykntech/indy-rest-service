const express = require('express');
const bodyParser = require('body-parser');
const setGetSizesEndpoint = require('./endpoints/get.sizes');
const setGetTxEndpoint = require('./endpoints/get.tx');
const setPostTxEndpoint = require('./endpoints/post.tx');
const swaggerUi = require('swagger-ui-express');
const { getNetwork } = require('./middlewares/getNetwork');
const YAML = require('yamljs');
const swaggerDoc = YAML.load('./api-spec.yaml');
const app = express();
const cors = require('cors');
app.use(cors());
const server = require('http').Server(app);
const io = require('socket.io')(server);
const router = express.Router();
const networks = require('./networks');
const getSizes = require('./services/getSizes');
const zmqlib = require('@tykntech/indy-zmq-lib');
const getTx = require('./services/getTx');

const sizeCache = {};

app.use(bodyParser.json());

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

async function getNextTx(socket, conf, net, ledger) {
  const response = await getTx(
    [conf],
    ledger,
    parseInt(sizeCache[net][ledger.toUpperCase()]) + 1,
    1,
    true
  );

  if (!response[0].result.data) return;

  sizeCache[net][ledger.toUpperCase()]++;

  socket.emit(`newtx_${ledger.toUpperCase()}`, [response[0].result.data]);
}

io.on('connection', async socket => {
  const net = socket.handshake.query.network;
  conf = await zmqlib.ParseGenesisTx(networks[net][0]);

  if (!sizeCache[net]) {
    const o = {};
    (await getSizes([conf])).map(x => (o[x.ledger] = x.size));
    sizeCache[net] = o;
  }

  const interWatch = setInterval(async () => {
    await getNextTx(socket, conf, net, 'domain');
    await getNextTx(socket, conf, net, 'config');
    await getNextTx(socket, conf, net, 'pool');
  }, 15000);

  socket.on('disconnect', () => {
    clearInterval(interWatch);
  });
});

setGetSizesEndpoint(router, sizeCache);
setGetTxEndpoint(router);
setPostTxEndpoint(router);

app.use('/:network', getNetwork, router);

const port = process.env.PORT || 3000;

server.listen(port, async () => {
  console.log(`Application started on port: ${port}`);
});
