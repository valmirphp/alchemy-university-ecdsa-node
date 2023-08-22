import {AxiosInstance} from "axios";
import {keccak256} from 'ethereum-cryptography/keccak';
import {toHex, utf8ToBytes} from 'ethereum-cryptography/utils';
import {TransactionDto, TransferDataDto} from "../dto/send.dto.ts";
import {BlockChain} from "./types.ts";

export type TransactionResponse = {
    tx: string
    block: number
    balance: number
}

export class ApiService {
    constructor(private readonly client: AxiosInstance) {
    }

    async getBalance(address: string): Promise<number> {
        try {
            const response = await this.client.get(`/balance/${address}`);
            return response.data?.balance || 0;
        } catch (e) {
            this.failedRequestHandler(e)
        }
    }

    async faucet(address: string): Promise<number> {
        try {
            const response = await this.client.get(`/balance/${address}/faucet`);
            return response.data?.balance || 0;
        } catch (e) {
            this.failedRequestHandler(e)
        }
    }

    async getNonce(address: string): Promise<string> {
        try {
            const response = await this.client.post('/auth/nonce', {
                address: address
            })

            console.log("getNonce", {...response.data, expiry: new Date(response.data.expiry)})
            return response.data?.nonce || 0;
        } catch (e) {
            this.failedRequestHandler(e)
        }
    }

    async preSignTransaction(data: TransferDataDto): Promise<TransactionDto> {
        if (!data.sender) throw new Error("Sender is required")
        if (!data.amount) throw new Error("Send amount is required")
        if (!data.recipient) throw new Error("Recipient is required")

        const nonce = await this.getNonce(data.sender);

        const trans: TransactionDto = {
            nonce,
            data,
            hash: null,
            signature: null
        }

        trans.hash = this.hashMessage(JSON.stringify(data) + nonce)

        // const hashMessage = ethers.hashMessage(JSON.stringify(data) + nonce)
        // trans.hash = ethers.keccak256(hashMessage)
        // trans.signature = await wallet.signMessage(trans.hash)

        console.log("signTransfer", trans)

        return trans;
    }

    async sendTransaction(data: TransactionDto): Promise<TransactionResponse> {
        if (!data?.hash) throw new Error("Hash is required")
        if (!data?.signature) throw new Error("Signature is required")

        try {
            const response = await this.client.post('/send', data)
            console.log("transfer", {...response.data})
            return response.data;
        } catch (e) {
            this.failedRequestHandler(e)
        }
    }

    async getLastBlockchain(): Promise<BlockChain> {
        try {
            const response = await this.client.get('/blockchain/last-block')
            console.log("getLastBlockchain", {...response.data})
            return response.data;
        } catch (e) {
            this.failedRequestHandler(e)
        }
    }

    private failedRequestHandler(e): never {
        const message = e.response?.data?.message || e.message || 'Unknown error';
        throw new Error(message);
    }

    private hashMessage(message: string): string {
        const bytes = utf8ToBytes(message);
        const hash = keccak256(bytes);

        return toHex(hash);
    }
}
