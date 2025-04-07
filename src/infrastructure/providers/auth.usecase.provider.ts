import { Provider } from '@nestjs/common';
import { AuthUseCase } from '../../application/useCases/auth/AuthUseCase';
import { UserRepository } from 'src/domain/repositories/UserRepository';
import { HashService } from 'src/domain/services/HashService';
import { TokenService } from 'src/domain/services/TokenService';
import { EmailService } from 'src/domain/services/EmailService';
import { INJECTION_TOKENS } from '../constants/injection-tokens.constants';

export const AuthUseCaseProvider: Provider = {
    provide: "AuthUseCase",
    useFactory: (
        userRepository: UserRepository,
        hashService: HashService,
        tokenService: TokenService,
        emailService: EmailService,
    ) => {
        return new AuthUseCase(userRepository, hashService, tokenService, emailService);
    },
    inject: [
        INJECTION_TOKENS.USER_REPOSITORY,
        INJECTION_TOKENS.HASH_SERVICE,
        INJECTION_TOKENS.TOKEN_SERVICE,
        INJECTION_TOKENS.EMAIL_SERVICE
    ],
};