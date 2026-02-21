/* 
    Los testings sirven para sellar un contrato de ingreso/egreso de datos,
    se busca que una funcion especifica reciba y devuelva exactamente la respuesta que esperamos,
    una vez fijado nos va a servir en un futuro ya que al refactorizar, cambiar o agregar cosas en el codigo
    nos muestra en tiempo real si el codigo con los cambios siguen pasando los tests (contratos).
    Se pueden ver los cambios con npm run test:watch
*/

//En resumen para testear generamos un escenario de prueba con cada unos de nuestros actores (imports)

import { UnauthorizedException } from '@nestjs/common'; //Error a probar
import { Test, TestingModule } from '@nestjs/testing'; //Herramientas de nest para test
import { JwtService } from '@nestjs/jwt'; //Servicio complementario
import { MailService } from '../mail/mail.service'; //Servicio complementario
import * as bcrypt from 'bcrypt'; //Libreria externa
import { AuthService } from './auth.service'; //Service a testear

//Jest toma el control de la libreria
jest.mock('bcrypt');

//Crea un objeto "falso" con una funcion sign que mas adelante vamos a definirle un comportamiento
const mockJwtService = {
    sign: jest.fn(),
};

//Otro objeto "falso"
const mockMailService = {
    sendPasswordResetEmail: jest.fn(),
};


//Definimos el titulo de lo que vamos a testear, en este caso 'AuthService'
describe('AuthService', () => {
    //Llama al servicio
    let service: AuthService;

    //Llama a el "falso" jwtservice
    let jwtService: typeof mockJwtService;

    //El beforeEach nos asegura generar un entorno nuevo y limpio antes de cada test
    beforeEach(async () => {
        //Construimos un modulo falso con el nombre del provide y el valor de las copias de mis servicios
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: MailService,
                    useValue: mockMailService,
                },
            ],
        }).compile();

        //Agarramos los servicios ya armados y los guardamos en variables para poder llamarlos mas adelante
        service = module.get<AuthService>(AuthService);
        jwtService = module.get(JwtService);


        (service as any).user = {
            findUnique: jest.fn(),
        } as any;
    });

    //Comprueba que la variable service no sea nula y que la configuracion previa funciona correctamente
    it('debería estar definido', () => {
        expect(service).toBeDefined();
    });



    //---TESTS---

    describe('login', () => {

        //---Escenario positivo---
        it('debería retornar un access_token cuando el login es exitoso', async () => {

            //Variables de prueba
            const loginDto = {
                email: 'doctor@medinext.com',
                password: 'password123'
            };

            const mockUser = {
                id: '12345',
                email: 'doctor@medinext.com',
                hashedPassword: 'un_hash_falso',
                roles: ['DOCTOR'],
                tokenVersion: 0
            };

            const expectedToken = 'un_token_jwt_falso_muy_largo';

            //Le decimos a las funciones que hacer
            ((service as any).user.findUnique as jest.Mock).mockResolvedValue(mockUser); //Cuando la llamemos, que devuelva el MockUp de User
            jwtService.sign.mockReturnValue(expectedToken); //Cuando la llamemos devuelva el token
            (bcrypt.compare as jest.Mock).mockResolvedValue(true); //Cuando la llamemos compare el token y deuvleva true

            //Guardamos al resultado de intentar hacer un login en la variable result
            const result = await service.login(loginDto as any);

            //Resultados esperados
            expect(result).toEqual({ access_token: expectedToken, });

            expect((service as any).user.findUnique).toHaveBeenCalledWith({
                where: { email: loginDto.email }
            });

        });

        //---Escenario negativo---
        it('debería lanzar UnauthorizedException si el usuario no existe', async () => {
            //Creamos un email inventado
            const loginDto = {
                email: 'fantasma@medinext.com',
                password: '123'
            };

            //Le decimos que el valor del email enviado es null
            ((service as any).user.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(service.login(loginDto as any)).rejects.toThrow(UnauthorizedException);
        });
    });

});