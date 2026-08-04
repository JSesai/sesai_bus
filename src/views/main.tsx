import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

function forwardError(level: 'error' | 'warn', scope: string, message: string, meta?: any) {
  try {
    window.electron?.logs?.write(level, scope, message, meta);
  } catch {
    // si el preload no está disponible, se ignora
  }
}

window.addEventListener('error', (event) => {
  forwardError('error', 'renderer', event.message || 'Error de renderizado', {
    source: event.filename,
    line: event.lineno,
    column: event.colno,
  });
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  forwardError('error', 'renderer', reason instanceof Error ? reason.message : 'Promesa rechazada sin manejar', {
    stack: reason instanceof Error ? reason.stack : String(reason),
  });
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
