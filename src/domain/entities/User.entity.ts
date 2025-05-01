import { Role } from "../enums/role.enum";
import { isValidEmail, isValidPassword, isNotEmpty } from "../utils/validators";

interface IUserEntity {
    id?: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    email_verified?: boolean;
    active?: boolean;
    role?: Role;
}

export class User {
    public readonly id: string;
    public readonly first_name: string;
    public readonly last_name: string;
    private readonly email: string;
    private readonly password: string;
    private email_verified: boolean;
    private active: boolean;
    private role: Role;

    constructor(props: IUserEntity) {
        if (!isNotEmpty(props.first_name)) {
            throw new Error("First name is required");
        }
        if (!isNotEmpty(props.last_name)) {
            throw new Error("Last name is required");
        }
        if (!props.email || !isValidEmail(props.email)) {
            throw new Error("Invalid email format");
        }
        if (!props.password || !isValidPassword(props.password)) {
            throw new Error("Password must be at least 6 characters long");
        }

        this.id = props.id || crypto.randomUUID();
        this.first_name = props.first_name.trim();
        this.last_name = props.last_name.trim();
        this.email = props.email.toLowerCase();
        this.password = props.password;
        this.email_verified = props.email_verified || false;
        this.active = props.active ?? true;
        this.role = props.role || Role.USER;
    }

    getEmail(): string {
        return this.email;
    }

    getPassword(): string {
        return this.password;
    }

    isEmailVerified(): boolean {
        return this.email_verified;
    }

    isActive(): boolean {
        return this.active;
    }

    getRole(): Role {
        return this.role;
    }

    fullName(): string {
        return `${this.first_name} ${this.last_name}`;
    }
}
