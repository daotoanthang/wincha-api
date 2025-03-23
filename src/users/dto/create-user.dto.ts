import {
  IsString,
  IsEmail,
  MinLength,
  IsBoolean,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsOptional()
  @IsBoolean()
  vip_status?: boolean;

  @IsString()
  role: 'admin' | 'user';

  @IsOptional()
  @IsDateString()
  vip_expiry?: Date;
}
