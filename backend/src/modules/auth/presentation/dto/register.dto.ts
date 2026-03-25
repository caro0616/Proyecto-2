import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MaxLength(100)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password!: string;
}
