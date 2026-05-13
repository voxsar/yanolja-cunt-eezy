import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { sequelize } from './config/database';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes';
import roomRoutes from './routes/room.routes';
import reservationRoutes from './routes/reservation.routes';
import guestRoutes from './routes/guest.routes';
import housekeepingRoutes from './routes/housekeeping.routes';
import dashboardRoutes from './routes/dashboard.routes';
import pmsRoutes from './routes/pms.routes';
import { seedDemoData } from './seed/demoData';

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
	origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
	credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
	customSiteTitle: 'Yanolja PMS API Docs',
	swaggerOptions: {
		persistAuthorization: true,
	},
}));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
	res.json({ status: 'OK', message: 'Yanolja PMS API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/housekeeping', housekeepingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/pms', pmsRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
	console.error(err.stack);
	res.status(err.status || 500).json({
		message: err.message || 'Internal Server Error',
		...(process.env.NODE_ENV === 'development' && { stack: err.stack })
	});
});

// Database connection and server start
const startServer = async () => {
	try {
		await sequelize.authenticate();
		console.log('✅ Database connection established successfully');

		// Sync database (in development only - use migrations in production)
		if (process.env.NODE_ENV === 'development') {
			await sequelize.sync({ alter: true });
			console.log('✅ Database synchronized');
			await seedDemoData();
			console.log('✅ Demo PMS data ready');
		}

		app.listen(PORT, () => {
			console.log(`🚀 Server is running on port ${PORT}`);
			console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
		});
	} catch (error) {
		console.error('❌ Unable to connect to the database:', error);
		process.exit(1);
	}
};

startServer();

export default app;
