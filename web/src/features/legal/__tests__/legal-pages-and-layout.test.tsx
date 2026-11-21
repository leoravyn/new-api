import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router'
import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import i18next from 'i18next'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Footer } from '@/components/layout/components/footer'
import { About } from '@/features/about'
import * as aboutApi from '@/features/about/api'
import { LegalConsent } from '@/features/auth/components/legal-consent'
import { TermsFooter } from '@/features/auth/components/terms-footer'
import { Home } from '@/features/home'
import * as pricingApi from '@/features/pricing/api'
import { STATUS_QUERY_KEY } from '@/lib/status-query'
import { useAuthStore } from '@/stores/auth-store'

import { AcceptableUsePolicy } from '../aup'
import { PrivacyPolicy } from '../privacy-policy'
import { TermsOfService } from '../terms-of-service'
import { UserAgreement } from '../user-agreement'

let queryClient: QueryClient

function buildTestRouter(initialPath: string) {
  const root = createRootRoute({
    component: () => <Outlet />,
  })

  const routes = [
    createRoute({
      getParentRoute: () => root,
      path: '/',
      component: Home,
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/terms',
      component: TermsOfService,
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/user-agreement',
      component: UserAgreement,
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/privacy-policy',
      component: PrivacyPolicy,
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/aup',
      component: AcceptableUsePolicy,
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/about',
      component: About,
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/pricing',
      component: () => <div>Pricing Page</div>,
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/rankings',
      component: () => <div>Rankings Page</div>,
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/sign-in',
      component: () => <div>Sign In Page</div>,
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/keys',
      component: () => <div>Keys Page</div>,
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/dashboard',
      component: () => <div>Dashboard Page</div>,
    }),
  ]

  return createRouter({
    routeTree: root.addChildren(routes),
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  })
}

function renderAtPath(initialPath: string) {
  const router = buildTestRouter(initialPath)
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

function renderWithRouter(node: React.ReactNode) {
  const root = createRootRoute({
    component: () => <>{node}</>,
  })
  const dummyRoutes = [
    '/',
    '/terms',
    '/user-agreement',
    '/privacy-policy',
    '/aup',
    '/pricing',
    '/rankings',
    '/about',
  ].map((path) =>
    createRoute({
      getParentRoute: () => root,
      path,
      component: () => null,
    })
  )
  const router = createRouter({
    routeTree: root.addChildren(dummyRoutes),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

beforeEach(async () => {
  await i18next.changeLanguage('en')
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
    user_agreement_enabled: false,
    privacy_policy_enabled: false,
    announcements_enabled: false,
  })
  queryClient.setQueryData(['notice'], { success: true, data: '' })
  vi.spyOn(aboutApi, 'getAboutContent').mockResolvedValue({
    success: true,
    message: '',
    data: '',
  })
  vi.spyOn(pricingApi, 'getPricing').mockResolvedValue({
    success: true,
    auto_groups: [],
    group_ratio: {},
    usable_group: {},
    supported_endpoint: {},
    vendors: [],
    data: [],
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Public legal pages, Footer, Home, About, and Auth legal links', () => {
  it('renders /terms unauthenticated and toggles cleanly between English and 中文', async () => {
    const user = userEvent.setup()
    renderAtPath('/terms')

    expect(
      await screen.findByRole('heading', { name: 'Terms of Service' })
    ).toBeVisible()
    expect(screen.getAllByText(/Waffo Pancake/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/support@tokex\.vip/).length).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: '中文' }))

    expect(
      await screen.findByRole('heading', { name: '服务条款' })
    ).toBeVisible()
    expect(screen.getByText(/香港国际仲裁中心（HKIAC）/)).toBeVisible()
  })

  it('renders /user-agreement, /privacy-policy, and /aup with full unauthenticated content', async () => {
    renderAtPath('/user-agreement')
    expect(
      await screen.findByRole('heading', { name: 'Terms of Service' })
    ).toBeVisible()
    cleanup()

    renderAtPath('/privacy-policy')
    expect(
      await screen.findByRole('heading', { name: 'Privacy Policy' })
    ).toBeVisible()
    expect(
      screen.getByText(/never sells, rents, or trades your personal information/i)
    ).toBeVisible()
    cleanup()

    renderAtPath('/aup')
    expect(
      await screen.findByRole('heading', {
        name: 'Acceptable Use Policy',
      })
    ).toBeVisible()
    expect(
      screen.getByRole('heading', {
        name: /Platform Security and Anti-Abuse Rules/i,
      })
    ).toBeVisible()
  })

  it('renders Footer without legacy tagline and always displays legal & support links', async () => {
    renderWithRouter(<Footer />)

    expect(await screen.findByText(/All rights reserved\./)).toBeVisible()
    expect(screen.queryByText(/The Unified Interface for LLMs/i)).toBeNull()
    expect(screen.queryByText(/统一大模型网关底座/)).toBeNull()

    expect(
      screen.getByRole('link', { name: 'Terms of Service' })
    ).toHaveAttribute('href', '/terms')
    expect(
      screen.getByRole('link', { name: 'Privacy Policy' })
    ).toHaveAttribute('href', '/privacy-policy')
    expect(
      screen.getByRole('link', { name: 'Acceptable Use' })
    ).toHaveAttribute('href', '/aup')
    expect(screen.getByRole('link', { name: 'Pricing' })).toHaveAttribute(
      'href',
      '/pricing'
    )
    expect(screen.getByRole('link', { name: 'Rankings' })).toHaveAttribute(
      'href',
      '/rankings'
    )
    expect(
      screen.getByRole('link', { name: 'support@tokex.vip' })
    ).toHaveAttribute('href', 'mailto:support@tokex.vip')

    await act(() => i18next.changeLanguage('zhCN'))
    expect(screen.getByText(/保留所有权利。/)).toBeVisible()
    expect(screen.queryByText(/统一大模型网关底座/)).toBeNull()
    expect(screen.getByRole('link', { name: '服务条款' })).toHaveAttribute(
      'href',
      '/terms'
    )
  })

  it('renders exactly one Footer on Home via PublicLayout', async () => {
    renderAtPath('/')

    const footers = await screen.findAllByRole('contentinfo')
    expect(footers).toHaveLength(1)
  })

  it('renders cleaned About overview without redundant gateway copy and includes legal links', async () => {
    renderAtPath('/about')

    expect(
      await screen.findByRole('heading', { name: 'About TOKEX' })
    ).toBeVisible()
    expect(screen.queryByText(/Enterprise Multi-Model AI Gateway/i)).toBeNull()
    expect(screen.queryByText(/基础设施底座/)).toBeNull()
    expect(
      screen.getAllByRole('link', { name: /Terms of Service/i }).length
    ).toBeGreaterThan(0)
  })

  it('renders only TermsFooter links when DB legal flags are disabled (no duplicate LegalConsent banner)', async () => {
    const onCheckedChange = vi.fn()
    renderWithRouter(
      <div>
        <LegalConsent
          status={{
            user_agreement_enabled: false,
            privacy_policy_enabled: false,
          }}
          checked={true}
          onCheckedChange={onCheckedChange}
        />
        <TermsFooter
          variant='sign-up'
          status={{
            user_agreement_enabled: false,
            privacy_policy_enabled: false,
          }}
        />
      </div>
    )

    expect(
      await screen.findByText(/By creating an account, you agree to our/)
    ).toBeVisible()
    expect(screen.queryByRole('checkbox')).toBeNull()
    expect(
      screen.getAllByRole('link', { name: 'Terms of Service' })
    ).toHaveLength(1)
    expect(
      screen.getAllByRole('link', { name: 'Privacy Policy' })
    ).toHaveLength(1)
    expect(
      screen.getAllByRole('link', { name: 'Acceptable Use Policy' })
    ).toHaveLength(1)

    await act(() => i18next.changeLanguage('zhCN'))
    expect(screen.getByText(/创建账户即表示您同意我们的/)).toBeVisible()
    expect(screen.getAllByRole('link', { name: '《服务条款》' })).toHaveLength(
      1
    )
    expect(screen.getAllByRole('link', { name: '《隐私政策》' })).toHaveLength(
      1
    )
    expect(
      screen.getAllByRole('link', { name: '《可接受使用政策》' })
    ).toHaveLength(1)
  })

  it('renders localized sign-in TermsFooter copy covering password and OAuth login', async () => {
    renderWithRouter(
      <TermsFooter
        variant='sign-in'
        status={{
          user_agreement_enabled: false,
          privacy_policy_enabled: false,
        }}
      />
    )

    expect(
      await screen.findByText(/By continuing, you agree to our/)
    ).toBeVisible()

    await act(() => i18next.changeLanguage('zhCN'))
    expect(screen.getByText(/继续登录即表示您同意我们的/)).toBeVisible()
  })

  it('renders interactive Checkbox in LegalConsent and hides TermsFooter when backend agreement flags are enabled', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    renderWithRouter(
      <div>
        <LegalConsent
          status={{
            user_agreement_enabled: true,
            privacy_policy_enabled: true,
          }}
          checked={false}
          onCheckedChange={onCheckedChange}
        />
        <TermsFooter
          variant='sign-in'
          status={{
            user_agreement_enabled: true,
            privacy_policy_enabled: true,
          }}
        />
      </div>
    )

    const checkbox = await screen.findByRole('checkbox')
    expect(checkbox).not.toBeChecked()
    expect(
      screen.getAllByRole('link', { name: 'Terms of Service' })
    ).toHaveLength(1)
    await user.click(checkbox)
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })
})
