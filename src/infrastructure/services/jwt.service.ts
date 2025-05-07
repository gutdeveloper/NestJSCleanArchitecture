import { TokenService } from "src/domain/services/TokenService";
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtService implements TokenService {
    constructor(private readonly jwtService: NestJwtService) { }
    
    generate(payload: Record<string, any>): string {
        try {
            const { id, role } = payload;
            return this.jwtService.sign({ id, role });
        } catch (error) {
            console.error('Error generating token:', error);
            throw new Error('Error generating token');
        }
    }

    verify(token: string): { id: string; role: string } {
        try {
            if (!token) {
                throw new Error('Token is required');
            }
            const verify = this.jwtService.verify(token);
            if (!verify) {
                throw new Error('Invalid token payload');
            }
            return { id: verify.id, role: verify.role };
        } catch (error) {
            console.error('Error verifying token:', error);
            throw new Error('Invalid token');
        }
    }
}