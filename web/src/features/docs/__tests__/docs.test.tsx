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
import userEvent from '@testing-library/user-event'
import i18next from 'i18next'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { useTopNavLinks } from '@/hooks/use-top-nav-links'
import { STATUS_QUERY_KEY } from '@/lib/status-query'
import { useAuthStore } from '@/stores/auth-store'

import { DocsPage } from '../index'

let queryClient: QueryClient

function TopNavSpy() {
  const links = useTopNavLinks()
  const docs = links.find((item) => item.href === '/docs')
  return (
    <div
      data-testid='top-nav-docs'
      data-href={docs?.href ?? ''}
      data-external={String(Boolean(docs?.external))}
    />
  )
}

function renderDocsPage() {
  const root = createRootRoute({
    component: () => <Outlet />,
  })

  const routes = [
    createRoute({
      getParentRoute: () => root,
      path: '/',
      component: () => <div>Home</div>,
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/docs',
      component: () => (
        <>
          <TopNavSpy />
          <DocsPage />
        </>
      ),
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/keys',
      component: () => <div>Keys</div>,
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/pricing',
      component: () => <div>Pricing</div>,
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/wallet',
      component: () => <div>Wallet</div>,
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/rankings',
      component: () => <div>Rankings</div>,
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/terms',
      component: () => <div>Terms</div>,
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/privacy-policy',
      component: () => <div>Privacy</div>,
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/aup',
      component: () => <div>AUP</div>,
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/about',
      component: () => <div>About</div>,
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/sign-in',
      component: () => <div>Sign In</div>,
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/dashboard',
      component: () => <div>Dashboard</div>,
    }),
  ]

  const router = createRouter({
    routeTree: root.addChildren(routes),
    history: createMemoryHistory({ initialEntries: ['/docs'] }),
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

beforeEach(async () => {
  await i18next.changeLanguage('zhCN')
  useAuthStore.setState((state) => ({
    auth: {
      ...state.auth,
      user: null,
      accessToken: null,
      session: null,
    },
  }))
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

describe('DocsPage', () => {
  it('renders /docs in Chinese and English with core configurations and legal links', async () => {
    const user = userEvent.setup()
    renderDocsPage()

    expect(
      await screen.findByRole('heading', { name: 'TOKEX API 接入文档' })
    ).toBeVisible()
    expect(screen.getAllByText(/api\.tokex\.vip/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/gpt-6\.2-astra/).length).toBeGreaterThan(0)
    expect(
      screen.getAllByText(/CLAUDE_CODE_DISABLE_1M_CONTEXT=1/).length
    ).toBeGreaterThan(0)
    expect(
      screen.getAllByText(/\/chat\/completions/).length
    ).toBeGreaterThan(0)

    // Check internal /docs link in TopNav is not treated as external
    const topNavSpy = screen.getByTestId('top-nav-docs')
    expect(topNavSpy).toHaveAttribute('data-href', '/docs')
    expect(topNavSpy).toHaveAttribute('data-external', 'false')

    // Check legal and platform links
    expect(
      screen.getAllByRole('link', { name: '隐私政策' }).length
    ).toBeGreaterThan(0)
    expect(
      screen.getAllByRole('link', { name: '服务条款' }).length
    ).toBeGreaterThan(0)
    expect(
      screen.getAllByRole('link', { name: '关于我们' }).length
    ).toBeGreaterThan(0)

    // Switch SDK tab to cURL
    await user.click(screen.getByRole('tab', { name: 'cURL' }))
    expect(
      screen.getAllByText(/https:\/\/api\.tokex\.vip\/v1\/chat\/completions/)
        .length
    ).toBeGreaterThan(0)

    // Switch language to English
    await user.click(screen.getAllByRole('button', { name: 'English' })[0])
    expect(
      await screen.findByRole('heading', { name: 'TOKEX API Documentation' })
    ).toBeVisible()
  })
})
