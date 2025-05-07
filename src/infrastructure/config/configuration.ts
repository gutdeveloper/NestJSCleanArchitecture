import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export default registerAs('config', () => {
    // Validación de las variables de entorno usando Joi
    const envSchema = Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        JWT_SECRET: Joi.string().required().description('JWT secret key'),
        JWT_EXPIRATION: Joi.string().default('3600s').description('JWT expiration time'),
        DATABASE_URL: Joi.string().uri().required().description('Database connection URL'),
    });

    const { error, value: validatedEnv } = envSchema.validate(process.env, { allowUnknown: true, abortEarly: false });

    if (error) {
        throw new Error(`Environment validation error: ${error.message}`);
    }

    return {
        jwt: {
            secret: validatedEnv.JWT_SECRET,
            expiration: validatedEnv.JWT_EXPIRATION,
        },
        database: {
            url: validatedEnv.DATABASE_URL,
        },
    };
});