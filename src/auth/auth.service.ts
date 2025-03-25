import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { randomBytes } from 'crypto';
import * as nodemailer from 'nodemailer';
import { Otp } from './entities/otp.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    return user;
  }

  async verifyToken(refreshToken: string) {
    const verify = this.jwtService.verify(refreshToken);

    if (!verify) {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  generateOtp(): string {
    return randomBytes(3).toString('hex').toUpperCase(); // Sinh OTP 6 ký tự
  }

  async createOtp(otpData: Partial<Otp>): Promise<Otp> {
    const newOtp = this.otpRepository.create(otpData);
    try {
      return await this.otpRepository.save(newOtp);
    } catch (error) {
      throw error;
    }
  }

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'wincha.contact@gmail.com',
        pass: 'Iloveyou@381',
      },
    });

    await transporter.sendMail({
      from: 'wincha.contact@gmail.com',
      to: email,
      subject: 'Verify Your Account',
      text: `Your OTP code is: ${otp}. It expires in 10 minutes.`,
    });
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    const payload = {
      id: user.id,
      email: user.email,
      isVip: user.vip_status,
      name: user.name,
    };
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: process.env.JWT_EXPIRE,
      }),
      refreshToken: this.jwtService.sign(
        {},
        {
          expiresIn: process.env.JWT_REFRESHTOKEN_EXPIRE,
        },
      ),
      user,
    };
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    return password;
  }
}
