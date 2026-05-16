import { IsString, Length, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(5, 10)
  @Matches(/^[a-zA-Z]+$/, {
    message: 'Username must contain only Latin letters',
  })
  username: string;

  @IsString()
  @Length(6, 10)
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Password must contain only Latin letters and digits',
  })
  password: string;
}
