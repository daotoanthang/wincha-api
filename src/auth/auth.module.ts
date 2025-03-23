import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Đổi thành biến môi trường trong thực tế
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {
  constructor(private connection: Connection) {
    this.checkJWT();
  }

  async checkJWT() {
    try {
      console.log('JWTSECret', process.env.JWT_SECRET);
    } catch (error) {
      console.error('Kết nối database thất bại:', error.message);
    }
  }
}
