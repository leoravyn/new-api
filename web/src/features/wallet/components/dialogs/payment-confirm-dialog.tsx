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
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { normalizeInterfaceLanguage } from '@/i18n/languages'

import { DEFAULT_DISCOUNT_RATE } from '../../constants'
import {
  formatUsdAmount,
  getDiscountLabel,
  getPaymentIcon,
  isWaffoPayment,
  isWaffoPancakePayment,
} from '../../lib'
import type { PaymentMethod } from '../../types'
import {
  CheckoutPolicyNotice,
  WaffoSettlementNote,
} from '../checkout-policy-notice'

interface PaymentConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  topupAmount: number
  paymentAmount: number
  paymentMethod: PaymentMethod | undefined
  calculating: boolean
  processing: boolean
  discountRate?: number
}

export function PaymentConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  topupAmount,
  paymentAmount,
  paymentMethod,
  calculating,
  processing,
  discountRate = DEFAULT_DISCOUNT_RATE,
}: PaymentConfirmDialogProps) {
  const { t, i18n } = useTranslation()
  const isZh =
    normalizeInterfaceLanguage(i18n.resolvedLanguage || i18n.language) ===
    'zhCN'
  const hasDiscount = discountRate > 0 && discountRate < 1 && paymentAmount > 0
  const originalAmount = hasDiscount
    ? Math.round((paymentAmount / discountRate) * 1e6) / 1e6
    : 0
  const discountAmount = hasDiscount
    ? Math.max(0, Math.round((originalAmount - paymentAmount) * 1e6) / 1e6)
    : 0
  const isWaffoMethod =
    isWaffoPayment(paymentMethod?.type ?? '') ||
    isWaffoPancakePayment(paymentMethod?.type ?? '')

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='max-sm:w-[calc(100vw-1.5rem)] sm:max-w-md'>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-xl font-semibold'>
            {t('Confirm Payment')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('Review your payment details')}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className='space-y-3 py-3 sm:space-y-4 sm:py-4'>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground text-sm'>
              {t('Topup Amount')}
            </span>
            <span className='font-mono text-lg font-semibold tabular-nums'>
              {formatUsdAmount(topupAmount, { withCode: true })}
            </span>
          </div>

          {hasDiscount && !calculating && (
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground text-sm'>
                {t('Original', {
                  defaultValue: isZh ? '原价' : 'Original',
                })}
              </span>
              <span className='text-muted-foreground font-mono text-sm tabular-nums line-through'>
                {formatUsdAmount(originalAmount, { withCode: true })}
              </span>
            </div>
          )}

          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground text-sm'>
              {t('You Pay')}
            </span>
            {calculating ? (
              <Skeleton className='h-6 w-24' />
            ) : (
              <span className='font-mono text-2xl font-semibold tabular-nums'>
                {formatUsdAmount(paymentAmount, { withCode: true })}
              </span>
            )}
          </div>

          {hasDiscount && !calculating && (
            <div className='rounded-xl border border-white/[0.07] bg-white/[0.025] p-3'>
              <div className='flex items-center justify-between gap-2 text-sm'>
                <div className='flex items-center gap-2'>
                  <span className='text-muted-foreground'>{t('You save')}</span>
                  <span className='rounded-md border border-emerald-500/25 bg-emerald-500/10 px-1.5 py-0.5 text-[11px] font-medium text-emerald-400'>
                    {getDiscountLabel(discountRate, t)}
                  </span>
                </div>
                <span className='font-mono font-semibold text-emerald-400 tabular-nums'>
                  {formatUsdAmount(discountAmount, { withCode: true })}
                </span>
              </div>
            </div>
          )}

          <div className='border-t border-white/[0.08] pt-4'>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground text-sm'>
                {t('Payment Method')}
              </span>
              <div className='flex items-center gap-2'>
                {getPaymentIcon(
                  paymentMethod?.type,
                  'h-4 w-4',
                  paymentMethod?.icon,
                  paymentMethod?.name
                )}
                <span className='font-medium'>{paymentMethod?.name}</span>
              </div>
            </div>
            {isWaffoMethod && <WaffoSettlementNote className='mt-2.5' />}
          </div>

          <CheckoutPolicyNotice compact />
        </div>

        <AlertDialogFooter className='grid grid-cols-2 gap-2 sm:flex'>
          <AlertDialogCancel disabled={processing}>
            {t('Cancel')}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={processing}>
            {processing && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {t('Confirm Payment')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
