export class UnauthorizedError extends Error {
    message;
    statusCode;
    constructor(message: string) {
        super();
        this.message = message;
        this.statusCode = 401;
    }
}