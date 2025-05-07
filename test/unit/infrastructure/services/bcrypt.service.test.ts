import { BcryptService } from 'src/infrastructure/services/bcrypt.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('BcryptService', () => {
    let bcryptService: BcryptService;

    beforeEach(() => {
        bcryptService = new BcryptService();
        jest.clearAllMocks();
    });

    describe('hash', () => {
        it('should hash password with salt', async () => {
            const password = 'Test123!';
            const salt = 'mockSalt';
            const hashedPassword = 'hashedPassword123';

            (bcrypt.genSalt as jest.Mock).mockResolvedValue(salt);
            (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

            const result = await bcryptService.hash(password);

            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
            expect(result).toBe(hashedPassword);
        });

        it('should handle hashing errors', async () => {
            const password = 'Test123!';
            const error = new Error('Hashing failed');

            (bcrypt.genSalt as jest.Mock).mockRejectedValue(error);

            await expect(bcryptService.hash(password)).rejects.toThrow('Hashing failed');
        });
    });

    describe('compare', () => {
        it('should compare passwords correctly', async () => {
            const password = 'Test123!';
            const hashedPassword = 'hashedPassword123';

            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const result = await bcryptService.compare(password, hashedPassword);

            expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
            expect(result).toBe(true);
        });

        it('should return false for incorrect passwords', async () => {
            const password = 'WrongPassword!';
            const hashedPassword = 'hashedPassword123';

            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            const result = await bcryptService.compare(password, hashedPassword);

            expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
            expect(result).toBe(false);
        });

        it('should handle comparison errors', async () => {
            const password = 'Test123!';
            const hashedPassword = 'hashedPassword123';
            const error = new Error('Comparison failed');

            (bcrypt.compare as jest.Mock).mockRejectedValue(error);

            await expect(bcryptService.compare(password, hashedPassword))
                .rejects
                .toThrow('Comparison failed');
        });
    });

    describe('performance', () => {
        it('should use the correct salt rounds', async () => {
            const password = 'Test123!';
            const salt = 'mockSalt';
            const hashedPassword = 'hashedPassword123';

            (bcrypt.genSalt as jest.Mock).mockResolvedValue(salt);
            (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

            await bcryptService.hash(password);

            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
        });

        it('should handle multiple hash requests', async () => {
            const password = 'Test123!';
            const salt = 'mockSalt';
            const hashedPassword = 'hashedPassword123';

            (bcrypt.genSalt as jest.Mock).mockResolvedValue(salt);
            (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

            // Realizar múltiples solicitudes de hash
            const promises = Array(5).fill(null).map(() => 
                bcryptService.hash(password)
            );

            const results = await Promise.all(promises);

            expect(results.every(result => result === hashedPassword)).toBe(true);
            expect(bcrypt.genSalt).toHaveBeenCalledTimes(5);
        });
    });
}); 