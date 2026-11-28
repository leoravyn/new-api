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
import { useLocation } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

import type { TopNavLink } from '../types'
import {
  AmbientBackdrop,
  type AmbientBackdropPreset,
} from './ambient-backdrop'
import { Footer } from './footer'
import { PublicHeader, type PublicHeaderProps } from './public-header'

type PublicLayoutProps = {
  children: React.ReactNode
  showMainContainer?: boolean
  showFooter?: boolean
  showBackdrop?: boolean
  backdropPreset?: AmbientBackdropPreset
  lockViewport?: boolean
  navContent?: React.ReactNode
  headerProps?: Omit<PublicHeaderProps, 'navContent'>
  navLinks?: TopNavLink[]
  showThemeSwitch?: boolean
  showAuthButtons?: boolean
  showNotifications?: boolean
  logo?: React.ReactNode
  siteName?: string
}

export function PublicLayout(props: PublicLayoutProps) {
  const { pathname, hash } = useLocation()
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (props.lockViewport) {
      document.documentElement.scrollTop = 0
    }
    if (!hash) {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0
      }
      document.documentElement.scrollTop = 0
    }
  }, [hash, pathname, props.lockViewport])

  return (
    <div className='bg-background text-foreground relative flex min-h-svh flex-col overflow-x-clip lg:h-svh lg:overflow-hidden dark:bg-transparent'>
      {props.showBackdrop !== false && (
        <AmbientBackdrop preset={props.backdropPreset ?? 'default'} />
      )}

      <PublicHeader
        navContent={props.navContent}
        navLinks={props.navLinks}
        showThemeSwitch={props.showThemeSwitch}
        showAuthButtons={props.showAuthButtons}
        showNotifications={props.showNotifications}
        logo={props.logo}
        siteName={props.siteName}
        {...props.headerProps}
        className={cn(
          'lg:absolute lg:inset-x-0 lg:top-0',
          props.headerProps?.className
        )}
        scrollTargetRef={props.headerProps?.scrollTargetRef ?? scrollContainerRef}
        disableScrollElevation={
          props.headerProps?.disableScrollElevation ?? props.lockViewport
        }
      />

      <div
        ref={scrollContainerRef}
        data-testid='public-scroll-container'
        className={cn(
          'relative z-10 flex flex-1 flex-col',
          props.lockViewport
            ? 'lg:h-full lg:min-h-0 lg:overflow-hidden'
            : 'tokex-scrollbar lg:h-full lg:min-h-0 lg:overflow-x-hidden lg:overflow-y-auto'
        )}
      >
        {props.showMainContainer !== false ? (
          <main
            className={cn(
              'container relative z-10 flex-1 px-4 py-6 md:px-6',
              !props.lockViewport && 'lg:pt-20'
            )}
          >
            {props.children}
          </main>
        ) : (
          <div
            className={cn(
              'relative z-10 flex-1',
              !props.lockViewport && 'lg:pt-14'
            )}
          >
            {props.children}
          </div>
        )}

        {props.showFooter !== false && <Footer />}
      </div>
    </div>
  )
}
