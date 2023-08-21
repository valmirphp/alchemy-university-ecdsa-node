import { Module } from '@nestjs/common';
import { AuthController } from '~/auth/auth.controller';
import { AuthService } from '~/auth/auth.service';

@Module({
  providers: [AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
