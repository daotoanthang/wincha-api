import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyOtpDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  code: string;
}
