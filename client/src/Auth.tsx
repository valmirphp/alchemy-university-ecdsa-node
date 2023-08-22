import {ethers} from "ethers";
import {useState} from "react";

import React from 'react';
import {IWallet, WalletFactory} from "./services/wallet.ts";

type Props = {
    setWallet: (wallet: IWallet) => void
}

const Auth: React.FC<Props> = ({setWallet}) => {

    const [phrase, setPhrase] = useState<string>('');
    const [phraseError, setPhraseError] = useState<string | null>(null);
    const [ethersError, setEthersError] = useState<string | null>(null);

    const generateRandomWallet = () => {
        const wallet = ethers.Wallet.createRandom();
        console.log("[random] Wallet address: " + wallet.address)
        prompt("Save your Mnemonic Phrase. It is the only way to recover your wallet.", wallet.mnemonic?.phrase);
        setWallet(WalletFactory.fromEtherWallet(wallet))
    };

    const generateByPhrase = (phrase: string) => {
        const words = phrase.split(" ");
        if (words.length !== 12) {
            setPhraseError("Incomplete phrase");
            return;
        }

        try {
            const wallet = ethers.Wallet.fromPhrase(phrase)
            console.log("[import] Wallet address: " + wallet.address)
            setWallet(WalletFactory.fromEtherWallet(wallet));
        } catch (error) {
            console.log("Invalid private key", error);
            setPhraseError("Error importing wallet. Invalid private key");
        }
    }

    const onChangePhrase = event => {
        event.preventDefault();
        setPhrase(event.target.value);
        generateByPhrase(event.target.value)
    };

    async function connectWallet() {
        if (window["ethereum"] == null) {
            // If MetaMask is not installed, we use the default provider,
            // which is backed by a variety of third-party services (such
            // as INFURA). They do not have private keys installed so are
            // only have read-only access
            // provider = ethers.getDefaultProvider(null)
            setEthersError("MetaMask not installed; using read-only defaults")
            return;
        }

        // Connect to the MetaMask EIP-1193 object. This is a standard
        // protocol that allows Ethers access to make all read-only
        // requests through MetaMask.
        const provider = new ethers.BrowserProvider(window["ethereum"])

        // It also provides an opportunity to request access to write
        // operations, which will be performed by the private key
        // that MetaMask manages for the user.
        const signer = await provider.getSigner();
        setWallet(WalletFactory.fromRpcSigner(signer));
    }

    return (
        <div className="container wallet">
            <h1>Connect Wallet</h1>

            <hr/>
            <h3>Generate Wallet</h3>
            <input type="button" className="button" value="Get Wallet" style={{backgroundColor: '#325bfc'}}
                   onClick={generateRandomWallet}/>

            <hr/>
            <h3>Meta Mask</h3>
            <input
                type="button" className="button" value="Connect Wallet" style={{backgroundColor: '#f65e24'}}
                onClick={connectWallet} />
            <small style={{color: "red"}}>{ethersError}</small>

            <hr/>
            <h3>Import Wallet</h3>
            <label>
                Mnemonic Phrase
                <input placeholder="Type an Mnemonic Phrase" value={phrase} onChange={onChangePhrase}></input>
            </label>
            <small style={{color: "red"}}>{phraseError}</small>
        </div>
    );
}

export default Auth;
