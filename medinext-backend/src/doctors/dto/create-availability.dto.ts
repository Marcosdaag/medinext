import { IsInt, IsString, Min, Max, Matches } from 'class-validator';

export class CreateAvailabilityDto {
    @IsInt()
    @Min(0) // 0 = Domingo
    @Max(6) // 6 = Sábado
    dayOfWeek: number;

    @IsString()
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Formato HH:MM requerido' })
    startTime: string;

    @IsString()
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Formato HH:MM requerido' })
    endTime: string;
}