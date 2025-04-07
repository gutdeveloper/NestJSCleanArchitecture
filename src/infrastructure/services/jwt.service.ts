import { TokenService } from "src/domain/services/TokenService";
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtService implements TokenService {
    constructor(private readonly jwtService: NestJwtService) { }
    generate(id: string): string {
        try {
            return this.jwtService.sign({ id });
        } catch (error) {
            console.error('Error generating token:', error);
            throw new Error('Error generating token');
        }
    }
    verify(token: string): string {
        try {
            const verify = this.jwtService.verify(token);
            return verify;
        } catch (error) {
            console.error('Error verifying token:', error);
            throw new Error('Invalid token');
        }
    }
}