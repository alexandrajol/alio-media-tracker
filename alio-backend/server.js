require('dotenv').config();
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const app = require('./src/app');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const keyPath = path.join(__dirname, 'certs/localhost-key.pem');
const certPath = path.join(__dirname, 'certs/localhost-cert.pem');

// Check if SSL certificates exist (for local development)
const hasSSL = fs.existsSync(keyPath) && fs.existsSync(certPath);

if (hasSSL && process.env.NODE_ENV !== 'production') {
  // Local development with HTTPS and HTTP
  const HTTPS_PORT = process.env.HTTPS_PORT || 3000;
  const HTTP_PORT = process.env.HTTP_PORT || 3001;

  https.createServer({
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  }, app).listen(HTTPS_PORT, HOST, () => {
    console.log(`✓ HTTPS Backend running on https://${HOST}:${HTTPS_PORT}`);
  });

  http.createServer(app).listen(HTTP_PORT, HOST, () => {
    console.log(`✓ HTTP Backend running on http://${HOST}:${HTTP_PORT}`);
    console.log(`\nFor other devices, use: http://192.168.88.243:${HTTP_PORT}`);
  });
} else {
  // Production or when SSL certs don't exist - HTTP only
  http.createServer(app).listen(PORT, HOST, () => {
    console.log(`✓ Backend running on http://${HOST}:${PORT}`);
    if (process.env.NODE_ENV === 'production') {
      console.log('Running in production mode');
    }
  });
}
