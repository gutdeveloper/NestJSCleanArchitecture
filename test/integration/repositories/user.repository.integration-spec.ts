import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/infrastructure/services/prisma.service';
import { PrismaUserRepository } from '../../../src/infrastructure/repositories/user.repository';
import { User } from '../../../src/domain/entities/User.entity';
import { Role } from '../../../src/domain/enums/role.enum';

describe('PrismaUserRepository Integration Tests', () => {
    let repository: PrismaUserRepository;
    let prismaService: PrismaService;
    let testUser: User;
    let testEmail: string;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PrismaService,
                PrismaUserRepository,
            ],
        }).compile();

        repository = module.get<PrismaUserRepository>(PrismaUserRepository);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    beforeEach(async () => {
        // Generate a unique email for each test
        testEmail = `test${Date.now()}@example.com`;
        
        // Create a new test user with unique email
        testUser = new User({
            first_name: 'Test',
            last_name: 'User',
            email: testEmail,
            password: 'password123',
            role: Role.USER,
        });

        // Clean up the database before each test
        await prismaService.user.deleteMany();
    });

    afterAll(async () => {
        await prismaService.$disconnect();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            const result = await repository.register(testUser);
            
            expect(result).toBeDefined();
            expect(result.email).toBe(testUser.getEmail());
            expect(result.first_name).toBe(testUser.first_name);
            expect(result.last_name).toBe(testUser.last_name);
        });

        it('should throw error when registering with duplicate email', async () => {
            // First register the user
            await repository.register(testUser);         
            // Try to register the same user again
            await expect(repository.register(testUser)).rejects.toThrow('Error registering user');
        });
    });

    describe('findByEmail', () => {
        it('should find user by email', async () => {
            // First register the user
            await repository.register(testUser);
            
            const user = await repository.findByEmail(testUser.getEmail());
            
            expect(user).toBeDefined();
            expect(user?.email).toBe(testUser.getEmail());
            expect(user?.first_name).toBe(testUser.first_name);
            expect(user?.last_name).toBe(testUser.last_name);
        });

        it('should return null when email not found', async () => {
            const user = await repository.findByEmail('nonexistent@example.com');
            expect(user).toBeNull();
        });
    });

    describe('findById', () => {
        it('should find user by id', async () => {
            // First register the user
            await repository.register(testUser);
            const userByEmail = await repository.findByEmail(testUser.getEmail());
            const userById = await repository.findById(userByEmail!.id);
            
            expect(userById).toBeDefined();
            expect(userById?.email).toBe(testUser.getEmail());
            expect(userById?.first_name).toBe(testUser.first_name);
            expect(userById?.last_name).toBe(testUser.last_name);
        });

        it('should return null when id not found', async () => {
            const user = await repository.findById('nonexistent-id');
            expect(user).toBeNull();
        });
    });
}); 