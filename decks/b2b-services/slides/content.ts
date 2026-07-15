import type { Personalization } from '../kit/host'
import { personalizationValue } from '../kit/host'

/** The consulting firm's details — replace these with your own. */
export const FIRM = {
  name: 'Meridian Advisory',
  tagline: 'revenue-operations consulting for B2B companies',
  contact: 'hello@meridianadvisory.com',
  phone: '(415) 555-0100',
}

/** The firm's practices — edit to match your own service portfolio. */
export const SERVICES = [
  { key: 'audit', title: 'RevOps audit & roadmap', text: 'A clear-eyed read of your funnel, tooling and process — with a prioritized plan and dollar impact.' },
  { key: 'crm', title: 'CRM re-implementation', text: 'Rebuild your CRM so reps actually use it: clean stages, required fields that fit the sale, automation that saves time.' },
  { key: 'analytics', title: 'Pipeline analytics & forecasting', text: 'A forecast the board trusts: conversion by stage, cohort velocity, and a model that holds up quarter to quarter.' },
  { key: 'enablement', title: 'Sales enablement & playbooks', text: 'Playbooks, call frameworks and onboarding that ramp new reps faster and lift win rates.' },
  { key: 'alignment', title: 'Marketing–sales alignment', text: 'One definition of a qualified lead, a shared handoff, and a pipeline both teams are accountable for.' },
]

export function getContext(personalization: Personalization) {
  const value = (key: string, fallback = '') => personalizationValue(personalization, key, fallback)

  return {
    companyName: personalization.companyName.trim() || 'your company',
    contactName: value('contactName'),
    industry: value('industry'),
    painPoints: value('painPoints')
      .split('\n')
      .map((line) => line.replace(/^[•-]\s*/, '').trim())
      .filter(Boolean),
    managerName: value('managerName'),
    managerContact: value('managerContact'),
  }
}
