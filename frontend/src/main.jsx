import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Interceptar fetch para capturar el header de CO2
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  // Intentar leer los headers si están disponibles
  try {
    const co2Grams = response.headers.get('X-Carbon-Footprint-Grams');
    const bytes = response.headers.get('X-Response-Bytes');
    if (co2Grams) {
      window.dispatchEvent(new CustomEvent('co2-updated', { detail: { co2Grams, bytes } }));
    }
  } catch (e) {
    // Silenciar errores si la respuesta no permite leer headers
  }
  return response;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
