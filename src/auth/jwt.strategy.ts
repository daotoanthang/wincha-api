import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'my_secret_key', // Đổi thành biến môi trường trong thực tế
    });
  }

  async validate(payload: any) {
    return { id: payload.id, email: payload.email, isVip: payload.isVip };
  }
}
