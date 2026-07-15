import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { host } from './host'
import type { DemoFieldValue, HostState } from './host'

export interface DemoValuesContextValue {
  getValue: (key: string) => DemoFieldValue | undefined
  setValue: (key: string, value: DemoFieldValue) => void
  /** Send pending edits to the host now (also runs on slide change / page hide). */
  flush: () => void
  canPersist: boolean
}

export const HostStateContext = createContext<HostState | null>(null)
export const DemoValuesContext = createContext<DemoValuesContextValue | null>(null)

const FLUSH_DEBOUNCE_MS = 400

/**
 * Connects to the host app and provides:
 *  - HostStateContext: personalization / canPersist (read-only)
 *  - DemoValuesContext: interactive values (demoData over clientFacts), with
 *    debounced patches back to the host so sliders don't spam the API.
 */
export function NaimiProvider({ children }: { children: ReactNode }) {
  const [hostState, setHostState] = useState<HostState | null>(null)
  const [values, setValues] = useState<Record<string, DemoFieldValue>>({})
  const valuesRef = useRef(values)
  const dirtyRef = useRef<Set<string>>(new Set())
  const flushTimerRef = useRef<number | null>(null)
  const initializedRef = useRef(false)

  useEffect(() => host.onStateChange((next) => {
    setHostState(next)
    // Seed interactive values once: clientFacts as defaults, demoData on top.
    if (!initializedRef.current) {
      initializedRef.current = true
      const seeded: Record<string, DemoFieldValue> = { ...next.clientFacts, ...next.demoData }
      valuesRef.current = seeded
      setValues(seeded)
    }
  }), [])

  const flush = useCallback(() => {
    if (flushTimerRef.current !== null) {
      window.clearTimeout(flushTimerRef.current)
      flushTimerRef.current = null
    }
    if (dirtyRef.current.size === 0) return

    const patch: Record<string, DemoFieldValue> = {}
    for (const key of dirtyRef.current) {
      patch[key] = valuesRef.current[key] ?? null
    }
    dirtyRef.current.clear()
    host.sendDemoDataPatch(patch)
  }, [])

  const scheduleFlush = useCallback(() => {
    if (flushTimerRef.current !== null) {
      window.clearTimeout(flushTimerRef.current)
    }
    flushTimerRef.current = window.setTimeout(flush, FLUSH_DEBOUNCE_MS)
  }, [flush])

  const getValue = useCallback((key: string) => values[key], [values])

  const setValue = useCallback((key: string, value: DemoFieldValue) => {
    if (Object.is(valuesRef.current[key], value)) return
    const next = { ...valuesRef.current, [key]: value }
    valuesRef.current = next
    setValues(next)
    dirtyRef.current.add(key)
    scheduleFlush()
  }, [scheduleFlush])

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('pagehide', flush)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('pagehide', flush)
      flush()
    }
  }, [flush])

  const demoValues = useMemo<DemoValuesContextValue>(() => ({
    getValue,
    setValue,
    flush,
    canPersist: hostState?.canPersist ?? false,
  }), [flush, getValue, hostState?.canPersist, setValue])

  return (
    <HostStateContext.Provider value={hostState}>
      <DemoValuesContext.Provider value={demoValues}>
        {children}
      </DemoValuesContext.Provider>
    </HostStateContext.Provider>
  )
}
