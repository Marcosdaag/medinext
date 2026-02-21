import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { AuthService } from './auth.service';

jest.mock('bcrypt');

const mockJwtService = {
    sign: jest.fn(),
};

const mockMailService = {
    sendPasswordResetEmail: jest.fn(),
};

describe('AuthService', () => {
    let service: AuthService;
    let jwtService: typeof mockJwtService;

    beforeEach(async () => {
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

        service = module.get<AuthService>(AuthService);
        jwtService = module.get(JwtService);

        // EL SECRETO: Interceptamos la llamada directa a Prisma dentro del servicio
        (service as any).user = {
            findUnique: jest.fn(),
        } as any;
    });

    it('debería estar definido', () => {
        expect(service).toBeDefined();
    });

    // ==========================================
    // BLOQUE DE TEST: MÉTODO LOGIN
    // ==========================================
    describe('login', () => {

        // --- TEST 1: EL CAMINO FELIZ (ÉXITO) ---
        it('debería retornar un access_token cuando el login es exitoso', async () => {
            // 1. ARRANGE
            const loginDto = {
                email: 'doctor@medinext.com',
                password: 'password123'
            };

            const mockUser = {
                id: '12345',
                email: 'doctor@medinext.com',
                hashedPassword: 'un_hash_falso',
                roles: ['DOCTOR'],
                tokenVersion: 0 // <-- ¡Agregado gracias a tu captura!
            };

            const expectedToken = 'un_token_jwt_falso_muy_largo';

            // Le decimos al Prisma falso cómo responder (casteando a any para engañar a TypeScript)
            ((service as any).user.findUnique as jest.Mock).mockResolvedValue(mockUser);

            jwtService.sign.mockReturnValue(expectedToken);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            // 2. ACT
            const result = await service.login(loginDto as any);

            // 3. ASSERT
            expect(result).toEqual({
                access_token: expectedToken,
            });

            // Verificamos que buscó usando la sintaxis exacta de tu código
            expect((service as any).user.findUnique).toHaveBeenCalledWith({
                where: { email: loginDto.email }
            });
        });

        // --- TEST 2: EL CAMINO TRISTE (ERROR) ---
        it('debería lanzar UnauthorizedException si el usuario no existe', async () => {
            // 1. ARRANGE: Le mandamos un mail inventado
            const loginDto = {
                email: 'fantasma@medinext.com',
                password: '123'
            };

            // Le decimos a Prisma: "Buscá, pero devolvé null porque el mail no existe"
            ((service as any).user.findUnique as jest.Mock).mockResolvedValue(null);

            // 2 & 3. ACT & ASSERT juntos: 
            // Esperamos que, al intentar loguearse, explote con el error 401
            await expect(service.login(loginDto as any)).rejects.toThrow(UnauthorizedException);
        });
    });
});