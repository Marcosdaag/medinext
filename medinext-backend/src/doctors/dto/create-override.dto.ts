import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateOverrideDto {
    @IsDateString()
    startDate: string; // ISO Date (YYYY-MM-DD)

    @IsDateString()
    endDate: string;

    @IsOptional()
    @IsString()
    reason?: string;
}