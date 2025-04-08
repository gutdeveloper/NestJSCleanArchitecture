import { Role } from "../enums/role.enum";

interface IUserEntity {
    id?: string;
    name: string;
    email: string;
    password: string;
    email_verified?: boolean;
    active?: boolean;
    role?: Role;
}

export class User {
    public name: string;
    public readonly email: string;
    public readonly password: string;
    public email_verified: boolean;
    public active: boolean;
    public role: Role;

    constructor(props: IUserEntity) {
        this.name = props.name;
        this.email = props.email;
        this.password = props.password;
        this.email_verified = props.email_verified || false;
        this.active = props.active || true;
        this.role = props.role || Role.USER;
    }

    emailVerified(): boolean {
        return this.email_verified;
    }

    isActive(): boolean {
        return this.active;
    }
}
