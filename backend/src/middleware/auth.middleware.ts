import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
	user?: {
		id: number;
		username: string;
		email: string;
		role: string;
	};
}

// API key authentication — key must be set via the API_KEY environment variable
const API_KEY_ROLE = 'admin';

export const authenticate = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		// 1. Check for API key in X-API-Key header
		const apiKey = req.headers['x-api-key'] as string | undefined;
		if (apiKey) {
			const validApiKey = process.env.API_KEY;
			if (!validApiKey) {
				return res.status(500).json({ message: 'API key authentication is not configured' });
			}
			if (apiKey !== validApiKey) {
				return res.status(401).json({ message: 'Invalid API key' });
			}
			// Grant API key callers a synthetic admin-level identity
			req.user = { id: 0, username: 'api-key', email: 'api@system', role: API_KEY_ROLE };
			return next();
		}

		// 2. Fall back to JWT Bearer token
		const token = req.headers.authorization?.split(' ')[1];

		if (!token) {
			return res.status(401).json({ message: 'No authentication credentials provided' });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
};

export const authorize = (...roles: string[]) => {
	return (req: AuthRequest, res: Response, next: NextFunction) => {
		if (!req.user) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		if (!roles.includes(req.user.role)) {
			return res.status(403).json({ message: 'Forbidden - Insufficient permissions' });
		}

		next();
	};
};
