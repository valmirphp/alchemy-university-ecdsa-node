import {useState} from "react";
import {api} from "./services/server.ts";
import {TransactionDto, TransferDataDto} from "./dto/send.dto.ts";

function Transfer({wallet, setBalance}) {
    const [sendAmount, setSendAmount] = useState("1");
    const [recipient, setRecipient] = useState("");
    const [transaction, setTransaction] = useState<TransactionDto>(null);

    const setValue = (setter) => (evt) => setter(evt.target.value);

    function getDto(): TransferDataDto {
        return {
            sender: wallet.address,
            amount: parseInt(sendAmount),
            recipient,
        }
    }

    async function sign(evt) {
        evt.preventDefault();

        try {
            const trans = await api.signTransaction(wallet, getDto())
            setTransaction(trans)
        } catch (e) {
            alert(e.message)
        }
    }

    async function transfer(evt) {
        evt.preventDefault();

        try {
            const response = await api.sendTransaction(transaction)
            alert(`Transaction sent! \nBlock: ${response.block} \nBalance: ${response.balance} \nHash: ${response.tx}`)
            setBalance(response.balance)
        } catch (e) {
            alert(e.message)
        }
    }

    return (
        <form className="container transfer" onSubmit={transfer}>
            <h1>Send Transaction</h1>

            <label>
                Send Amount
                <input
                    placeholder="1, 2, 3..."
                    type={"number"}
                    step={1}
                    value={sendAmount}
                    onChange={setValue(setSendAmount)}
                ></input>
            </label>

            <label>
                Recipient
                <input
                    placeholder="Type an address, for example: 0x2"
                    value={recipient}
                    onChange={setValue(setRecipient)}
                ></input>
            </label>

            <label>Hash: {transaction?.hash}</label>

            <div>
                <input type="button" className="button" value="Sign" onClick={sign} style={{backgroundColor: "#f6d507"}}/>
                <input type="button" className="button" value="Transfer" onClick={transfer}/>
            </div>
        </form>
    );
}

export default Transfer;
