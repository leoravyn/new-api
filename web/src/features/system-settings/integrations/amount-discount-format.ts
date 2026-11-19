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

export type FormattedDiscount = {
  hasDiscount: boolean
  isValid: boolean
  offPercent: string | null
  zhe: string | null
  label: string
}

function toCleanString(value: number): string {
  return String(Object.is(value, -0) ? 0 : value)
}

function formatOffPercent(rate: number): string {
  const raw = (1 - rate) * 100
  for (let decimals = 2; decimals <= 4; decimals++) {
    const rounded = Number(raw.toFixed(decimals))
    if (rounded > 0) {
      return toCleanString(rounded)
    }
  }
  return toCleanString(Number(raw.toFixed(4)))
}

function formatZhe(rate: number): string {
  const raw = rate * 10
  // Preserve exact 3-decimal multipliers (e.g. 0.9555 -> 9.555) while avoiding float noise.
  const rounded3 = Number(raw.toFixed(3))
  if (Math.abs(raw - rounded3) < 1e-6 && rounded3 > 0 && rounded3 < 10) {
    return toCleanString(rounded3)
  }
  for (let decimals = 2; decimals <= 4; decimals++) {
    const rounded = Number(raw.toFixed(decimals))
    if (rounded > 0 && rounded < 10) {
      return toCleanString(rounded)
    }
  }
  return toCleanString(Number(raw.toFixed(4)))
}

/**
 * Format a numeric discount rate multiplier for table/card code display while
 * keeping two decimals for standard rates (e.g. 0.9 -> "0.90") and preserving
 * finer precision when configured (e.g. 0.955 -> "0.955").
 */
export function formatDiscountRateValue(rate: number): string {
  if (!Number.isFinite(rate)) return '-'
  const rounded2 = Number(rate.toFixed(2))
  if (Math.abs(rate - rounded2) < 1e-6) {
    return rate.toFixed(2)
  }
  return toCleanString(Number(rate.toFixed(4)))
}

/**
 * Format a price multiplier rate (0 < rate <= 1) into a localized discount
 * label without IEEE-754 floating-point artifacts.
 */
export function formatDiscountDisplay(
  rate: number,
  t: TFunction
): FormattedDiscount {
  if (!Number.isFinite(rate) || rate <= 0 || rate > 1) {
    return {
      hasDiscount: false,
      isValid: false,
      offPercent: null,
      zhe: null,
      label: '-',
    }
  }

  if (rate === 1) {
    return {
      hasDiscount: false,
      isValid: true,
      offPercent: '0',
      zhe: '10',
      label: t('No discount'),
    }
  }

  const offPercent = formatOffPercent(rate)
  const zhe = formatZhe(rate)

  return {
    hasDiscount: true,
    isValid: true,
    offPercent,
    zhe,
    label: t('{{percent}}% off', { percent: offPercent, zhe }),
  }
}
