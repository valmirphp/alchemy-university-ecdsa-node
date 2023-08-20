import { Body, Controller, Post } from '@nestjs/common';
import { BalanceService } from '~/balance/balance.service';
import { AuthService } from '~/auth/auth.service';
import { SendDto } from '~/balance/dto/send.dto';

@Controller('send')
export class SendController {
  constructor(
    private readonly balanceService: BalanceService,
    private readonly authService: AuthService,
  ) {}

  @Post('/')
  send(@Body() dto: SendDto) {
    const { sender, recipient, amount } = dto.data;

    const signerAddress = this.authService.validateTransaction(sender, dto);

    return this.balanceService.transfer(
      signerAddress,
      sender,
      recipient,
      amount,
    );
  }
}
