import { Module } from '@nestjs/common';
import { BlockchainModule } from '~/blockchain/blockchain.module';
import { BalanceService } from '~/balance/balance.service';
import { BalanceController } from '~/balance/balance.controller';
import { SendController } from '~/balance/send.controller';

@Module({
  imports: [BlockchainModule],
  providers: [BalanceService],
  exports: [BalanceService],
  controllers: [BalanceController, SendController],
})
export class BalanceModule {}
