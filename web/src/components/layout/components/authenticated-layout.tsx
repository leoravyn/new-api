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
import { Outlet } from '@tanstack/react-router'

import { CommandMenu } from '@/components/command-menu'
import { SkipToMain } from '@/components/skip-to-main'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'

import { AppHeader } from './app-header'
import { AmbientBackdrop } from './ambient-backdrop'
import { AppSidebar } from './app-sidebar'
import { ConsoleScrollProvider } from './console-scroll-context'

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

export function AuthenticatedLayout(props: AuthenticatedLayoutProps) {
  const defaultOpen = getCookie('sidebar_state') !== 'false'
  const signedIn = useAuthStore((s) => !!s.auth.user)
  // Unmount pages on sign-out, otherwise their queries refetch and toast "Session expired!" / "invalid access token"
  if (!signedIn) return null

  return (
    <LayoutProvider>
      <SearchProvider>
        <ConsoleScrollProvider>
          <div className='relative min-h-svh w-full md:h-svh md:overflow-hidden'>
            <AmbientBackdrop preset='console' className='hidden dark:block' />
            <SidebarProvider
              defaultOpen={defaultOpen}
              className='bg-sidebar relative z-10 flex-col md:h-svh md:overflow-hidden dark:bg-transparent'
            >
              <SkipToMain />
              <AppHeader className='md:absolute md:inset-x-0 md:top-0' />
              <div className='bg-sidebar flex min-h-0 w-full flex-1 dark:bg-transparent'>
                <AppSidebar />
                <SidebarInset
                  className={cn(
                    '@container/content',
                    'h-[calc(100svh-var(--app-header-height,0px))] md:h-svh',
                    'min-h-0 min-w-0 overflow-hidden'
                  )}
                >
                  {props.children ?? <Outlet />}
                </SidebarInset>
              </div>
            </SidebarProvider>
          </div>
          <CommandMenu />
        </ConsoleScrollProvider>
      </SearchProvider>
    </LayoutProvider>
  )
}
