import { Module } from '@nestjs/common';
import { BlockchainModule } from '~/blockchain/blockchain.module';
import { BalanceService } from '~/balance/balance.service';
import { BalanceController } from '~/balance/balance.controller';

@Module({
  imports: [BlockchainModule],
  providers: [BalanceService],
  exports: [BalanceService],
  controllers: [BalanceController],
})
export class BalanceModule {}
