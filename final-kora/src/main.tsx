import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { installWebsiteSchema } from './utils/seo';
import { loadAdSense } from './utils/adsense';

installWebsiteSchema();
loadAdSense();
createRoot(document.getElementById('root')!).render(<App />);

// Register Service Worker for multi-platform PWA support (Android, iOS, Desktop)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('SW registration skipped:', err);
    });
  });
}

