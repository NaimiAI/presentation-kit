// Connection to the Naimi Web Pres host application.
//
// The built presentation runs inside a sandboxed iframe and talks to the host
// only through postMessage:
//   bundle -> host  { type: 'naimi:ready' }
//   host -> bundle  { type: 'naimi:init', payload: HostState }
//   bundle -> host  { type: 'naimi:demoDataPatch', payload: { data } }
//
// In `npm run dev` (opened directly, not in an iframe) the client falls back
// to mock/state.json so slides render with realistic data.

export type DemoFieldValue = string | number | boolean | null

export interface PersonalizationCustomField {
  key: string
  value: string
}

export interface Personalization {
  companyName: string
  contactName?: string
  customFields?: PersonalizationCustomField[]
  [key: string]: string | PersonalizationCustomField[] | undefined
}

export interface HostState {
  personalization: Personalization
  /** Latest known facts about the client, accumulated across demos. */
  clientFacts: Record<string, DemoFieldValue>
  /** Values already saved for this demo. */
  demoData: Record<string, DemoFieldValue>
  /** True only when a logged-in manager opened the link. */
  canPersist: boolean
}

const EMPTY_STATE: HostState = {
  personalization: { companyName: '' },
  clientFacts: {},
  demoData: {},
  canPersist: false,
}

type Listener = (state: HostState) => void

const isEmbedded = typeof window !== 'undefined' && window.parent !== window

let state: HostState | null = null
const listeners = new Set<Listener>()
let started = false

function emit() {
  if (!state) return
  for (const listener of listeners) {
    try {
      listener(state)
    } catch (error) {
      console.error(error)
    }
  }
}

function normalizeState(raw: unknown): HostState {
  const payload = (raw ?? {}) as Partial<HostState> & { personalization?: Personalization }
  return {
    personalization: payload.personalization ?? { companyName: '' },
    clientFacts: payload.clientFacts ?? {},
    demoData: payload.demoData ?? {},
    canPersist: Boolean(payload.canPersist),
  }
}

function start() {
  if (started || typeof window === 'undefined') return
  started = true

  window.addEventListener('message', (event: MessageEvent) => {
    const message = (event.data ?? {}) as { type?: string; payload?: unknown }
    if (message.type !== 'naimi:init') return
    state = normalizeState(message.payload)
    emit()
  })

  if (isEmbedded) {
    window.parent.postMessage({ type: 'naimi:ready' }, '*')
    // Safety net: if the host never answers, render with empty defaults.
    window.setTimeout(() => {
      if (!state) {
        state = EMPTY_STATE
        emit()
      }
    }, 1500)
    return
  }

  if (import.meta.env.DEV) {
    void import('../../mock/state.json').then((module) => {
      if (state) return
      state = normalizeState(module.default)
      emit()
    })
    return
  }

  // Built bundle opened directly in a browser (no host): empty defaults.
  state = EMPTY_STATE
  emit()
}

export const host = {
  /** Subscribe to host state. Fires immediately if state already arrived. */
  onStateChange(listener: Listener): () => void {
    start()
    listeners.add(listener)
    if (state) listener(state)
    return () => listeners.delete(listener)
  },

  getState(): HostState | null {
    start()
    return state
  },

  /** Send interactive values to the host (persisted into demo.demoData). */
  sendDemoDataPatch(data: Record<string, DemoFieldValue>) {
    if (Object.keys(data).length === 0) return
    if (isEmbedded) {
      window.parent.postMessage({ type: 'naimi:demoDataPatch', payload: { data } }, '*')
    } else if (import.meta.env.DEV) {
      console.debug('[naimi-kit] demoData patch (dev, not sent):', data)
    }
  },
}

/** Resolve a personalization value: direct key first, then customFields. */
export function personalizationValue(
  personalization: Personalization,
  key: string,
  fallback = '',
): string {
  const direct = personalization[key]
  if (typeof direct === 'string' && direct.trim()) return direct
  const custom = personalization.customFields?.find((field) => field.key === key)
  if (custom && custom.value.trim()) return custom.value
  return fallback
}
