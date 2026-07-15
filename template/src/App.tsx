import { Suspense, lazy } from 'react'
import { NaimiProvider } from './kit/context'
import { useHostReady, usePersonalization } from './kit/hooks'
import SlideDeckPlayer from './kit/SlideDeckPlayer'
import { slides } from './slides'

// Component gallery, dev-only (npm run dev → http://localhost:5173/#gallery).
// The `import.meta.env.DEV` guard removes it from the production bundle.
const Gallery = import.meta.env.DEV
  ? lazy(() => import('./kit/gallery/GalleryApp'))
  : null

if (import.meta.env.DEV) {
  window.addEventListener('hashchange', () => window.location.reload())
}

function Deck() {
  const ready = useHostReady()
  const personalization = usePersonalization()

  // Blank surface until the host sends state — avoids a flash of {{companyName}}.
  if (!ready) {
    return <div className="h-screen w-screen bg-surface" />
  }

  return <SlideDeckPlayer slides={slides} slideProps={{ personalization }} />
}

export default function App() {
  if (Gallery && window.location.hash.startsWith('#gallery')) {
    return (
      <Suspense fallback={null}>
        <Gallery />
      </Suspense>
    )
  }

  return (
    <NaimiProvider>
      <Deck />
    </NaimiProvider>
  )
}
