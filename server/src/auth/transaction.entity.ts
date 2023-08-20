export class TransactionEntity<Data = Record<string, any>> {
  public hash: string;
  public nonce: string;
  public signature: string;
  public data: Data;

  constructor(partial: Partial<TransactionEntity<Data>>) {
    Object.assign(this, partial);
  }
}
