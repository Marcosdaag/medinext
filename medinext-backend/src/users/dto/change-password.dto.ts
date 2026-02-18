import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'Password123', description: 'Contraseña actual del usuario.' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos seis carácteres.' })
  oldPassword: string;

  @ApiProperty({ example: 'NuevaPassword', description: 'Nueva contraseña deseada.' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos seis carácteres.' })
  newPassword: string;
}