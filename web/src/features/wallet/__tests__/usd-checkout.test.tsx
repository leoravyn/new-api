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
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createInstance } from 'i18next'
import type { ReactNode } from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { toast } from 'sonner'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Wallet } from '@/features/wallet'
import { PaymentConfirmDialog } from '@/features/wallet/components/dialogs/payment-confirm-dialog'
import { PAYMENT_TYPES } from '@/features/wallet/constants'
import {
  calculatePresetPricing,
  formatUsdAmount,
  getDiscountLabel,
  getMatchedAmountDiscount,
} from '@/features/wallet/lib/format'
import {
  getMinTopupAmount,
  mergePresetAmounts,
} from '@/features/wallet/lib/payment'
import en from '@/i18n/locales/en.json'
import zh from '@/i18n/locales/zh.json'
import { api } from '@/lib/api'

vi.mock('@/components/layout', () => {
  const SectionPageLayout = ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  )
  SectionPageLayout.Title = ({ children }: { children: ReactNode }) => (
    <h1>{children}</h1>
  )
  SectionPageLayout.Content = ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  )
  return { SectionPageLayout }
})

vi.mock('@/hooks/use-status', () => ({
  useStatus: () => ({
    status: {
      price: 6,
      usd_exchange_rate: 7,
      quota_display_type: 'USD',
      stripe_unit_price: 8,
    },
    loading: false,
    error: null,
  }),
}))

const i18n = createInstance()

beforeEach(async () => {
  vi.restoreAllMocks()
  await i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: false,
    nsSeparator: false,
    resources: { en, zh },
    interpolation: { escapeValue: false },
  })
})

describe('USD formatting and preset discount pricing', () => {
  it('formats whole and fractional USD values consistently', () => {
    expect(formatUsdAmount(10, { trimWholeCents: true })).toBe('$10')
    expect(formatUsdAmount(100, { trimWholeCents: true })).toBe('$100')
    expect(formatUsdAmount(10)).toBe('$10.00')
    expect(formatUsdAmount(95, { withCode: true })).toBe('$95.00 USD')
    expect(formatUsdAmount(0.0098)).toBe('$0.0098')
    expect(formatUsdAmount(Number.NaN)).toBe('-')
  })

  it('computes 1:1 USD preset prices and discounts without float drift', () => {
    const ten = calculatePresetPricing(10, 1, 1.0, 1)
    expect(ten).toEqual({
      displayValue: 10,
      originalPrice: 10,
      actualPrice: 10,
      savedAmount: 0,
      hasDiscount: false,
    })

    const hundred = calculatePresetPricing(100, 1, 0.95, 1)
    expect(hundred).toEqual({
      displayValue: 100,
      originalPrice: 100,
      actualPrice: 95,
      savedAmount: 5,
      hasDiscount: true,
    })

    const nineteen = calculatePresetPricing(19, 1, 0.9, 1)
    expect(nineteen.actualPrice).toBe(17.1)
    expect(nineteen.savedAmount).toBe(1.9)

    expect(getDiscountLabel(0.95, i18n.t.bind(i18n))).toBe('5% OFF')
    expect(getDiscountLabel(0.85, i18n.t.bind(i18n))).toBe('15% OFF')
    expect(getDiscountLabel(1, i18n.t.bind(i18n))).toBe('')
  })

  it('matches the highest tiered discount threshold <= amount', () => {
    const discounts = { 100: 0.95, 200: 0.9 }
    expect(getMatchedAmountDiscount(99, discounts)).toBe(1.0)
    expect(getMatchedAmountDiscount(100, discounts)).toBe(0.95)
    expect(getMatchedAmountDiscount(105, discounts)).toBe(0.95)
    expect(getMatchedAmountDiscount(200, discounts)).toBe(0.9)
    expect(getMatchedAmountDiscount(250, discounts)).toBe(0.9)
    expect(getMatchedAmountDiscount(0, discounts)).toBe(1.0)
    expect(getMatchedAmountDiscount(150, {})).toBe(1.0)
    expect(getMatchedAmountDiscount(150, null)).toBe(1.0)
    expect(getMatchedAmountDiscount(250, { 0: 0.5, 100: 0.95, 200: 0 })).toBe(
      0.95
    )

    expect(mergePresetAmounts([99, 105, 250], discounts)).toEqual([
      { value: 99, discount: 1.0 },
      { value: 105, discount: 0.95 },
      { value: 250, discount: 0.9 },
    ])
  })

  it('respects global min_topup floor even when enable_online_topup is false', () => {
    expect(
      getMinTopupAmount({
        enable_online_topup: false,
        enable_stripe_topup: false,
        enable_waffo_topup: false,
        enable_waffo_pancake_topup: true,
        pay_methods: [],
        min_topup: 10,
        stripe_min_topup: 1,
        waffo_pancake_min_topup: 1,
        amount_options: [],
        discount: {},
      })
    ).toBe(10)

    expect(
      getMinTopupAmount({
        enable_online_topup: false,
        enable_stripe_topup: false,
        enable_waffo_topup: true,
        enable_waffo_pancake_topup: false,
        pay_methods: [],
        min_topup: 10,
        stripe_min_topup: 1,
        waffo_min_topup: 2,
        amount_options: [],
        discount: {},
      })
    ).toBe(10)

    expect(
      getMinTopupAmount({
        enable_online_topup: false,
        enable_stripe_topup: false,
        enable_waffo_topup: false,
        enable_waffo_pancake_topup: true,
        pay_methods: [],
        min_topup: 10,
        stripe_min_topup: 1,
        waffo_pancake_min_topup: 15,
        amount_options: [],
        discount: {},
      })
    ).toBe(15)
  })
})

describe('PaymentConfirmDialog USD totals and legal links', () => {
  it('displays Topup Amount, Original, You Pay, You save in USD and legal links', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <PaymentConfirmDialog
          open
          onOpenChange={vi.fn()}
          onConfirm={vi.fn()}
          topupAmount={100}
          paymentAmount={95}
          paymentMethod={{
            name: 'Waffo Pancake',
            type: PAYMENT_TYPES.WAFFO_PANCAKE,
          }}
          calculating={false}
          processing={false}
          discountRate={0.95}
        />
      </I18nextProvider>
    )

    expect(screen.getByText('Topup Amount')).toBeVisible()
    expect(screen.getByText('Original')).toBeVisible()
    expect(screen.getByText('You Pay')).toBeVisible()
    expect(screen.getByText('You save')).toBeVisible()
    expect(screen.getByText('5% OFF')).toBeVisible()
    expect(screen.getAllByText('$100.00 USD')).toHaveLength(2)
    expect(screen.getByText('$95.00 USD')).toBeVisible()
    expect(screen.getByText('$5.00 USD')).toBeVisible()
    expect(
      screen.getByText(/Orders are settled in USD via Waffo\./)
    ).toBeVisible()
    expect(
      screen.getByRole('link', { name: 'Terms of Service' })
    ).toHaveAttribute('href', '/terms')
    expect(
      screen.getByRole('link', { name: 'Privacy Policy' })
    ).toHaveAttribute('href', '/privacy-policy')
    expect(
      screen.getByRole('link', { name: 'Acceptable Use Policy' })
    ).toHaveAttribute('href', '/aup')

    await act(() => i18n.changeLanguage('zh'))
    expect(screen.getByText('原价')).toBeVisible()
    expect(screen.getByText('优惠 5%')).toBeVisible()
    expect(screen.getByRole('link', { name: '服务条款' })).toHaveAttribute(
      'href',
      '/terms'
    )
    expect(screen.getByRole('link', { name: '隐私政策' })).toHaveAttribute(
      'href',
      '/privacy-policy'
    )
    expect(
      screen.getByRole('link', { name: '可接受使用政策' })
    ).toHaveAttribute('href', '/aup')
  })
})

describe('Wallet USD flow ignores legacy status.price=6 for Waffo Pancake', () => {
  it('aligns preset cards, custom amount total, and confirm dialog with /api/user/waffo-pancake/amount', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    const discountMap: Record<number, number> = {
      100: 0.95,
      200: 0.9,
      500: 0.85,
    }

    vi.spyOn(api, 'get').mockImplementation(async (url: string) => {
      if (url === '/api/user/self') {
        return {
          data: {
            success: true,
            data: {
              id: 1,
              username: 'tester',
              quota: 5000000,
              used_quota: 0,
              request_count: 0,
              aff_quota: 0,
              aff_history_quota: 0,
              aff_count: 0,
              group: 'Official',
            },
          },
        }
      }
      if (url === '/api/user/topup/info') {
        return {
          data: {
            success: true,
            data: {
              enable_online_topup: false,
              enable_stripe_topup: false,
              enable_waffo_topup: false,
              enable_waffo_pancake_topup: true,
              enable_redemption: true,
              payment_compliance_confirmed: true,
              pay_methods: [
                {
                  name: 'Waffo Pancake',
                  type: PAYMENT_TYPES.WAFFO_PANCAKE,
                  min_topup: 1,
                },
              ],
              min_topup: 1,
              stripe_min_topup: 1,
              waffo_pancake_min_topup: 1,
              amount_options: [5, 10, 20, 50, 100, 200, 500],
              discount: discountMap,
            },
          },
        }
      }
      if (url === '/api/user/aff') {
        return { data: { success: true, data: 'REF123' } }
      }
      if (url === '/api/subscription/plans') {
        return { data: { success: true, message: 'success', data: [] } }
      }
      if (url === '/api/subscription/self') {
        return {
          data: {
            success: true,
            message: 'success',
            data: {
              billing_preference: 'subscription_first',
              subscriptions: [],
              all_subscriptions: [],
            },
          },
        }
      }
      return { data: { success: true, data: null } }
    })

    const postSpy = vi
      .spyOn(api, 'post')
      .mockImplementation(async (url: string, body?: unknown) => {
        if (url === '/api/user/waffo-pancake/amount') {
          const amount = Number((body as { amount?: number })?.amount ?? 0)
          const discount = discountMap[amount] ?? 1
          return {
            data: {
              message: 'success',
              data: (amount * discount).toFixed(2),
            },
          }
        }
        return { data: { message: 'error', data: 'unexpected' } }
      })

    render(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <Wallet />
        </I18nextProvider>
      </QueryClientProvider>
    )

    const hundredBtn = await screen.findByRole('button', { name: /^\$100 / })
    expect(hundredBtn).toHaveTextContent('5% OFFPay $95.00 • Save $5.00')
    expect(screen.getByRole('button', { name: /^\$10 / })).toHaveTextContent(
      'Pay $10.00'
    )
    expect(screen.getByRole('button', { name: /^\$500 / })).toHaveTextContent(
      '15% OFFPay $425.00 • Save $75.00'
    )

    await act(async () => {
      fireEvent.click(hundredBtn)
    })

    await waitFor(() => {
      expect(screen.getByText('$95.00 USD')).toBeVisible()
    })
    expect(postSpy).toHaveBeenCalledWith(
      '/api/user/waffo-pancake/amount',
      { amount: 100 },
      expect.anything()
    )

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Waffo Pancake/ }))
    })

    const dialog = await screen.findByRole('alertdialog')
    expect(dialog).toHaveTextContent('Topup Amount')
    expect(dialog).toHaveTextContent('$100.00 USD')
    expect(dialog).toHaveTextContent('Original')
    expect(dialog).toHaveTextContent('You Pay')
    expect(dialog).toHaveTextContent('$95.00 USD')
    expect(dialog).toHaveTextContent('You save')
    expect(dialog).toHaveTextContent('$5.00 USD')
    expect(dialog).toHaveTextContent(
      'Digital API credits are delivered instantly upon payment. Unused credits are refundable within 24 hours.'
    )
    expect(dialog).toHaveTextContent(
      'Orders are settled in USD via Waffo. If you pay in a local currency, Waffo applies exchange rates at checkout.'
    )
    expect(dialog.querySelector('a[href="/terms"]')).toBeInTheDocument()
    expect(
      dialog.querySelector('a[href="/privacy-policy"]')
    ).toBeInTheDocument()
    expect(dialog.querySelector('a[href="/aup"]')).toBeInTheDocument()
  })

  it('applies tiered discount for custom amount 105 and enforces min_topup=10 with inline warning and toast.error', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    const discountMap: Record<number, number> = {
      100: 0.95,
      200: 0.9,
    }

    vi.spyOn(api, 'get').mockImplementation(async (url: string) => {
      if (url === '/api/user/self') {
        return {
          data: {
            success: true,
            data: {
              id: 1,
              username: 'tester',
              quota: 5000000,
              used_quota: 0,
              request_count: 0,
              aff_quota: 0,
              aff_history_quota: 0,
              aff_count: 0,
              group: 'Official',
            },
          },
        }
      }
      if (url === '/api/user/topup/info') {
        return {
          data: {
            success: true,
            data: {
              enable_online_topup: false,
              enable_stripe_topup: false,
              enable_waffo_topup: false,
              enable_waffo_pancake_topup: true,
              enable_redemption: true,
              payment_compliance_confirmed: true,
              pay_methods: [
                {
                  name: 'Waffo Pancake',
                  type: PAYMENT_TYPES.WAFFO_PANCAKE,
                  min_topup: 1,
                },
              ],
              min_topup: 10,
              stripe_min_topup: 1,
              waffo_pancake_min_topup: 1,
              amount_options: [10, 50, 100, 200],
              discount: discountMap,
            },
          },
        }
      }
      if (url === '/api/user/aff') {
        return { data: { success: true, data: 'REF123' } }
      }
      if (url === '/api/subscription/plans') {
        return { data: { success: true, message: 'success', data: [] } }
      }
      if (url === '/api/subscription/self') {
        return {
          data: {
            success: true,
            message: 'success',
            data: {
              billing_preference: 'subscription_first',
              subscriptions: [],
              all_subscriptions: [],
            },
          },
        }
      }
      return { data: { success: true, data: null } }
    })

    vi.spyOn(api, 'post').mockImplementation(
      async (url: string, body?: unknown) => {
        if (url === '/api/user/waffo-pancake/amount') {
          const amount = Number((body as { amount?: number })?.amount ?? 0)
          const discount = getMatchedAmountDiscount(amount, discountMap)
          return {
            data: {
              message: 'success',
              data: (amount * discount).toFixed(2),
            },
          }
        }
        return { data: { message: 'error', data: 'unexpected' } }
      }
    )

    const toastErrorSpy = vi.spyOn(toast, 'error').mockImplementation(() => '')

    render(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <Wallet />
        </I18nextProvider>
      </QueryClientProvider>
    )

    const amountInput = await screen.findByPlaceholderText('Minimum $10')
    await waitFor(() => {
      expect(amountInput).toHaveValue(10)
    })

    // Enter amount below min_topup (5 < 10)
    await act(async () => {
      fireEvent.change(amountInput, { target: { value: '5' } })
    })

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Minimum topup amount: $10'
    )
    expect(amountInput).toHaveAttribute('aria-invalid', 'true')

    const waffoButton = screen.getByRole('button', { name: /Waffo Pancake/ })
    expect(waffoButton).toHaveAttribute('aria-disabled', 'true')

    await act(async () => {
      fireEvent.click(waffoButton)
    })

    expect(toastErrorSpy).toHaveBeenCalledWith('Minimum topup amount: $10')
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()

    // Enter custom amount 105 -> matches 100: 0.95 tier
    await act(async () => {
      fireEvent.change(amountInput, { target: { value: '105' } })
    })

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    const customDiscount = screen.getByTestId('custom-amount-discount')
    expect(customDiscount).toHaveTextContent('5% OFF')
    expect(customDiscount).toHaveTextContent('Save $5.25')

    await waitFor(() => {
      expect(screen.getByText('$99.75 USD')).toBeVisible()
    })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Waffo Pancake/ }))
    })

    const dialog = await screen.findByRole('alertdialog')
    expect(dialog).toHaveTextContent('Original')
    expect(dialog).toHaveTextContent('$105.00 USD')
    expect(dialog).toHaveTextContent('You Pay')
    expect(dialog).toHaveTextContent('$99.75 USD')
    expect(dialog).toHaveTextContent('You save')
    expect(dialog).toHaveTextContent('5% OFF')
    expect(dialog).toHaveTextContent('$5.25 USD')
  })
})
