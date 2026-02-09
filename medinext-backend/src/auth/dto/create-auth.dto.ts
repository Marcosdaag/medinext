// De la libreria (paquete) class-validator importo las herramientas cuales puedo utilizar como decoradores en los campos
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateAuthDto {

    // Modelo para crear un usuario

    /* 
        Agrego decoradores para verificar el campo y en caso de no cumplir
        con los distintos parametros envio un mensaje
    */

    @IsString({ message: 'El nombre debe ser un texto' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    fullName: string;

    @IsEmail({}, { message: 'El email no es valido' })
    @IsNotEmpty({ message: 'El email es obligatorio' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos seis caracteres' })
    password: string;

    @IsString()
    @IsNotEmpty({ message: 'El DNI es obligatorio' })
    dni: string;
}
