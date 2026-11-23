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
import { getServerMessage } from '@/lib/server-error-message'

import {
  PAYMENT_TYPES,
  DEFAULT_PRESET_MULTIPLIERS,
  DEFAULT_PAYMENT_TYPE,
  DEFAULT_MIN_TOPUP,
} from '../constants'
import type { PaymentMethod, PresetAmount, TopupInfo } from '../types'
import type { SettlementCurrency } from './format'
import { getMatchedAmountDiscount } from './format'

// ============================================================================
// Payment Processing Functions
// ============================================================================

/**
 * Payment endpoints answer errors as {"message": "error", "data": text}. When
 * the response also carries a message_key, this is its translation; callers
 * fall back to the text they already read.
 */
export function getPaymentErrorTranslation(
  response: unknown
): string | undefined {
  if (!response || typeof response !== 'object') return undefined
  const body = response as Record<string, unknown>
  if (typeof body.message_key !== 'string' || !body.message_key) {
    return undefined
  }
  return getServerMessage(body)
}

/**
 * Check if browser is Safari
 */
function isSafariBrowser(): boolean {
  return (
    navigator.userAgent.includes('Safari') &&
    !navigator.userAgent.includes('Chrome')
  )
}

/**
 * Submit payment form (for non-Stripe payments)
 */
export function submitPaymentForm(
  url: string,
  params: Record<string, unknown>
): void {
  const form = document.createElement('form')
  form.action = url
  form.method = 'POST'

  // Don't open in new tab for Safari
  if (!isSafariBrowser()) {
    form.target = '_blank'
  }

  // Add form parameters
  Object.entries(params).forEach(([key, value]) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = key
    input.value = String(value)
    form.appendChild(input)
  })

  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}

/**
 * Check if payment method is Stripe
 */
export function isStripePayment(paymentType: string): boolean {
  return paymentType === PAYMENT_TYPES.STRIPE
}

/**
 * Check if payment method is Waffo
 */
export function isWaffoPayment(paymentType: string): boolean {
  return paymentType === PAYMENT_TYPES.WAFFO
}

/**
 * Check if payment method is Waffo Pancake
 *
 * Pancake is a metered-style payment that goes through a dedicated checkout
 * URL flow rather than the generic epay form submission, so it must be
 * special-cased in payment dispatch logic.
 */
export function isWaffoPancakePayment(paymentType: string): boolean {
  return paymentType === PAYMENT_TYPES.WAFFO_PANCAKE
}

/**
 * Epay / Zpay handles all standard payment methods other than Stripe, Waffo,
 * and Waffo Pancake (e.g., alipay, wxpay, qqpay, or future Epay channels).
 */
export function isEpayMethodType(paymentType: string): boolean {
  return (
    Boolean(paymentType) &&
    !isStripePayment(paymentType) &&
    !isWaffoPayment(paymentType) &&
    !isWaffoPancakePayment(paymentType)
  )
}

/**
 * Return the checkout settlement currency for a payment method type.
 * Waffo, Waffo Pancake, and Stripe settle in USD; Epay channels settle in CNY.
 */
export function getPaymentSettlementCurrency(
  paymentType: string
): SettlementCurrency {
  return isEpayMethodType(paymentType) ? 'CNY' : 'USD'
}

/**
 * Detect Epay / Zpay return_url callback query parameters (e.g. pid, trade_no,
 * out_trade_no, trade_status) so /usage-logs can forward back to /wallet.
 */
export function isEpayReturnQuery(
  searchStr: string = '',
  search?: Record<string, unknown>
): boolean {
  const hasParam = (key: string) =>
    typeof search?.[key] === 'string' && search[key] !== ''

  if (
    hasParam('trade_status') ||
    hasParam('out_trade_no') ||
    hasParam('trade_no')
  ) {
    return true
  }

  if (!searchStr) {
    return false
  }

  const params = new URLSearchParams(searchStr)
  return Boolean(
    params.get('trade_status') ||
    params.get('out_trade_no') ||
    params.get('trade_no')
  )
}

export interface PaymentProcessors {
  regular: (topupAmount: number, paymentType: string) => Promise<boolean>
  waffo: (topupAmount: number, payMethodIndex: number) => Promise<boolean>
  waffoPancake: (topupAmount: number) => Promise<boolean>
}

export async function dispatchSelectedPayment(
  paymentMethod: PaymentMethod,
  topupAmount: number,
  waffoMethodIndex: number | null,
  processors: PaymentProcessors
): Promise<boolean> {
  if (isWaffoPayment(paymentMethod.type)) {
    if (waffoMethodIndex === null) {
      return false
    }
    return processors.waffo(topupAmount, waffoMethodIndex)
  }

  if (isWaffoPancakePayment(paymentMethod.type)) {
    return processors.waffoPancake(topupAmount)
  }

  return processors.regular(topupAmount, paymentMethod.type)
}

/**
 * Get default payment type from topup info.
 * Prefer Waffo Pancake when enabled so the default preview aligns with USD preset cards.
 */
export function getDefaultPaymentType(topupInfo: TopupInfo | null): string {
  if (!topupInfo) {
    return DEFAULT_PAYMENT_TYPE
  }

  if (
    topupInfo.enable_waffo_pancake_topup ||
    topupInfo.pay_methods?.some((method) => isWaffoPancakePayment(method.type))
  ) {
    return PAYMENT_TYPES.WAFFO_PANCAKE
  }

  // Return first available payment method or default
  if (topupInfo.pay_methods?.length > 0) {
    return topupInfo.pay_methods[0].type
  }

  if (topupInfo.enable_stripe_topup) {
    return PAYMENT_TYPES.STRIPE
  }

  if (topupInfo.enable_waffo_topup) {
    return PAYMENT_TYPES.WAFFO
  }

  return DEFAULT_PAYMENT_TYPE
}

/**
 * Get minimum topup amount from topup info
 */
export function getMinTopupAmount(topupInfo: TopupInfo | null): number {
  if (!topupInfo) {
    return DEFAULT_MIN_TOPUP
  }

  const globalMin = topupInfo.min_topup || 0
  let gatewayMin = 0

  if (topupInfo.enable_online_topup) {
    gatewayMin = topupInfo.min_topup || 0
  } else if (topupInfo.enable_stripe_topup) {
    gatewayMin = topupInfo.stripe_min_topup || 0
  } else if (topupInfo.enable_waffo_topup) {
    gatewayMin = topupInfo.waffo_min_topup || 0
  } else if (topupInfo.enable_waffo_pancake_topup) {
    gatewayMin = topupInfo.waffo_pancake_min_topup || 0
  }

  return Math.max(globalMin, gatewayMin) || DEFAULT_MIN_TOPUP
}

/**
 * Generate preset amounts based on minimum topup
 */
export function generatePresetAmounts(minAmount: number): PresetAmount[] {
  return DEFAULT_PRESET_MULTIPLIERS.map((multiplier) => ({
    value: minAmount * multiplier,
  }))
}

/**
 * Merge custom preset amounts with discounts
 */
export function mergePresetAmounts(
  amountOptions: number[],
  discounts: Record<number, number>
): PresetAmount[] {
  if (!amountOptions || amountOptions.length === 0) {
    return []
  }

  return amountOptions.map((amount) => ({
    value: amount,
    discount: getMatchedAmountDiscount(amount, discounts),
  }))
}
