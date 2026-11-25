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

export function formatCommissionRatePercent(rate: number): string {
  if (!Number.isFinite(rate) || rate <= 0) return '0%'
  const pct = Math.round(rate * 10000) / 100
  return `${pct}%`
}

export function getDiscountPercentOff(discount: number): number {
  if (!Number.isFinite(discount) || discount <= 0 || discount >= 1) return 0
  return Math.round((1 - discount) * 1000) / 10
}

export function getZhDiscountZhe(discount: number): string {
  if (!Number.isFinite(discount) || discount <= 0 || discount >= 1) return ''
  const zhe = Math.round(discount * 100) / 10
  return String(zhe)
}

export function formatCancelReason(reason: string, t: TFunction): string {
  switch (reason) {
    case 'topup_not_success':
      return t('Top-up order reversed or incomplete')
    case 'invitee_disabled':
      return t('Invitee account disabled')
    case 'inviter_disabled':
      return t('Inviter account disabled')
    default:
      return reason || t('Cancelled')
  }
}

export function formatPaymentProviderLabel(
  provider: string,
  t: TFunction
): string {
  switch (provider) {
    case 'waffo_pancake':
      return 'Waffo Pancake'
    case 'waffo':
      return 'Waffo'
    case 'stripe':
      return 'Stripe'
    case 'creem':
      return 'Creem'
    case 'epay':
      return 'Epay'
    case 'alipay':
      return t('Alipay')
    case 'wxpay':
      return t('WeChat Pay')
    case 'admin':
      return t('Admin Manual')
    default:
      return provider || '-'
  }
}
