import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({
        example: 'Juan Perez',
        description: 'Nombre completo del usuario',
        required: false
    })
    @IsOptional()
    @IsString()
    @MinLength(3)
    fullName?: string;

    @ApiProperty({
        example: '12345678',
        description: 'DNI o Documento de Identidad',
        required: false
    })
    @IsOptional()
    @IsString()
    dni?: string;

    @ApiProperty({
        example: 'America/Argentina/Buenos_Aires',
        description: 'Zona horaria para los turnos',
        required: false
    })
    @IsOptional()
    @IsString()
    timeZone?: string;
}