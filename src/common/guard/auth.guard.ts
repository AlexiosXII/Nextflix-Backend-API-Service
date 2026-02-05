import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { CommonError } from '../errors/list/common.error';
import { UnauthorizedError } from '../errors/unauthorized.error';

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);

    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<Request>();
        const authHeader = (req.headers['authorization'] as string) || (req.headers['Authorization'] as string);

        if (!authHeader) {
            throw new UnauthorizedError(CommonError.MISSING_AUTHORIZATION_HEADER);
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            throw new UnauthorizedError(CommonError.INVALID_AUTHORIZATION_HEADER_FORMAT);
        }

        const token = parts[1];
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            this.logger.error('JWT_SECRET is not configured in environment');
            throw new UnauthorizedError(CommonError.SERVER_CONFIGURATION_ERROR);
        }

        try {
            const payload = jwt.verify(token, secret as string);
            // attach payload to request for downstream handlers
            (req as any).user = payload;
            return true;
        } catch (err: any) {
            this.logger.debug(`JWT verification failed: ${err?.message ?? err}`);
            throw new UnauthorizedError(CommonError.INVALID_OR_EXPIRED_TOKEN);
        }
    }
}
