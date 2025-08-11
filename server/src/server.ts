import * as dotenv from 'dotenv';
import app from '@src/app'; // adjust alias/path if needed

dotenv.config();

const port = process.env.PORT || '8000';

// Listen on 0.0.0.0 so Docker exposes port correctly
const server = app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`🔗 Health check available at http://localhost:${port}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});