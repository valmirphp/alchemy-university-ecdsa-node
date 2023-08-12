import { Module } from '@nestjs/common';
import { BlockchainModule } from '~/blockchain/blockchain.module';
import { BalanceModule } from '~/balance/balance.module';
import { MainController } from '~/main.controller';

@Module({
  imports: [BlockchainModule, BalanceModule],
  controllers: [MainController],
})
export class MainModule {}
