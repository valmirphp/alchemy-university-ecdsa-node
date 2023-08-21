import {ethers} from "ethers";
import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import {useEffect, useState} from "react";
import Auth from "./Auth.tsx";
import {api} from "./services/server.ts";
import {HdWallet} from "./helpers/hd-wallet.ts";

function App() {
    const [wallet, setWallet] = useState<ethers.Wallet>();
    const [balance, setBalance] = useState(0);

    const loadBalance: () => void = () => {
        if (wallet?.address) api.getBalance(wallet.address).then((balance) => setBalance(balance))
    }

    useEffect(() => {
        if (wallet?.address) {
            HdWallet.store(wallet.privateKey);
            loadBalance();
        }
    }, [wallet]);

    useEffect(() => {
        const privateKey = HdWallet.retrieve();
        if (privateKey) {
            const wallet = new ethers.Wallet(privateKey);
            setWallet(wallet);
        }
    }, [])

    const logout = () => {
        HdWallet.clear();
        setWallet(undefined);
    }



    if (!wallet) {
        return (
            <div className="app">
                <Auth setWallet={setWallet}/>
            </div>
        )
    }

    return (
        <div className="app">
            <Wallet
                balance={balance}
                wallet={wallet}
                logout={logout}
                setBalance={setBalance}
            />
            <Transfer setBalance={setBalance} wallet={wallet}/>
        </div>
    );
}

export default App;
