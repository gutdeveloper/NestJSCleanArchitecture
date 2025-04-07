export class NotFoundError extends Error {
    message: string;
    statusCode: number;

    constructor(message: string) {
        super();
        this.message = message;
        this.statusCode = 404;
    }
}