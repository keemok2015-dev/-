const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');

export function setPageSEO({
  title,
  description,
  path = '/',
  image = '/icon-512.png',
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}) {
  const url = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;
  document.title = title;

  const set = (selector: string, attr: string, value: string) => {
    const el = document.querySelector<HTMLMetaElement>(selector);
    if (el) el.setAttribute(attr, value);
  };
  set('meta[name="description"]', 'content', description);
  set('meta[property="og:title"]', 'content', title);
  set('meta[property="og:description"]', 'content', description);
  set('meta[property="og:url"]', 'content', url);
  set('meta[property="og:image"]', 'content', imageUrl);
  set('meta[name="twitter:title"]', 'content', title);
  set('meta[name="twitter:description"]', 'content', description);
  set('meta[name="twitter:image"]', 'content', imageUrl);

  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = url;
}

export function installWebsiteSchema() {
  const existing = document.getElementById('koralive-schema');
  if (existing) return;
  const script = document.createElement('script');
  script.id = 'koralive-schema';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'كورة لايف',
    url: SITE_URL,
    inLanguage: 'ar',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  });
  document.head.appendChild(script);
}
