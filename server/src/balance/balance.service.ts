import { randomUUID } from 'node:crypto';
import { ethers } from 'ethers';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { BlockchainService } from '~/blockchain/blockchain.service';
import { WalletEntity } from '~/balance/entities/wallet.entity';
import { BlockEvent } from '~/blockchain/block.event';

type Transaction = {
  action: 'wallet_update' | 'event_add';
  wallet?: WalletEntity;
  event?: BlockEvent;
};

@Injectable()
export class BalanceService {
  private readonly logger = new Logger(BalanceService.name);
  private readonly tmpTransactions: Array<Transaction> = [];

  constructor(private readonly blockchainService: BlockchainService) {}

  makeWalletKey(address: string) {
    if (!ethers.isAddress(address)) {
      throw new BadRequestException('Invalid address');
    }

    return `wallet:${address.toLowerCase()}`;
  }

  all(): Array<WalletEntity> {
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

  getWallet(address: string): WalletEntity | undefined {
    const walletKey = this.makeWalletKey(address);
    const data = this.blockchainService.lastData()[walletKey];
    return data ? new WalletEntity(data) : undefined;
  }

  getBalance(address: string): number {
    return this.getWallet(address)?.balance || 0;
  }

  setEvent(kind: string, from: string, data: any): string {
    const event: BlockEvent = {
      kind,
      from,
      data,
      tx: randomUUID(),
      timestamp: Date.now(),
    };
    this.tmpTransactions.push({ action: 'event_add', event });
    return event.tx;
  }

  setBalance(address: string, balance: number): void {
    let wallet: WalletEntity = this.getWallet(address);

    if (!wallet) {
      wallet = new WalletEntity({
        balance: 0,
        address: ethers.getAddress(address),
      });
    }

    wallet.balance = balance;
    wallet.updatedAt = new Date();

    this.tmpTransactions.push({
      action: 'wallet_update',
      wallet,
    });
  }

  transfer(
    sender: string,
    recipient: string,
    amount: number,
  ): { balance: number; block: number; tx: string } {
    let senderBalance = this.getBalance(sender);
    let recipientBalance = this.getBalance(recipient);

    if (sender.toLowerCase() === recipient.toLowerCase()) {
      throw new BadRequestException('Sender and recipient must be different!');
    } else if (senderBalance < amount) {
      throw new BadRequestException('Not enough funds!');
    }

    senderBalance -= amount;
    recipientBalance += amount;

    this.setBalance(sender, senderBalance);
    this.setBalance(recipient, recipientBalance);
    const tx = this.setEvent('transfer', sender, { sender, recipient, amount });

    this.commit();

    return {
      balance: senderBalance,
      block: this.blockchainService.latestIndex(),
      tx,
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

      if (transaction.action === 'wallet_update' && transaction.wallet) {
        const walletKey = this.makeWalletKey(transaction.wallet.address);
        data[walletKey] = transaction.wallet.toJSON();

        this.logger.debug(
          `Updating wallet ${transaction.wallet.address} balance to ${transaction.wallet.balance}`,
        );
      } else if (transaction.action === 'event_add' && transaction.event) {
        data['events'].push(transaction.event);

        this.logger.debug(
          `Push transaction #${transaction.event.tx} from ${transaction.event.from}`,
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
