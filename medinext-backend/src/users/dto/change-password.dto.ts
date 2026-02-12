import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'Password123!', description: 'Contraseña actual del usuario' })
  @IsString()
  @MinLength(6)
  oldPassword: string;

  @ApiProperty({ example: 'NuevaSegura456!', description: 'Nueva contraseña deseada' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}