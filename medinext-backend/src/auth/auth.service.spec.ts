import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

const mockJwtService = {
    sign: jest.fn(),
};

const mockMailService = {
    sendPasswordResetEmail: jest.fn(),
};

const mockPrismaService = {
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
    },
};

describe('AuthService', () => {
    let service: AuthService;
    let prismaService: typeof mockPrismaService;
    let jwtService: typeof mockJwtService;
    let mailService: typeof mockMailService;

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
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
        prismaService = module.get(PrismaService);
        jwtService = module.get(JwtService);
        mailService = module.get(MailService);
    });

    it('debería estar definido', () => {
        expect(service).toBeDefined();
    });

    describe('login', () => {
        it('debería retornar un access_token cuando el login es exitoso', async () => {
            const loginDto = {
                email: 'doctor@medinext.com',
                password: 'password123',
            };

            const mockUser = {
                id: '12345',
                email: 'doctor@medinext.com',
                hashedPassword: 'un_hash_falso',
                roles: ['DOCTOR'],
                tokenVersion: 0,
            };

            const expectedToken = 'un_token_jwt_falso_muy_largo';

            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            mockJwtService.sign.mockReturnValue(expectedToken);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const result = await service.login(loginDto);

            expect(result).toEqual({ access_token: expectedToken });
            expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
                where: { email: loginDto.email },
            });
        });

        it('debería lanzar UnauthorizedException si el usuario no existe', async () => {
            const loginDto = {
                email: 'fantasma@medinext.com',
                password: '123',
            };

            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('register', () => {
        it('debería encriptar la contraseña y crear un usuario nuevo', async () => {
            const registerDto = {
                email: 'nuevo@medinext.com',
                password: '123',
                fullName: 'Juan Perez',
            };
            const hashedPassword = 'hash_generado_falso';
            const mockCreatedUser = { id: '1', email: registerDto.email };

            (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
            mockPrismaService.user.create.mockResolvedValue(mockCreatedUser);

            const result = await service.register(registerDto);

            expect(result.message).toEqual('Usuario registrado exitosamente.');
            expect(result.user).toEqual(mockCreatedUser);
            expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
            expect(mockPrismaService.user.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    email: registerDto.email,
                    hashedPassword: hashedPassword,
                }),
            });
        });
    });

    describe('forgotPassword', () => {
        it('debería generar token y enviar correo si el usuario existe', async () => {
            const dto = { email: 'doctor@medinext.com' };
            const mockUser = { id: '1', email: 'doctor@medinext.com' };

            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            mockPrismaService.user.update.mockResolvedValue(mockUser);

            const result = await service.forgotPassword(dto);

            expect(result.message).toContain('Si el correo está registrado');
            expect(mockPrismaService.user.update).toHaveBeenCalled();
            expect(mailService.sendPasswordResetEmail).toHaveBeenCalled();
        });

        it('debería devolver el mismo mensaje sin enviar correo si el usuario no existe', async () => {
            const dto = { email: 'no_existo@medinext.com' };
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            const result = await service.forgotPassword(dto);

            expect(result.message).toContain('Si el correo está registrado');
            expect(mockPrismaService.user.update).not.toHaveBeenCalled();
            expect(mailService.sendPasswordResetEmail).not.toHaveBeenCalled();
        });
    });

    describe('resetPassword', () => {
        it('debería actualizar la contraseña si el token es válido', async () => {
            const dto = { token: 'token_valido', newPassword: 'newPassword123' };
            const mockUser = { id: '1' };
            const newHash = 'nuevo_hash_seguro';

            mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
            (bcrypt.hash as jest.Mock).mockResolvedValue(newHash);
            mockPrismaService.user.update.mockResolvedValue({});

            const result = await service.resetPassword(dto);

            expect(result.message).toContain('Contraseña actualizada correctamente');
            expect(bcrypt.hash).toHaveBeenCalledWith(dto.newPassword, 10);
            expect(mockPrismaService.user.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { id: mockUser.id },
                    data: expect.objectContaining({
                        hashedPassword: newHash,
                        resetPasswordToken: null,
                    }),
                }),
            );
        });

        it('debería lanzar BadRequestException si el token es inválido o expiró', async () => {
            const dto = { token: 'token_vencido', newPassword: '123' };
            mockPrismaService.user.findFirst.mockResolvedValue(null);

            await expect(service.resetPassword(dto)).rejects.toThrow(BadRequestException);
        });
    });
});