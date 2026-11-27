/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@/components/dialog'
import { LanguageSwitcher } from '@/components/language-switcher'
import { NotificationPopover } from '@/components/notification-popover'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useNotifications } from '@/hooks/use-notifications'
import { useSystemConfig } from '@/hooks/use-system-config'
import { useTopNavLinks } from '@/hooks/use-top-nav-links'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'

import { defaultTopNavLinks } from '../config/top-nav.config'
import type { TopNavLink } from '../types'
import {
  HeaderConsoleButton,
  splitHeaderNavLinks,
} from './header-console-action'
import { HeaderLogo } from './header-logo'

const AUTH_PROMPT_SECONDS = 5

type AuthPromptTarget = {
  title: string
  href: string
}

export interface PublicHeaderProps {
  navLinks?: TopNavLink[]
  mobileLinks?: TopNavLink[]
  navContent?: React.ReactNode
  showThemeSwitch?: boolean
  showLanguageSwitcher?: boolean
  logo?: React.ReactNode
  siteName?: string
  homeUrl?: string
  leftContent?: React.ReactNode
  rightContent?: React.ReactNode
  showNavigation?: boolean
  showAuthButtons?: boolean
  showNotifications?: boolean
  className?: string
}

export function PublicHeader(props: PublicHeaderProps) {
  const {
    navLinks = defaultTopNavLinks,
    showThemeSwitch: _showThemeSwitch = false,
    showLanguageSwitcher = true,
    logo: customLogo,
    siteName: customSiteName,
    homeUrl = '/',
    showAuthButtons = true,
    showNotifications = true,
  } = props

  const { t } = useTranslation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [authPromptTarget, setAuthPromptTarget] =
    useState<AuthPromptTarget | null>(null)
  const [authPromptSecondsLeft, setAuthPromptSecondsLeft] =
    useState(AUTH_PROMPT_SECONDS)
  const { auth } = useAuthStore()
  const {
    systemName,
    logo: systemLogo,
    loading,
    logoLoaded,
  } = useSystemConfig()
  const dynamicLinks = useTopNavLinks()
  const notifications = useNotifications()
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  const user = auth.user
  const isAuthenticated = !!user
  const rawSiteName = customSiteName || systemName || 'TOKEX'
  const displaySiteName =
    rawSiteName.toLowerCase() === 'new api' ||
    rawSiteName.toLowerCase() === 'tokex'
      ? 'TOKEX'
      : rawSiteName
  const allLinks = dynamicLinks.length > 0 ? dynamicLinks : navLinks
  const { navLinks: links, consoleLink } = splitHeaderNavLinks(allLinks)

  let logoContent: ReactNode = (
    <HeaderLogo
      src={systemLogo}
      loading={loading}
      logoLoaded={logoLoaded}
      className='size-full rounded-lg object-contain'
    />
  )
  if (customLogo) logoContent = customLogo
  if (loading) logoContent = <Skeleton className='size-full rounded-lg' />

  const consoleLabel = consoleLink ? t(consoleLink.title) : t('Console')

  let authContent: ReactNode = (
    <Link
      to='/sign-in'
      className='inline-flex shrink-0 items-center justify-center rounded-lg border border-white/20 bg-gradient-to-b from-[#fafafa] via-[#ededf0] to-[#d6d6db] px-3.5 py-1.5 text-sm font-medium whitespace-nowrap text-[#08080a] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_1px_3px_0_rgba(0,0,0,0.45)] transition-all duration-200 hover:from-[#ffffff] hover:via-[#f4f4f6] hover:to-[#e0e0e5]'
    >
      {t('Sign in')}
    </Link>
  )
  if (isAuthenticated) {
    authContent = consoleLink ? (
      <HeaderConsoleButton
        label={consoleLabel}
        emphasized
        disabled={consoleLink.disabled}
      />
    ) : null
  }
  if (loading) authContent = <Skeleton className='h-8 w-20 rounded-lg' />

  useEffect(() => {
    const syncScrollState = () => {
      setIsScrolled(window.scrollY > 8)
    }
    syncScrollState()
    window.addEventListener('scroll', syncScrollState, { passive: true })
    return () => {
      window.removeEventListener('scroll', syncScrollState)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!authPromptTarget) return

    const intervalId = window.setInterval(() => {
      setAuthPromptSecondsLeft((seconds) => Math.max(seconds - 1, 0))
    }, 1000)

    const timeoutId = window.setTimeout(() => {
      const redirect = authPromptTarget.href
      setAuthPromptTarget(null)
      navigate({ to: '/sign-in', search: { redirect } })
    }, AUTH_PROMPT_SECONDS * 1000)

    return () => {
      window.clearInterval(intervalId)
      window.clearTimeout(timeoutId)
    }
  }, [authPromptTarget, navigate])

  const closeAuthPrompt = useCallback(() => {
    setAuthPromptTarget(null)
    setAuthPromptSecondsLeft(AUTH_PROMPT_SECONDS)
  }, [])

  const navigateToSignIn = useCallback(() => {
    const redirect = authPromptTarget?.href || '/'
    setAuthPromptTarget(null)
    navigate({ to: '/sign-in', search: { redirect } })
  }, [authPromptTarget?.href, navigate])

  const handleNavLinkClick = useCallback(
    (
      event: React.MouseEvent<HTMLAnchorElement>,
      link: TopNavLink,
      closeMobile = false
    ) => {
      if (link.disabled) {
        event.preventDefault()
        return
      }

      if (link.requiresAuth) {
        event.preventDefault()
        if (closeMobile) {
          setMobileOpen(false)
        }
        setAuthPromptSecondsLeft(AUTH_PROMPT_SECONDS)
        setAuthPromptTarget({
          title: t(link.title),
          href: link.href,
        })
        return
      }

      if (closeMobile) {
        setMobileOpen(false)
      }
    },
    [t]
  )

  const showElevatedBar = isScrolled || mobileOpen

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 h-14 w-full border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
          showElevatedBar
            ? 'border-white/[0.05] bg-[#08080a]/48 backdrop-blur-2xl backdrop-saturate-150'
            : 'border-transparent bg-transparent backdrop-blur-none',
          props.className
        )}
      >
        <div className='flex h-full w-full items-center justify-between gap-2 px-4 md:px-6'>
          <nav className='flex w-full items-center justify-between gap-2'>
            {/* Left: Logo + Primary Nav */}
            <div className='flex min-w-0 flex-1 items-center gap-4 lg:gap-6'>
              <div className='@container/system-brand flex min-w-0 shrink-0 items-center gap-1'>
                <Link
                  to={homeUrl}
                  aria-label={displaySiteName}
                  className='group flex min-w-0 items-center gap-2.5'
                >
                  {loading ? (
                    <Skeleton className='h-8 w-28 rounded-lg' />
                  ) : !customLogo && displaySiteName === 'TOKEX' ? (
                    <img
                      src='/logo-tokex.svg'
                      alt='TOKEX'
                      width={226}
                      height={64}
                      className='h-8 w-auto shrink-0 object-contain transition-transform duration-300 select-none group-hover:scale-[1.02]'
                    />
                  ) : (
                    <>
                      <div className='flex size-7 shrink-0 items-center justify-center transition-all duration-300 group-hover:scale-105'>
                        {logoContent}
                      </div>
                      <span
                        className='max-w-48 truncate text-sm font-semibold tracking-tight'
                        title={displaySiteName}
                      >
                        {displaySiteName}
                      </span>
                    </>
                  )}
                </Link>
              </div>

              {/* Desktop nav grouped beside logo */}
              <div className='hidden min-w-0 items-center gap-0.5 lg:flex'>
                {links.map((link) => {
                  const isActive = pathname === link.href
                  if (link.external) {
                    return (
                      <a
                        key={`${link.title}:${link.href}`}
                        href={link.href}
                        title={t(link.title)}
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-disabled={link.disabled}
                        tabIndex={link.disabled ? -1 : undefined}
                        onClick={(event) => handleNavLinkClick(event, link)}
                        className={cn(
                          'text-muted-foreground hover:text-foreground min-w-0 truncate rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors duration-200',
                          link.disabled && 'pointer-events-none opacity-50'
                        )}
                      >
                        {t(link.title)}
                      </a>
                    )
                  }
                  return (
                    <Link
                      key={`${link.title}:${link.href}`}
                      to={link.href}
                      title={t(link.title)}
                      disabled={link.disabled}
                      onClick={(event) => handleNavLinkClick(event, link)}
                      className={cn(
                        'min-w-0 truncate rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
                        isActive
                          ? 'bg-white/[0.06] text-[#f4f4f5] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] ring-1 ring-white/[0.12]'
                          : 'text-muted-foreground hover:bg-white/[0.04] hover:text-foreground',
                        link.disabled && 'pointer-events-none opacity-50'
                      )}
                    >
                      {t(link.title)}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Right: Utilities + Console CTA */}
            <div className='hidden shrink-0 items-center gap-1.5 lg:flex'>
              {showNotifications && (
                <NotificationPopover
                  open={notifications.popoverOpen}
                  onOpenChange={notifications.setPopoverOpen}
                  unreadCount={notifications.unreadCount}
                  activeTab={notifications.activeTab}
                  onTabChange={notifications.setActiveTab}
                  notice={notifications.notice}
                  announcements={notifications.announcements}
                  loading={notifications.loading}
                />
              )}
              {showLanguageSwitcher && <LanguageSwitcher />}

              {showAuthButtons && authContent && (
                <>
                  <div className='mx-1 h-4 w-px bg-[rgba(255,255,255,0.1)]' />
                  {authContent}
                </>
              )}
            </div>

            {/* Mobile: compact actions + hamburger */}
            <div className='flex shrink-0 items-center gap-2 lg:hidden'>
              {showLanguageSwitcher && <LanguageSwitcher />}
              {showAuthButtons && !loading && isAuthenticated && consoleLink && (
                <HeaderConsoleButton
                  label={consoleLabel}
                  emphasized
                  disabled={consoleLink.disabled}
                  className='px-2.5 py-1 text-xs'
                />
              )}
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='size-9'
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={t('Toggle navigation menu')}
              >
                <div className='relative size-4'>
                  <span
                    className={cn(
                      'absolute inset-x-0 block h-[1.5px] origin-center rounded-full bg-current transition-all duration-300',
                      mobileOpen ? 'top-[7px] rotate-45' : 'top-[3px]'
                    )}
                  />
                  <span
                    className={cn(
                      'absolute inset-x-0 top-[7px] block h-[1.5px] rounded-full bg-current transition-all duration-300',
                      mobileOpen ? 'scale-x-0 opacity-0' : 'opacity-100'
                    )}
                  />
                  <span
                    className={cn(
                      'absolute inset-x-0 block h-[1.5px] origin-center rounded-full bg-current transition-all duration-300',
                      mobileOpen ? 'top-[7px] -rotate-45' : 'top-[11px]'
                    )}
                  />
                </div>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      <div
        className={cn(
          'bg-background/98 fixed inset-0 z-40 backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:pointer-events-none lg:hidden',
          mobileOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        )}
      >
        <div className='flex h-full flex-col justify-between px-8 pt-20 pb-10'>
          <nav className='flex flex-col gap-1'>
            {links.map((link, i) => {
              const isActive = pathname === link.href
              const linkClassName = cn(
                'flex items-center gap-3 py-3 text-base font-medium tracking-tight transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                mobileOpen
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0',
                isActive ? 'text-foreground' : 'text-muted-foreground',
                link.disabled && 'pointer-events-none opacity-50'
              )
              const transitionStyle = {
                transitionDelay: mobileOpen ? `${100 + i * 50}ms` : '0ms',
              }
              if (link.external) {
                return (
                  <a
                    key={`${link.title}:${link.href}`}
                    href={link.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-disabled={link.disabled}
                    tabIndex={link.disabled ? -1 : undefined}
                    onClick={(event) => handleNavLinkClick(event, link, true)}
                    className={linkClassName}
                    style={transitionStyle}
                  >
                    {t(link.title)}
                  </a>
                )
              }
              return (
                <Link
                  key={`${link.title}:${link.href}`}
                  to={link.href}
                  disabled={link.disabled}
                  onClick={(event) => handleNavLinkClick(event, link, true)}
                  className={linkClassName}
                  style={transitionStyle}
                >
                  {t(link.title)}
                </Link>
              )
            })}
          </nav>

          <div
            className={cn(
              'flex flex-col gap-3 transition-all duration-500',
              mobileOpen
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            )}
            style={{ transitionDelay: mobileOpen ? '250ms' : '0ms' }}
          >
            {showAuthButtons && (
              <Link
                to={isAuthenticated ? '/dashboard' : '/sign-in'}
                onClick={() => setMobileOpen(false)}
                className='inline-flex h-10 items-center justify-center rounded-lg border border-white/20 bg-gradient-to-b from-[#fafafa] via-[#ebebef] to-[#d6d6db] text-sm font-medium text-[#0a0a0b] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_1px_2px_0_rgba(0,0,0,0.45)] transition-all hover:from-[#ffffff] hover:via-[#f2f2f5] hover:to-[#e0e0e5] active:opacity-90'
              >
                {isAuthenticated ? t('Go to Dashboard') : t('Sign in')}
              </Link>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={!!authPromptTarget}
        onOpenChange={(open) => {
          if (!open) {
            closeAuthPrompt()
          }
        }}
        title={t('Sign in required')}
        description={t('Please sign in to view {{module}}.', {
          module: authPromptTarget?.title || '',
        })}
        contentClassName='sm:max-w-md'
        contentHeight='auto'
        footer={
          <>
            <Button variant='outline' onClick={closeAuthPrompt}>
              {t('Cancel')}
            </Button>
            <Button onClick={navigateToSignIn}>{t('Sign in now')}</Button>
          </>
        }
      >
        <div className='bg-muted/40 text-muted-foreground rounded-lg px-3 py-2 text-sm'>
          {t('Redirecting to sign in in {{seconds}} seconds.', {
            seconds: authPromptSecondsLeft,
          })}
        </div>
      </Dialog>
    </>
  )
}
