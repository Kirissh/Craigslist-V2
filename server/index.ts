import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import config from './config/config.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';

// Create Express app
const app = express();
const PORT = config.server.port;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(path.dirname(new URL(import.meta.url).pathname), '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: config.server.clientUrl,
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/uploads', express.static(path.join(path.dirname(new URL(import.meta.url).pathname), '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Health check route
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handler middleware
app.use((err, _req, res, _next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Server error',
    message: err.message,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app; 