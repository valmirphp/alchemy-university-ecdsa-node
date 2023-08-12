import { Module } from '@nestjs/common';
import { BlockchainService } from '~/blockchain/blockchain.service';
import { BlockchainController } from '~/blockchain/blockchain.controller';

@Module({
  providers: [BlockchainService],
  exports: [BlockchainService],
  controllers: [BlockchainController],
})
export class BlockchainModule {}
