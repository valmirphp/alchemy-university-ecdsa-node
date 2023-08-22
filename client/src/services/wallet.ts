import {ethers} from "ethers";

export interface IWallet {
    address: string;
    privateKey?: string;

    signMessage(hash: string): Promise<string>;
}

export class HardWallet implements IWallet {
    constructor(private readonly wallet: ethers.Wallet | ethers.HDNodeWallet) {
    }

    get address(): string {
        return this.wallet.address;
    }

    get privateKey(): string {
        return this.wallet.privateKey;
    }

    signMessage(hash: string): Promise<string> {
        return this.wallet.signMessage(hash);
    }
}

export class BrowserWallet implements IWallet {
    constructor(private readonly signer: ethers.JsonRpcSigner) {
    }

    get address(): string {
        return this.signer.address
    }

    signMessage(hash: string): Promise<string> {
        return this.signer.signMessage(hash);
    }
}

export class WalletFactory {
    static fromEtherWallet(wallet: ethers.Wallet | ethers.HDNodeWallet): IWallet {
        return new HardWallet(wallet);
    }

    static fromPrivateKey(privateKey: string): IWallet {
        return new HardWallet(new ethers.Wallet(privateKey));
    }

    static fromRpcSigner(signer: ethers.JsonRpcSigner): IWallet {
        return new BrowserWallet(signer);
    }
}
