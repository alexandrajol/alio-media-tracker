import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { MediaProvider } from './context/MediaContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MediaProvider>
        <App />
      </MediaProvider>
    </BrowserRouter>
  </React.StrictMode>,
)