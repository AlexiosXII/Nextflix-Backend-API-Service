import { HttpException, HttpStatus } from '@nestjs/common';

export class ApplicationError extends HttpException {
    public message: string;
    constructor(
        public readonly code: string,
        status: HttpStatus = HttpStatus.BAD_REQUEST,
    ) {
        super(code, status);
        this.name = 'ApplicationError';
    }
}
