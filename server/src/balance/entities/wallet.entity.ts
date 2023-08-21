export class WalletEntity {
  public balance: number;
  public address: string;
  public updatedAt: Date;
  public createdAt: Date;

  constructor(partial?: Partial<WalletEntity>) {
    Object.assign(this, partial);

    if (partial?.createdAt) {
      this.createdAt = new Date(partial.createdAt);
    } else {
      this.createdAt = new Date();
    }

    if (partial?.updatedAt) {
      this.updatedAt = new Date(partial.updatedAt);
    } else {
      this.updatedAt = this.createdAt;
    }
  }

  toJSON() {
    return {
      balance: this.balance,
      address: this.address,
      updatedAt: this.updatedAt.getTime(),
      createdAt: this.createdAt.getTime(),
    };
  }
}
