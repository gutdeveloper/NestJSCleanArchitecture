import { User } from "src/domain/entities/User.entity";
import { ForbiddenError } from "../../../domain/errors/ForbiddenError";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { HashService } from "../../../domain/services/HashService";
import { TokenService } from "../../../domain/services/TokenService";
import { ConflictError } from "src/domain/errors/ConflictError";
import { EmailService } from "src/domain/services/EmailService";
import { FindUserById, IUser } from "src/domain/interfaces/user.interface";

export class AuthUseCase {
    constructor(
        private userRepository: UserRepository,
        private passwordHash: HashService,
        private tokenService: TokenService,
        private emailService: EmailService
    ) { }

    async loginUser(email: string, password: string): Promise<string> {
        const userExists = await this.userRepository.findByEmail(email);
        if (!userExists) throw new NotFoundError("User not found");
        const user = new User({ ...userExists });
        if (!user.emailVerified()) throw new ForbiddenError("Email not verified");
        const isValidPassword = await this.passwordHash.compare(password, user.password);
        if (!isValidPassword) throw new UnauthorizedError("Invalid password");
        if (!user.isActive()) throw new ForbiddenError("User is not active");
        const accesstoken = this.tokenService.generate(user.id!);
        return accesstoken;
    }

    async registerUser(payload: Pick<IUser, "name" | "email" | "password">): Promise<Pick<IUser, "email">> {
        const { name, email, password } = payload;
        const user = await this.userRepository.findByEmail(email);
        if (user) throw new ConflictError('User already exists');
        const passwordHashed = await this.passwordHash.hash(password);
        const newUser = new User({ name, email, password: passwordHashed });
        const userRegistered = await this.userRepository.register(newUser);
        this.emailService.sendEmailActivation(userRegistered.email, userRegistered.name);
        return { email: userRegistered.email };
    }

    async userProfile(userId: string): Promise<FindUserById> {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new NotFoundError("User not found");
        return user;
    }
}