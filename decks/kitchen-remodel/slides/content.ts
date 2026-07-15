// Studio and configurator price list — edit these for your own company and pricing.

export const STUDIO = {
  name: 'Alder & Oak Kitchens',
  tagline: 'design-build kitchens, Portland OR since 2011',
  phone: '(503) 555-0142',
  address: '1420 SE Division St, Portland, OR 97202',
}

/**
 * Cabinet line price per linear foot (base + wall cabinets, boxes, and standard
 * hardware). Realistic for a full US design-build job.
 */
export const CABINETS = [
  { key: 'stock', label: 'Stock', note: 'ready sizes, quick lead time', pricePerFoot: 1100 },
  { key: 'semiCustom', label: 'Semi-custom', note: 'your layout, curated finishes', pricePerFoot: 1850 },
  { key: 'custom', label: 'Custom', note: 'built to the inch, any finish', pricePerFoot: 2900 },
]

/** Countertop material, per linear foot. */
export const COUNTERTOPS = [
  { key: 'butcher', label: 'Butcher block', note: 'warm wood, refinishable', pricePerFoot: 180 },
  { key: 'granite', label: 'Granite', note: 'natural stone, one-of-a-kind slab', pricePerFoot: 340 },
  { key: 'quartz', label: 'Quartz', note: 'engineered stone, seamless & sealed', pricePerFoot: 420 },
]

/** Design, demolition, install labor, plumbing and fixtures — flat base cost. */
export const BASE_COST = 6000

/** Upcharge for premium soft-close hardware, full-extension slides and lift systems. */
export const PREMIUM_HARDWARE_FACTOR = 1.1

export function calcPrice(feet: number, cabinetKey: string, countertopKey: string, premium: boolean): number {
  const cabinet = CABINETS.find((item) => item.key === cabinetKey) ?? CABINETS[1]
  const countertop = COUNTERTOPS.find((item) => item.key === countertopKey) ?? COUNTERTOPS[2]
  const base = feet * (cabinet.pricePerFoot + countertop.pricePerFoot) + BASE_COST
  return Math.round((premium ? base * PREMIUM_HARDWARE_FACTOR : base) / 1000) * 1000
}

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function formatUsd(value: number): string {
  return usd.format(Math.max(0, Math.round(value)))
}

/** Rough monthly payment estimate for the financing line (84-month term). */
export function monthlyFinancing(total: number): number {
  return Math.round(total / 85)
}
