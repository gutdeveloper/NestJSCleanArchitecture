import { AuthUseCase } from 'src/application/useCases/auth/AuthUseCase';
import { User } from 'src/domain/entities/User.entity';
import { Role } from 'src/domain/enums/role.enum';
import { ForbiddenError } from 'src/domain/errors/ForbiddenError';
import { NotFoundError } from 'src/domain/errors/NotFoundError';
import { UnauthorizedError } from 'src/domain/errors/UnauthorizedError';
import { ConflictError } from 'src/domain/errors/ConflictError';
import { UserRepository } from 'src/domain/repositories/UserRepository';
import { HashService } from 'src/domain/services/HashService';
import { TokenService } from 'src/domain/services/TokenService';
import { EmailService } from 'src/domain/services/EmailService';
import { IUser, FindUserById } from 'src/domain/interfaces/user.interface';

describe('AuthUseCase', () => {
    let authUseCase: AuthUseCase;
    let mockUserRepository: jest.Mocked<UserRepository>;
    let mockPasswordHash: jest.Mocked<HashService>;
    let mockTokenService: jest.Mocked<TokenService>;
    let mockEmailService: jest.Mocked<EmailService>;

    const mockUser: IUser = {
        id: '1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'hashedPassword123',
        email_verified: true,
        active: true,
        role: Role.USER
    };

    beforeEach(() => {
        mockUserRepository = {
            findByEmail: jest.fn(),
            register: jest.fn(),
            findById: jest.fn()
        };

        mockPasswordHash = {
            compare: jest.fn(),
            hash: jest.fn()
        };

        mockTokenService = {
            generate: jest.fn(),
            verify: jest.fn()
        };

        mockEmailService = {
            sendEmailActivation: jest.fn()
        };

        authUseCase = new AuthUseCase(
            mockUserRepository,
            mockPasswordHash,
            mockTokenService,
            mockEmailService
        );
    });

    describe('loginUser', () => {
        it('should successfully login and return access token', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            mockPasswordHash.compare.mockResolvedValue(true);
            mockTokenService.generate.mockReturnValue('mockToken');

            const result = await authUseCase.loginUser('john@example.com', 'password123');

            expect(result).toBe('mockToken');
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
            expect(mockPasswordHash.compare).toHaveBeenCalledWith('password123', mockUser.password);
            expect(mockTokenService.generate).toHaveBeenCalledWith({ id: mockUser.id, role: mockUser.role });
        });

        it('should throw NotFoundError when user does not exist', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);

            await expect(authUseCase.loginUser('nonexistent@example.com', 'password123'))
                .rejects
                .toThrow(NotFoundError);
        });

        it('should throw ForbiddenError when email is not verified', async () => {
            mockUserRepository.findByEmail.mockResolvedValue({ ...mockUser, email_verified: false });

            await expect(authUseCase.loginUser('john@example.com', 'password123'))
                .rejects
                .toThrow(ForbiddenError);
        });

        it('should throw UnauthorizedError when password is invalid', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            mockPasswordHash.compare.mockResolvedValue(false);

            await expect(authUseCase.loginUser('john@example.com', 'wrongpassword'))
                .rejects
                .toThrow(UnauthorizedError);
        });

        it('should throw ForbiddenError when user is not active', async () => {
            mockUserRepository.findByEmail.mockResolvedValue({ ...mockUser, active: false });

            await expect(authUseCase.loginUser('john@example.com', 'password123'))
                .rejects
                .toThrow(NotFoundError);
        });
    });

    describe('registerUser', () => {
        const registerPayload = {
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            password: 'password123'
        };

        it('should successfully register a new user', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockPasswordHash.hash.mockResolvedValue('hashedPassword123');
            mockUserRepository.register.mockResolvedValue({
                email: mockUser.email,
                first_name: mockUser.first_name,
                last_name: mockUser.last_name
            });

            const result = await authUseCase.registerUser(registerPayload);

            expect(result).toEqual({ email: mockUser.email });
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(registerPayload.email);
            expect(mockPasswordHash.hash).toHaveBeenCalledWith(registerPayload.password);
            expect(mockUserRepository.register).toHaveBeenCalled();
            expect(mockEmailService.sendEmailActivation).toHaveBeenCalledWith(
                mockUser.email,
                mockUser.first_name
            );
        });

        it('should throw ConflictError when user already exists', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);

            await expect(authUseCase.registerUser(registerPayload))
                .rejects
                .toThrow(ConflictError);
        });
    });

    describe('userProfile', () => {
        it('should return user profile when user exists', async () => {
            const userProfile: FindUserById = {
                id: mockUser.id,
                first_name: mockUser.first_name,
                last_name: mockUser.last_name,
                email: mockUser.email,
                email_verified: mockUser.email_verified,
                active: mockUser.active
            };
            
            mockUserRepository.findById.mockResolvedValue(userProfile);

            const result = await authUseCase.userProfile('1');

            expect(result).toEqual(userProfile);
            expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
        });

        it('should throw NotFoundError when user does not exist', async () => {
            mockUserRepository.findById.mockResolvedValue(null);

            await expect(authUseCase.userProfile('nonexistent'))
                .rejects
                .toThrow(NotFoundError);
        });
    });
}); 