import { Injectable } from '@nestjs/common';
import { Blockchain } from '~/blockchain/blockchain';
import { Block } from '~/blockchain/block';

@Injectable()
export class BlockchainService {
  private readonly blockchain: Blockchain;

  constructor() {
    this.blockchain = new Blockchain();
    this.mine({ startedAt: Date.now() });
  }

  get(index: number): Block {
    return this.blockchain.get()[index];
  }

  all(): Array<Block> {
    return this.blockchain.get();
  }

  latestIndex(): number {
    return this.blockchain.latestBlock.index;
  }

  latestBlock(): Block {
    return this.blockchain.latestBlock;
  }

  lastData(): Record<string, any> {
    return JSON.parse(this.latestBlock().data);
  }

  mine(data: Record<string, any>) {
    this.blockchain.mine(JSON.stringify(data));
  }
}
