import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  ConflictException,
  Headers,
  Header,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { VerifyOtpDTO } from './dto/verify-otp.dto';
import { RefreshTokenDTO } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('verify-otp')
  async verifyOTP(@Body(ValidationPipe) data: VerifyOtpDTO) {
    const otp = this.authService.generateOtp();
    // await this.authService.sendOtpEmail(email, otp);

    console.log('data', data);
  }

  @Post('/refresh')
  @Header('content-type', 'application/json')
  async refreshToken(
    @Headers() headers: Record<string, string>,
    @Body(ValidationPipe) data: RefreshTokenDTO,
  ) {
    const verify = await this.authService.verifyToken(data.refreshToken);
    console.log('headers', headers.authorization);
    // if (verify) {
    //   return {};
    // }
  }

  @Post('register')
  async registerUser(@Body(ValidationPipe) user: RegisterDTO) {
    const isExistEmail = await this.usersService.findByEmail(user.email);

    if (isExistEmail) {
      throw new ConflictException('Email already exist');
    }
    try {
      user.password = await this.authService.hashPassword(user.password);
      await this.usersService.create(user);
      return { message: 'User registered successfully' };
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('logout')
  logout() {
    return { message: 'Logout successful' }; // JWT sẽ bị vô hiệu khi hết hạn
  }
}
