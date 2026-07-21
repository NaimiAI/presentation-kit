// Slide deck engine — identical look and behavior to the built-in Naimi decks:
// spring slide transitions, keyboard navigation (←/→/Home/End/Space/Enter),
// touch swipe with a first-slide hint, desktop dot navigation, mobile bar,
// collapsible thumbnail panel that docks left and pushes the deck (desktop,
// PowerPoint-style), and an alternative scroll view — all slides stacked as one
// vertically scrollable document (PDF-like), toggled by the viewer.
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  GalleryHorizontal,
  GalleryVertical,
  PanelLeft,
  PanelLeftClose,
} from 'lucide-react'
import type { ComponentType } from 'react'
import type { TouchEvent } from 'react'
import { useDemoDataFlush } from './hooks'

interface SlideDeckPlayerProps<TSlideProps extends object> {
  slides: Array<ComponentType<TSlideProps>>
  slideProps: TSlideProps
}

// 'slides' — classic one-at-a-time show; 'scroll' — every slide stacked into one
// vertically scrollable document. The default MUST stay 'slides': the platform's
// PDF export drives the deck with arrow keys and relies on slide-mode DOM.
type ViewMode = 'slides' | 'scroll'

// While a client is typing into an interactive field (text input, textarea,
// select, contenteditable), Space/Enter/arrows belong to that field — not to
// deck navigation. Skip the keyboard handler when such an element is focused.
function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
}

// Thumbnails render the real slide components on a fixed virtual canvas shrunk
// with transform: scale — slides size against their container (SlideShell is
// min-h-full), so each thumbnail reproduces the true desktop layout.
const PANEL_WIDTH = 256
const THUMB_CANVAS_WIDTH = 1280
const THUMB_CANVAS_HEIGHT = 800
// 200px leaves room for the scrollbar inside the panel (256 − px-4×2 − scrollbar).
const THUMB_WIDTH = 200
const THUMB_SCALE = THUMB_WIDTH / THUMB_CANVAS_WIDTH
const THUMB_HEIGHT = Math.round(THUMB_CANVAS_HEIGHT * THUMB_SCALE)

interface ThumbnailItemProps<TSlideProps extends object> {
  slide: ComponentType<TSlideProps>
  slideProps: TSlideProps
  index: number
  isActive: boolean
  label: string
  onSelect: (index: number) => void
}

// memo: player state churn (navigation, hints, panel toggle) must not
// re-reconcile N mounted slide trees on every keypress; only the two items
// whose isActive flips re-render. content-visibility lets the browser skip
// layout/paint of thumbnails scrolled out of the panel.
function ThumbnailItemImpl<TSlideProps extends object>({
  slide: Slide,
  slideProps,
  index,
  isActive,
  label,
  onSelect,
}: ThumbnailItemProps<TSlideProps>) {
  return (
    <button
      data-thumb-index={index}
      onClick={() => onSelect(index)}
      className={`relative shrink-0 overflow-hidden rounded-lg border text-left transition-all duration-200 ${
        isActive
          ? 'border-[var(--nk-nav-dot-active)] ring-2 ring-[var(--nk-nav-dot-active)]'
          : 'border-[var(--nk-nav-border)] hover:border-[var(--nk-nav-dot-hover)]'
      }`}
      style={{ width: THUMB_WIDTH, height: THUMB_HEIGHT, contentVisibility: 'auto' }}
      title={label}
      aria-label={label}
      aria-current={isActive ? 'true' : undefined}
    >
      <div
        inert
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 origin-top-left select-none bg-surface"
        style={{ width: THUMB_CANVAS_WIDTH, height: THUMB_CANVAS_HEIGHT, transform: `scale(${THUMB_SCALE})` }}
      >
        <MotionConfig reducedMotion="always">
          <Slide {...slideProps} />
        </MotionConfig>
      </div>
      <span className="absolute bottom-1.5 left-1.5 rounded-md border border-[var(--nk-nav-border)] bg-[var(--nk-nav-chip)] px-1.5 py-0.5 text-[10px] font-semibold text-ink-soft backdrop-blur-sm">
        {index + 1}
      </span>
    </button>
  )
}
const ThumbnailItem = memo(ThumbnailItemImpl) as typeof ThumbnailItemImpl

interface ScrollSectionProps<TSlideProps extends object> {
  slide: ComponentType<TSlideProps>
  slideProps: TSlideProps
  index: number
  isMounted: boolean
  registerRef: (index: number, el: HTMLElement | null) => void
}

// One scroll-view section. Slides size against their container (SlideShell is
// min-h-full), but a section only has a min-height — percentages can't resolve
// against it, so a flex column with [&>*]:flex-auto stretches short slides to a
// full screen and lets tall ones grow naturally. memo: the scroll observers bump
// currentSlide on every crossing; N mounted slide trees must not re-render from it.
function ScrollSectionImpl<TSlideProps extends object>({
  slide: Slide,
  slideProps,
  index,
  isMounted,
  registerRef,
}: ScrollSectionProps<TSlideProps>) {
  return (
    <section
      ref={(el) => registerRef(index, el)}
      data-section-index={index}
      className={`relative flex min-h-screen w-full flex-col bg-surface [&>*]:flex-auto ${
        index > 0 ? 'border-t border-[var(--nk-nav-border)]' : ''
      }`}
    >
      {isMounted ? <Slide {...slideProps} /> : null}
    </section>
  )
}
const ScrollSection = memo(ScrollSectionImpl) as typeof ScrollSectionImpl

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
}

export default function SlideDeckPlayer<TSlideProps extends object>({ slides, slideProps }: SlideDeckPlayerProps<TSlideProps>) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isSwipeHintDismissed, setIsSwipeHintDismissed] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('slides')
  const [mountedSections, setMountedSections] = useState<boolean[]>(() => slides.map((_, index) => index === 0))
  const panelListRef = useRef<HTMLDivElement | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)
  const sectionRefs = useRef<Array<HTMLElement | null>>([])
  const currentSlideRef = useRef(0)
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const showSwipeHint = viewMode === 'slides' && currentSlide === 0 && !isSwipeHintDismissed
  const flushDemoData = useDemoDataFlush()

  useEffect(() => {
    currentSlideRef.current = currentSlide
  })

  // Flush any pending interactive-field edits before changing slides.
  const triggerFlush = useCallback(() => {
    if (flushDemoData) {
      flushDemoData()
    }
  }, [flushDemoData])

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < slides.length && index !== currentSlide) {
      triggerFlush()
      setDirection(index > currentSlide ? 1 : -1)
      setCurrentSlide(index)
      if (index === 0) {
        setIsSwipeHintDismissed(false)
      }
    }
  }, [currentSlide, slides.length, triggerFlush])

  const registerSectionRef = useCallback((index: number, el: HTMLElement | null) => {
    sectionRefs.current[index] = el
  }, [])

  const scrollToSection = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    sectionRefs.current[index]?.scrollIntoView({ block: 'start', behavior })
  }, [])

  // Single navigation entry for dots/buttons/panel/keyboard: slide mode switches
  // with the spring transition, scroll mode smooth-scrolls to the section
  // (currentSlide catches up via the observer as the scroll passes by).
  const navigateToSlide = useCallback((index: number) => {
    if (index < 0 || index >= slides.length) return
    if (viewMode === 'scroll') {
      if (index !== currentSlideRef.current) triggerFlush()
      scrollToSection(index)
    } else {
      goToSlide(index)
    }
  }, [goToSlide, scrollToSection, slides.length, triggerFlush, viewMode])

  // navigateToSlide changes identity on every slide change; thumbnails get a
  // stable callback through a ref so memo() actually skips them.
  const navigateRef = useRef(navigateToSlide)
  useEffect(() => {
    navigateRef.current = navigateToSlide
  })
  const selectSlide = useCallback((index: number) => {
    navigateRef.current(index)
  }, [])

  const goNext = useCallback(() => navigateToSlide(currentSlide + 1), [currentSlide, navigateToSlide])
  const goPrev = useCallback(() => navigateToSlide(currentSlide - 1), [currentSlide, navigateToSlide])
  const goFirst = useCallback(() => navigateToSlide(0), [navigateToSlide])
  const goLast = useCallback(() => navigateToSlide(slides.length - 1), [navigateToSlide])

  const enterScrollMode = useCallback(() => {
    const current = currentSlideRef.current
    // Mount the current slide and its neighbors upfront — no blank sections on entry.
    setMountedSections((prev) => prev.map((mounted, index) => mounted || Math.abs(index - current) <= 1))
    setViewMode('scroll')
  }, [])

  const exitScrollMode = useCallback(() => setViewMode('slides'), [])

  const toggleViewMode = useCallback(() => {
    if (viewMode === 'scroll') {
      exitScrollMode()
    } else {
      enterScrollMode()
    }
  }, [enterScrollMode, exitScrollMode, viewMode])

  // Entering scroll view jumps straight to the current slide (mode continuity;
  // the way back needs nothing: currentSlide is already tracked by the observer).
  useLayoutEffect(() => {
    if (viewMode !== 'scroll') return
    scrollToSection(currentSlideRef.current, 'auto')
  }, [scrollToSection, viewMode])

  // Lazy-mount scroll sections: a slide mounts as it approaches the viewport
  // (~a third of a screen ahead) — entrance animations play when the viewer
  // scrolls to it, and N trees don't mount at once on mode entry. Never
  // unmounted back: replayed animations and lost focus in interactive fields
  // cost more than the memory.
  useEffect(() => {
    if (viewMode !== 'scroll') return
    const area = scrollAreaRef.current
    if (!area) return
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const index = Number((entry.target as HTMLElement).dataset.sectionIndex)
        if (Number.isNaN(index)) continue
        setMountedSections((prev) => {
          if (prev[index]) return prev
          const next = [...prev]
          next[index] = true
          return next
        })
        observer.unobserve(entry.target)
      }
    }, { root: area, rootMargin: '35% 0px 35% 0px' })
    for (const el of sectionRefs.current) {
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [slides.length, viewMode])

  // Active slide in scroll view = the section under the viewport middle: the
  // observer root is shrunk to a narrow center band (rootMargin −49%), and at any
  // moment exactly one section crosses it (sections are at least a screen tall
  // and stack with no gaps).
  useEffect(() => {
    if (viewMode !== 'scroll') return
    const area = scrollAreaRef.current
    if (!area) return
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const index = Number((entry.target as HTMLElement).dataset.sectionIndex)
        if (Number.isNaN(index) || index === currentSlideRef.current) continue
        triggerFlush()
        setCurrentSlide(index)
      }
    }, { root: area, rootMargin: '-49% 0px -49% 0px' })
    for (const el of sectionRefs.current) {
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [slides.length, triggerFlush, viewMode])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return
      // Space/Enter on a focused button/link activate it — don't hijack those.
      if (
        (event.key === ' ' || event.key === 'Enter') &&
        event.target instanceof HTMLElement &&
        event.target.closest('button, a')
      ) {
        return
      }
      // In scroll view the intercepted keys get preventDefault: the scroll
      // container has native reactions of its own — without it actions double up.
      const isScroll = viewMode === 'scroll'
      const area = scrollAreaRef.current
      switch (event.key) {
        case 'ArrowRight':
        case ' ':
        case 'Enter':
          if (isScroll) event.preventDefault()
          goNext()
          break
        case 'ArrowLeft':
        case 'Backspace':
          if (isScroll) event.preventDefault()
          goPrev()
          break
        case 'Home':
          if (isScroll) event.preventDefault()
          goFirst()
          break
        case 'End':
          if (isScroll) event.preventDefault()
          goLast()
          break
        case 'ArrowDown':
        case 'ArrowUp':
          // PDF-like free scrolling in small steps (in slide mode these keys are
          // not ours — a tall slide scrolls itself natively).
          if (isScroll && area) {
            event.preventDefault()
            area.scrollBy({ top: event.key === 'ArrowDown' ? 160 : -160, behavior: 'smooth' })
          }
          break
        case 'PageDown':
        case 'PageUp':
          if (isScroll && area) {
            event.preventDefault()
            area.scrollBy({ top: (event.key === 'PageDown' ? 1 : -1) * area.clientHeight * 0.85, behavior: 'smooth' })
          }
          break
        case 'Escape':
          setIsPanelOpen(false)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goFirst, goLast, goNext, goPrev, viewMode])

  // Keep the active thumbnail in view while navigating with the panel open.
  useEffect(() => {
    if (!isPanelOpen) return
    const item = panelListRef.current?.querySelector(`[data-thumb-index="${currentSlide}"]`)
    item?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [currentSlide, isPanelOpen])

  useEffect(() => {
    if (!showSwipeHint) return

    const timeout = window.setTimeout(() => {
      setIsSwipeHintDismissed(true)
    }, 2500)

    return () => window.clearTimeout(timeout)
  }, [showSwipeHint])

  const CurrentSlide = slides[currentSlide]

  const handleTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0]
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    }
  }

  const handleTouchEnd = (event: TouchEvent) => {
    const start = touchStartRef.current
    if (!start) return

    const touch = event.changedTouches[0]
    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)
    const elapsed = Date.now() - start.time

    if (absDx > 60 && absDx > absDy * 1.2 && elapsed < 600) {
      if (dx < 0) {
        goNext()
      } else {
        goPrev()
      }
    }

    touchStartRef.current = null
  }

  return (
    <div className="h-screen w-screen bg-surface overflow-hidden flex">
      <AnimatePresence>
        {isPanelOpen && (
          <motion.aside
            className="hidden md:block shrink-0 overflow-hidden bg-[var(--nk-nav-fade)] border-r border-[var(--nk-nav-border)] backdrop-blur-md"
            initial={{ width: 0 }}
            animate={{ width: PANEL_WIDTH }}
            exit={{ width: 0 }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* Fixed inner width so thumbnails don't reflow while the panel width animates. */}
            <div className="h-full" style={{ width: PANEL_WIDTH }}>
              <div ref={panelListRef} className="flex h-full flex-col items-center gap-3 overflow-y-auto overflow-x-hidden px-4 pb-6 pt-6">
                {slides.map((slide, index) => (
                  <ThumbnailItem
                    key={index}
                    slide={slide}
                    slideProps={slideProps}
                    index={index}
                    isActive={index === currentSlide}
                    label={`Slide ${index + 1}`}
                    onSelect={selectSlide}
                  />
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="relative h-full flex-1 min-w-0">
        {viewMode === 'slides' ? (
          <div className="h-full w-full relative">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0 overflow-y-auto overflow-x-hidden"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <CurrentSlide {...slideProps} />
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div ref={scrollAreaRef} className="h-full w-full overflow-y-auto overflow-x-hidden overscroll-contain">
            {slides.map((slide, index) => (
              <ScrollSection
                key={index}
                slide={slide}
                slideProps={slideProps}
                index={index}
                isMounted={mountedSections[index] ?? false}
                registerRef={registerSectionRef}
              />
            ))}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 z-50 hidden md:block">
          <div className="flex items-center justify-between px-8 py-6 bg-gradient-to-t from-[var(--nk-nav-fade)] to-transparent">
            <div className="flex items-center gap-2">
              <button
                onClick={goFirst}
                disabled={currentSlide === 0}
                className="p-3 rounded-xl bg-[var(--nk-nav-button)] border border-[var(--nk-nav-border)] backdrop-blur-sm hover:bg-[var(--nk-nav-button-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 group"
                title="First slide (Home)"
              >
                <ChevronsLeft className="w-5 h-5 text-[var(--nk-nav-icon)] group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={goPrev}
                disabled={currentSlide === 0}
                className="p-3 rounded-xl bg-[var(--nk-nav-button)] border border-[var(--nk-nav-border)] backdrop-blur-sm hover:bg-[var(--nk-nav-button-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 group"
                title="Previous (←)"
              >
                <ChevronLeft className="w-5 h-5 text-[var(--nk-nav-icon)] group-hover:scale-110 transition-transform" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => navigateToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide
                      ? 'w-8 h-2 bg-[var(--nk-nav-dot-active)]'
                      : 'w-2 h-2 bg-[var(--nk-nav-dot)] hover:bg-[var(--nk-nav-dot-hover)]'
                  }`}
                  title={`Slide ${index + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={goNext}
                disabled={currentSlide === slides.length - 1}
                className="p-3 rounded-xl bg-[var(--nk-nav-button)] border border-[var(--nk-nav-border)] backdrop-blur-sm hover:bg-[var(--nk-nav-button-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 group"
                title="Next (→)"
              >
                <ChevronRight className="w-5 h-5 text-[var(--nk-nav-icon)] group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={goLast}
                disabled={currentSlide === slides.length - 1}
                className="p-3 rounded-xl bg-[var(--nk-nav-button)] border border-[var(--nk-nav-border)] backdrop-blur-sm hover:bg-[var(--nk-nav-button-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 group"
                title="Last slide (End)"
              >
                <ChevronsRight className="w-5 h-5 text-[var(--nk-nav-icon)] group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showSwipeHint && (
            <motion.div
              className="absolute top-20 left-1/2 z-40 -translate-x-1/2 md:hidden pointer-events-none"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.35 }}
            >
              <div className="flex items-center gap-4 px-5 py-3 rounded-full bg-[var(--nk-nav-chip)] border border-[var(--nk-nav-border)] backdrop-blur-sm text-ink-soft text-base font-semibold shadow-md">
                <div className="relative h-6 w-20">
                  <div className="absolute left-1/2 top-1/2 h-[2px] w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-[var(--nk-nav-dot)] to-transparent" />
                  <motion.div
                    className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-[var(--nk-nav-button-hover)] shadow-[0_4px_10px_rgba(15,23,42,0.25)] border border-[var(--nk-nav-border)]"
                    animate={{ x: [4, 44, 4], scale: [1, 1.06, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute top-1/2 h-7 w-7 -translate-y-1/2 rounded-full border border-[var(--nk-nav-dot)]"
                    animate={{ x: [2, 42, 2], opacity: [0, 0.45, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
                <span>Swipe →</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute left-0 right-0 z-50 md:hidden bottom-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between px-4 pt-3 pb-3 bg-gradient-to-t from-[var(--nk-nav-fade)] to-transparent">
            <button
              onClick={goFirst}
              disabled={currentSlide === 0}
              className="p-2 rounded-lg bg-[var(--nk-nav-chip)] border border-[var(--nk-nav-border)] backdrop-blur-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              title="First slide"
              aria-label="First slide"
            >
              <ChevronsLeft className="w-5 h-5 text-[var(--nk-nav-icon)]" />
            </button>
            <button
              onClick={goPrev}
              disabled={currentSlide === 0}
              className="p-2 rounded-lg bg-[var(--nk-nav-chip)] border border-[var(--nk-nav-border)] backdrop-blur-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              title="Previous"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 text-[var(--nk-nav-icon)]" />
            </button>
            <div className="px-3 py-1.5 rounded-full bg-[var(--nk-nav-chip)] border border-[var(--nk-nav-border)] backdrop-blur-sm text-ink-soft text-xs font-medium">
              {currentSlide + 1} / {slides.length}
            </div>
            <button
              onClick={goNext}
              disabled={currentSlide === slides.length - 1}
              className="p-2 rounded-lg bg-[var(--nk-nav-chip)] border border-[var(--nk-nav-border)] backdrop-blur-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              title="Next"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 text-[var(--nk-nav-icon)]" />
            </button>
            <button
              onClick={goLast}
              disabled={currentSlide === slides.length - 1}
              className="p-2 rounded-lg bg-[var(--nk-nav-chip)] border border-[var(--nk-nav-border)] backdrop-blur-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              title="Last slide"
              aria-label="Last slide"
            >
              <ChevronsRight className="w-5 h-5 text-[var(--nk-nav-icon)]" />
            </button>
          </div>
        </div>

        <div className="absolute top-6 right-8 z-50 hidden md:block">
          <div className="px-4 py-2 rounded-full bg-[var(--nk-nav-chip)] border border-[var(--nk-nav-border)] backdrop-blur-sm text-ink-soft text-sm font-medium">
            {currentSlide + 1} / {slides.length}
          </div>
        </div>

        <div className="absolute top-6 left-8 z-50 hidden md:flex items-center gap-2">
          <button
            onClick={() => setIsPanelOpen((prev) => !prev)}
            className="p-3 rounded-xl bg-[var(--nk-nav-button)] border border-[var(--nk-nav-border)] backdrop-blur-sm hover:bg-[var(--nk-nav-button-hover)] transition-all duration-200 group"
            title={isPanelOpen ? 'Hide slides (Esc)' : 'Slides'}
            aria-label={isPanelOpen ? 'Hide slide panel' : 'Show slide panel'}
            aria-expanded={isPanelOpen}
          >
            {isPanelOpen ? (
              <PanelLeftClose className="w-5 h-5 text-[var(--nk-nav-icon)] group-hover:scale-110 transition-transform" />
            ) : (
              <PanelLeft className="w-5 h-5 text-[var(--nk-nav-icon)] group-hover:scale-110 transition-transform" />
            )}
          </button>
          <button
            onClick={toggleViewMode}
            className="p-3 rounded-xl bg-[var(--nk-nav-button)] border border-[var(--nk-nav-border)] backdrop-blur-sm hover:bg-[var(--nk-nav-button-hover)] transition-all duration-200 group"
            title={viewMode === 'scroll' ? 'Slide view' : 'Scroll view'}
            aria-label={viewMode === 'scroll' ? 'Switch to slide view' : 'Switch to scroll view'}
            aria-pressed={viewMode === 'scroll'}
          >
            {viewMode === 'scroll' ? (
              <GalleryHorizontal className="w-5 h-5 text-[var(--nk-nav-icon)] group-hover:scale-110 transition-transform" />
            ) : (
              <GalleryVertical className="w-5 h-5 text-[var(--nk-nav-icon)] group-hover:scale-110 transition-transform" />
            )}
          </button>
        </div>

        <div className="absolute right-3 z-50 md:hidden top-[calc(0.75rem+env(safe-area-inset-top))]">
          <button
            onClick={toggleViewMode}
            className="p-2 rounded-lg bg-[var(--nk-nav-chip)] border border-[var(--nk-nav-border)] backdrop-blur-sm transition-all duration-200"
            title={viewMode === 'scroll' ? 'Slide view' : 'Scroll view'}
            aria-label={viewMode === 'scroll' ? 'Switch to slide view' : 'Switch to scroll view'}
            aria-pressed={viewMode === 'scroll'}
          >
            {viewMode === 'scroll' ? (
              <GalleryHorizontal className="w-5 h-5 text-[var(--nk-nav-icon)]" />
            ) : (
              <GalleryVertical className="w-5 h-5 text-[var(--nk-nav-icon)]" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
