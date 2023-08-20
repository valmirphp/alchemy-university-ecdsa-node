import { ethers } from 'ethers';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { BlockchainService } from '~/blockchain/blockchain.service';
import { WalletEntity } from '~/wallet/wallet.entity';

type Transaction = {
  action: 'wallet_update';
  wallet: WalletEntity;
};

@Injectable()
export class BalanceService {
  private readonly logger = new Logger(BalanceService.name);
  private readonly tmpTransactions: Array<Transaction> = [];

  constructor(private readonly blockchainService: BlockchainService) {}

  makeWalletKey(address: string) {
    return `wallet:${address.toLowerCase()}`;
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
    let wallet: WalletEntity = this.getWallet(address);

    const now = new Date();

    if (!wallet) {
      wallet = {
        balance: 0,
        address: ethers.getAddress(address),
        updatedAt: now,
        createdAt: now,
      };
    }

    wallet.balance = balance;
    wallet.updatedAt = now;

    this.tmpTransactions.push({
      action: 'wallet_update',
      wallet,
    });
  }

  transfer(
    sender: string,
    recipient: string,
    amount: number,
  ): { balance: number; block: number } {
    let senderBalance = this.getBalance(sender);
    let recipientBalance = this.getBalance(recipient);

    if (sender === recipient) {
      throw new BadRequestException('Sender and recipient must be different!');
    } else if (senderBalance < amount) {
      throw new BadRequestException('Not enough funds!');
    }

    senderBalance -= amount;
    recipientBalance += amount;

    this.setBalance(sender, senderBalance);
    this.setBalance(recipient, recipientBalance);
    this.commit();

    return {
      balance: senderBalance,
      block: this.blockchainService.latestIndex(),
    };
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
