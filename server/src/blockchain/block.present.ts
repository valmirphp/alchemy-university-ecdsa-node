import { Block } from '~/blockchain/block';

export class BlockPresent {
  public data: any;

  constructor(block: Block) {
    Object.assign(this, block);
    this.data = block.index > 0 ? JSON.parse(block.data) : block.data;
  }
}
