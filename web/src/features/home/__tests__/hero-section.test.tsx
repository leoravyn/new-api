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
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import i18next from 'i18next'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import * as pricingApi from '@/features/pricing/api'
import type { PricingData, PricingModel } from '@/features/pricing/types'
import { STATUS_QUERY_KEY } from '@/lib/status-query'
import { useAuthStore } from '@/stores/auth-store'
import {
  DEFAULT_CURRENCY_CONFIG,
  useSystemConfigStore,
} from '@/stores/system-config-store'

import {
  buildFlagshipModelDisplay,
  selectFlagshipModels,
  TokexHeroSection,
} from '../components/tokex/hero-section'

const LIVE_PRICING_RESPONSE: PricingData = {
  success: true,
  auto_groups: ['Proxy'],
  group_ratio: {
    Official: 1.35,
    Proxy: 0.4,
  },
  usable_group: {
    Official: { desc: 'Official API', ratio: 1.35 },
    Proxy: { desc: 'Subscription', ratio: 0.4 },
  },
  supported_endpoint: {
    openai: '/v1/chat/completions',
  },
  vendors: [
    { id: 5, name: 'Anthropic', icon: 'Claude.Color' },
    { id: 6, name: 'OpenAI', icon: 'OpenAI' },
  ],
  data: [
    {
      id: 1,
      model_name: 'gpt-6.1-sol',
      vendor_id: 6,
      quota_type: 0,
      model_ratio: 37.5,
      completion_ratio: 2,
      enable_groups: ['Proxy'],
      billing_mode: 'tiered_expr',
      billing_expr:
        '((p <= 272000)) ? (tier("Short", p * 2 + c * 10)) : (tier("Long", p * 4 + c * 15))',
    },
    {
      id: 2,
      model_name: 'gpt-6.2-astra',
      vendor_id: 6,
      quota_type: 0,
      model_ratio: 37.5,
      completion_ratio: 2,
      enable_groups: ['Proxy'],
      billing_mode: 'tiered_expr',
      billing_expr:
        '((p <= 272000)) ? (tier("Short", p * 8 + c * 40)) : (tier("Long", p * 16 + c * 60))',
    },
    {
      id: 3,
      model_name: 'gpt-6.2-sol',
      vendor_id: 6,
      quota_type: 0,
      model_ratio: 37.5,
      completion_ratio: 2,
      enable_groups: ['Proxy'],
      billing_mode: 'tiered_expr',
      billing_expr:
        '((p <= 272000)) ? (tier("Short", p * 2 + c * 10)) : (tier("Long", p * 4 + c * 15))',
    },
    {
      id: 4,
      model_name: 'claude-fable-5.2',
      vendor_id: 5,
      quota_type: 0,
      model_ratio: 37.5,
      completion_ratio: 1,
      enable_groups: ['Official'],
      billing_mode: 'tiered_expr',
      billing_expr: 'tier("Base", p * 8 + c * 40 + cr * 0.2 + cc * 10)',
    },
    {
      id: 5,
      model_name: 'claude-opus-5.5',
      vendor_id: 5,
      quota_type: 0,
      model_ratio: 37.5,
      completion_ratio: 1,
      enable_groups: ['Official'],
      billing_mode: 'tiered_expr',
      billing_expr: 'tier("Base", p * 4 + c * 20 + cr * 0.2 + cc * 5)',
    },
    {
      id: 6,
      model_name: 'claude-sonnet-5.5',
      vendor_id: 5,
      quota_type: 0,
      model_ratio: 37.5,
      completion_ratio: 1,
      enable_groups: ['Official'],
      billing_mode: 'tiered_expr',
      billing_expr: 'tier("Base", p * 2 + c * 10 + cr * 0.1 + cc * 2.5)',
    },
    {
      id: 7,
      model_name: 'gpt-6-astra',
      vendor_id: 6,
      quota_type: 0,
      model_ratio: 37.5,
      completion_ratio: 2,
      enable_groups: ['Proxy'],
      billing_mode: 'tiered_expr',
      billing_expr:
        '((p <= 272000)) ? (tier("Short", p * 10 + c * 50)) : (tier("Long", p * 20 + c * 75))',
    },
  ],
}

let queryClient: QueryClient

function createHeroTestRouter() {
  const root = createRootRoute({
    component: Outlet,
  })
  const home = createRoute({
    getParentRoute: () => root,
    path: '/',
    component: TokexHeroSection,
  })
  const pricing = createRoute({
    getParentRoute: () => root,
    path: '/pricing',
    component: () => <div>Pricing Directory</div>,
  })
  const modelDetails = createRoute({
    getParentRoute: () => root,
    path: '/pricing/$modelId',
    component: () => {
      const { modelId } = modelDetails.useParams()
      return <div>Model Details: {modelId}</div>
    },
  })
  const signIn = createRoute({
    getParentRoute: () => root,
    path: '/sign-in',
    component: () => <div>Sign In Page</div>,
  })
  const keys = createRoute({
    getParentRoute: () => root,
    path: '/keys',
    component: () => <div>Keys Page</div>,
  })
  const dashboard = createRoute({
    getParentRoute: () => root,
    path: '/dashboard',
    component: () => <div>Dashboard Page</div>,
  })

  return createRouter({
    routeTree: root.addChildren([
      home,
      pricing,
      modelDetails,
      signIn,
      keys,
      dashboard,
    ]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
}

function renderHero() {
  const router = createHeroTestRouter()
  const result = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
  return { ...result, router }
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
  useSystemConfigStore.getState().setConfig({
    currency: { ...DEFAULT_CURRENCY_CONFIG, quotaDisplayType: 'USD' },
  })
  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })
  queryClient.setQueryData(STATUS_QUERY_KEY, {
    quota_display_type: 'USD',
    usd_exchange_rate: 1,
    price: 1,
  })
})

afterEach(() => {
  queryClient.clear()
  vi.restoreAllMocks()
})

describe('flagship model helpers', () => {
  it('selects up to 4 flagship models from live pricing and falls back round-robin by vendor', () => {
    const selected = selectFlagshipModels(LIVE_PRICING_RESPONSE.data, 4)
    expect(selected.map((m) => m.model_name)).toEqual([
      'claude-fable-5.2',
      'claude-opus-5.5',
      'gpt-6-astra',
      'gpt-6.2-astra',
    ])

    const customModels: PricingModel[] = [
      {
        id: 10,
        model_name: 'alpha-1',
        vendor_name: 'VendorA',
        quota_type: 0,
        model_ratio: 1,
        completion_ratio: 2,
        enable_groups: ['default'],
      },
      {
        id: 11,
        model_name: 'alpha-2',
        vendor_name: 'VendorA',
        quota_type: 0,
        model_ratio: 1,
        completion_ratio: 2,
        enable_groups: ['default'],
      },
      {
        id: 12,
        model_name: 'beta-1',
        vendor_name: 'VendorB',
        quota_type: 0,
        model_ratio: 1,
        completion_ratio: 2,
        enable_groups: ['default'],
      },
      {
        id: 13,
        model_name: 'gamma-1',
        vendor_name: 'VendorC',
        quota_type: 0,
        model_ratio: 1,
        completion_ratio: 2,
        enable_groups: ['default'],
      },
    ]

    expect(
      selectFlagshipModels(customModels, 4).map((m) => m.model_name)
    ).toEqual(['alpha-1', 'beta-1', 'gamma-1', 'alpha-2'])
  })

  it('computes strikethrough 1x original price when groupRatio !== 1 and hides it for 1x', () => {
    const officialDynamic: PricingModel = {
      id: 4,
      model_name: 'claude-fable-5.2',
      vendor_name: 'Anthropic',
      quota_type: 0,
      model_ratio: 37.5,
      completion_ratio: 1,
      enable_groups: ['Official'],
      group_ratio: { Official: 1.35, Proxy: 0.4 },
      billing_mode: 'tiered_expr',
      billing_expr: 'tier("Base", p * 8 + c * 40)',
    }

    const officialDisplay = buildFlagshipModelDisplay(officialDynamic)
    expect(officialDisplay.groupBadge).toBe('Official · 1.35x')
    expect(officialDisplay.priceItems).toEqual([
      {
        key: 'p',
        labelZh: '输入',
        labelEn: 'In',
        current: '$10.8',
        original: '$8',
        unitSuffixZh: '/1M',
        unitSuffixEn: '/1M',
      },
      {
        key: 'c',
        labelZh: '输出',
        labelEn: 'Out',
        current: '$54',
        original: '$40',
        unitSuffixZh: '/1M',
        unitSuffixEn: '/1M',
      },
    ])

    const unitRatioModel: PricingModel = {
      ...officialDynamic,
      enable_groups: ['Standard'],
      group_ratio: { Standard: 1 },
    }
    const unitDisplay = buildFlagshipModelDisplay(unitRatioModel)
    expect(unitDisplay.groupBadge).toBe('Standard · 1x')
    expect(unitDisplay.priceItems[0]?.original).toBeUndefined()
    expect(unitDisplay.priceItems[0]?.current).toBe('$8')
    expect(unitDisplay.priceItems[1]?.original).toBeUndefined()
    expect(unitDisplay.priceItems[1]?.current).toBe('$40')

    const legacyTokenModel: PricingModel = {
      id: 20,
      model_name: 'legacy-chat',
      vendor_name: 'OpenAI',
      quota_type: 0,
      model_ratio: 1,
      completion_ratio: 3,
      enable_groups: ['Proxy'],
      group_ratio: { Proxy: 0.4 },
    }
    const legacyTokenDisplay = buildFlagshipModelDisplay(legacyTokenModel)
    expect(legacyTokenDisplay.priceItems).toEqual([
      {
        key: 'input',
        labelZh: '输入',
        labelEn: 'In',
        current: '$0.8',
        original: '$2',
        unitSuffixZh: '/1M',
        unitSuffixEn: '/1M',
      },
      {
        key: 'output',
        labelZh: '输出',
        labelEn: 'Out',
        current: '$2.4',
        original: '$6',
        unitSuffixZh: '/1M',
        unitSuffixEn: '/1M',
      },
    ])

    const legacyRequestModel: PricingModel = {
      id: 21,
      model_name: 'legacy-image',
      vendor_name: 'OpenAI',
      quota_type: 1,
      model_ratio: 0,
      completion_ratio: 1,
      model_price: 0.1,
      enable_groups: ['Official'],
      group_ratio: { Official: 1.35 },
    }
    const legacyRequestDisplay = buildFlagshipModelDisplay(legacyRequestModel)
    expect(legacyRequestDisplay.priceItems).toEqual([
      {
        key: 'request',
        labelZh: '按次',
        labelEn: 'Req',
        current: '$0.135',
        original: '$0.1',
        unitSuffixZh: '/次',
        unitSuffixEn: '/req',
      },
    ])
  })
})

describe('TokexHeroSection', () => {
  it('shows a loading skeleton while /api/pricing is pending and then renders live flagship models', async () => {
    let resolvePricing!: (value: PricingData) => void
    const pendingPromise = new Promise<PricingData>((resolve) => {
      resolvePricing = resolve
    })
    vi.spyOn(pricingApi, 'getPricing').mockReturnValueOnce(pendingPromise)

    renderHero()

    expect(
      await screen.findAllByTestId('flagship-model-skeleton')
    ).toHaveLength(4)

    resolvePricing(LIVE_PRICING_RESPONSE)

    const fableLink = await screen.findByRole('link', {
      name: /claude-fable-5\.2/i,
    })
    expect(fableLink).toHaveAttribute('href', '/pricing/claude-fable-5.2')
    expect(within(fableLink).getByText('Anthropic')).toBeVisible()
    expect(within(fableLink).getByText('Official · 1.35x')).toBeVisible()
    expect(within(fableLink).getAllByText('$8')[0]).toHaveClass('line-through')
    expect(within(fableLink).getAllByText('$10.8')[0]).toBeVisible()
    expect(within(fableLink).getAllByText('$40')[0]).toHaveClass('line-through')
    expect(within(fableLink).getAllByText('$54')[0]).toBeVisible()

    const astraLink = screen.getByRole('link', { name: /gpt-6-astra/i })
    expect(astraLink).toHaveAttribute('href', '/pricing/gpt-6-astra')
    expect(within(astraLink).getByText('OpenAI')).toBeVisible()
    expect(within(astraLink).getByText('Proxy · 0.4x')).toBeVisible()
    expect(within(astraLink).getAllByText('$10')[0]).toHaveClass('line-through')
    expect(within(astraLink).getAllByText('$4')[0]).toBeVisible()
    expect(within(astraLink).getAllByText('$50')[0]).toHaveClass('line-through')
    expect(within(astraLink).getAllByText('$20')[0]).toBeVisible()

    expect(screen.queryByTestId('flagship-model-skeleton')).toBeNull()
  })

  it('removes gateway jargon, sample prompts, fake stats, fake keys, and fake specs', async () => {
    vi.spyOn(pricingApi, 'getPricing').mockResolvedValueOnce(
      LIVE_PRICING_RESPONSE
    )

    renderHero()

    await screen.findByRole('link', { name: /claude-fable-5\.2/i })

    expect(screen.queryByText(/TOKEX Unified Model Router/i)).toBeNull()
    expect(screen.queryByText(/The Unified Interface For LLMs/i)).toBeNull()
    expect(screen.queryByText(/Try sample/i)).toBeNull()
    expect(screen.queryByRole('textbox')).toBeNull()
    expect(screen.queryByText(/8\.4T\+/)).toBeNull()
    expect(screen.queryByText(/1\.05M/)).toBeNull()
    expect(screen.queryByText(/< 35ms/)).toBeNull()
    expect(screen.queryByText(/99\.99%/)).toBeNull()
    expect(screen.queryByText(/sk-tokex-94f/i)).toBeNull()
    expect(screen.queryByText(/128K out/i)).toBeNull()
    expect(screen.queryByText(/1M ctx/i)).toBeNull()
  })

  it('navigates directly to /pricing/$modelId (with URL encoding for slashes) when clicking a card', async () => {
    const user = userEvent.setup()
    vi.spyOn(pricingApi, 'getPricing').mockResolvedValueOnce({
      ...LIVE_PRICING_RESPONSE,
      group_ratio: { Standard: 1 },
      data: [
        {
          id: 99,
          model_name: 'anthropic/claude-fable-5.2',
          vendor_id: 5,
          quota_type: 0,
          model_ratio: 37.5,
          completion_ratio: 1,
          enable_groups: ['Standard'],
          billing_mode: 'tiered_expr',
          billing_expr: 'tier("Base", p * 8 + c * 40)',
        },
      ],
    })

    const { router } = renderHero()

    const modelCardLink = await screen.findByRole('link', {
      name: /anthropic\/claude-fable-5\.2/i,
    })
    expect(modelCardLink).toHaveAttribute(
      'href',
      '/pricing/anthropic%2Fclaude-fable-5.2'
    )
    expect(within(modelCardLink).getByText('Standard · 1x')).toBeVisible()
    // No strikethrough when groupRatio === 1
    expect(modelCardLink.querySelector('.line-through')).toBeNull()

    await user.click(modelCardLink)

    await waitFor(() => {
      expect(router.state.location.pathname).toBe(
        '/pricing/anthropic%2Fclaude-fable-5.2'
      )
    })
    expect(
      await screen.findByText('Model Details: anthropic/claude-fable-5.2')
    ).toBeVisible()
  })

  it('renders a clean fallback when /api/pricing fails and recovers on retry', async () => {
    const user = userEvent.setup()
    const getPricingMock = vi
      .spyOn(pricingApi, 'getPricing')
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(LIVE_PRICING_RESPONSE)

    renderHero()

    expect(
      await screen.findByText(/Live model pricing is temporarily unavailable/i)
    ).toBeVisible()

    await user.click(screen.getByRole('button', { name: /Retry/i }))

    expect(getPricingMock).toHaveBeenCalledTimes(2)
    expect(
      await screen.findByRole('link', { name: /claude-fable-5\.2/i })
    ).toBeVisible()
  })

  it('supports zhCN and en copy cleanly and updates Get API Key target by auth state', async () => {
    vi.spyOn(pricingApi, 'getPricing').mockResolvedValue(LIVE_PRICING_RESPONSE)

    await i18next.changeLanguage('zhCN')
    useAuthStore.setState((state) => ({
      auth: {
        ...state.auth,
        user: { id: 1, username: 'dev', role: 1 },
      },
    }))

    renderHero()

    await screen.findByRole('link', { name: /claude-fable-5\.2/i })
    expect(screen.queryByText(/TOKEX 多模型统一网关已就绪/)).toBeNull()
    expect(screen.queryByText(/大模型统一路由接口/)).toBeNull()
    expect(screen.queryByText(/示例提示词/)).toBeNull()

    expect(screen.getByRole('link', { name: /获取 API 密钥/ })).toHaveAttribute(
      'href',
      '/keys'
    )
    expect(screen.getByRole('link', { name: /模型定价/ })).toHaveAttribute(
      'href',
      '/pricing'
    )
    expect(screen.getByRole('link', { name: /控制台/ })).toHaveAttribute(
      'href',
      '/dashboard'
    )
  })
})
