import * as bcrypt from "bcrypt";
import { HashService } from "../../domain/services/HashService";

export class BcryptService implements HashService {
    async hash(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
    async compare(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}