import { IsOptional, IsArray, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UpdateUserByAdminDto {
    @ApiProperty({
        example: 'Juan Pérez',
        description: 'Nombre completo del usuario',
        required: false
    })
    @IsOptional()
    @IsString()
    fullName?: string;

    @ApiProperty({
        example: ['USER', 'DOCTOR', 'SUPERADMIN'],
        description: 'Roles asignados al usuario',
        required: false,
        enum: Role,
        isArray: true
    })
    @IsOptional()
    @IsArray()
    @IsEnum(Role, { each: true, message: 'Cada rol debe ser válido (ej: USER, DOCTOR, SUPERADMIN)' })
    roles?: Role[];
}