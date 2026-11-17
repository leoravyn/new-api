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
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ModelCard } from '../components/model-card'
import { ModelDetailsContent } from '../components/model-details'
import { ModelGroupRatioBadges } from '../components/model-group-ratio-badges'
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
})
