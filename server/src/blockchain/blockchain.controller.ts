import { Controller, Get } from '@nestjs/common';
import { BlockchainService } from '~/blockchain/blockchain.service';
import { BlockPresent } from '~/blockchain/block.present';

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get('/')
  all() {
    return this.blockchainService
      .all()
      .reverse()
      .map((block) => new BlockPresent(block));
  }

  @Get('/last-block')
  lastBlock() {
    const block = this.blockchainService.latestBlock();

    return new BlockPresent(block);
  }
}
