import { useEffect, useState } from 'react'
import { Shield } from 'lucide-react'

export function TeamBadge({ name, logo, initials }: { name: string; logo: string | null; initials: string }) {
  const [imageState, setImageState] = useState<'cdn' | 'direct' | 'missing'>('cdn')
  useEffect(() => setImageState('cdn'), [logo])
  const imageUrl = logo && imageState !== 'missing'
    ? imageState === 'cdn' ? `/.netlify/images?url=${encodeURIComponent(logo)}&w=96&h=96&fit=contain` : logo
    : null
  return (
    <span className="team-badge white real-badge">
      {imageUrl ? <img src={imageUrl} alt={`شعار ${name}`} width={48} height={48} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setImageState(current => current === 'cdn' ? 'direct' : 'missing')} />
        : <span className="badge-fallback" role="img" aria-label={`شعار ${name} غير متاح`}><Shield strokeWidth={1.4} /><b>{initials.slice(0, 3)}</b></span>}
    </span>
  )
}
