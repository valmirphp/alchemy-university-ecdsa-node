import { Injectable, Logger } from '@nestjs/common';
import { BlockchainService } from '~/blockchain/blockchain.service';
import { Wallet } from '~/balance/types';

type Transaction = {
  action: 'wallet_update';
  wallet: Wallet;
};

@Injectable()
export class BalanceService {
  private readonly logger = new Logger(BalanceService.name);
  private readonly tmpTransactions: Array<Transaction> = [];

  constructor(private readonly blockchainService: BlockchainService) {}

  makeWalletKey(address: string) {
    return `wallet:${address}`;
  }

  all(): Array<Wallet> {
    return Object.entries(this.blockchainService.lastData()).reduce(
      (prev, [k, v]) => {
        if (k.startsWith('wallet')) {
          prev.push(v);
        }
        return prev;
      },
      [],
    );
  }

  getWallet(address: string): Wallet | undefined {
    const walletKey = this.makeWalletKey(address);
    return this.blockchainService.lastData()[walletKey];
  }

  getBalance(address: string): number {
    return this.getWallet(address)?.balance || 0;
  }

  setBalance(address: string, balance: number): void {
    let wallet = this.getWallet(address);

    if (!wallet) {
      wallet = {
        address,
        balance: 0,
        updatedAt: Date.now(),
        createdAt: Date.now(),
      };
    }

    wallet.balance = balance;
    wallet.updatedAt = Date.now();

    this.tmpTransactions.push({
      action: 'wallet_update',
      wallet,
    });
  }

  commit(): void {
    if (this.tmpTransactions.length === 0) {
      this.logger.debug('No transactions to commit');
      return;
    }

    const data = this.blockchainService.lastData();

    while (this.tmpTransactions.length > 0) {
      const transaction = this.tmpTransactions.shift();

      if (transaction.action === 'wallet_update') {
        const walletKey = this.makeWalletKey(transaction.wallet.address);
        data[walletKey] = transaction.wallet;

        this.logger.debug(
          `Updating wallet ${transaction.wallet.address} balance to ${transaction.wallet.balance}`,
        );
      } else {
        this.logger.error(`Invalid transaction: ${transaction.action}`);
        throw new Error(`Invalid transaction: ${transaction.action}`);
      }
    }

    this.logger.debug('Committing transactions');
    this.blockchainService.mine(data);
  }
}
