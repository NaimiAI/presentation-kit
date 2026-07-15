import type { Personalization } from '../kit/host'
import { personalizationValue } from '../kit/host'

/** Sender details — replace with your own company. */
export const SENDER = {
  name: 'Northmark Consulting',
  tagline: 'revenue systems & automation',
  contact: 'sales@northmark.co',
  phone: '(415) 555-0132',
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
export function getOffer(personalization: Personalization) {
  const value = (key: string, fallback = '') => personalizationValue(personalization, key, fallback)

  const stages = parseStages(value('stagesJson'))
  const total = stages.reduce((sum, stage) => sum + stage.cost, 0)

  return {
    companyName: personalization.companyName.trim() || 'your company',
    contactName: value('contactName'),
    offerNumber: value('offerNumber', 'P-2026-001'),
    projectTitle: value('projectTitle', 'Full-scope project'),
    projectOverview: value(
      'projectOverview',
      'Describe how you understood the client’s problem: what hurts today, the outcome they’re after, and why it matters right now.',
    ),
    projectDuration: value('projectDuration', '6–8 weeks'),
    proposalDateText: formatDate(value('proposalDate'), formatDate(new Date().toISOString())),
    validUntilText: formatDate(value('validUntil')),
    workConditions: value('workConditions')
      .split('\n')
      .map((line) => line.replace(/^[•-]\s*/, '').trim())
      .filter(Boolean),
    managerName: value('managerName'),
    managerContact: value('managerContact'),
    stages,
    total,
  }
}
