import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
    @ApiProperty({ description: 'El token secreto enviado al correo' })
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty({ example: 'NuevaClave123' })
    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    newPassword: string;
}