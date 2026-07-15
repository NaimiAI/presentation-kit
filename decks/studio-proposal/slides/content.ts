import type { Personalization } from '../kit/host'
import { personalizationValue } from '../kit/host'

/** Sender details — replace with your own studio. */
export const STUDIO = {
  name: 'Fieldnote Studio',
  tagline: 'digital products & brand systems',
  contact: 'hello@fieldnote.studio',
  phone: '(415) 555-0148',
}

export interface EstimateRow {
  work: string
  description: string
}

export interface EstimateStage {
  title: string
  cost: number
  rows: EstimateRow[]
}

function parseCost(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.max(0, Math.round(value))
  const digits = String(value ?? '').replace(/[^\d]/g, '')
  return digits ? Math.max(0, Number.parseInt(digits, 10)) : 0
}

function parseRows(raw: unknown): EstimateRow[] {
  return String(raw ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/\s*\|\s*|\t+/).map((part) => part.trim()).filter(Boolean)
      return { work: parts[0] ?? line, description: parts.slice(1).join(' | ') || '—' }
    })
}

/** Stages from stagesJson (the stages editor in the create-presentation form).
 *  The host serializes each stage's amount under the fixed `costRub` key. */
export function parseStages(stagesJson: string): EstimateStage[] {
  if (!stagesJson.trim()) return []
  try {
    const parsed = JSON.parse(stagesJson)
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((item) => {
        const title = typeof item?.title === 'string' ? item.title.trim() : ''
        const rows = parseRows(item?.rows)
        if (!title && rows.length === 0) return null
        return { title: title || 'Stage', cost: parseCost(item?.costRub), rows }
      })
      .filter((stage): stage is EstimateStage => stage !== null)
  } catch {
    return []
  }
}

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function formatUsd(value: number): string {
  return usdFormatter.format(Math.max(0, Math.round(value)))
}

export function formatDate(iso: string, fallback = ''): string {
  if (!iso.trim()) return fallback
  const date = new Date(iso.trim())
  if (Number.isNaN(date.getTime())) return fallback
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/** The proposal content, assembled from personalization with fallbacks. */
export function getProposal(personalization: Personalization) {
  const value = (key: string, fallback = '') => personalizationValue(personalization, key, fallback)

  const stages = parseStages(value('stagesJson'))
  const total = stages.reduce((sum, stage) => sum + stage.cost, 0)

  return {
    companyName: personalization.companyName.trim() || 'your company',
    contactName: value('contactName'),
    projectTitle: value('projectTitle', 'Marketing site redesign'),
    projectOverview: value(
      'projectOverview',
      'The current site doesn’t reflect where the company is today and loses inquiries on mobile. The goal is to sharpen the positioning, rebuild the structure, and ship a site that turns traffic into inbound.',
    ),
    proposalDateText: formatDate(value('proposalDate'), formatDate(new Date().toISOString())),
    validUntilText: formatDate(value('validUntil')),
    pricingDisclaimer: value('pricingDisclaimer', 'Prices exclude sales tax'),
    workConditions: value('workConditions')
      .split('\n')
      .map((line) => line.replace(/^[•-]\s*/, '').trim())
      .filter(Boolean),
    stages,
    total,
  }
}
