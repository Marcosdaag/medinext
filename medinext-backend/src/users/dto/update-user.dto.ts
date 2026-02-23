import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({
        example: 'Juan Perez',
        description: 'Nombre completo del usuario.',
        required: false
    })
    @IsOptional()
    @IsString()
    @MinLength(3, { message: 'El nombre debe tener al menos tres carácteres.' })
    fullName?: string;

    @ApiProperty({
        example: '12345678',
        description: 'DNI o Documento de Identidad.',
        required: false
    })
    @IsOptional()
    @IsString()
    dni?: string;

    @ApiProperty({
        example: 'America/Argentina/Buenos_Aires',
        description: 'Zona horaria para los turnos.',
        required: false
    })
    @IsOptional()
    @IsString()
    timeZone?: string;

    @ApiProperty({
        example: '+5491123456789',
        description: 'Número de teléfono de contacto (con código de país)',
        required: false
    })
    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @ApiProperty({
        example: '1990-05-15',
        description: 'Fecha de nacimiento en formato ISO 8601',
        required: false
    })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de nacimiento debe tener un formato válido (ej: 1990-05-15).' })
    birthDate?: string;
}