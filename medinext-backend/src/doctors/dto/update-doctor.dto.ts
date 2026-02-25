import { PartialType } from '@nestjs/swagger';
import { IsInt, IsNumber, Min, Max } from 'class-validator';
import { CreateDoctorDto } from './create-doctor.dto';

export class UpdateDoctorDto extends PartialType(CreateDoctorDto) {
    @IsNumber()
    @Min(0)
    visitPrice: number;

    @IsInt()
    @Min(10)
    @Max(120)
    visitDuration: number;
}
