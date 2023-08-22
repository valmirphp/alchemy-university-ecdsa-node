## ECDSA Node

This project is an example of using a client and server to facilitate transfers between different addresses. Since there
is just a single server on the back-end handling transfers, this is clearly very centralized. We won't worry about
distributed consensus for this project.

However, something that we would like to incoporate is Public Key Cryptography. By using Elliptic Curve Digital
Signatures we can make it so the server only allows transfers that have been signed for by the person who owns the
associated address.

### Video instructions

For an overview of this project as well as getting started instructions, check out the following video:

https://www.loom.com/share/0d3c74890b8e44a5918c4cacb3f646c4

### Client

The client folder contains a [react app](https://reactjs.org/) using [vite](https://vitejs.dev/). To get started, follow
these steps:

1. Open up a terminal in the `/client` folder
2. Run `yarn install` to install all the depedencies
3. Run `yarn dev` to start the application
4. Now you should be able to visit the app at [http://127.0.0.1:5173](http://127.0.0.1:5173)

### Server

The server folder contains a node.js server using [NestJS](https://nestjs.com/). To run the server, follow these
steps:

1. Open a terminal within the `/server` folder
2. Run `yarn install` to install all the depedencies
3. Run `yarn start:dev` to start the server
4. Now you should be able to visit the api at [http://127.0.0.1:3042](http://127.0.0.1:3042)

The application should connect to the default server port (3042) automatically!

## Demo

### WebApp

Visit [ua-ecdsa-node.onrender.com](https://ua-ecdsa-node.onrender.com/) to see the webapp in action!

### API

API is hosted on [api-ua-ecdsa-node.onrender.com](https://api-ua-ecdsa-node.onrender.com/)

### Get blockchain

Get the blockchain.

```http request
GET /blockchain HTTP/1.1
Host: api-ua-ecdsa-node.onrender.com
```

### Balance

Get the balance of an address.

```http request
GET /balance/0x538D09dbe6aBa08Bf4D0369b6f4432789Ce312C3 HTTP/1.1
Host: api-ua-ecdsa-node.onrender.com
```

### Faucet

Generate 10 coins for an address.

```http request
GET /balance/0x538D09dbe6aBa08Bf4D0369b6f4432789Ce312C3/faucet HTTP/1.1
Host: api-ua-ecdsa-node.onrender.com
```

### Transfer

Transfer coins from one address to another.

```http request
POST /send HTTP/1.1
Content-Type: application/json
Host: api-ua-ecdsa-node.onrender.com

{
	"nonce": "f3b71131-e649-42eb-b0f2-3da7de447983",
	"data": {
		"sender": "0x538D09dbe6aBa08Bf4D0369b6f4432789Ce312C3",
		"amount": 1,
		"recipient": "0xA03A19d2814eE3b60F9C47ebA4E2eccC4a966145"
	},
	"hash": "e1a33d424c1addc0bc103c818bdf25ffb9c46921dea6fe75fdb4ea7d4ccee746",
	"signature": "0x94ade6b6bc63ee00ad3b3c55bb0925341c322efc41a8f138800138a28842079d344362b193e0fedc8ddb0c474f72665938989c112045391093e5e6a0e75fee671b"
}
```

## References

- [Blockchaindemo.io](https://github.com/0xs34n/blockchain)
- [University Alchemy - Course Ethereum](https://university.alchemy.com/course/ethereum/)

