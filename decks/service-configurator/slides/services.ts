import type { LucideIcon } from 'lucide-react'
import { BarChart3, Mail, Megaphone, MonitorSmartphone, PenLine, SearchCheck } from 'lucide-react'
import { useDemoField } from '../kit/hooks'

/** Service menu — replace with your own price list. Keys must match manifest.json. */
export interface ServiceDef {
  key: string
  title: string
  description: string
  price: number
  /** How the price recurs: 'mo' = per month, 'once' = one-time setup. */
  cadence: 'mo' | 'once'
  /** Optional fine-print line under the price (e.g. an ad-spend fee). */
  note?: string
  weeks: number
  icon: LucideIcon
  defaultOn: boolean
}

export const SERVICES: ServiceDef[] = [
  {
    key: 'svcAudit',
    title: 'SEO audit',
    description: 'Technical + content audit, keyword gaps, and a prioritized 90-day roadmap.',
    price: 1900,
    cadence: 'once',
    weeks: 2,
    icon: SearchCheck,
    defaultOn: true,
  },
  {
    key: 'svcBrand',
    title: 'Analytics dashboard',
    description: 'One live dashboard across ads, site, and email — plus a monthly readout.',
    price: 1200,
    cadence: 'mo',
    weeks: 2,
    icon: BarChart3,
    defaultOn: false,
  },
  {
    key: 'svcSite',
    title: 'Landing page',
    description: 'A conversion-focused landing page: copy, design, build, and A/B setup.',
    price: 3200,
    cadence: 'once',
    weeks: 3,
    icon: MonitorSmartphone,
    defaultOn: true,
  },
  {
    key: 'svcSeo',
    title: 'Email flows',
    description: 'Welcome, cart, and win-back automations wired into your ESP.',
    price: 1500,
    cadence: 'once',
    weeks: 2,
    icon: Mail,
    defaultOn: false,
  },
  {
    key: 'svcContent',
    title: 'Content engine',
    description: 'Four SEO-driven posts a month — briefs, drafts, edits, and publishing.',
    price: 2400,
    cadence: 'mo',
    weeks: 4,
    icon: PenLine,
    defaultOn: false,
  },
  {
    key: 'svcAds',
    title: 'Paid ads management',
    description: 'Google and Meta campaigns, creative testing, and weekly optimization.',
    price: 1800,
    cadence: 'mo',
    note: '+ 10% of ad spend',
    weeks: 2,
    icon: Megaphone,
    defaultOn: true,
  },
]

export function discountPct(selectedCount: number): number {
  if (selectedCount >= 5) return 10
  if (selectedCount >= 3) return 5
  return 0
}

export interface ServiceSelection {
  def: ServiceDef
  selected: boolean
  toggle: () => void
}

/**
 * Per-service selection state (lives in the presentation's demoData).
 * SERVICES is a constant, so the hook order stays stable across renders.
 */
export function useServiceSelection() {
  const selections: ServiceSelection[] = SERVICES.map((def) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- fixed list
    const [selected, setSelected] = useDemoField<boolean>(def.key, { defaultValue: def.defaultOn })
    return { def, selected, toggle: () => setSelected(!selected) }
  })

  const chosen = selections.filter((item) => item.selected)
  // First-month total: monthly retainers + one-time setup, before the bundle discount.
  const subtotal = chosen.reduce((sum, item) => sum + item.def.price, 0)
  const discount = discountPct(chosen.length)
  const discountUsd = Math.round((subtotal * discount) / 100)
  const total = subtotal - discountUsd
  const maxWeeks = chosen.reduce((max, item) => Math.max(max, item.def.weeks), 0)

  return { selections, chosen, subtotal, discount, discountUsd, total, maxWeeks }
}

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function formatUsd(value: number): string {
  return usdFormatter.format(Math.max(0, Math.round(value)))
}

/** A price with its cadence suffix, e.g. "$1,800/mo" or "$3,200". */
export function formatServicePrice(def: ServiceDef): string {
  const base = formatUsd(def.price)
  return def.cadence === 'mo' ? `${base}/mo` : base
}
