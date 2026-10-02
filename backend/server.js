import dns from 'dns';
// Fix Windows Node.js DNS SRV resolution for MongoDB Atlas cluster
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // fallback default
}

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { seedInitialDomains } from './utils/seedDomains.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
let PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://anilrongali323_db_user:anil123@cluster0.ek7mwvf.mongodb.net/acharya?retryWrites=true&w=majority';

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Acharya MERN Backend API Server',
    database: mongoose.connection.readyState === 1 ? 'Connected (MongoDB Atlas)' : 'Offline',
    dbName: 'acharya',
    timestamp: new Date()
  });
});

// Serve Acharya Frontend Portal directly from static dist
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

// Fallback to index.html for any SPA routes so opening localhost:5000 opens the Acharya Portal directly
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Connect to MongoDB Atlas (db: 'acharya')
const connectDB = async () => {
  const directURI = 'mongodb://anilrongali323_db_user:anil123@ac-v7nalij-shard-00-00.ek7mwvf.mongodb.net:27017,ac-v7nalij-shard-00-01.ek7mwvf.mongodb.net:27017,ac-v7nalij-shard-00-02.ek7mwvf.mongodb.net:27017/acharya?ssl=true&replicaSet=atlas-13dkn4-shard-0&authSource=admin&retryWrites=true&w=majority';
  
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log(`  ➜  Database: Connected to MongoDB Atlas via SRV (DB: acharya)`);
    await seedInitialDomains();
    return;
  } catch (srvErr) {
    console.log(`  ➜  SRV Lookup notice, attempting direct Atlas seedlist connection...`);
  }

  try {
    await mongoose.connect(directURI, { serverSelectionTimeoutMS: 5000 });
    console.log(`  ➜  Database: Connected to MongoDB Atlas via direct seedlist (DB: acharya)`);
    await seedInitialDomains();
  } catch (directErr) {
    console.log(`  ➜  Database Notice: ${directErr.message}`);
    console.log(`  ➜  Note: If IP is restricted, whitelist 0.0.0.0/0 in MongoDB Atlas -> Network Access tab.`);
  }
};

const startServer = (portToTry) => {
  const server = app.listen(portToTry, () => {
    console.log(`\n  ➜  Acharya Portal: http://localhost:${portToTry}/\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      startServer(Number(portToTry) + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

// Start server instantly in < 50ms, connect DB in background
startServer(PORT);
connectDB();
