import { Role } from "../enums/role.enum";

export interface IUser {
    name: string;
    email: string;
    email_verified: boolean;
    active: boolean;
    id: string;
    password: string;
    role: Role;
}

export type FindUserById = Omit<IUser, "password" | "role">;

export type FindByEmail = Omit<IUser, "role">