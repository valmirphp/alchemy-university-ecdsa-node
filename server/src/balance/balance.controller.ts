import { Controller, Get, Param } from '@nestjs/common';
import { BalanceService } from '~/balance/balance.service';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get('/')
  allWallets() {
    return this.balanceService.all();
  }

  @Get('/:address')
  getBalance(@Param('address') address) {
    const balance = this.balanceService.getBalance(address);

    return {
      balance,
    };
  }

  @Get('/:address/faucet')
  faucet(@Param('address') address) {
    const balance = this.balanceService.getBalance(address) + 1;
    this.balanceService.setBalance(address, balance);
    this.balanceService.commit();

    return {
      balance,
    };
  }
}
