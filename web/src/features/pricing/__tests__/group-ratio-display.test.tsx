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
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  DEFAULT_CURRENCY_CONFIG,
  useSystemConfigStore,
} from '@/stores/system-config-store'

import { CachedPriceCell } from '../components/cached-price-cell'
import { DynamicPricingBreakdown } from '../components/dynamic-pricing-breakdown'
import { ModelCard } from '../components/model-card'
import { ModelDetailsContent } from '../components/model-details'
import { ModelGroupRatioBadges } from '../components/model-group-ratio-badges'
import { ModelPriceCell } from '../components/model-price-cell'
import { PricingTable } from '../components/pricing-table'
import {
  formatRatioMultiplier,
  getModelGroupMultipliers,
} from '../lib/model-helpers'
import type { PricingModel } from '../types'

function createDynamicModel(
  overrides: Partial<PricingModel> = {}
): PricingModel {
  return {
    id: 1,
    model_name: 'gpt-6-astra',
    quota_type: 0,
    model_ratio: 37.5,
    completion_ratio: 1,
    billing_mode: 'tiered_expr',
    billing_expr: 'tier("standard", p * 2 + c * 8)',
    enable_groups: ['Proxy'],
    group_ratio: { Official: 1, Proxy: 0.3 },
    ...overrides,
  }
}

describe('group ratio display', () => {
  beforeEach(() => {
    useSystemConfigStore.getState().setConfig({
      currency: { ...DEFAULT_CURRENCY_CONFIG, quotaDisplayType: 'USD' },
    })
  })

  afterEach(() => {
    useSystemConfigStore
      .getState()
      .setConfig({ currency: { ...DEFAULT_CURRENCY_CONFIG } })
  })

  it('formats multipliers and resolves enabled model groups cleanly', () => {
    expect(formatRatioMultiplier(1)).toBe('1x')
    expect(formatRatioMultiplier(0.3)).toBe('0.3x')
    expect(formatRatioMultiplier(1.25)).toBe('1.25x')

    const multiGroupModel = createDynamicModel({
      model_name: 'claude-fable-5.2',
      enable_groups: ['auto', 'Official', 'Claude-Proxy', 'Official'],
      group_ratio: { Official: 1, 'Claude-Proxy': 0.5 },
    })

    expect(getModelGroupMultipliers(multiGroupModel)).toEqual([
      { group: 'Official', ratio: 1, label: 'Official · 1x' },
      { group: 'Claude-Proxy', ratio: 0.5, label: 'Claude-Proxy · 0.5x' },
    ])
    expect(getModelGroupMultipliers(multiGroupModel, 'Claude-Proxy')).toEqual([
      { group: 'Claude-Proxy', ratio: 0.5, label: 'Claude-Proxy · 0.5x' },
    ])
  })

  it('hides legacy 37.5x on dynamic models and shows group badges instead', () => {
    const gptModel = createDynamicModel()
    const { rerender } = render(<ModelGroupRatioBadges model={gptModel} />)
    expect(screen.getByText('Proxy · 0.3x')).toBeVisible()
    expect(screen.queryByText(/37\.5/)).toBeNull()

    const claudeModel = createDynamicModel({
      model_name: 'claude-fable-5.2',
      enable_groups: ['Official', 'Proxy'],
    })
    rerender(<ModelGroupRatioBadges model={claudeModel} />)
    expect(screen.getByText('Official · 1x')).toBeVisible()
    expect(screen.getByText('Proxy · 0.3x')).toBeVisible()

    rerender(
      <ModelGroupRatioBadges model={claudeModel} selectedGroup='Official' />
    )
    expect(screen.getByText('Official · 1x')).toBeVisible()
    expect(screen.queryByText('Proxy · 0.3x')).toBeNull()
  })

  it('renders group multipliers on ModelCard without legacy 37.5x', () => {
    const model = createDynamicModel()
    render(<ModelCard model={model} onClick={vi.fn()} />)
    expect(screen.getByText('Proxy · 0.3x')).toBeVisible()
    expect(screen.queryByText(/37\.5/)).toBeNull()
  })

  it('lets ModelDetailsContent switch between model groups and scales pricing', async () => {
    const user = userEvent.setup()
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const model = createDynamicModel({
      model_name: 'claude-fable-5.2',
      enable_groups: ['Official', 'Proxy'],
    })

    render(
      <QueryClientProvider client={queryClient}>
        <ModelDetailsContent
          model={model}
          groupRatio={{ Official: 1, Proxy: 0.3 }}
          usableGroup={{
            Official: { desc: 'Offical API', ratio: 1 },
            Proxy: { desc: 'Unofficial', ratio: 0.3 },
          }}
          endpointMap={{}}
          autoGroups={[]}
          priceRate={1}
          usdExchangeRate={1}
          tokenUnit='M'
        />
      </QueryClientProvider>
    )

    const officialButton = screen.getByRole('button', {
      name: 'Official · 1x',
    })
    const proxyButton = screen.getByRole('button', {
      name: 'Proxy · 0.3x',
    })

    // Defaults to lowest-ratio group (Proxy · 0.3x -> $0.6000 input / $2.4000 output)
    expect(proxyButton).toHaveAttribute('aria-pressed', 'true')
    expect(officialButton).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getAllByText('$0.6000').length).toBeGreaterThan(0)

    await user.click(officialButton)
    expect(officialButton).toHaveAttribute('aria-pressed', 'true')
    expect(proxyButton).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getAllByText('$2.0000').length).toBeGreaterThan(0)
  })

  it('avoids duplicate model identifiers and omits empty capabilities/context columns in PricingTable', () => {
    const models = [
      createDynamicModel({ model_name: 'gpt-6-astra' }),
      createDynamicModel({
        id: 2,
        model_name: 'anthropic/claude-fable-5.2',
        enable_groups: ['Official'],
      }),
    ]

    render(<PricingTable models={models} />)

    // Model without slash appears once in the cell (no duplicate slug subtitle)
    expect(screen.getAllByText('gpt-6-astra')).toHaveLength(1)
    // Model with slash shows short title + full slug
    expect(screen.getByText('claude-fable-5.2')).toBeVisible()
    expect(screen.getByText('anthropic/claude-fable-5.2')).toBeVisible()

    // Dedicated group ratio column without "Capabilities: Dynamic Pricing" noise
    expect(screen.getByText('Group Ratio')).toBeVisible()
    expect(screen.getByText('Proxy · 0.3x')).toBeVisible()
    expect(screen.getByText('Official · 1x')).toBeVisible()
    expect(screen.queryByText('Capabilities')).toBeNull()
    expect(screen.queryByText('Context')).toBeNull()
    expect(screen.queryByText('Dynamic Pricing')).toBeNull()
  })

  it('shows strikethrough 1x price on ModelCard for <1x and >1x groups and hides it for 1x', () => {
    const dynamicModel = createDynamicModel({
      billing_expr: 'tier("standard", p * 2 + c * 8 + cr * 0.5)',
      enable_groups: ['Discount', 'Official', 'VIP'],
      group_ratio: { Discount: 0.4, Official: 1, VIP: 1.35 },
    })

    const { rerender, container } = render(
      <ModelCard
        model={dynamicModel}
        selectedGroup='Discount'
        onClick={vi.fn()}
      />
    )
    expect(screen.getByText('$2')).toHaveClass('line-through')
    expect(screen.getByText('$0.8')).not.toHaveClass('line-through')
    expect(screen.getByText('$8')).toHaveClass('line-through')
    expect(screen.getByText('$3.2')).not.toHaveClass('line-through')
    expect(screen.getByText('$0.5')).toHaveClass('line-through')
    expect(screen.getByText('$0.2')).not.toHaveClass('line-through')

    rerender(
      <ModelCard model={dynamicModel} selectedGroup='VIP' onClick={vi.fn()} />
    )
    expect(screen.getByText('$2')).toHaveClass('line-through')
    expect(screen.getByText('$2.7')).not.toHaveClass('line-through')
    expect(screen.getByText('$8')).toHaveClass('line-through')
    expect(screen.getByText('$10.8')).not.toHaveClass('line-through')
    expect(screen.getByText('$0.5')).toHaveClass('line-through')
    expect(screen.getByText('$0.675')).not.toHaveClass('line-through')

    rerender(
      <ModelCard
        model={dynamicModel}
        selectedGroup='Official'
        onClick={vi.fn()}
      />
    )
    expect(container.querySelectorAll('.line-through')).toHaveLength(0)
    expect(screen.getByText('$2')).toBeVisible()
    expect(screen.getByText('$8')).toBeVisible()
    expect(screen.getByText('$0.5')).toBeVisible()

    // Legacy token and per-request models
    const legacyTokenModel: PricingModel = {
      id: 2,
      model_name: 'legacy-token',
      quota_type: 0,
      model_ratio: 1,
      completion_ratio: 4,
      cache_ratio: 0.25,
      enable_groups: ['Discount', 'Official', 'VIP'],
      group_ratio: { Discount: 0.4, Official: 1, VIP: 1.35 },
    }
    rerender(
      <ModelCard
        model={legacyTokenModel}
        selectedGroup='Discount'
        onClick={vi.fn()}
      />
    )
    expect(screen.getByText('$2')).toHaveClass('line-through')
    expect(screen.getByText('$0.8')).not.toHaveClass('line-through')
    expect(screen.getByText('$8')).toHaveClass('line-through')
    expect(screen.getByText('$3.2')).not.toHaveClass('line-through')

    rerender(
      <ModelCard
        model={legacyTokenModel}
        selectedGroup='Official'
        onClick={vi.fn()}
      />
    )
    expect(container.querySelectorAll('.line-through')).toHaveLength(0)

    const legacyRequestModel: PricingModel = {
      id: 3,
      model_name: 'legacy-request',
      quota_type: 1,
      model_ratio: 1,
      completion_ratio: 1,
      model_price: 0.2,
      enable_groups: ['Discount', 'Official', 'VIP'],
      group_ratio: { Discount: 0.4, Official: 1, VIP: 1.35 },
    }
    rerender(
      <ModelCard
        model={legacyRequestModel}
        selectedGroup='VIP'
        onClick={vi.fn()}
      />
    )
    expect(screen.getByText('$0.2')).toHaveClass('line-through')
    expect(screen.getByText('$0.27')).not.toHaveClass('line-through')

    rerender(
      <ModelCard
        model={legacyRequestModel}
        selectedGroup='Official'
        onClick={vi.fn()}
      />
    )
    expect(container.querySelectorAll('.line-through')).toHaveLength(0)
    expect(screen.getByText('$0.2')).toBeVisible()
  })

  it('shows strikethrough 1x price in table cells (ModelPriceCell & CachedPriceCell) for all non-1x groups', () => {
    const model = createDynamicModel({
      billing_expr: 'tier("standard", p * 2 + c * 8 + cr * 0.5)',
      enable_groups: ['Discount', 'Official', 'VIP'],
      group_ratio: { Discount: 0.4, Official: 1, VIP: 1.35 },
    })

    const { rerender, container } = render(
      <>
        <div data-testid='price-cell'>
          <ModelPriceCell
            model={model}
            options={{ tokenUnit: 'M', selectedGroup: 'Discount' }}
          />
        </div>
        <div data-testid='cache-cell'>
          <CachedPriceCell
            model={model}
            options={{ tokenUnit: 'M', selectedGroup: 'Discount' }}
          />
        </div>
      </>
    )

    const priceCell = screen.getByTestId('price-cell')
    const cacheCell = screen.getByTestId('cache-cell')
    expect(within(priceCell).getByText('2')).toHaveClass('line-through')
    expect(within(priceCell).getByText('0.8')).not.toHaveClass('line-through')
    expect(within(priceCell).getByText('8')).toHaveClass('line-through')
    expect(within(priceCell).getByText('3.2')).not.toHaveClass('line-through')
    expect(within(cacheCell).getByText('$0.5')).toHaveClass('line-through')
    expect(within(cacheCell).getByText('$0.2')).not.toHaveClass('line-through')

    rerender(
      <>
        <div data-testid='price-cell'>
          <ModelPriceCell
            model={model}
            options={{ tokenUnit: 'M', selectedGroup: 'VIP' }}
          />
        </div>
        <div data-testid='cache-cell'>
          <CachedPriceCell
            model={model}
            options={{ tokenUnit: 'M', selectedGroup: 'VIP' }}
          />
        </div>
      </>
    )
    expect(within(priceCell).getByText('2')).toHaveClass('line-through')
    expect(within(priceCell).getByText('2.7')).not.toHaveClass('line-through')
    expect(within(cacheCell).getByText('$0.5')).toHaveClass('line-through')
    expect(within(cacheCell).getByText('$0.675')).not.toHaveClass(
      'line-through'
    )

    rerender(
      <>
        <div data-testid='price-cell'>
          <ModelPriceCell
            model={model}
            options={{ tokenUnit: 'M', selectedGroup: 'Official' }}
          />
        </div>
        <div data-testid='cache-cell'>
          <CachedPriceCell
            model={model}
            options={{ tokenUnit: 'M', selectedGroup: 'Official' }}
          />
        </div>
      </>
    )
    expect(container.querySelectorAll('.line-through')).toHaveLength(0)
    expect(within(priceCell).getByText('2')).toBeVisible()
    expect(within(cacheCell).getByText('$0.5')).toBeVisible()
  })

  it('toggles strikethrough 1x original prices across ModelDetailsContent and DynamicPricingBreakdown when switching groups', async () => {
    const user = userEvent.setup()
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const model = createDynamicModel({
      model_name: 'multi-group-model',
      enable_groups: ['Discount', 'Official', 'VIP'],
      group_ratio: { Discount: 0.4, Official: 1, VIP: 1.35 },
    })

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <ModelDetailsContent
          model={model}
          groupRatio={{ Discount: 0.4, Official: 1, VIP: 1.35 }}
          usableGroup={{
            Discount: { desc: 'Discount', ratio: 0.4 },
            Official: { desc: 'Official', ratio: 1 },
            VIP: { desc: 'VIP', ratio: 1.35 },
          }}
          endpointMap={{}}
          autoGroups={[]}
          priceRate={1}
          usdExchangeRate={1}
          tokenUnit='M'
        />
      </QueryClientProvider>
    )

    // Defaults to lowest ratio (Discount · 0.4x)
    expect(screen.getByText('$2')).toHaveClass('line-through')
    expect(screen.getByText('$0.8')).not.toHaveClass('line-through')
    expect(
      screen
        .getAllByText('$2.0000')
        .every((el) => el.className.includes('line-through'))
    ).toBe(true)
    expect(screen.getAllByText('$0.8000').length).toBeGreaterThan(0)

    // Switch to 1x Official: no strikethrough anywhere
    await user.click(screen.getByRole('button', { name: 'Official · 1x' }))
    expect(container.querySelectorAll('.line-through')).toHaveLength(0)
    expect(screen.getAllByText('$2.0000').length).toBeGreaterThan(0)

    // Switch to 1.35x VIP: strikethrough 1x returns alongside 1.35x prices
    await user.click(screen.getByRole('button', { name: 'VIP · 1.35x' }))
    expect(screen.getByText('$2')).toHaveClass('line-through')
    expect(screen.getByText('$2.7')).not.toHaveClass('line-through')
    expect(
      screen
        .getAllByText('$2.0000')
        .every((el) => el.className.includes('line-through'))
    ).toBe(true)
    expect(screen.getAllByText('$2.7000').length).toBeGreaterThan(0)
  })

  it('shows strikethrough 1x prices on task-usage DynamicPricingBreakdown for <1x and >1x multipliers', () => {
    const schema = {
      seconds: { type: 'number' as const, unit: 'second' as const },
    }
    const expr = 'tier("base", u("seconds") * 0.4)'

    const { rerender, container } = render(
      <DynamicPricingBreakdown
        billingExpr={expr}
        usageSchema={schema}
        taskPriceOptions={{ groupRatioMultiplier: 0.4 }}
      />
    )
    expect(
      screen
        .getAllByText('$0.4')
        .every((el) => el.className.includes('line-through'))
    ).toBe(true)
    expect(screen.getAllByText('$0.16/s').length).toBeGreaterThan(0)

    rerender(
      <DynamicPricingBreakdown
        billingExpr={expr}
        usageSchema={schema}
        taskPriceOptions={{ groupRatioMultiplier: 1.35 }}
      />
    )
    expect(
      screen
        .getAllByText('$0.4')
        .every((el) => el.className.includes('line-through'))
    ).toBe(true)
    expect(screen.getAllByText('$0.54/s').length).toBeGreaterThan(0)

    rerender(
      <DynamicPricingBreakdown
        billingExpr={expr}
        usageSchema={schema}
        taskPriceOptions={{ groupRatioMultiplier: 1 }}
      />
    )
    expect(container.querySelectorAll('.line-through')).toHaveLength(0)
    expect(screen.getAllByText('$0.4/s').length).toBeGreaterThan(0)
  })

  it('shows strikethrough 1x prices on ModelDetailsContent for legacy token and request models and on ModelCard task ranges/examples', async () => {
    const user = userEvent.setup()
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    const legacyTokenModel: PricingModel = {
      id: 10,
      model_name: 'legacy-details-token',
      quota_type: 0,
      model_ratio: 1,
      completion_ratio: 4,
      cache_ratio: 0.25,
      enable_groups: ['Discount', 'Official', 'VIP'],
      group_ratio: { Discount: 0.4, Official: 1, VIP: 1.35 },
    }

    const { rerender, container } = render(
      <QueryClientProvider client={queryClient}>
        <ModelDetailsContent
          model={legacyTokenModel}
          groupRatio={{ Discount: 0.4, Official: 1, VIP: 1.35 }}
          usableGroup={{
            Discount: { desc: 'Discount', ratio: 0.4 },
            Official: { desc: 'Official', ratio: 1 },
            VIP: { desc: 'VIP', ratio: 1.35 },
          }}
          endpointMap={{}}
          autoGroups={[]}
          priceRate={1}
          usdExchangeRate={1}
          tokenUnit='M'
        />
      </QueryClientProvider>
    )

    expect(screen.getByText('$2')).toHaveClass('line-through')
    expect(screen.getByText('$0.8')).not.toHaveClass('line-through')
    expect(screen.getByText('$0.5')).toHaveClass('line-through')
    expect(screen.getByText('$0.2')).not.toHaveClass('line-through')

    await user.click(screen.getByRole('button', { name: 'Official · 1x' }))
    expect(container.querySelectorAll('.line-through')).toHaveLength(0)

    await user.click(screen.getByRole('button', { name: 'VIP · 1.35x' }))
    expect(screen.getByText('$2')).toHaveClass('line-through')
    expect(screen.getByText('$2.7')).not.toHaveClass('line-through')

    const legacyRequestModel: PricingModel = {
      id: 11,
      model_name: 'legacy-details-request',
      quota_type: 1,
      model_ratio: 1,
      completion_ratio: 1,
      model_price: 0.2,
      enable_groups: ['Discount', 'Official', 'VIP'],
      group_ratio: { Discount: 0.4, Official: 1, VIP: 1.35 },
    }

    rerender(
      <QueryClientProvider client={queryClient}>
        <ModelDetailsContent
          model={legacyRequestModel}
          selectedGroup='VIP'
          groupRatio={{ Discount: 0.4, Official: 1, VIP: 1.35 }}
          usableGroup={{
            Discount: { desc: 'Discount', ratio: 0.4 },
            Official: { desc: 'Official', ratio: 1 },
            VIP: { desc: 'VIP', ratio: 1.35 },
          }}
          endpointMap={{}}
          autoGroups={[]}
          priceRate={1}
          usdExchangeRate={1}
          tokenUnit='M'
        />
      </QueryClientProvider>
    )
    expect(screen.getByText('$0.2')).toHaveClass('line-through')
    expect(screen.getByText('$0.27')).not.toHaveClass('line-through')

    // ModelCard task-usage range + example price
    const taskModel: PricingModel = {
      id: 12,
      model_name: 'task-range-example',
      quota_type: 0,
      model_ratio: 1,
      completion_ratio: 1,
      billing_mode: 'tiered_expr',
      billing_expr:
        'u("mode") == "pro" ? tier("pro", u("seconds") * 0.8) : tier("std", u("seconds") * 0.4)',
      billing_usage_schema: {
        seconds: { type: 'number', unit: 'second' },
        mode: { enum: ['std', 'pro'] },
      },
      billing_usage_examples: [
        { label: '5s std', facts: { seconds: 5, mode: 'std' } },
      ],
      enable_groups: ['Discount', 'Official'],
      group_ratio: { Discount: 0.4, Official: 1 },
    }
    rerender(
      <ModelCard model={taskModel} selectedGroup='Discount' onClick={vi.fn()} />
    )
    expect(screen.getByText('$0.4 – $0.8')).toHaveClass('line-through')
    expect(screen.getByText('$0.16 – $0.32')).not.toHaveClass('line-through')
    expect(screen.getByText('$2')).toHaveClass('line-through')
    expect(screen.getByText('$0.8')).not.toHaveClass('line-through')

    rerender(
      <ModelCard model={taskModel} selectedGroup='Official' onClick={vi.fn()} />
    )
    expect(container.querySelectorAll('.line-through')).toHaveLength(0)
  })
})
