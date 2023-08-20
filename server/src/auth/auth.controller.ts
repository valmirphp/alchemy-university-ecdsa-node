import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '~/auth/auth.service';
import { AuthNonceDto } from '~/auth/dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('nonce')
  async nonce(@Body() dto: AuthNonceDto) {
    return this.authService.generateNonce(dto.address);
  }
}
