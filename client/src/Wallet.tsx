import {api} from "./services/server.ts";

import React from 'react';
import {IWallet} from "./services/wallet.ts";

type Props = {
    wallet: IWallet,
    balance: number,
    logout: () => void,
    setBalance: (balance: number) => void
}

const Wallet: React.FC<Props> = ({wallet, balance, logout, setBalance}) => {

    const faucet = () => {
        if (wallet?.address) api.faucet(wallet.address).then((balance) => setBalance(balance))
    }

    return (
        <div className="container wallet">
            <h1>Your Wallet</h1>

            <label>
                Wallet Address
                <input placeholder="Type an address, for example: 0x1" value={wallet?.address} readOnly={true}></input>
            </label>

            <label>
                {' '}
                <div className="balance">Balance: {balance}</div>
            </label>

            <div className='row-center-items'>
                <input type="button" className="button" value="Faucet" style={{backgroundColor: '#325bfc'}}
                       onClick={faucet}/>

                <input type="button" className="button" value="Logout" style={{backgroundColor: '#eb8def'}}
                       onClick={logout}/>
            </div>
        </div>
    );
}

export default Wallet;
