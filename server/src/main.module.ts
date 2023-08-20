import { Module } from '@nestjs/common';
import { BlockchainModule } from '~/blockchain/blockchain.module';
import { BalanceModule } from '~/balance/balance.module';
import { MainController } from '~/main.controller';
import { AuthModule } from '~/auth/auth.module';

@Module({
  imports: [BlockchainModule, BalanceModule, AuthModule],
  controllers: [MainController],
})
export class MainModule {}
