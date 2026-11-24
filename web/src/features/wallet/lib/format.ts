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
import type { TFunction } from 'i18next'

import { DEFAULT_DISCOUNT_RATE, PAYMENT_TYPES } from '../constants'

// ============================================================================
// Wallet-specific Formatting Functions
// ============================================================================

/**
 * Format Creem price with currency symbol (USD/EUR)
 */
export function formatCreemPrice(
  price: number,
  currency: 'USD' | 'EUR'
): string {
  const symbol = currency === 'EUR' ? '€' : '$'
  return `${symbol}${price.toFixed(2)}`
}

/**
 * Format large quota numbers with K/M suffix
 */
export function formatQuotaShort(quota: number): string {
  if (quota >= 1000000) {
    return `${(quota / 1000000).toFixed(1)}M`
  }
  if (quota >= 1000) {
    return `${(quota / 1000).toFixed(1)}K`
  }
  return quota.toString()
}

/**
 * Format currency amount that is already in local currency.
 * This is used for payment amounts that have been calculated via priceRatio.
 */
export function formatCurrency(amount: number | string): string {
  const numeric =
    typeof amount === 'number' ? amount : Number.parseFloat(String(amount))
  if (!Number.isFinite(numeric)) return '-'

  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: Math.abs(numeric) >= 1 ? 2 : 4,
  }).format(numeric)
}

export type SettlementCurrency = 'USD' | 'CNY'

export interface FormatUsdOptions {
  /** Omit `.00` for whole-dollar amounts (e.g. `$10`, `$100`) */
  trimWholeCents?: boolean
  /** Append explicit currency code (e.g. `$10.00 USD`, `¥70.00 CNY`) */
  withCode?: boolean
}

function roundPrecision(value: number): number {
  return Math.round(value * 1e6) / 1e6
}

function formatCurrencyAmount(
  amount: number | string,
  currency: SettlementCurrency,
  locale: string,
  options?: FormatUsdOptions
): string {
  const numeric =
    typeof amount === 'number' ? amount : Number.parseFloat(String(amount))
  if (!Number.isFinite(numeric)) return '-'

  const trimWholeCents = options?.trimWholeCents ?? false
  const withCode = options?.withCode ?? false
  const isWhole = Math.abs(numeric - Math.round(numeric)) < 1e-9

  let minimumFractionDigits = 2
  let maximumFractionDigits = 2

  if (trimWholeCents && isWhole) {
    minimumFractionDigits = 0
    maximumFractionDigits = 0
  } else if (Math.abs(numeric) > 0 && Math.abs(numeric) < 0.01) {
    minimumFractionDigits = 2
    maximumFractionDigits = 4
  }

  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numeric)

  return withCode ? `${formatted} ${currency}` : formatted
}

/**
 * Format an amount explicitly in USD (`$`) regardless of browser locale.
 */
export function formatUsdAmount(
  amount: number | string,
  options?: FormatUsdOptions
): string {
  return formatCurrencyAmount(amount, 'USD', 'en-US', options)
}

/**
 * Format an amount explicitly in CNY (`¥`) regardless of browser locale.
 */
export function formatCnyAmount(
  amount: number | string,
  options?: FormatUsdOptions
): string {
  return formatCurrencyAmount(amount, 'CNY', 'zh-CN', options)
}

/**
 * Format a settlement amount in the given currency (`USD` or `CNY`).
 */
export function formatSettlementAmount(
  amount: number | string,
  currency: SettlementCurrency = 'USD',
  options?: FormatUsdOptions
): string {
  return currency === 'CNY'
    ? formatCnyAmount(amount, options)
    : formatUsdAmount(amount, options)
}

/**
 * Match the highest discount tier whose threshold is <= amount.
 */
export function getMatchedAmountDiscount(
  amount: number,
  discounts?: Record<number, number> | null
): number {
  if (!Number.isFinite(amount) || amount <= 0 || !discounts) {
    return DEFAULT_DISCOUNT_RATE
  }

  let bestThreshold = 0
  let bestRate = DEFAULT_DISCOUNT_RATE

  for (const [rawThreshold, rawRate] of Object.entries(discounts)) {
    const threshold = Number(rawThreshold)
    const rate = Number(rawRate)
    if (
      !Number.isFinite(threshold) ||
      threshold <= 0 ||
      threshold > amount ||
      !Number.isFinite(rate) ||
      rate <= 0
    ) {
      continue
    }

    if (threshold > bestThreshold) {
      bestThreshold = threshold
      bestRate = rate
    }
  }

  return bestRate
}

/**
 * Resolve discount rate by payment method: Stripe quotes still use exact-key
 * discount lookup, while other gateways use tiered threshold matching.
 */
export function getDiscountRateForPaymentType(
  amount: number,
  discounts?: Record<number, number> | null,
  paymentType?: string
): number {
  if (paymentType === PAYMENT_TYPES.STRIPE) {
    if (!Number.isFinite(amount) || amount <= 0 || !discounts) {
      return DEFAULT_DISCOUNT_RATE
    }
    const exactRate = Number(discounts[amount])
    return Number.isFinite(exactRate) && exactRate > 0
      ? exactRate
      : DEFAULT_DISCOUNT_RATE
  }

  return getMatchedAmountDiscount(amount, discounts)
}

/**
 * Get discount label for display (e.g., "20% OFF")
 */
export function getDiscountLabel(discount: number, t: TFunction): string {
  if (discount <= 0 || discount >= DEFAULT_DISCOUNT_RATE) {
    return ''
  }
  const off = Math.round((1 - discount) * 100)
  if (off <= 0) {
    return ''
  }
  return t('{{percent}}% OFF', { percent: off })
}

/**
 * Calculate pricing details for a preset amount
 */
export function calculatePresetPricing(
  presetValue: number,
  priceRatio: number,
  discount: number,
  usdExchangeRate: number = 1
) {
  const effectiveDiscount =
    Number.isFinite(discount) && discount > 0 && discount <= 1 ? discount : 1
  const originalPrice = roundPrecision(presetValue * priceRatio)
  const actualPrice = roundPrecision(originalPrice * effectiveDiscount)
  const savedAmount = roundPrecision(originalPrice - actualPrice)
  const hasDiscount = effectiveDiscount < 1.0 && savedAmount > 0
  const displayValue = roundPrecision(presetValue * usdExchangeRate)

  return {
    displayValue,
    originalPrice,
    actualPrice,
    savedAmount,
    hasDiscount,
  }
}
