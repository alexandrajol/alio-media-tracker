// server.js
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Alio Backend is running on http://localhost:${PORT}`);
    console.log(`Make sure your React app sends requests to this address!`);
});