// frontend/src/main.jsx (or main.js)
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'; // Import provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap the App with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
)