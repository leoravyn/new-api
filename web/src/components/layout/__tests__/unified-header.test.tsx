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
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import i18next from 'i18next'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { SearchProvider } from '@/context/search-provider'
import { LayoutProvider } from '@/context/layout-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { installLiquidGlassTracker } from '@/lib/liquid-glass-tracker'
import { STATUS_QUERY_KEY } from '@/lib/status-query'
import { useAuthStore } from '@/stores/auth-store'
import { useSystemConfigStore } from '@/stores/system-config-store'

import { AppHeader } from '../components/app-header'
import { AppSidebar } from '../components/app-sidebar'
import { AuthenticatedLayout } from '../components/authenticated-layout'
import { PublicHeader } from '../components/public-header'
import { PublicLayout } from '../components/public-layout'
import { SectionPageLayout } from '../components/section-page-layout'
import { SystemBrand } from '../components/system-brand'

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
    expect(
      screen.queryByRole('button', { name: 'Notifications' })
    ).toBeNull()
  })

  it('shows default active-box Console link on AppHeader without avatar dropdown or notification bell', async () => {
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
    expect(
      screen.queryByRole('button', { name: 'Notifications' })
    ).toBeNull()
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

  it('aligns inline SystemBrand SVG logo edge cleanly without extra px-1 padding', async () => {
    renderWithRouter(<SystemBrand variant='inline' />, '/dashboard')

    const homeLink = await screen.findByRole('link', { name: 'Go to home' })
    expect(homeLink.className).not.toContain('px-1')
  })

  it('places PublicLayout scroll container below PublicHeader on desktop and reacts to container scroll', async () => {
    const { container } = renderWithRouter(
      <PublicLayout showFooter={false}>
        <div style={{ height: 2000 }}>Tall content</div>
      </PublicLayout>,
      '/'
    )

    const scrollContainer = await screen.findByTestId('public-scroll-container')
    const header = container.querySelector('header')

    expect(header).not.toBeNull()
    expect(header?.className).toContain('lg:absolute')
    expect(header?.className).toContain('border-transparent')
    expect(scrollContainer.className).toContain('lg:h-full')
    expect(scrollContainer.className).toContain('lg:overflow-y-auto')
    expect(scrollContainer.className).toContain('tokex-scrollbar')

    Object.defineProperty(scrollContainer, 'scrollTop', {
      value: 40,
      writable: true,
    })
    fireEvent.scroll(scrollContainer)

    expect(header?.className).toContain('backdrop-blur-2xl')
    expect(header?.className).not.toContain('border-transparent')
  })

  it('keeps PublicHeader transparent when scroll elevation is disabled for Home pager', async () => {
    const { container } = renderWithRouter(
      <PublicLayout lockViewport showFooter={false}>
        <div>Home content</div>
      </PublicLayout>,
      '/'
    )

    const scrollContainer = await screen.findByTestId('public-scroll-container')
    const header = container.querySelector('header')

    expect(header).not.toBeNull()
    expect(scrollContainer.className).toContain('lg:overflow-hidden')
    expect(scrollContainer.className).not.toContain('lg:overflow-y-auto')

    Object.defineProperty(window, 'scrollY', { value: 120, writable: true })
    fireEvent.scroll(window)

    expect(header?.className).toContain('border-transparent')
    expect(header?.className).toContain('bg-transparent')
    expect(header?.className).not.toContain('backdrop-blur-2xl')

    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
  })

  it('mounts console AmbientBackdrop preset and renders rounded-full glass Search trigger in AppHeader', async () => {
    useAuthStore.setState((state) => ({
      auth: {
        ...state.auth,
        user: { id: 1, username: 'alice', role: 1 } as never,
      },
    }))

    renderWithRouter(
      <AuthenticatedLayout>
        <div>Console body</div>
      </AuthenticatedLayout>,
      '/dashboard'
    )

    const backdrop = await screen.findByTestId('ambient-backdrop')
    expect(backdrop).toHaveAttribute('data-preset', 'console')

    const header = document.querySelector('header')
    expect(header?.className).toContain('md:absolute')
    expect(header?.className).toContain('dark:md:border-b-transparent')
    expect(header?.className).toContain('dark:md:bg-transparent')

    const searchBtn = await screen.findByRole('button', { name: 'Search' })
    expect(searchBtn.className).toContain('rounded-full')
    expect(searchBtn.className).not.toContain('rounded-md')
  })

  it('activates frosted glass on Console Header when SectionPageLayout scrolls on desktop', async () => {
    useAuthStore.setState((state) => ({
      auth: {
        ...state.auth,
        user: { id: 1, username: 'alice', role: 1 } as never,
      },
    }))

    const { container } = renderWithRouter(
      <AuthenticatedLayout>
        <SectionPageLayout>
          <SectionPageLayout.Title>Overview</SectionPageLayout.Title>
          <SectionPageLayout.Content>
            <div style={{ height: 2000 }}>Tall console content</div>
          </SectionPageLayout.Content>
        </SectionPageLayout>
      </AuthenticatedLayout>,
      '/dashboard'
    )

    const scrollContainer = await screen.findByTestId(
      'console-scroll-container'
    )
    const header = container.querySelector('header')

    expect(header?.className).toContain('dark:md:bg-transparent')

    Object.defineProperty(scrollContainer, 'scrollTop', {
      value: 48,
      writable: true,
    })
    fireEvent.scroll(scrollContainer)

    expect(header?.className).toContain('md:backdrop-blur-2xl')
    expect(header?.className).toContain('dark:md:bg-[#08080a]/48')
    expect(header?.className).not.toContain('dark:md:bg-transparent')
  })

  it('computes squared edge proximity rim glow across nearby glass cards without abrupt pop', () => {
    const rafQueue: FrameRequestCallback[] = []
    const origRaf = window.requestAnimationFrame
    const origCancel = window.cancelAnimationFrame
    const origMatchMedia = window.matchMedia
    window.requestAnimationFrame = (cb) => {
      rafQueue.push(cb)
      return rafQueue.length
    }
    window.cancelAnimationFrame = () => {}
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: (query: string): MediaQueryList =>
        ({
          matches: false,
          media: query,
          onchange: null,
          addListener: () => undefined,
          removeListener: () => undefined,
          addEventListener: () => undefined,
          removeEventListener: () => undefined,
          dispatchEvent: () => false,
        }) as MediaQueryList,
    })

    const cleanupTracker = installLiquidGlassTracker()
    const nearCard = document.createElement('div')
    nearCard.className = 'tokex-liquid-card'
    nearCard.getBoundingClientRect = () =>
      ({
        left: 100,
        top: 50,
        right: 400,
        bottom: 350,
        width: 300,
        height: 300,
      }) as DOMRect
    document.body.appendChild(nearCard)

    const neighborSidebar = document.createElement('div')
    neighborSidebar.setAttribute('data-slot', 'sidebar-inner')
    neighborSidebar.getBoundingClientRect = () =>
      ({
        left: 10,
        top: 50,
        right: 80,
        bottom: 450,
        width: 70,
        height: 400,
      }) as DOMRect
    document.body.appendChild(neighborSidebar)

    const flush = (x: number, y: number) => {
      const moveEvent = new Event('pointermove', {
        bubbles: true,
      }) as PointerEvent
      Object.defineProperties(moveEvent, {
        clientX: { value: x },
        clientY: { value: y },
        pointerType: { value: 'mouse' },
      })
      document.dispatchEvent(moveEvent)
      while (rafQueue.length > 0) {
        rafQueue.shift()?.(0)
      }
    }

    try {
      // Near top-left border of nearCard (10px from left edge, 30px from neighborSidebar right edge)
      flush(110, 120)
      expect(nearCard.style.getPropertyValue('--lg-x')).toBe('10px')
      expect(nearCard.style.getPropertyValue('--lg-y')).toBe('70px')
      expect(nearCard.style.getPropertyValue('--lg-o')).toBe('1.000')

      // Neighbor card 30px away receives smooth squared outer proximity falloff
      expect(
        Number(neighborSidebar.style.getPropertyValue('--lg-o'))
      ).toBeCloseTo(Math.pow(1 - 30 / 136, 2), 2)

      document.dispatchEvent(new Event('pointerleave'))
      expect(nearCard.style.getPropertyValue('--lg-o')).toBe('0')
      expect(neighborSidebar.style.getPropertyValue('--lg-o')).toBe('0')
    } finally {
      cleanupTracker()
      nearCard.remove()
      neighborSidebar.remove()
      window.requestAnimationFrame = origRaf
      window.cancelAnimationFrame = origCancel
      Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        value: origMatchMedia,
      })
    }
  })
})
