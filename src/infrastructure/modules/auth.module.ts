import { Module } from "@nestjs/common";
import { PrismaUserRepository } from "../../infrastructure/repositories/user.repository";
import { BcryptService } from "../../infrastructure/services/bcrypt.service";
import { JwtService } from '../../infrastructure/services/jwt.service';
import { AuthController } from "../../infrastructure/controllers/auth.controller";
import { PrismaService } from "../../infrastructure/services/prisma.service";
import { MailgunEmailService } from "../services/mailgun.service";
import { JwtModule } from '@nestjs/jwt';
import { AuthUseCaseProvider } from "../providers/auth.usecase.provider";
import { INJECTION_TOKENS } from "../constants/injection-tokens.constants";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthUseCase } from "src/application/useCases/auth/AuthUseCase";

@Module({
    // imports: [JwtModule],
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_EXPIRATION'),
                    algorithm: 'HS256',
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [
        PrismaService,
        {
            provide: INJECTION_TOKENS.USER_REPOSITORY,
            useClass: PrismaUserRepository,
        },
        {
            provide: INJECTION_TOKENS.HASH_SERVICE,
            useClass: BcryptService,
        },
        {
            provide: INJECTION_TOKENS.TOKEN_SERVICE,
            useClass: JwtService,
        },
        {
            provide: INJECTION_TOKENS.EMAIL_SERVICE,
            useClass: MailgunEmailService,
        },
        AuthUseCaseProvider,
        JwtService,
    ],
    exports: [JwtService]
})
export class AuthModule { }
