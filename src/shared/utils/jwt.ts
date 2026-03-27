import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/env';
import { User } from '../../database/models/user.model';

export const generateToken = (user: User) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        JWT_SECRET,
        {
            expiresIn: '1h',
        }
    )
}