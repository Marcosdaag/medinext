import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty({ description: 'El token secreto enviado al correo' })
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty({ example: 'NuevaClave123' })
    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
    newPassword: string;
}