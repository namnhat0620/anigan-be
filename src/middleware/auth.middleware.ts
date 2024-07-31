import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: any, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' }); // Unauthorized
        }

        next()

        // try {
        //     const user = jwt.verify(token, 'secret-key'); // Verify token
        //     req.user = user; // Optionally, add user info to req object
        //     next(); // Pass control to the next middleware or route handler
        // } catch (err) {
        //     return res.status(403).json({ message: 'Forbidden' }); // Forbidden
        // }
    }
}
