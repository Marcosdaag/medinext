import { IsInt, IsString, Min, Max, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // <--- Importante

export class CreateAvailabilityDto {
    @ApiProperty({
        example: 1,
        description: 'Día de la semana: 0=Domingo, 1=Lunes, 2=Martes, ..., 6=Sábado'
    })
    @IsInt({ message: 'El día de la semana debe ser un número entero.' })
    @Min(0, { message: 'Mínimo 0 (Domingo).' })
    @Max(6, { message: 'Máximo 6 (Sábado).' })
    dayOfWeek: number;

    @ApiProperty({
        example: '09:00',
        description: 'Hora de inicio en formato 24hs (HH:MM)'
    })
    @IsString()
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Formato inválido. Usá HH:MM (Ej: 09:00)'
    })
    startTime: string;

    @ApiProperty({
        example: '17:00',
        description: 'Hora de fin en formato 24hs (HH:MM)'
    })
    @IsString()
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Formato inválido. Usá HH:MM (Ej: 17:00)'
    })
    endTime: string;
}