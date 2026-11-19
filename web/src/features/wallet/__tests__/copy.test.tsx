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
import { act, render, screen } from '@testing-library/react'
import { createInstance } from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { beforeEach, expect, it, vi } from 'vitest'

import { BillingHistoryDialog } from '@/features/wallet/components/dialogs/billing-history-dialog'
import en from '@/i18n/locales/en.json'
import zh from '@/i18n/locales/zh.json'
import { api } from '@/lib/api'

import { RechargeFormCard } from '../components/recharge-form-card'

const i18n = createInstance()

beforeEach(async () => {
  await i18n.use(initReactI18next).init({
    lng: 'zh',
    fallbackLng: false,
    nsSeparator: false,
    resources: { en, zh },
    interpolation: { escapeValue: false },
  })
})

it('translates billing history statuses and updates them when the language changes', async () => {
  vi.spyOn(api, 'get').mockResolvedValue({
    data: {
      success: true,
      data: {
        total: 3,
        items: ['success', 'pending', 'expired'].map((status, id) => ({
          id,
          status,
          amount: 10,
          money: 10,
          trade_no: `order-${id}`,
          payment_method: 'stripe',
          create_time: 1,
        })),
      },
    },
  })
  render(
    <I18nextProvider i18n={i18n}>
      <BillingHistoryDialog open onOpenChange={vi.fn()} />
    </I18nextProvider>
  )
  await screen.findByText('order-0')
  for (const label of ['成功', '待确认', '已过期']) {
    expect(screen.getByText(label)).toBeVisible()
  }
  await act(() => i18n.changeLanguage('en'))
  for (const label of ['Success', 'Pending', 'Expired']) {
    expect(screen.getByText(label)).toBeVisible()
  }
})

it('translates unified USD recharge presets, Waffo note, minimum amount, and checkout legal links', async () => {
  render(
    <I18nextProvider i18n={i18n}>
      <RechargeFormCard
        topupInfo={{
          enable_online_topup: false,
          enable_stripe_topup: false,
          enable_waffo_pancake_topup: true,
          pay_methods: [
            { name: 'Waffo Pancake', type: 'waffo_pancake', min_topup: 1 },
          ],
          min_topup: 1,
          stripe_min_topup: 1,
          waffo_pancake_min_topup: 1,
          amount_options: [100, 20],
          discount: { 100: 0.95 },
        }}
        presetAmounts={[{ value: 100, discount: 0.95 }, { value: 20 }]}
        selectedPreset={100}
        topupAmount={100}
        paymentAmount={95}
        priceRatio={6}
        usdExchangeRate={7}
        calculating={false}
        paymentLoading={null}
        redemptionCode=''
        redeeming={false}
        enableWaffoPancakeTopup
        onSelectPreset={vi.fn()}
        onTopupAmountChange={vi.fn()}
        onPaymentMethodSelect={vi.fn()}
        onRedemptionCodeChange={vi.fn()}
        onRedeem={vi.fn()}
      />
    </I18nextProvider>
  )
  expect(screen.getByRole('button', { name: /^\$100 / })).toHaveTextContent(
    '优惠 5%支付 $95.00 • 节省 $5.00'
  )
  expect(screen.getByRole('button', { name: /^\$20 / })).toHaveTextContent(
    '支付 $20.00'
  )
  expect(screen.getByPlaceholderText('最低 $1')).toBeVisible()
  expect(screen.getByText('$95.00 USD')).toBeVisible()
  expect(
    screen.getByText(
      /订单以美元 \(USD\) 通过 Waffo 结算；如使用本地货币支付，Waffo 将在结账页自动按汇率换算。/
    )
  ).toBeVisible()
  expect(
    screen.getByText(/数字 API 额度支付后即时到账。/)
  ).toBeVisible()
  expect(screen.getByRole('link', { name: '服务条款' })).toHaveAttribute(
    'href',
    '/terms'
  )
  expect(screen.getByRole('link', { name: '隐私政策' })).toHaveAttribute(
    'href',
    '/privacy-policy'
  )
  expect(screen.getByRole('link', { name: '可接受使用政策' })).toHaveAttribute(
    'href',
    '/aup'
  )

  await act(() => i18n.changeLanguage('en'))
  expect(screen.getByRole('button', { name: /^\$100 / })).toHaveTextContent(
    '5% OFFPay $95.00 • Save $5.00'
  )
  expect(screen.getByRole('button', { name: /^\$20 / })).toHaveTextContent(
    'Pay $20.00'
  )
  expect(screen.getByPlaceholderText('Minimum $1')).toBeVisible()
  expect(
    screen.getByText(
      /Orders are settled in USD via Waffo\. If you pay in a local currency, Waffo applies exchange rates at checkout\./
    )
  ).toBeVisible()
  expect(
    screen.getByText(
      /Digital API credits are delivered instantly upon payment\./
    )
  ).toBeVisible()
  expect(
    screen.getByRole('link', { name: 'Terms of Service' })
  ).toHaveAttribute('href', '/terms')
  expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute(
    'href',
    '/privacy-policy'
  )
  expect(
    screen.getByRole('link', { name: 'Acceptable Use Policy' })
  ).toHaveAttribute('href', '/aup')
})

it('translates custom amount tier discount savings and inline minimum topup warning', async () => {
  const { rerender } = render(
    <I18nextProvider i18n={i18n}>
      <RechargeFormCard
        topupInfo={{
          enable_online_topup: false,
          enable_stripe_topup: false,
          enable_waffo_pancake_topup: true,
          pay_methods: [
            { name: 'Waffo Pancake', type: 'waffo_pancake', min_topup: 1 },
          ],
          min_topup: 10,
          stripe_min_topup: 1,
          waffo_pancake_min_topup: 1,
          amount_options: [10, 100],
          discount: { 100: 0.95, 200: 0.9 },
        }}
        presetAmounts={[
          { value: 10, discount: 1 },
          { value: 100, discount: 0.95 },
        ]}
        selectedPreset={null}
        topupAmount={105}
        paymentAmount={99.75}
        priceRatio={6}
        usdExchangeRate={7}
        calculating={false}
        paymentLoading={null}
        redemptionCode=''
        redeeming={false}
        enableWaffoPancakeTopup
        onSelectPreset={vi.fn()}
        onTopupAmountChange={vi.fn()}
        onPaymentMethodSelect={vi.fn()}
        onRedemptionCodeChange={vi.fn()}
        onRedeem={vi.fn()}
      />
    </I18nextProvider>
  )

  const customDiscount = screen.getByTestId('custom-amount-discount')
  expect(customDiscount).toHaveTextContent('优惠 5%')
  expect(customDiscount).toHaveTextContent('节省 $5.25')

  await act(() => i18n.changeLanguage('en'))
  expect(customDiscount).toHaveTextContent('5% OFF')
  expect(customDiscount).toHaveTextContent('Save $5.25')

  rerender(
    <I18nextProvider i18n={i18n}>
      <RechargeFormCard
        topupInfo={{
          enable_online_topup: false,
          enable_stripe_topup: false,
          enable_waffo_pancake_topup: true,
          pay_methods: [
            { name: 'Waffo Pancake', type: 'waffo_pancake', min_topup: 1 },
          ],
          min_topup: 10,
          stripe_min_topup: 1,
          waffo_pancake_min_topup: 1,
          amount_options: [10, 100],
          discount: { 100: 0.95, 200: 0.9 },
        }}
        presetAmounts={[
          { value: 10, discount: 1 },
          { value: 100, discount: 0.95 },
        ]}
        selectedPreset={null}
        topupAmount={5}
        paymentAmount={0}
        priceRatio={6}
        usdExchangeRate={7}
        calculating={false}
        paymentLoading={null}
        redemptionCode=''
        redeeming={false}
        enableWaffoPancakeTopup
        onSelectPreset={vi.fn()}
        onTopupAmountChange={vi.fn()}
        onPaymentMethodSelect={vi.fn()}
        onRedemptionCodeChange={vi.fn()}
        onRedeem={vi.fn()}
      />
    </I18nextProvider>
  )

  expect(screen.getByRole('alert')).toHaveTextContent(
    'Minimum topup amount: $10'
  )

  await act(() => i18n.changeLanguage('zh'))
  expect(screen.getByRole('alert')).toHaveTextContent('最低充值金额：$10')
})
