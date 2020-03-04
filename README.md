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