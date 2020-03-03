const express = require('express');
const zmqlib = require('@tykntech/indy-zmq-lib');
const bodyParser = require('body-parser');

const app = express()

// builderNet,  first line from: https://raw.githubusercontent.com/sovrin-foundation/sovrin/master/sovrin/pool_transactions_builder_genesis  
const conf = process.env.GENESIS_TX || '{"reqSignature":{},"txn":{"data":{"data":{"alias":"Node1","blskey":"4N8aUNHSgjQVgkpm8nhNEfDf6txHznoYREg9kirmJrkivgL4oSEimFF6nsQ6M41QvhM2Z33nves5vfSn9n1UwNFJBYtWVnHYMATn76vLuL3zU88KyeAYcHfsih3He6UHcXDxcaecHVz6jhCYz1P2UZn2bDVruL5wXpehgBfBaLKm3Ba","blskey_pop":"RahHYiCvoNCtPTrVtP7nMC5eTYrsUA8WjXbdhNc8debh1agE9bGiJxWBXYNFbnJXoXhWFMvyqhqhRoq737YQemH5ik9oL7R4NTTCz2LEZhkgLJzB3QRQqJyBNyv7acbdHrAT8nQ9UkLbaVL9NBpnWXBTw4LEMePaSHEw66RzPNdAX1","client_ip":"127.0.0.1","client_port":9702,"node_ip":"127.0.0.1","node_port":9701,"services":["VALIDATOR"]},"dest":"Gw6pDLhcBcoQesN72qfotTgFa7cbuqZpkX3Xo6pLhPhv"},"metadata":{"from":"Th7MpTaRZVRYnPiabds81Y"},"type":"0"},"txnMetadata":{"seqNo":1,"txnId":"fea82e10e894419fe2bea7d96296a6d46f50f93f9eeda954ec461b2ed2950b62"},"ver":"1"}';

const getLedger = function(something) {
    switch (something.toString().toLowerCase()) {
        case '1':
            return 1;
        case 'pool':
            return 0;
        case 'domain':
            return 1;
        case 'config':
            return 2;
        default:
            return 1;
    }
}

app.use(bodyParser.json());

app.get('/tx/:ledger?/:amount?/:number', async(req, res) => {
    const { ledger, number, amount } = req.params;
    console.trace(`Getting tx #${number} from ${ledger}`);

    const parsedConf = await zmqlib.ParseGenesisTx(conf);
    console.trace(`Using ${JSON.stringify(parsedConf)}`);

    const ledgerConnection = zmqlib.Wrap(parsedConf);
    let resp = [];
    for (let it = 0; it <= amount; it++) {
        resp.push(ledgerConnection.send({
            "operation": {
                "type": "3",
                "ledgerId": getLedger(ledger || 1),
                "data": parseInt(number + it)
            },
            "identifier": "LibindyDid211111111111",
            "protocolVersion": 2
        }));
    }
    try {
        await Promise.all(resp);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }

    console.trace(JSON.stringify(resp.result.data));
    res.status(200).json(resp.result.data);
});

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

const port = process.env.PORT || 3000
app.listen(port, async() => {
    console.log(`Application started on port: ${port}`);
})