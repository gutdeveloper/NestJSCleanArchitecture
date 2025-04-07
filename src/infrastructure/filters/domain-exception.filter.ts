// filepath: c:\laragon\www\clar-nest\src\infrastructure\filters\domain-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ConflictError } from '../../domain/errors/ConflictError';
import { ForbiddenError } from '../../domain/errors/ForbiddenError';
import { NotFoundError } from '../../domain/errors/NotFoundError';
import { UnauthorizedError } from '../../domain/errors/UnauthorizedError';

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof ConflictError) {
      status = HttpStatus.CONFLICT;
      message = exception.message;
    } else if (exception instanceof ForbiddenError) {
      status = HttpStatus.FORBIDDEN;
      message = exception.message;
    } else if (exception instanceof NotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    } else if (exception instanceof UnauthorizedError) {
      status = HttpStatus.UNAUTHORIZED;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}