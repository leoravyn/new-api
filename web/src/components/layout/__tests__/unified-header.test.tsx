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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router'
import { cleanup, render, screen } from '@testing-library/react'
import i18next from 'i18next'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { SearchProvider } from '@/context/search-provider'
import { LayoutProvider } from '@/context/layout-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { STATUS_QUERY_KEY } from '@/lib/status-query'
import { useAuthStore } from '@/stores/auth-store'
import { useSystemConfigStore } from '@/stores/system-config-store'

import { AppHeader } from '../components/app-header'
import { AppSidebar } from '../components/app-sidebar'
import { PublicHeader } from '../components/public-header'

let queryClient: QueryClient

function renderWithRouter(
  node: React.ReactNode,
  initialPath = '/',
  sidebarDefaultOpen = true
) {
  const root = createRootRoute({
    component: () => <Outlet />,
  })

  const routes = [
    createRoute({
      getParentRoute: () => root,
      path: '/',
      component: () => <>{node}</>,
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/dashboard',
      component: () => <>{node}</>,
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/pricing',
      component: () => <div>Pricing</div>,
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/rankings',
      component: () => <div>Rankings</div>,
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/docs',
      component: () => <div>Docs</div>,
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/profile',
      component: () => <div>Profile</div>,
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/sign-in',
      component: () => <div>Sign In</div>,
    }),
  ]

  const router = createRouter({
    routeTree: root.addChildren(routes),
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <LayoutProvider>
        <SearchProvider>
          <SidebarProvider defaultOpen={sidebarDefaultOpen}>
            <RouterProvider router={router} />
          </SidebarProvider>
        </SearchProvider>
      </LayoutProvider>
    </QueryClientProvider>
  )
}

beforeEach(async () => {
  await i18next.changeLanguage('en')
  useSystemConfigStore.setState({ loading: false })
  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  queryClient.setQueryData(STATUS_QUERY_KEY, {
    system_name: 'TOKEX',
    docs_link: '/docs',
  })
})

afterEach(() => {
  cleanup()
})

describe('Unified PublicHeader and AppHeader', () => {
  it('shows emphasized Console button on PublicHeader when signed in without avatar dropdown', async () => {
    useAuthStore.setState((state) => ({
      auth: {
        ...state.auth,
        user: { id: 1, username: 'alice', role: 1 } as never,
      },
    }))

    renderWithRouter(<PublicHeader />, '/')

    const consoleLinks = await screen.findAllByRole('link', { name: 'Console' })
    expect(consoleLinks.length).toBeGreaterThan(0)
    expect(consoleLinks[0]).toHaveAttribute('href', '/dashboard')
    expect(consoleLinks[0].className).toContain('text-sm')
    expect(consoleLinks[0].className).toContain('from-[#fafafa]')
    // Console link should not be duplicated inside the mid nav list
    expect(screen.queryAllByRole('link', { name: 'Console' })).toHaveLength(2) // desktop + mobile compact CTA
  })

  it('shows default active-box Console link on AppHeader without avatar dropdown', async () => {
    useAuthStore.setState((state) => ({
      auth: {
        ...state.auth,
        user: { id: 1, username: 'alice', role: 1 } as never,
      },
    }))

    renderWithRouter(<AppHeader />, '/dashboard')

    const consoleLink = await screen.findByRole('link', { name: 'Console' })
    expect(consoleLink).toHaveAttribute('href', '/dashboard')
    expect(consoleLink.className).toContain('text-sm')
    expect(consoleLink.className).toContain('ring-white/[0.12]')
    expect(consoleLink.className).not.toContain('from-[#fafafa]')
  })

  it('hides sidebar labels when collapsed and keeps sign-out button centered', async () => {
    useAuthStore.setState((state) => ({
      auth: {
        ...state.auth,
        user: { id: 1, username: 'alice', role: 1 } as never,
      },
    }))

    const { container } = renderWithRouter(<AppSidebar />, '/dashboard', false)

    const signOutBtn = await screen.findByRole('button', { name: 'Sign out' })
    expect(signOutBtn).toBeInTheDocument()
    const sidebar = container.querySelector('[data-state="collapsed"]')
    expect(sidebar).not.toBeNull()
    const hiddenLabels = container.querySelectorAll(
      '[class*="group-data-[collapsible=icon]:hidden"]'
    )
    expect(hiddenLabels.length).toBeGreaterThan(0)
  })
})
