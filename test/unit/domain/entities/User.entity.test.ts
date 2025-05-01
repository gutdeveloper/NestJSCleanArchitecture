import { User } from 'src/domain/entities/User.entity';
import { Role } from 'src/domain/enums/role.enum';

describe('User Entity', () => {
    const validUserData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password123',
    };

    it('should create a valid user', () => {
        const user = new User(validUserData);
        
        expect(user.first_name).toBe(validUserData.first_name);
        expect(user.last_name).toBe(validUserData.last_name);
        expect(user.getEmail()).toBe(validUserData.email.toLowerCase());
        expect(user.getPassword()).toBe(validUserData.password);
        expect(user.isEmailVerified()).toBe(false);
        expect(user.isActive()).toBe(true);
        expect(user.getRole()).toBe(Role.USER);
    });

    it('should throw error for invalid email', () => {
        expect(() => {
            new User({ ...validUserData, email: 'invalid-email' });
        }).toThrow('Invalid email format');
    });

    it('should throw error for short password', () => {
        expect(() => {
            new User({ ...validUserData, password: '123' });
        }).toThrow('Password must be at least 6 characters long');
    });

    it('should return full name', () => {
        const user = new User(validUserData);
        expect(user.fullName()).toBe(`${validUserData.first_name} ${validUserData.last_name}`);
    });

    it('should handle edge cases', () => {
        // Nombre con caracteres especiales
        expect(() => {
            new User({ ...validUserData, first_name: 'Jöhn' });
        }).not.toThrow();
        
        // Email con caracteres especiales
        expect(() => {
            new User({ ...validUserData, email: 'jöhn.doe@example.com' });
        }).not.toThrow();
        
        // Contraseña con caracteres especiales
        expect(() => {
            new User({ ...validUserData, password: 'p@ssw0rd!' });
        }).not.toThrow();
    });

    it('should set default values correctly', () => {
        const user = new User({
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            password: 'password123'
        });
        
        expect(user.isEmailVerified()).toBe(false);
        expect(user.isActive()).toBe(true);
        expect(user.getRole()).toBe(Role.USER);
        expect(user.id).toBeDefined();
    });

    it('should allow overriding default values', () => {
        const user = new User({
            ...validUserData,
            email_verified: true,
            active: false,
            role: Role.ADMIN
        });
        
        expect(user.isEmailVerified()).toBe(true);
        expect(user.isActive()).toBe(false);
        expect(user.getRole()).toBe(Role.ADMIN);
    });

    it('should have correct default values when optional fields are not provided', () => {
        const user = new User({
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            password: 'password123'
        });

        // Verificar valores por defecto
        expect(user.isEmailVerified()).toBe(false);
        expect(user.isActive()).toBe(true);
        expect(user.getRole()).toBe(Role.USER);
    });
}); 