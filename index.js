const express = require('express');
const zmqlib = require('@tykntech/indy-zmq-lib');
const bodyParser = require('body-parser');

const app = express()

// builderNet,  first line from: https://raw.githubusercontent.com/sovrin-foundation/sovrin/master/sovrin/pool_transactions_builder_genesis  
const conf = process.env.GENESIS_TX ||
    '{"reqSignature":{},"txn":{"data":{"data":{"alias":"ev1","client_ip":"54.207.36.81","client_port":"9702","node_ip":"18.231.96.215","node_port":"9701","services":["VALIDATOR"]},"dest":"GWgp6huggos5HrzHVDy5xeBkYHxPvrRZzjPNAyJAqpjA"},"metadata":{"from":"J4N1K1SEB8uY2muwmecY5q"},"type":"0"},"txnMetadata":{"seqNo":1,"txnId":"b0c82a3ade3497964cb8034be915da179459287823d92b5717e6d642784c50e6"},"ver":"1"}';
// '{"reqSignature":{},"txn":{"data":{"data":{"alias":"Node1","blskey":"4N8aUNHSgjQVgkpm8nhNEfDf6txHznoYREg9kirmJrkivgL4oSEimFF6nsQ6M41QvhM2Z33nves5vfSn9n1UwNFJBYtWVnHYMATn76vLuL3zU88KyeAYcHfsih3He6UHcXDxcaecHVz6jhCYz1P2UZn2bDVruL5wXpehgBfBaLKm3Ba","blskey_pop":"RahHYiCvoNCtPTrVtP7nMC5eTYrsUA8WjXbdhNc8debh1agE9bGiJxWBXYNFbnJXoXhWFMvyqhqhRoq737YQemH5ik9oL7R4NTTCz2LEZhkgLJzB3QRQqJyBNyv7acbdHrAT8nQ9UkLbaVL9NBpnWXBTw4LEMePaSHEw66RzPNdAX1","client_ip":"127.0.0.1","client_port":9702,"node_ip":"127.0.0.1","node_port":9701,"services":["VALIDATOR"]},"dest":"Gw6pDLhcBcoQesN72qfotTgFa7cbuqZpkX3Xo6pLhPhv"},"metadata":{"from":"Th7MpTaRZVRYnPiabds81Y"},"type":"0"},"txnMetadata":{"seqNo":1,"txnId":"fea82e10e894419fe2bea7d96296a6d46f50f93f9eeda954ec461b2ed2950b62"},"ver":"1"}';

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
    let { ledger, number, amount } = req.params;
    amount = amount || 1;

    if (amount > 20) {
        return res.status(429).json({ message: 'Amount should be <20.' });
    }

    console.debug(`Getting ${amount} txs after #${number} from ${ledger}`);

    const parsedConf = await zmqlib.ParseGenesisTx(conf);
    let resp = [];

    for (let it = 0; it < amount; it++) {
        try {
            const ledgerConnection = zmqlib.Wrap(parsedConf);
            resp.push(ledgerConnection.send({
                "operation": {
                    "type": "3",
                    "ledgerId": getLedger(ledger || 1),
                    "data": parseInt(number) + it
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