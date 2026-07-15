/** Fictional showcase product — swap it for your own. */
export const PRODUCT = {
  name: 'Relay',
  tagline: 'the customer-communications platform',
}

export interface Plan {
  id: string
  name: string
  /** Per-seat monthly price in USD; null is a custom "let's talk" tier. */
  pricePerSeat: number | null
  popular?: boolean
  features: string[]
}

export const ANNUAL_DISCOUNT = 0.17 // ~2 months free on annual billing

export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    pricePerSeat: 29,
    features: ['Shared inbox & contacts', 'Standard reports', 'Chat support'],
  },
  {
    id: 'growth',
    name: 'Growth',
    pricePerSeat: 59,
    popular: true,
    features: ['Everything in Starter', 'AI churn signals', 'Integrations: your CRM, Slack, HubSpot', 'Roles & permissions'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    pricePerSeat: null,
    features: ['Everything in Growth', 'SSO & audit log', 'Dedicated success manager', '99.9% SLA'],
  },
]

export function planById(id: string): Plan {
  return PLANS.find((plan) => plan.id === id) ?? PLANS[1]
}

export function formatUsd(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value)))
}
