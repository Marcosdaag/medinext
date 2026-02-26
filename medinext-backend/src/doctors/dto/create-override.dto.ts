import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // <--- No te olvides de este import

export class CreateOverrideDto {
    @ApiProperty({
        example: '2024-12-20',
        description: 'Fecha de inicio del bloqueo de agenda (Formato YYYY-MM-DD)'
    })
    @IsDateString({}, {
        message: 'La fecha de INICIO es inválida. Debe cumplir con el formato ISO 8601. Ejemplo recomendado: "2023-12-20" o "2023-12-20T09:00:00Z".'
    })
    startDate: string;

    @ApiProperty({
        example: '2024-12-31',
        description: 'Fecha de fin del bloqueo de agenda (Formato YYYY-MM-DD)'
    })
    @IsDateString({}, {
        message: 'La fecha de FIN es inválida. Debe cumplir con el formato ISO 8601. Ejemplo recomendado: "2023-12-31".'
    })
    endDate: string;

    @ApiProperty({
        example: 'Vacaciones de verano',
        description: 'Motivo o razón de la ausencia (Opcional)',
        required: false // <--- Esto le avisa a Swagger que no es obligatorio
    })
    @IsOptional()
    @IsString({ message: 'El motivo o razón debe ser una cadena de texto válida.' })
    reason?: string;
}