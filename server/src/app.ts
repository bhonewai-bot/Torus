import express from 'express';
import cors from 'cors';
import routes from "@src/routes";

const app = express();

// CORS configuration
app.use(cors({
    credentials: true
}));

// Body parsing middleware with size limits
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

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

export default app;