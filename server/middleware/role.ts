import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest, UserRole } from '../types';
import { sendError } from '../utils/response';

export function authorizeRoles(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Authentication required before role check.', 401, 'UNAUTHORIZED');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        `Access forbidden. Requires one of [${allowedRoles.join(', ')}] privileges. Current role: ${req.user.role}`,
        403,
        'FORBIDDEN'
      );
    }

    next();
  };
}
