import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedError extends HttpException {
    public message: string;
    constructor(
        public readonly code: string,
        status: HttpStatus = HttpStatus.UNAUTHORIZED,
    ) {
        super(code, status);
        this.message = code;
        this.name = 'UnauthorizedError';
    }
}
