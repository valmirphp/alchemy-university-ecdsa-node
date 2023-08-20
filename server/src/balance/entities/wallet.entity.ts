export class WalletEntity {
  public balance: number;
  public address: string;
  public updatedAt: Date;
  public createdAt: Date;

  constructor(partial) {
    Object.assign(this, partial);
  }
}
