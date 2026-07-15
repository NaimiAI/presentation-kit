// Shared pricing state for the couple's configuration — one source of truth so
// the package picker (slide 3), the add-ons + total (slide 4) all agree.
import { useDemoField } from '../kit/hooks'
import { ADDONS, EXTRA_HOUR_RATE, findPackage, isCovered, type AddonKey } from './content'

export interface AddonState {
  key: AddonKey
  /** Already bundled into the selected package → shown as "included", no checkbox. */
  covered: boolean
  /** Checkbox state (only meaningful when not covered). */
  checked: boolean
  toggle: () => void
}

export interface PricingState {
  packageKey: string
  setPackageKey: (next: string) => void
  addons: AddonState[]
  extraHours: number
  setExtraHours: (next: number) => void
  /** Add-ons that actually add to the total (checked AND not already covered). */
  billedAddonKeys: AddonKey[]
  packagePrice: number
  addonsTotal: number
  extraHoursTotal: number
  total: number
}

/**
 * Reads the couple's choices from demoData. Add-ons already bundled into the
 * selected package show as "included" and never double-count in the total.
 * ADDONS is a constant list, so the hook order stays stable between renders.
 */
export function usePricing(): PricingState {
  const [packageKey, setPackageKey] = useDemoField<string>('selectedPackage', { defaultValue: 'signature' })
  const [extraHoursRaw, setExtraHours] = useDemoField<number>('extraHours', { defaultValue: 0 })
  const extraHours = Math.max(0, Math.min(4, Math.round(extraHoursRaw)))

  const pkg = findPackage(packageKey)

  const addons: AddonState[] = ADDONS.map((addon) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- fixed-length list
    const [checked, setChecked] = useDemoField<boolean>(addon.key, { defaultValue: false })
    const covered = isCovered(pkg, addon.key)
    return { key: addon.key, covered, checked, toggle: () => setChecked(!checked) }
  })

  // Only bill an add-on that the couple checked AND the package doesn't already include.
  const billedAddonKeys = addons
    .filter((addon) => addon.checked && !addon.covered)
    .map((addon) => addon.key)

  const addonsTotal = billedAddonKeys.reduce((sum, key) => {
    const def = ADDONS.find((addon) => addon.key === key)
    return sum + (def?.price ?? 0)
  }, 0)

  const extraHoursTotal = extraHours * EXTRA_HOUR_RATE

  return {
    packageKey,
    setPackageKey,
    addons,
    extraHours,
    setExtraHours: (next) => setExtraHours(Math.max(0, Math.min(4, Math.round(next)))),
    billedAddonKeys,
    packagePrice: pkg.price,
    addonsTotal,
    extraHoursTotal,
    total: pkg.price + addonsTotal + extraHoursTotal,
  }
}
