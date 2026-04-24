import React from 'react'
import ReactDOM from 'react-dom/client' // <-- THIS is the missing piece!
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { MediaProvider } from './context/MediaContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx' 
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MediaProvider>
          <App />
        </MediaProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)