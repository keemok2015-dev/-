import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);

// Register Service Worker for multi-platform PWA support (Android, iOS, Desktop)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('SW registration skipped:', err);
    });
  });
}

const id = (localStorage.vid ??= crypto.randomUUID());
fetch("/api/track", { method: "POST", body: JSON.stringify({ id }) });
