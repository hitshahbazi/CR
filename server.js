// Import the necessary modules and packages
import express from 'express';
import dotenv from 'dotenv';
import 'express-async-errors';
import morgan from 'morgan';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

// Import the connectDB function
import connectDB from './db/connect.js';

// Import your routers and middleware
import authRouter from './routes/authRoutes.js';
import jobsRouter from './routes/jobsRoutes.js';
import scriptRouter from './routes/scriptRoutes.js'
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import authenticateUser from './middleware/auth.js';

// Create an instance of the Express application
const app = express();

// Load environment variables from .env file
dotenv.config();

// Use morgan middleware for logging in development mode
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Define the __dirname variable
const __dirname = dirname(fileURLToPath(import.meta.url));

// Serve static files from the client/build directory
app.use(express.static(path.resolve(__dirname, './client/build')));

// Use middleware for parsing JSON, security, and cookies
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(cookieParser());

// Define your API routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);
app.use('/api/v1/scripts',authenticateUser,scriptRouter)

// Serve the React app for all routes except /api/*
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

// Use custom middleware for handling 404 errors
app.use(notFoundMiddleware);

// Use custom middleware for handling errors
app.use(errorHandlerMiddleware);

// Define the port for the server
const port = process.env.PORT || 5000;

// Start the server
const start = async () => {
  try {
    // Connect to the MongoDB database
    await connectDB(process.env.MONGO_URL);

    // Start the Express server
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

// Call the start function to initiate the server
start();
