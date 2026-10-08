import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const client = import.meta.env.VITE_ADSENSE_CLIENT as string | undefined;

export function AdSlot({ slot, format = 'auto', responsive = true }: { slot: string; format?: string; responsive?: boolean }) {
  useEffect(() => {
    if (!client) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.warn('AdSense slot was not initialized', error);
    }
  }, []);

  if (!client || !slot) return null;

  return (
    <div className="koralive-ad" aria-label="إعلان">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
