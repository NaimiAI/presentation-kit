// Slide deck engine — identical look and behavior to the built-in Naimi decks:
// spring slide transitions, keyboard navigation (←/→/Home/End/Space/Enter),
// touch swipe with a first-slide hint, desktop dot navigation, mobile bar.
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
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
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToFirst, goToLast, nextSlide, prevSlide])

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
    <div className="h-screen w-screen bg-surface overflow-hidden relative">
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
    </div>
  )
}
