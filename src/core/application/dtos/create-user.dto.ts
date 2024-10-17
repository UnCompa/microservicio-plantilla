//Dto para la creacion
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class CreateUserDto {
  @IsString()
  name: string;
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
}
