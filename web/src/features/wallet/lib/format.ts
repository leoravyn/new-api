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

import { DEFAULT_DISCOUNT_RATE } from '../constants'

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

export interface FormatUsdOptions {
  /** Omit `.00` for whole-dollar amounts (e.g. `$10`, `$100`) */
  trimWholeCents?: boolean
  /** Append explicit `USD` code (e.g. `$10.00 USD`) */
  withCode?: boolean
}

function roundPrecision(value: number): number {
  return Math.round(value * 1e6) / 1e6
}

/**
 * Format an amount explicitly in USD (`$`) regardless of browser locale.
 */
export function formatUsdAmount(
  amount: number | string,
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

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numeric)

  return withCode ? `${formatted} USD` : formatted
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
