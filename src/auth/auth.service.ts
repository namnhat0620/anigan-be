import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    extractSubFromToken(authHeader: string): string {
        const token = this.extractToken(authHeader);
        const decodedToken = jwt.decode(token);
        return decodedToken['sub']; // Assuming 'sub' field exists in the token
    }

    extractToken(authHeader: string): string {
        if (!authHeader) {
            throw new Error('Authorization header missing');
        }
        const [, token] = authHeader.split(' '); // Bearer token format
        if (!token) {
            throw new Error('Token missing in Authorization header');
        }
        return token;
    }
}
