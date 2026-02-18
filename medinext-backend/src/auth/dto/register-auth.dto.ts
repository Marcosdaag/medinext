import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterAuthDto {
    @ApiProperty({ example: 'juan.perez@medinext.com' })
    @IsEmail()
    @IsNotEmpty({ message: 'El email no puede estar vacío.' })
    email: string;

    @ApiProperty({ example: 'Juan Perez' })
    @IsString()
    @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
    @MinLength(3, { message: 'El nombre no puede estar vacío.' })
    fullName: string;

    @ApiProperty({ example: 'Secret123', minLength: 6 })
    @IsString()
    @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
    @MinLength(6, { message: 'La debe tener un mínimo de seis carácteres.' })
    @MaxLength(25, { message: 'La debe tener un máximo de veinticinco carácteres.' })
    password: string;
}