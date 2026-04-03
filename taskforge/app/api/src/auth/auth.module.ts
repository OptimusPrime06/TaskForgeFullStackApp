import { Module } from '@nestjs/common';
import { AuthService } from './business.logic/services/auth.service';
import { AuthController } from './presentation/controllers/auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
