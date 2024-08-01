import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { AniganUserEntity } from 'src/keycloak/entities/anigan_user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AniganUserEntity)
        private readonly userRepository: Repository<AniganUserEntity>,
    ) { }

    extractSubFromToken(authHeader: string): string {
        const token = this.extractToken(authHeader);
        const decodedToken = jwt.decode(token);
        return decodedToken['sub'].toString(); // Assuming 'sub' field exists in the token
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

    isTechnicalUser(authHeader: string) {
        return process.env.TECHNICAL_USER_ID === this.extractSubFromToken(authHeader)
    }
}
