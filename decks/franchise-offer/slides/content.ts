// Network legend and unit economics — edit these for your own franchise.
// Everything personal to the partner (city, note) comes from personalization.

export const FRANCHISE = {
  name: 'Daybreak Coffee',
  format: 'neighborhood coffee shop, 1,200–1,800 sq ft',
  years: 9,
  locations: 42,
  region: 'the Pacific Northwest',
  auv: 685_000, // average unit volume — gross sales per location per year
}

/** Cost to open, USD. */
export const ENTRY = {
  franchiseFee: 45_000, // initial franchise fee
  investmentLow: 285_000, // total initial investment, low end
  investmentHigh: 420_000, // total initial investment, high end
  royaltyShare: 0.06, // royalty on gross sales
  brandFundShare: 0.02, // national brand fund on gross sales
}

/** Midpoint of the initial-investment range — the calculator pays this back. */
export const INVESTMENT_MID = Math.round((ENTRY.investmentLow + ENTRY.investmentHigh) / 2)

/** Where the initial investment goes, USD (spans the range). */
export const INVESTMENT_BREAKDOWN = [
  { label: 'Buildout & fixtures', value: 175_000 },
  { label: 'Espresso & kitchen equipment', value: 95_000 },
  { label: 'Franchise fee', value: 45_000 },
  { label: 'Inventory, training & opening', value: 37_500 },
]

/** Monthly location model: shares of sales + fixed rent, USD. */
export const ECONOMICS = {
  cogsShare: 0.3, // cost of goods: beans, milk, cups
  payrollShare: 0.26, // team payroll
  rentFixed: 6_500, // rent, fixed per month
  royaltyShare: 0.06, // royalty
  brandFundShare: 0.02, // national brand fund
  otherShare: 0.06, // other: card fees, utilities, supplies
}

/** Median location's monthly gross sales, USD (AUV ÷ 12, rounded). */
export const MEDIAN_REVENUE = 57_000

/** Monthly profit for a location under the ECONOMICS model (one formula deck-wide). */
export function monthlyProfit(revenue: number): number {
  const variableShare =
    ECONOMICS.cogsShare +
    ECONOMICS.payrollShare +
    ECONOMICS.royaltyShare +
    ECONOMICS.brandFundShare +
    ECONOMICS.otherShare
  return Math.round(revenue * (1 - variableShare) - ECONOMICS.rentFixed)
}

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function formatUsd(value: number): string {
  return usd.format(Math.round(value))
}
