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
import { act, fireEvent, render, screen } from '@testing-library/react'
import { createInstance } from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import en from '@/i18n/locales/en.json'
import zhTW from '@/i18n/locales/zh-TW.json'
import zhCN from '@/i18n/locales/zh.json'

import { AmountDiscountDialog } from '../amount-discount-dialog'
import {
  formatDiscountDisplay,
  formatDiscountRateValue,
} from '../amount-discount-format'
import { AmountDiscountVisualEditor } from '../amount-discount-visual-editor'

const i18n = createInstance()

beforeEach(async () => {
  await i18n.use(initReactI18next).init({
    lng: 'zhCN',
    fallbackLng: 'en',
    nsSeparator: false,
    resources: { en, zhCN, zhTW },
    interpolation: { escapeValue: false },
  })
})

describe('formatDiscountDisplay', () => {
  it('formats standard and fractional multipliers cleanly without float artifacts', () => {
    expect(formatDiscountDisplay(0.95, i18n.t)).toEqual({
      hasDiscount: true,
      isValid: true,
      offPercent: '5',
      zhe: '9.5',
      label: '优惠 5% (9.5折)',
    })
    expect(formatDiscountDisplay(0.9, i18n.t)).toEqual({
      hasDiscount: true,
      isValid: true,
      offPercent: '10',
      zhe: '9',
      label: '优惠 10% (9折)',
    })
    expect(formatDiscountDisplay(0.85, i18n.t)).toEqual({
      hasDiscount: true,
      isValid: true,
      offPercent: '15',
      zhe: '8.5',
      label: '优惠 15% (8.5折)',
    })
    expect(formatDiscountDisplay(0.57, i18n.t).label).toBe('优惠 43% (5.7折)')
    expect(formatDiscountDisplay(0.14, i18n.t).label).toBe('优惠 86% (1.4折)')
    expect(formatDiscountDisplay(0.9500000000000002, i18n.t).label).toBe(
      '优惠 5% (9.5折)'
    )
    expect(formatDiscountDisplay(0.955, i18n.t).label).toBe(
      '优惠 4.5% (9.55折)'
    )
    expect(formatDiscountDisplay(0.9555, i18n.t).label).toBe(
      '优惠 4.45% (9.555折)'
    )
    expect(formatDiscountDisplay(0.9999, i18n.t).label).toBe(
      '优惠 0.01% (9.999折)'
    )
    expect(formatDiscountDisplay(1, i18n.t)).toEqual({
      hasDiscount: false,
      isValid: true,
      offPercent: '0',
      zhe: '10',
      label: '原价',
    })
  })

  it('formats English and zhTW labels and rejects invalid rates', async () => {
    await act(() => i18n.changeLanguage('en'))
    expect(formatDiscountDisplay(0.95, i18n.t).label).toBe('5% off')
    expect(formatDiscountDisplay(0.9, i18n.t).label).toBe('10% off')
    expect(formatDiscountDisplay(1, i18n.t).label).toBe('No discount')
    expect(formatDiscountDisplay(0, i18n.t)).toEqual({
      hasDiscount: false,
      isValid: false,
      offPercent: null,
      zhe: null,
      label: '-',
    })
    expect(formatDiscountDisplay(1.2, i18n.t).isValid).toBe(false)
    expect(formatDiscountDisplay(Number.NaN, i18n.t).isValid).toBe(false)

    await act(() => i18n.changeLanguage('zhTW'))
    expect(formatDiscountDisplay(0.95, i18n.t).label).toBe('優惠 5% (9.5折)')
    expect(formatDiscountDisplay(1, i18n.t).label).toBe('原價')
  })

  it('preserves 2-decimal tabular formatting and 3+ decimal precision for rates', () => {
    expect(formatDiscountRateValue(0.9)).toBe('0.90')
    expect(formatDiscountRateValue(0.95)).toBe('0.95')
    expect(formatDiscountRateValue(1)).toBe('1.00')
    expect(formatDiscountRateValue(0.955)).toBe('0.955')
  })

  it('keeps the shared off i18n key untouched for toggle callers', () => {
    expect(zhCN.translation.off).toBe('关闭')
    expect(zhTW.translation.off).toBe('關閉')
    expect(en.translation.off).toBe('off')
  })
})

describe('AmountDiscountDialog', () => {
  it('renders accurate zhCN and en multiplier wording and live previews', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <AmountDiscountDialog
          open
          onOpenChange={vi.fn()}
          onSave={vi.fn()}
          editData={{ amount: 100, discountRate: 0.95 }}
        />
      </I18nextProvider>
    )

    expect(
      screen.getByText('最终价格乘数 (0.95 = 优惠 5% / 9.5折)')
    ).toBeVisible()
    expect(screen.getByText(/优惠 5% \(9\.5折\)/)).toBeVisible()
    expect(document.body.textContent).not.toContain('= 5折')

    const rateInput = screen.getByLabelText('折扣率')
    fireEvent.change(rateInput, { target: { value: '0.9' } })
    expect(screen.getByText(/优惠 10% \(9折\)/)).toBeVisible()

    fireEvent.change(rateInput, { target: { value: '0.85' } })
    expect(screen.getByText(/优惠 15% \(8\.5折\)/)).toBeVisible()

    fireEvent.change(rateInput, { target: { value: '1' } })
    expect(screen.getByText(/原价/)).toBeVisible()

    await act(() => i18n.changeLanguage('en'))
    expect(
      screen.getByText('Final price multiplier (0.95 = 5% off)')
    ).toBeVisible()
    expect(screen.getByText(/No discount/)).toBeVisible()

    fireEvent.change(screen.getByLabelText('Discount Rate'), {
      target: { value: '0.95' },
    })
    expect(screen.getByText(/· 5% off/)).toBeVisible()
    expect(
      screen.getByLabelText('Recharge Amount Threshold (≥ USD)')
    ).toBeVisible()
    expect(
      screen.getByText(
        'Threshold cannot be changed when editing. Applies when top-up amount ≥ this threshold (highest matching tier applies).'
      )
    ).toBeVisible()
  })

  it('clarifies >= threshold helper copy when adding a new discount tier', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <AmountDiscountDialog
          open
          onOpenChange={vi.fn()}
          onSave={vi.fn()}
          editData={null}
        />
      </I18nextProvider>
    )

    expect(screen.getByLabelText('充值金额阈值 (≥ 美元)')).toBeVisible()
    expect(
      screen.getByText(
        '当充值金额达到或超过该阈值（≥ 金额）时生效；自动匹配最高满足的档位。'
      )
    ).toBeVisible()

    await act(() => i18n.changeLanguage('en'))
    expect(
      screen.getByLabelText('Recharge Amount Threshold (≥ USD)')
    ).toBeVisible()
    expect(
      screen.getByText(
        'Applies when top-up amount reaches or exceeds this threshold (≥ amount); the highest matching tier applies.'
      )
    ).toBeVisible()

    await act(() => i18n.changeLanguage('zhTW'))
    expect(screen.getByLabelText('儲值金額閾值 (≥ 美元)')).toBeVisible()
    expect(
      screen.getByText(
        '當儲值金額達到或超過此閾值（≥ 金額）時生效；自動套用最高符合的級距。'
      )
    ).toBeVisible()
  })
})

describe('AmountDiscountVisualEditor', () => {
  it('renders accurate discount badges in both desktop table and mobile cards', async () => {
    const value = JSON.stringify({
      '10': 1,
      '100': 0.95,
      '200': 0.9,
      '500': 0.85,
    })

    const { container } = render(
      <I18nextProvider i18n={i18n}>
        <AmountDiscountVisualEditor value={value} onChange={vi.fn()} />
      </I18nextProvider>
    )

    expect(screen.getAllByText('优惠 5% (9.5折)')).toHaveLength(2)
    expect(screen.getAllByText('优惠 10% (9折)')).toHaveLength(2)
    expect(screen.getAllByText('优惠 15% (8.5折)')).toHaveLength(2)
    expect(screen.getAllByText('原价')).toHaveLength(2)
    expect(screen.getAllByText('≥ $100')).toHaveLength(2)
    expect(
      screen.getByText(
        '配置阶梯充值折扣率。充值金额 ≥ 阈值时自动匹配最高满足的折扣档位。'
      )
    ).toBeVisible()
    expect(container.textContent).not.toContain('关闭')
    expect(container.textContent).not.toContain('= 5折')

    await act(() => i18n.changeLanguage('en'))
    expect(screen.getAllByText('5% off')).toHaveLength(2)
    expect(screen.getAllByText('10% off')).toHaveLength(2)
    expect(screen.getAllByText('15% off')).toHaveLength(2)
    expect(screen.getAllByText('No discount')).toHaveLength(2)
    expect(
      screen.getByText(
        'Configure tiered discount rates. Orders ≥ threshold automatically match the highest qualifying tier.'
      )
    ).toBeVisible()
  })
})
