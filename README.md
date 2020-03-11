![Node.js CI](https://github.com/tykntech/indy-rest-service/workflows/Node.js%20CI/badge.svg?branch=master)

# Tykn's rest service

This is Tykn’s alternative to communicate with Hyperledger Indy nodes. With this service it’s possible to send REST requests to the nodes without needing ZeroMQ a complex messaging system. 

Currently it is already hard to onboard new developers to Indy and Self-Sovereign Identity as both require a lot of knowledge around blockchain, cryptography and identity. Putting another communication paradigm in just makes it harder. So, as a first step, we decided to build a tool that could facilitate communication, creating this REST interface that any client can call to read and write to any Hyperledger Indy node.


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
npm start // npm mon for nodemon
```
---
## Open API Spec 3.0

Try our OpenAPI 3.0 spec at: http://api.tykn.tech/doc

---
## How it works?

The API expects a transaction object built following the [INDY specs](https://readthedocs.org/projects/indy-node/downloads/pdf/latest/). Usually, the INDY-SDK builds those transactions.

A transaction-builder tool is being developed to help build transactions but, meanwhile, it needs to be done manually.

1. Create a transaction (ATTRIB/NYM/SCHEMA_DEF/SCHEMA)
```JSON
// NYM transaction
{
  "operation": {
    "type": "1",
    "dest": "LnXR1rPnncTPZvRdmJKhJQ",
    "role": "0",
    // 000000000000000000000000Trustee2
    "verkey": "BnSWTUQmdYCewSGFrRUhT6LmKdcCcSzRGqWXMPnEP168" 
  },
  "taaAcceptance": {
    "taaDigest": "8cee5d7a573e4893b08ff53a0761a22a1607df3b3fcd7e75b98696c92879641f",
    "mechanism": "product_eula",
    "time": 1583798400
  },
  "identifier": "Th7MpTaRZVRYnPiabds81Y",
  "reqId": 1583864223,
  "protocolVersion": 2,
  "signatures": {
    // 000000000000000000000000Steward1
    "Th7MpTaRZVRYnPiabds81Y": "4z6WfmWonquBEG8SzbALJYXTVJNseiJGAxjrejrCXduGACSCY1ViEMxPp3sjHSh9rHsF7byuvXQVbUpmPCqvmfDE", 
    // 000000000000000000000000Trustee1
    "V4SGRU86Z58d6TV7PBUe6f": "345W7oCrC6GupUhmKeaZ5X6fQ72so8XcCKqu12nQzMYWdZJWwRtABdwS9ZNpDVGW53f5no4HiDAz1ni4Dxe4gDmu" 
  }
}
``` 
```JSON
// SCHEMA transaction example
{
  "operation": {
    "type": "101",
    "data": {
      "version": "1.0",
      "name": "Degree",
      "attr_names": [
        "undergrad",
        "last_name",
        "first_name",
        "birth_date",
        "postgrad",
        "expiry_dat"
      ]
    }
  },
  "taaAcceptance": {
    "taaDigest": "8cee5d7a573e4893b08ff53a0761a22a1607df3b3fcd7e75b98696c92879641f",
    "mechanism": "product_eula",
    "time": 1583798400
  },
  "identifier": "Th7MpTaRZVRYnPiabds81Y",
  "reqId": 1583853291,
  "protocolVersion": 2,
  "signatures": {
    "Th7MpTaRZVRYnPiabds81Y": "8FQijmUrd1ML45nQD3MZ8Ugb9VMyyxWFNyypeNT8d4XKeP66d2VLNUE1SXMZB7PyhM6BU8ZDYJUPF4SAWJoiMoi"
  }
}
```
```JSON
// AML transaction example
{
  "operation": {
    "type": "5",
    "version": "1.0",
    "aml": {
      "eula": "Included in the EULA for the product being used",
      "service_agreement": "Included in the agreement with the service provider managing the transaction",
      "click_agreement": "Agreed through the UI at the time of submission",
      "session_agreement": "Agreed at wallet instantiation or login"
    },
    "amlContext": "http://aml-context-descr"
  },
  "identifier": "Th7MpTaRZVRYnPiabds81Y",
  "reqId": 1583864614,
  "protocolVersion": 2,
  "signatures": {
    "Th7MpTaRZVRYnPiabds81Y": "3GDAqEQ5VUtEz3ytk2dUQymgmZ5UAKNPF8U4jrvXfG53ZFCyTZ2FadV9xpVtiyVuFNbujoaupSRTBkAQJ1u7nXLZ",
    "V4SGRU86Z58d6TV7PBUe6f": "3Zr2fhcWe5T2bNpUF3SY7CmaY9yN596QwPz58tyHoXLLC7gjo2b1btWkqGDs6SGX1UDpLHky6pPebJFWAcCj1CWd"
  }
}
```
```JSON
// TAA transaction example
{
  "operation": {
    "type": "4",
    "version": "1.0",
    "text": "Here goes some acceptance text ..."
  },
  "identifier": "Th7MpTaRZVRYnPiabds81Y",
  "reqId": 1583864570,
  "protocolVersion": 2,
  "signatures": {
    "Th7MpTaRZVRYnPiabds81Y": "2TayPJ4CyWXhfLDJ7vbNXDg4ryH4oEbVeTeraGcDHXDgupaseedojiu7JsydPypWmiB8edGdtKEYasQcucnCAt4y",
    "V4SGRU86Z58d6TV7PBUe6f": "39mdgqDxzmePbJA9HnFVrVEdPNCrDW7RSARspt6aEzTvhVSdtbUnhti3D5ouCPgNox8EcP8TqhauZ8qjj2ke4Cew"
  }
}
```
```JSON
// GET TAA data
{
  "operation": {
    "type": "6"
  },
  "identifier": "LibindyDid211111111111",
  "reqId": 1583864570,
  "protocolVersion": 2
}
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