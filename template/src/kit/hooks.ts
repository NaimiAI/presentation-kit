import { useContext, useState } from 'react'
import { DemoValuesContext, HostStateContext } from './context'
import type { DemoFieldValue, Personalization } from './host'

const EMPTY_PERSONALIZATION: Personalization = { companyName: '' }

/** Personalization entered by the manager when creating the client presentation. */
export function usePersonalization(): Personalization {
  const state = useContext(HostStateContext)
  return state?.personalization ?? EMPTY_PERSONALIZATION
}

/** True while waiting for the first state message from the host. */
export function useHostReady(): boolean {
  return useContext(HostStateContext) !== null
}

/**
 * Interactive slide field. Returns [value, setValue]. The value resolves from:
 * local edits → demo.demoData → client.facts → defaultValue. Edits are sent to
 * the host (debounced); the host persists them only for a logged-in manager.
 *
 * Safe to use outside NaimiProvider — falls back to plain useState.
 */
export function useDemoField<T extends DemoFieldValue>(
  key: string,
  options: { defaultValue: T },
): [T, (next: T) => void] {
  const ctx = useContext(DemoValuesContext)
  const [standalone, setStandalone] = useState<T>(options.defaultValue)

  if (!ctx) {
    return [standalone, setStandalone]
  }

  const raw = ctx.getValue(key)
  const value = raw === undefined || raw === null ? options.defaultValue : (raw as T)

  return [value, (next: T) => ctx.setValue(key, next)]
}

/** Internal: lets the SlideDeckPlayer flush pending edits on slide change. */
export function useDemoDataFlush() {
  const ctx = useContext(DemoValuesContext)
  return ctx?.flush ?? null
}
