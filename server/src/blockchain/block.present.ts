import { BlockEvent } from '~/blockchain/block.event';
import { Block } from '~/blockchain/block';

export class BlockPresent {
  public data: any;

  constructor(block: Block) {
    Object.assign(this, block);
    this.data = block.index > 0 ? JSON.parse(block.data) : block.data;
  }

  allEvents(): Array<BlockEvent> {
    return this.data.events || [];
  }

  findEvent(id: string): BlockEvent | undefined {
    return this.allEvents().find((event) => event.tx === id);
  }
}
