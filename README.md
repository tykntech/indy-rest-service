![Node.js CI](https://github.com/tykntech/indy-rest-service/workflows/Node.js%20CI/badge.svg?branch=master)

# Tykn's rest service

This is Tykn's alternative to communicate with Hyperledger INDY nodes. With this service, it is possible to send REST requests to a INDY node without needing a ZeroMQ connection or any other messaging system.

---
## How to deploy it

Pre-requirements:
1. A node-js 10+ environment
2. Internet access or Hyperledger INDY node locally

First, clone this repository:
```
git clone git@github.com:tykntech/indy-rest-service.git
```

Then go into the cloned folder:
```
cd indy-rest-service
```

As it is a NodeJS service, you need to install the dependencies:
```
npm i
```

An then start the service:
```
npm start
```
---
## Open API Spec 3.0

Try our OpenAPI 3.0 spec at: http://api.tykn.tech/doc

---
## How it works?

Eliminating the Indy-SDK, it's necessary to build the transactions ourselves. All needed is: 
1. Create a transaction (ATTRIB/NYM/SCHEMA_DEF/SCHEMA)
```
A tool to create transactions is on our road map that could also validate it after signatures
```
2. Sign the transaction by the parties (you need to move the JSON around and sign it yourself)
```
Signing means hashing and adding a signature at the end of the JSON. 
This can be achieved in many ways and we're also planning into providing a tool for that. 
We can even use Hyperledger Aries to deal with this kind of communication.
```
3. Send the signed transaction to the POST endpoint
```
It's important to notice that the transaction must be signed by the target of 
the transaction as the node will accept to deploy such transaction
```
---
## How to contribute?

We're still studying ways to improve this tool and we expect the community to help us with that.