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
import { describe, expect, test } from 'vitest'

import { PAYMENT_TYPES } from '../constants'
import {
  dispatchSelectedPayment,
  getDefaultPaymentType,
  getPaymentSettlementCurrency,
  isEpayMethodType,
  isEpayReturnQuery,
  isStripePayment,
  isWaffoPayment,
  isWaffoPancakePayment,
} from './payment'

describe('payment type classification', () => {
  test('keeps Waffo and Waffo Pancake on their dedicated flows', () => {
    expect(isWaffoPayment(PAYMENT_TYPES.WAFFO)).toBe(true)
    expect(isWaffoPayment(PAYMENT_TYPES.WAFFO_PANCAKE)).toBe(false)
    expect(isWaffoPancakePayment(PAYMENT_TYPES.WAFFO_PANCAKE)).toBe(true)
    expect(isWaffoPancakePayment(PAYMENT_TYPES.WAFFO)).toBe(false)
    expect(isStripePayment(PAYMENT_TYPES.STRIPE)).toBe(true)
  })

  test('classifies Epay methods (alipay, wxpay, etc.) as CNY and Waffo/Stripe as USD', () => {
    expect(isEpayMethodType('alipay')).toBe(true)
    expect(isEpayMethodType('wxpay')).toBe(true)
    expect(isEpayMethodType(PAYMENT_TYPES.WAFFO_PANCAKE)).toBe(false)
    expect(isEpayMethodType(PAYMENT_TYPES.WAFFO)).toBe(false)
    expect(isEpayMethodType(PAYMENT_TYPES.STRIPE)).toBe(false)

    expect(getPaymentSettlementCurrency('alipay')).toBe('CNY')
    expect(getPaymentSettlementCurrency('wxpay')).toBe('CNY')
    expect(getPaymentSettlementCurrency(PAYMENT_TYPES.WAFFO_PANCAKE)).toBe(
      'USD'
    )
    expect(getPaymentSettlementCurrency(PAYMENT_TYPES.WAFFO)).toBe('USD')
    expect(getPaymentSettlementCurrency(PAYMENT_TYPES.STRIPE)).toBe('USD')
  })

  test('prefers Waffo Pancake as default preview type even when Epay methods come first', () => {
    expect(
      getDefaultPaymentType({
        enable_online_topup: true,
        enable_stripe_topup: false,
        enable_waffo_topup: false,
        enable_waffo_pancake_topup: true,
        pay_methods: [
          { name: 'Alipay', type: 'alipay', min_topup: 5 },
          { name: 'WeChat Pay', type: 'wxpay', min_topup: 5 },
          {
            name: 'Waffo Pancake',
            type: PAYMENT_TYPES.WAFFO_PANCAKE,
            min_topup: 10,
          },
        ],
        min_topup: 5,
        stripe_min_topup: 5,
        amount_options: [],
        discount: {},
      })
    ).toBe(PAYMENT_TYPES.WAFFO_PANCAKE)
  })

  test('detects Zpay/Epay return_url query parameters for wallet redirect', () => {
    expect(
      isEpayReturnQuery(
        '?pid=2026112020260672&trade_no=202611232300143295&out_trade_no=USR1NOBrAcxb&type=alipay&money=1.00&trade_status=TRADE_SUCCESS&sign=abc&sign_type=MD5'
      )
    ).toBe(true)
    expect(
      isEpayReturnQuery('', {
        out_trade_no: 'USR1NOBrAcxb',
        trade_status: 'TRADE_SUCCESS',
      })
    ).toBe(true)
    expect(isEpayReturnQuery('')).toBe(false)
    expect(isEpayReturnQuery('?tab=common', { tab: 'common' })).toBe(false)
  })
})

describe('payment dispatch', () => {
  test('keeps the selected Waffo method index through confirmation', async () => {
    const calls: string[] = []
    const success = await dispatchSelectedPayment(
      { name: 'Waffo Card', type: PAYMENT_TYPES.WAFFO },
      120,
      3,
      {
        regular: async () => {
          calls.push('regular')
          return false
        },
        waffo: async (amount, index) => {
          calls.push(`waffo:${amount}:${index}`)
          return true
        },
        waffoPancake: async () => {
          calls.push('pancake')
          return false
        },
      }
    )

    expect(success).toBe(true)
    expect(calls).toEqual(['waffo:120:3'])
  })

  test('does not create a Waffo order without a selected method index', async () => {
    let called = false
    const success = await dispatchSelectedPayment(
      { name: 'Waffo Card', type: PAYMENT_TYPES.WAFFO },
      120,
      null,
      {
        regular: async () => false,
        waffo: async () => {
          called = true
          return true
        },
        waffoPancake: async () => false,
      }
    )

    expect(success).toBe(false)
    expect(called).toBe(false)
  })
})
