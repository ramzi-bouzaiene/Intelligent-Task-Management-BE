import { Request, Response, NextFunction } from 'express';
import Permissions from '../database/models/permissions';

interface AuthenticatedRequest extends Request {
  user?: {
    role?: string;
  };
}

export const checkPermission = (permission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role || 'anonymous';

    const permissionsService = new Permissions();
    const userPermissions = permissionsService.getPermissionsByRoleName(userRole);

    if (userPermissions.includes(permission)) {
      return next();
    }

    return res.status(403).json({ error: 'Access denied' });
  };
};
