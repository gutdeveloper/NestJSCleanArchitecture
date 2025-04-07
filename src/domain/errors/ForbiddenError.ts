export class ForbiddenError extends Error {
    message: string;
    statusCode: number;

    constructor(message: string) {
        super();
        this.message = message;
        this.statusCode = 403
    }
}