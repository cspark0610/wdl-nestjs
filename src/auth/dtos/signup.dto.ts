import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRoles } from 'src/users/schemas/user.schema';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(UserRoles, { message: 'please enter USER or ADMIN' })
  role: string;
}
