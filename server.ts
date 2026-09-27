import http from 'node:http';
import express from 'express';
import path from 'node:path';
import { handleApiRoute } from './src/server/apiMiddleware';
import { getDbStats } from './src/server/db';

const app = express();
const PORT = process.env.PORT || 3001;

// Use our zero-dependency SQLite API middleware
app.use((req, res, next) => {
  handleApiRoute(req, res, next);
});

// Serve static frontend if built in dist
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('Garba Radar SQLite Sync Server running. Run npm run dev for client development.');
    }
  });
});

const server = http.createServer(app);
server.listen(PORT, () => {
  const stats = getDbStats();
  console.log(`=======================================================`);
  console.log(`🚀 Garba Radar Local SQLite Sync Server`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📁 Database: ${stats.dbFilePath}`);
  console.log(`⚡ Driver: ${stats.engine}`);
  console.log(`📊 Synced Events: ${stats.totalVenues}`);
  console.log(`=======================================================`);
});
