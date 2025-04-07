import { Role } from "../enums/role.enum";
import { IUser } from "../interfaces/user.interface";

export class User {
    public readonly id: string;
    public name: string;
    public readonly email: string;
    public readonly password: string;
    public email_verified: boolean;
    public active: boolean;
    public role: string;

    constructor(props: Partial<IUser>) {
        this.id = props.id || "";
        this.name = props.name || "";
        this.email = props.email || "";
        this.password = props.password || "";
        this.email_verified = props.email_verified || false;
        this.active = props.active || false;
        this.role = props.role || Role.User;
    }

    emailVerified(): boolean {
        return this.email_verified;
    }

    isActive(): boolean {
        return this.active;
    }
}
