export function loadAdSense() {
  const client = import.meta.env.VITE_ADSENSE_CLIENT as string | undefined;
  if (!client || client.includes('REPLACE_ME')) return false;
  if (document.querySelector('script[data-koralive-adsense]')) return true;
  const script = document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.dataset.koraliveAdsense = 'true';
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
  document.head.appendChild(script);
  return true;
}
