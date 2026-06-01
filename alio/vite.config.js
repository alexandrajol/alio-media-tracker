// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const certDir = path.resolve('../alio-backend/certs')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    https: {
      key: fs.readFileSync(path.join(certDir, 'localhost-key.pem')),
      cert: fs.readFileSync(path.join(certDir, 'localhost-cert.pem')),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'], // text summary and a visual HTML report
      include: ['src/context/MediaContext.jsx'], // CRUD logic
    },
  },
})
