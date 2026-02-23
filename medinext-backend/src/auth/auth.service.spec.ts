/* Los testings sirven para sellar un contrato de ingreso/egreso de datos,
    se busca que una funcion especifica reciba y devuelva exactamente la respuesta que esperamos,
    una vez fijado nos va a servir en un futuro ya que al refactorizar, cambiar o agregar cosas en el codigo
    nos muestra en tiempo real si el codigo con los cambios siguen pasando los tests (contratos).
    Se pueden ver los cambios con npm run test:watch
*/

//En resumen para testear generamos un escenario de prueba con cada unos de nuestros actores (imports)

import { UnauthorizedException, BadRequestException } from '@nestjs/common'; //Error a probar
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

    //Llama al "falso" mailService para poder testear los correos
    let mailService: typeof mockMailService;

    //El beforeEach nos asegura generar un entorno nuevo y limpio antes de cada test
    beforeEach(async () => {
        // Limpiamos los contadores de los mocks por las dudas
        jest.clearAllMocks();

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
        mailService = module.get(MailService); // Agarramos el mail falso

        //Le enseñamos al prisma falso todos los metodos que va a necesitar
        (service as any).user = {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        } as any;
    });

    //Comprueba que la variable service no sea nula y que la configuracion previa funciona correctamente
    it('debería estar definido', () => {
        expect(service).toBeDefined();
    });

    //---TESTS---

    //---TEST DE LOGIN---
    describe('login', () => {

        //---Escenario positivo---
        it('debería retornar un access_token cuando el login es exitoso', async () => {
            // 1. ARRANGE
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

            // 2. ACT
            //Guardamos al resultado de intentar hacer un login en la variable result
            const result = await service.login(loginDto as any);

            // 3. ASSERT
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

    //---TEST DE REGISTER---
    describe('register', () => {
        it('debería encriptar la contraseña y crear un usuario nuevo', async () => {
            // 1. ARRANGE
            const registerDto = { email: 'nuevo@medinext.com', password: '123', fullName: 'Juan Perez' };
            const hashedPassword = 'hash_generado_falso';
            const mockCreatedUser = { id: '1', email: registerDto.email };

            // Le decimos a bcrypt que devuelva nuestro hash falso
            (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
            // Le decimos a Prisma qué devolver al crear el usuario
            ((service as any).user.create as jest.Mock).mockResolvedValue(mockCreatedUser);

            // 2. ACT
            const result = await service.register(registerDto as any);

            // 3. ASSERT
            expect(result.message).toEqual('Usuario registrado exitosamente.');
            expect(result.user).toEqual(mockCreatedUser);

            // Verificamos que se haya encriptado
            expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);

            // Verificamos que se haya guardado con la contraseña encriptada (Contrato de seguridad)
            expect((service as any).user.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    email: registerDto.email,
                    hashedPassword: hashedPassword
                })
            });
        });
    });

    //---TEST DE FORGOT PASSWORD---
    describe('forgotPassword', () => {
        it('debería generar token y enviar correo si el usuario existe', async () => {
            // 1. ARRANGE
            const dto = { email: 'doctor@medinext.com' };
            const mockUser = { id: '1', email: 'doctor@medinext.com' };

            ((service as any).user.findUnique as jest.Mock).mockResolvedValue(mockUser);
            ((service as any).user.update as jest.Mock).mockResolvedValue(mockUser);

            // 2. ACT
            const result = await service.forgotPassword(dto);

            // 3. ASSERT
            expect(result.message).toContain('Si el correo está registrado');
            expect((service as any).user.update).toHaveBeenCalled(); // Verifica que se guardó el token
            expect(mailService.sendPasswordResetEmail).toHaveBeenCalled(); // Verifica que salió el mail
        });

        it('debería devolver el mismo mensaje sin enviar correo si el usuario no existe', async () => {
            // 1. ARRANGE
            const dto = { email: 'no_existo@medinext.com' };
            ((service as any).user.findUnique as jest.Mock).mockResolvedValue(null);

            // 2. ACT
            const result = await service.forgotPassword(dto);

            // 3. ASSERT
            expect(result.message).toContain('Si el correo está registrado');
            expect((service as any).user.update).not.toHaveBeenCalled(); // No debe guardar nada
            expect(mailService.sendPasswordResetEmail).not.toHaveBeenCalled(); // No debe mandar mail
        });
    });

    //---TEST DE RESET PASSWORD---
    describe('resetPassword', () => {
        it('debería actualizar la contraseña si el token es válido', async () => {
            // 1. ARRANGE
            const dto = { token: 'token_valido', newPassword: 'newPassword123' };
            const mockUser = { id: '1' };
            const newHash = 'nuevo_hash_seguro';

            ((service as any).user.findFirst as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.hash as jest.Mock).mockResolvedValue(newHash);

            // 2. ACT
            const result = await service.resetPassword(dto);

            // 3. ASSERT
            expect(result.message).toContain('Contraseña actualizada correctamente');
            expect(bcrypt.hash).toHaveBeenCalledWith(dto.newPassword, 10);
            expect((service as any).user.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { id: mockUser.id },
                    data: expect.objectContaining({
                        hashedPassword: newHash,
                        resetPasswordToken: null // Contrato: el token debe limpiarse
                    })
                })
            );
        });

        it('debería lanzar BadRequestException si el token es inválido o expiró', async () => {
            // 1. ARRANGE
            const dto = { token: 'token_vencido', newPassword: '123' };
            ((service as any).user.findFirst as jest.Mock).mockResolvedValue(null); // No lo encuentra

            // 2/3. ACT & ASSERT
            await expect(service.resetPassword(dto)).rejects.toThrow(BadRequestException);
        });
    });
});