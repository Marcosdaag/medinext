import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
    @ApiProperty({ example: 'juan@gmail.com' })
    @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
    @IsNotEmpty()
    email: string;
}