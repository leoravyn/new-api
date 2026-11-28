import { motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { PublicLayout } from '@/components/layout'
import { Footer } from '@/components/layout/components/footer'
import { normalizeInterfaceLanguage } from '@/i18n/languages'
import { cn } from '@/lib/utils'

import { TokexHeroSection } from './components/tokex/hero-section'
import { HomeShowcase } from './components/tokex/home-showcase'

const EASE_LIQUID = [0.22, 1, 0.36, 1] as const
const WHEEL_COOLDOWN_MS = 750
const WHEEL_THRESHOLD = 18

export function Home() {
  const { i18n } = useTranslation()
  const prefersReducedMotion = useReducedMotion()
  const isZh =
    normalizeInterfaceLanguage(i18n.resolvedLanguage || i18n.language) ===
    'zhCN'

  const [activePage, setActivePage] = useState<0 | 1>(0)
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(min-width: 1024px)').matches
      : false
  )
  const lastSwitchRef = useRef<number>(0)
  const panel2Ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(min-width: 1024px)')
    const sync = () => setIsDesktop(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const goToPage = useCallback((nextPage: 0 | 1) => {
    const now = Date.now()
    lastSwitchRef.current = now
    setActivePage(nextPage)
    if (nextPage === 1 && panel2Ref.current) {
      panel2Ref.current.scrollTop = 0
    }
  }, [])

  // Keyboard navigation on desktop pager
  useEffect(() => {
    if (!isDesktop) return
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return
      }
      if (
        (event.key === 'ArrowDown' || event.key === 'PageDown') &&
        activePage === 0
      ) {
        event.preventDefault()
        goToPage(1)
      } else if (
        (event.key === 'ArrowUp' || event.key === 'PageUp') &&
        activePage === 1 &&
        (panel2Ref.current?.scrollTop ?? 0) <= 2
      ) {
        event.preventDefault()
        goToPage(0)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activePage, goToPage, isDesktop])

  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      if (!isDesktop) return
      const now = Date.now()
      if (now - lastSwitchRef.current < WHEEL_COOLDOWN_MS) {
        return
      }

      if (activePage === 0 && event.deltaY > WHEEL_THRESHOLD) {
        goToPage(1)
        return
      }

      if (activePage === 1 && event.deltaY < -WHEEL_THRESHOLD) {
        const scrollTop = panel2Ref.current?.scrollTop ?? 0
        if (scrollTop <= 2) {
          goToPage(0)
        }
      }
    },
    [activePage, goToPage, isDesktop]
  )

  return (
    <PublicLayout
      showMainContainer={false}
      showFooter={false}
      lockViewport={isDesktop}
      backdropPreset={isDesktop && activePage === 1 ? 'home-1' : 'home-0'}
      headerProps={
        isDesktop ? { disableScrollElevation: true } : undefined
      }
    >
      {isDesktop ? (
        <div
          onWheel={handleWheel}
          className='relative h-svh w-full overflow-hidden'
        >
          {/* Right edge page indicator */}
          <nav
            aria-label={isZh ? '页面切换指示' : 'Section indicator'}
            className='fixed top-1/2 right-5 z-30 flex -translate-y-1/2 flex-col items-center gap-2.5'
          >
            {[0, 1].map((idx) => {
              const isActive = activePage === idx
              const label =
                idx === 0
                  ? isZh
                    ? '概览'
                    : 'Overview'
                  : isZh
                    ? '接入与生态'
                    : 'Connect'
              return (
                <button
                  key={idx}
                  type='button'
                  onClick={() => goToPage(idx as 0 | 1)}
                  title={label}
                  aria-label={label}
                  aria-current={isActive ? 'step' : undefined}
                  className='group flex cursor-pointer items-center p-1 focus:outline-none'
                >
                  <span
                    className={cn(
                      'block w-1.5 rounded-full transition-all duration-300',
                      isActive
                        ? 'h-6 bg-white shadow-[0_0_10px_rgba(255,255,255,0.45)]'
                        : 'h-2 bg-white/25 group-hover:h-3 group-hover:bg-white/60'
                    )}
                  />
                </button>
              )
            })}
          </nav>

          {/* Animated two-page sliding track */}
          <motion.div
            animate={{ y: activePage === 0 ? '0%' : '-50%' }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.72, ease: EASE_LIQUID }
            }
            className='h-[200%] w-full'
          >
            {/* Page 1: Hero */}
            <div className='h-1/2 w-full overflow-hidden lg:pt-14'>
              <TokexHeroSection onScrollDown={() => goToPage(1)} />
            </div>

            {/* Page 2: Showcase + Footer */}
            <div
              ref={panel2Ref}
              className='tokex-scrollbar flex h-1/2 w-full flex-col justify-between overflow-y-auto'
            >
              <div className='flex-1 lg:pt-14'>
                <HomeShowcase visible={activePage === 1} />
              </div>
              <Footer />
            </div>
          </motion.div>
        </div>
      ) : (
        <div className='relative flex min-h-screen flex-col'>
          <div className='flex-1'>
            <TokexHeroSection />
            <HomeShowcase />
          </div>
          <Footer />
        </div>
      )}
    </PublicLayout>
  )
}
