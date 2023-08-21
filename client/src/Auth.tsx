import {ethers} from "ethers";
import {useState} from "react";

function Auth({setWallet}) {

    const [phrase, setPhrase] = useState<string>('');
    const [messageError, setMessageError] = useState<string | null>(null);

    function generateWallet() {
        const wallet = ethers.Wallet.createRandom();
        console.log("[random] Wallet address: " + wallet.address)
        prompt("Save your Mnemonic Phrase. It is the only way to recover your wallet.", wallet.mnemonic?.phrase);
        setWallet(wallet);
    }

    function onChangePhrase(event) {
        event.preventDefault();
        setPhrase(event.target.value);

        const words = event.target.value.split(" ");
        if (words.length !== 12) {
            setMessageError("Incomplete phrase");
            return;
        }

        try {
            const wallet = ethers.Wallet.fromPhrase(event.target.value)
            console.log("[import] Wallet address: " + wallet.address)
            setWallet(wallet);
        } catch (error) {
            console.log("Invalid private key", error);
            setMessageError("Error importing wallet. Invalid private key");
        }
    }

    return (
        <div className="container wallet">
            <h1>Connect Wallet</h1>

            <hr/>

            <h3>Generate Wallet</h3>
            <button onClick={generateWallet}>Get wallet</button>

            <hr/>

            <h3>Import Wallet</h3>
            <label>
                Mnemonic Phrase
                <input placeholder="Type an Mnemonic Phrase" value={phrase} onChange={onChangePhrase}></input>
            </label>
            <small style={{color: "red"}}>{messageError}</small>
        </div>
    );
}

export default Auth;
