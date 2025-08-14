import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { AuthGuard } from './guards/auth.guard';
import { JwtProviderModule } from 'src/jwt-provider/jwt-provider.module';

@Module({
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  imports: [JwtProviderModule, forwardRef(() => UserModule)],
  exports: [AuthService, AuthGuard, JwtProviderModule],
})
export class AuthModule {}
