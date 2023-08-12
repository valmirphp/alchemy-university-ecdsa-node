import * as crypto from 'crypto';
import { Block } from '~/blockchain/block';

export class Blockchain {
  private readonly difficulty: number;
  private blockchain: Array<Block>;

  constructor() {
    this.difficulty = 3;
    this.blockchain = [Block.genesis];
  }

  get(): Array<Block> {
    // return copy of blockchain
    return this.blockchain.slice();
  }

  get latestBlock(): Block {
    return this.blockchain[this.blockchain.length - 1];
  }

  isValidHashDifficulty(hash: string): boolean {
    let i;

    for (i = 0; i < hash.length; i++) {
      if (hash[i] !== '0') {
        break;
      }
    }

    return i >= this.difficulty;
  }

  calculateHashForBlock(block: Block): string {
    const { index, previousHash, timestamp, data, nonce } = block;
    return this.calculateHash(index, previousHash, timestamp, data, nonce);
  }

  calculateHash(
    index: number,
    previousHash: string,
    timestamp: number,
    data: string,
    nonce: number,
  ): string {
    return crypto
      .createHash('sha256')
      .update(index + previousHash + timestamp + data + nonce)
      .digest('hex');
  }

  mine(data: string): void {
    const newBlock = this.generateNextBlock(data);
    try {
      this.addBlock(newBlock);
    } catch (err) {
      throw err;
    }
  }

  generateNextBlock(data: string): Block {
    const nextIndex = this.latestBlock.index + 1;
    const previousHash = this.latestBlock.hash;
    let timestamp = new Date().getTime();
    let nonce = 0;
    let nextHash = this.calculateHash(
      nextIndex,
      previousHash,
      timestamp,
      data,
      nonce,
    );

    while (!this.isValidHashDifficulty(nextHash)) {
      nonce = nonce + 1;
      timestamp = new Date().getTime();
      nextHash = this.calculateHash(
        nextIndex,
        previousHash,
        timestamp,
        data,
        nonce,
      );
    }

    const nextBlock = new Block(
      nextIndex,
      previousHash,
      timestamp,
      data,
      nextHash,
      nonce,
    );

    return nextBlock;
  }

  addBlock(newBlock: Block): void {
    if (this.isValidNextBlock(newBlock, this.latestBlock)) {
      this.blockchain.push(newBlock);
    } else {
      throw 'Error: Invalid block';
    }
  }

  isValidNextBlock(nextBlock: Block, previousBlock: Block): boolean {
    const nextBlockHash = this.calculateHashForBlock(nextBlock);

    if (previousBlock.index + 1 !== nextBlock.index) {
      return false;
    } else if (previousBlock.hash !== nextBlock.previousHash) {
      return false;
    } else if (nextBlockHash !== nextBlock.hash) {
      return false;
    } else if (!this.isValidHashDifficulty(nextBlockHash)) {
      return false;
    } else {
      return true;
    }
  }

  isValidChain(chain: Array<Block>): boolean {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis)) {
      return false;
    }

    const tempChain = [chain[0]];
    for (let i = 1; i < chain.length; i = i + 1) {
      if (this.isValidNextBlock(chain[i], tempChain[i - 1])) {
        tempChain.push(chain[i]);
      } else {
        return false;
      }
    }

    return true;
  }

  isChainLonger(chain: Array<Block>): boolean {
    return chain.length > this.blockchain.length;
  }

  replaceChain(newChain: Array<Block>) {
    if (this.isValidChain(newChain) && this.isChainLonger(newChain)) {
      this.blockchain = JSON.parse(JSON.stringify(newChain));
    } else {
      throw 'Error: invalid chain';
    }
  }
}
