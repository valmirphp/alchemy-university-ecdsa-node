import { ethers } from 'ethers';

// https://docs.ethers.org/v6/getting-started/
// https://ethereumjs.readthedocs.io/en/latest/index.html

// artigos para ler
// https://www.web3dev.com.br/devaraujo/como-criar-um-fluxo-de-autenticacao-web3-5d0g
// https://blog.thirdweb.com/web3-auth/
// https://web3auth.io/account-abstraction.html

const WALLETS = [
  {
    privateKey:
      'c2db5c2afa12c461648d70f8600a89724b0d890516707d0f233150f532c53501',
    address: '0x2b7c1dd94f51f517c3a7ae336cd123ca4234b31d',
  },
  {
    privateKey:
      '3470f278bf47b3c3bf8dac10fb4680da5eda2addb6791e42cb2ff3c85cc2c795',
    address: '0x818b690884071145a485ee72278917609fda5d2d',
  },
];

describe('Playground', () => {
  it('should new wallet with private key', () => {
    // Crie uma nova Wallet com chave privada aleatória
    const wallet = ethers.Wallet.createRandom();

    console.log('Chave Privada:', wallet.privateKey);
    console.log('Chave Publica:', wallet.publicKey);
    console.log('Endereço:', wallet.address);
  });

  it('generate Address from privateKey', () => {
    // Obtenha a chave privada e o endereço
    const privateKey = WALLETS[0].privateKey;
    const expectedAddress = ethers.getAddress(WALLETS[0].address); // torna o endereço em formato checksum

    const wallet = new ethers.Wallet(privateKey);

    const address = wallet.address;

    expect(address).toBe(expectedAddress);
  });

  it('Sign Message', async () => {
    const privateKey = WALLETS[0].privateKey;
    const publicKey = WALLETS[0].address;

    const message = 'Hello, world!';
    const wallet = new ethers.Wallet(privateKey);
    const signature = await wallet.signMessage(message);
    console.log('signature', signature);

    ///////////////////
    // Recuperar a chave pública correspondente ao endereço
    const signerAddress = ethers.verifyMessage(message, signature);
    const isValidSignature =
      publicKey.toLowerCase() === signerAddress.toLowerCase();

    console.log('publicKey', ethers.getAddress(publicKey));
    console.log('signerAddress', signerAddress);

    expect(isValidSignature).toBeTruthy();
  });
});
