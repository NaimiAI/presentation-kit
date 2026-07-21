// Slide deck engine — identical look and behavior to the built-in Naimi decks:
// spring slide transitions, keyboard navigation (←/→/Home/End/Space/Enter),
// touch swipe with a first-slide hint, desktop dot navigation, mobile bar,
// collapsible thumbnail panel that docks left and pushes the deck (desktop,
// PowerPoint-style).
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, PanelLeft, PanelLeftClose } from 'lucide-react'
import type { ComponentType } from 'react'
import type { TouchEvent } from 'react'
import { useDemoDataFlush } from './hooks'

interface SlideDeckPlayerProps<TSlideProps extends object> {
  slides: Array<ComponentType<TSlideProps>>
  slideProps: TSlideProps
}

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
  const panelListRef = useRef<HTMLDivElement | null>(null)
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const showSwipeHint = currentSlide === 0 && !isSwipeHintDismissed
  const flushDemoData = useDemoDataFlush()

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

  // goToSlide changes identity on every slide change; thumbnails get a stable
  // callback through a ref so memo() actually skips them.
  const goToSlideRef = useRef(goToSlide)
  useEffect(() => {
    goToSlideRef.current = goToSlide
  })
  const selectSlide = useCallback((index: number) => {
    goToSlideRef.current(index)
  }, [])

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      triggerFlush()
      setDirection(1)
      setCurrentSlide((prev) => prev + 1)
    }
  }, [currentSlide, slides.length, triggerFlush])

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      triggerFlush()
      const nextIndex = currentSlide - 1
      setDirection(-1)
      setCurrentSlide(nextIndex)
      if (nextIndex === 0) {
        setIsSwipeHintDismissed(false)
      }
    }
  }, [currentSlide, triggerFlush])

  const goToFirst = useCallback(() => {
    if (currentSlide !== 0) {
      triggerFlush()
      setDirection(-1)
      setCurrentSlide(0)
      setIsSwipeHintDismissed(false)
    }
  }, [currentSlide, triggerFlush])

  const goToLast = useCallback(() => {
    if (currentSlide !== slides.length - 1) {
      triggerFlush()
      setDirection(1)
      setCurrentSlide(slides.length - 1)
    }
  }, [currentSlide, slides.length, triggerFlush])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return
      switch (event.key) {
        case 'ArrowRight':
        case ' ':
        case 'Enter':
          nextSlide()
          break
        case 'ArrowLeft':
        case 'Backspace':
          prevSlide()
          break
        case 'Home':
          goToFirst()
          break
        case 'End':
          goToLast()
          break
        case 'Escape':
          setIsPanelOpen(false)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToFirst, goToLast, nextSlide, prevSlide])

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
        nextSlide()
      } else {
        prevSlide()
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

        <div className="absolute bottom-0 left-0 right-0 z-50 hidden md:block">
          <div className="flex items-center justify-between px-8 py-6 bg-gradient-to-t from-[var(--nk-nav-fade)] to-transparent">
            <div className="flex items-center gap-2">
              <button
                onClick={goToFirst}
                disabled={currentSlide === 0}
                className="p-3 rounded-xl bg-[var(--nk-nav-button)] border border-[var(--nk-nav-border)] backdrop-blur-sm hover:bg-[var(--nk-nav-button-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 group"
                title="First slide (Home)"
              >
                <ChevronsLeft className="w-5 h-5 text-[var(--nk-nav-icon)] group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={prevSlide}
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
                  onClick={() => goToSlide(index)}
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
                onClick={nextSlide}
                disabled={currentSlide === slides.length - 1}
                className="p-3 rounded-xl bg-[var(--nk-nav-button)] border border-[var(--nk-nav-border)] backdrop-blur-sm hover:bg-[var(--nk-nav-button-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 group"
                title="Next (→)"
              >
                <ChevronRight className="w-5 h-5 text-[var(--nk-nav-icon)] group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={goToLast}
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
              onClick={goToFirst}
              disabled={currentSlide === 0}
              className="p-2 rounded-lg bg-[var(--nk-nav-chip)] border border-[var(--nk-nav-border)] backdrop-blur-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              title="First slide"
              aria-label="First slide"
            >
              <ChevronsLeft className="w-5 h-5 text-[var(--nk-nav-icon)]" />
            </button>
            <button
              onClick={prevSlide}
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
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="p-2 rounded-lg bg-[var(--nk-nav-chip)] border border-[var(--nk-nav-border)] backdrop-blur-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              title="Next"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 text-[var(--nk-nav-icon)]" />
            </button>
            <button
              onClick={goToLast}
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

        <div className="absolute top-6 left-8 z-50 hidden md:block">
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
        </div>
      </div>
    </div>
  )
}
