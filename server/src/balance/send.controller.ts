import { Body, Controller, Post } from '@nestjs/common';
import { BalanceService } from '~/balance/balance.service';
import { SendDto } from '~/balance/dto/send.dto';

@Controller('send')
export class SendController {
  constructor(private readonly balanceService: BalanceService) {}

  @Post('/')
  send(@Body() { sender, recipient, amount }: SendDto) {
    return this.balanceService.transfer(sender, recipient, amount);
  }
}
