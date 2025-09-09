import express from 'express';
import cors from 'cors';
import routes from "@src/routes";
import { handleErrors, notFoundHandler } from '@middlewares/error.handlers';
import env from "@config/env";
import path from "path";

const app = express();

// CORS configuration
app.use(cors({
    origin: env.CLIENT_URL || "localhost://8000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing middleware with size limits
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

const uploadsPath = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsPath, {
    maxAge: "1y",
    etag: true,
    lastModified: true,
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Server is running!',
        version: '1.0.0',
    });
});

// 404 handler for unknown routes
app.use(notFoundHandler);

// Global error handler 
app.use(handleErrors);

export default app;