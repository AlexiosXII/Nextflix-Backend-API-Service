import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);

    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<Request>();
        const authHeader = (req.headers['authorization'] as string) || (req.headers['Authorization'] as string);

        if (!authHeader) {
            throw new UnauthorizedException('Missing authorization header');
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            throw new UnauthorizedException('Invalid authorization header format');
        }

        const token = parts[1];
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            this.logger.error('JWT_SECRET is not configured in environment');
            throw new UnauthorizedException('Server configuration error');
        }

        try {
            const payload = jwt.verify(token, secret as string);
            // attach payload to request for downstream handlers
            (req as any).user = payload;
            return true;
        } catch (err: any) {
            this.logger.debug(`JWT verification failed: ${err?.message ?? err}`);
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
