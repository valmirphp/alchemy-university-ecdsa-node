export class TransactionEntity<Data = Record<string, unknown>> {
    public hash!: string;
    public nonce!: string;
    public signature!: string;
    public data!: Data;

    constructor(partial: Partial<TransactionEntity<Data>>) {
        Object.assign(this, partial);
    }
}

export type TransferDataDto = {
    sender: string;
    recipient: string;
    amount: number;
};

export type TransactionDto = TransactionEntity<TransferDataDto>;
