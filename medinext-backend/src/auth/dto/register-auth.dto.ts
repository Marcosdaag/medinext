import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterAuthDto {
    @ApiProperty({ example: 'juan.perez@medinext.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'Juan Perez' })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    fullName: string;

    @ApiProperty({ example: 'Secret123', minLength: 6 })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(25)
    password: string;
}