// Photographer story, packages, add-ons and pricing logic — edit to fit your studio.

/** Static studio identity (same for every couple). */
export const STUDIO = {
  name: 'Wren & Field Photography',
  photographer: 'Sarah Wren',
  style: 'Documentary-style wedding photography',
  region: 'Hudson Valley, NY',
  signature: '— S.',
}

/** Add-on keys covered by each package (so they show as "included", not a checkbox). */
export interface Package {
  key: string
  label: string
  price: number
  hours: string
  includes: string[]
  /** Add-on keys already bundled into this tier. */
  covers: AddonKey[]
  flagship?: boolean
}

export const PACKAGES: Package[] = [
  {
    key: 'essentials',
    label: 'Essentials',
    price: 3200,
    hours: '6 hours',
    includes: ['6 hours of coverage', 'One photographer', 'Online gallery', 'Full print rights'],
    covers: [],
  },
  {
    key: 'signature',
    label: 'Signature',
    price: 4800,
    hours: '9 hours',
    includes: [
      '9 hours of coverage',
      'Second shooter',
      'Engagement session',
      'Online gallery + slideshow',
      'Full print rights',
    ],
    covers: ['addonSecondShooter', 'addonEngagement'],
    flagship: true,
  },
  {
    key: 'heirloom',
    label: 'Heirloom',
    price: 7500,
    hours: '12 hours',
    includes: [
      '12 hours of coverage',
      'Second shooter',
      'Engagement session',
      'Fine-art album (10×10)',
      'Two parent albums',
      'Full print rights',
    ],
    covers: ['addonSecondShooter', 'addonEngagement', 'addonAlbum'],
  },
]

export type AddonKey = 'addonSecondShooter' | 'addonEngagement' | 'addonAlbum' | 'addonRehearsal'

export interface Addon {
  key: AddonKey
  label: string
  price: number
  note: string
}

export const ADDONS: Addon[] = [
  { key: 'addonSecondShooter', label: 'Second shooter', price: 600, note: 'A second angle on the day — details, reactions, both partners getting ready.' },
  { key: 'addonEngagement', label: 'Engagement session', price: 450, note: 'A relaxed pre-wedding shoot — great for save-the-dates and finding your rhythm on camera.' },
  { key: 'addonAlbum', label: 'Fine-art album', price: 950, note: 'A heirloom 10×10 layflat album, designed by hand and printed to last.' },
  { key: 'addonRehearsal', label: 'Rehearsal-dinner coverage', price: 800, note: 'Two hours the night before — toasts, family, the calm before the day.' },
]

/** Per-extra-hour rate for the stepper on slide 4. */
export const EXTRA_HOUR_RATE = 400

/** Booking retainer, shown as a footnote. */
export const RETAINER_PCT = 30

export function findPackage(key: string): Package {
  return PACKAGES.find((pkg) => pkg.key === key) ?? PACKAGES[0]
}

/** True when the selected tier already bundles this add-on. */
export function isCovered(pkg: Package, addonKey: AddonKey): boolean {
  return pkg.covers.includes(addonKey)
}

export function formatUsd(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value)))
}

export function formatWeddingDate(iso: string, fallback = ''): string {
  if (!iso.trim()) return fallback
  const date = new Date(iso.trim())
  if (Number.isNaN(date.getTime())) return fallback
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}
