import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDoctorDto {
    @IsString()
    @IsNotEmpty()
    specialty: string;
}
