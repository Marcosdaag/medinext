import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginAuthDto {
    @ApiProperty({ example: 'juan.perez@medinext.com' })
    @IsEmail()
    @IsNotEmpty({ message: 'El email no puede estar vacío.' })
    email: string;

    @ApiProperty({ example: 'Secret123' })
    @IsString()
    @IsNotEmpty({ message: 'La contrraseña no puede estar vacía.' })
    @MinLength(6, { message: 'La contraseña debe tener al menos seis carácteres.' })
    password: string;
}