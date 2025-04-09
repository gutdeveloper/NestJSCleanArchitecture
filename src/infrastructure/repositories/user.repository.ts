import { User } from "src/domain/entities/User.entity";
import { UserRepository } from "src/domain/repositories/UserRepository";
import { PrismaService } from "../services/prisma.service";
import { Injectable } from "@nestjs/common";
import { IUser } from "src/domain/interfaces/user.interface";
import { Role } from "src/domain/enums/role.enum";

@Injectable()
export class PrismaUserRepository implements UserRepository {
    constructor(private prisma: PrismaService) { }
    async register(user: User): Promise<Pick<IUser, "email" | "name">> {
        try {
            return await this.prisma.user.create({
                data: { ...user },
                select: { email: true, name: true },
            });

        } catch (error) {
            console.error(error);
            throw new Error("Error registering user");
        }
    }

    async findByEmail(email: string): Promise<IUser | null> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email },
                select: {
                    id: true, name: true, email: true,
                    password: true, email_verified: true,
                    active: true, role: true
                },
            });
            if (!user) return null;
            return { ...user, role: user.role as Role };
        } catch (error) {
            console.error(error);
            throw new Error("Error finding user by email");
        }

    }
    async findById(id: string): Promise<Omit<IUser, "password" | "role"> | null> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id },
                select: { id: true, name: true, email: true, email_verified: true, active: true },
            });
            if (!user) return null;
            return user;
        } catch (error) {
            console.error(error);
            throw new Error("Error finding user by id");
        }
    }
}