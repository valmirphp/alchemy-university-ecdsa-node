import {useEffect, useState} from "react";
import "./App.scss";
import Wallet from "./Wallet";
import Transfer from "./Transfer";
import Auth from "./Auth.tsx";
import {api} from "./services/server.ts";
import {HdWallet} from "./helpers/hd-wallet.ts";
import {IWallet, WalletFactory} from "./services/wallet.ts";
import LastBlockchain from "./LastBlockchain.tsx";
import {BlockChain} from "./services/types.ts";
import Footer from "./Footer.tsx";

function App() {
    const [wallet, setWallet] = useState<IWallet>();
    const [balance, setBalance] = useState(0);
    const [blockchain, setBlockchain] = useState<BlockChain>(null);

    const loadBlockchain = () => {
        api.getLastBlockchain().then((blockchain) => setBlockchain(blockchain))
    }

    const loadBalance: () => void = () => {
        if (wallet?.address) api.getBalance(wallet.address).then((balance) => setBalance(balance))
    }

    useEffect(() => {
        loadBlockchain();
    }, [balance]);

    useEffect(() => {
        if (wallet?.privateKey) {
            HdWallet.store(wallet.privateKey);
        }

        loadBalance();
    }, [wallet]);

    useEffect(() => {
        const privateKey = HdWallet.retrieve();
        if (privateKey) {
            const wallet = WalletFactory.fromPrivateKey(privateKey);
            setWallet(wallet);
        }

        loadBlockchain();
    }, [])

    const logout = () => {
        HdWallet.clear();
        setWallet(undefined);
    }

    if (!wallet) {
        return (
            <>
                <div className="app">
                    <Auth setWallet={setWallet}/>
                </div>
                <Footer/>
            </>
        )
    }

    return (
        <div>
            <div className="app">
                <Wallet
                    balance={balance}
                    wallet={wallet}
                    logout={logout}
                    setBalance={setBalance}
                />
                <Transfer setBalance={setBalance} wallet={wallet}/>
            </div>

            {blockchain && (
                <div className="app" style={{marginTop: '24px'}}>
                    <LastBlockchain block={blockchain}/>
                </div>
            )}

            <Footer/>
        </div>
    );
}

export default App;
