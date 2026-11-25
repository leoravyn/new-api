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
import {
  Check,
  Clock,
  Copy,
  Gift,
  Percent,
  Sparkles,
  Wallet,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { IconBadge } from '@/components/ui/icon-badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { normalizeInterfaceLanguage } from '@/i18n/languages'

import {
  formatCommissionRatePercent,
  getDiscountPercentOff,
  getZhDiscountZhe,
} from '../lib'
import type { ReferralSummary } from '../types'

interface ReferralHeroCardProps {
  summary: ReferralSummary | null
  referralLink: string
  loading?: boolean
}

export function ReferralHeroCard({
  summary,
  referralLink,
  loading,
}: ReferralHeroCardProps) {
  const { t, i18n } = useTranslation()
  const { copiedText, copyToClipboard } = useCopyToClipboard()
  const isZh =
    normalizeInterfaceLanguage(i18n.resolvedLanguage || i18n.language) ===
    'zhCN'

  if (loading) {
    return (
      <div className='rounded-2xl border border-white/[0.08] bg-[#0a0a0c]/95 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_12px_32px_-16px_rgba(0,0,0,0.72)] backdrop-blur-xl sm:p-6'>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Skeleton className='h-6 w-52' />
            <Skeleton className='h-4 w-80 max-w-full' />
          </div>
          <div className='flex gap-2'>
            <Skeleton className='h-10 flex-1 rounded-lg' />
            <Skeleton className='h-10 w-36 rounded-lg' />
          </div>
          <div className='grid gap-3 md:grid-cols-3'>
            <Skeleton className='h-20 rounded-xl' />
            <Skeleton className='h-20 rounded-xl' />
            <Skeleton className='h-20 rounded-xl' />
          </div>
        </div>
      </div>
    )
  }

  const discount = summary?.first_topup_discount ?? 0.9
  const discountPercent = getDiscountPercentOff(discount)
  const zhZhe = getZhDiscountZhe(discount)
  const hasFirstTopupDiscount = discountPercent > 0
  const commissionRate = summary?.commission_rate ?? 0.05
  const commissionRateText = formatCommissionRatePercent(commissionRate)
  const cooldownDays = summary?.cooldown_days ?? 7
  const commissionEnabled = summary?.commission_enabled !== false
  const complianceConfirmed = summary?.compliance_confirmed !== false
  const isCopied = Boolean(referralLink) && copiedText === referralLink

  return (
    <div className='rounded-2xl border border-white/[0.08] bg-[#0a0a0c]/95 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_12px_32px_-16px_rgba(0,0,0,0.72)] backdrop-blur-xl sm:p-6'>
      <div className='flex flex-col gap-5'>
        {/* Top Row: Heading + Code Pill */}
        <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div className='flex items-start gap-3'>
            <div className='flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-white'>
              <Gift className='size-5' />
            </div>
            <div className='min-w-0 space-y-1'>
              <div className='flex flex-wrap items-center gap-2'>
                <h2 className='text-foreground text-base font-semibold tracking-tight sm:text-lg'>
                  {t('Invite Friends & Earn Commission')}
                </h2>
                {hasFirstTopupDiscount && (
                  <span className='inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400 tabular-nums'>
                    <Sparkles className='size-3' />
                    {isZh
                      ? t('First Top-Up {{zhe}}折', {
                          zhe: zhZhe,
                          defaultValue: `受邀首充 ${zhZhe} 折`,
                        })
                      : t('{{percent}}% Off First Top-Up', {
                          percent: discountPercent,
                        })}
                  </span>
                )}
              </div>
              <p className='text-muted-foreground text-xs leading-relaxed sm:text-sm'>
                {t(
                  'Share your unique referral link. Invited friends get an exclusive first top-up discount, and your commissions automatically credit to your wallet balance.'
                )}
              </p>
            </div>
          </div>

          {summary?.aff_code && (
            <div className='flex shrink-0 items-center gap-2 self-start rounded-xl border border-white/[0.08] bg-[#050506]/90 px-3 py-1.5'>
              <span className='text-muted-foreground text-[11px] tracking-wider uppercase'>
                {t('Invite Code')}
              </span>
              <code className='text-foreground font-mono text-sm font-semibold tracking-wide'>
                {summary.aff_code}
              </code>
            </div>
          )}
        </div>

        {/* Referral Link Input + High-Contrast #FAFAFA CTA */}
        <div className='flex flex-col gap-2.5 sm:flex-row sm:items-center'>
          <Input
            value={referralLink}
            readOnly
            aria-label={t('Your Referral Link')}
            className='h-10 min-w-0 flex-1 rounded-lg border-white/[0.08] bg-[#050506]/90 font-mono text-xs text-zinc-200 sm:text-sm'
          />
          <Button
            type='button'
            onClick={() => referralLink && copyToClipboard(referralLink)}
            disabled={!referralLink}
            className='h-10 shrink-0 rounded-lg bg-[#FAFAFA] px-4 text-sm font-medium text-[#09090B] hover:bg-[#FAFAFA]/90'
          >
            {isCopied ? (
              <Check className='size-4 text-emerald-600' />
            ) : (
              <Copy className='size-4' />
            )}
            {isCopied ? t('Copied') : t('Copy Referral Link')}
          </Button>
        </div>

        {!complianceConfirmed && (
          <Alert className='border-amber-500/25 bg-amber-500/[0.06] text-amber-200'>
            <AlertDescription className='text-xs'>
              {t(
                'Referral rewards and first top-up discounts are paused until payment compliance terms are confirmed by the administrator.'
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Dynamic Rule Highlights */}
        <div className='grid gap-3 md:grid-cols-3'>
          <div className='rounded-xl border border-white/[0.08] bg-[#050506]/80 p-3.5'>
            <div className='flex items-center gap-2'>
              <span className='flex size-7 items-center justify-center rounded-lg border border-emerald-500/25 bg-emerald-500/10 text-emerald-400'>
                <Sparkles className='size-3.5' />
              </span>
              <span className='text-foreground text-xs font-semibold'>
                {t('Friend First Top-Up')}
              </span>
            </div>
            <p className='text-muted-foreground mt-2 text-xs leading-relaxed tabular-nums'>
              {hasFirstTopupDiscount
                ? isZh
                  ? t(
                      'Friends registering via your link get {{zhe}}折 ({{percent}}% off) on their first top-up.',
                      {
                        zhe: zhZhe,
                        percent: discountPercent,
                        defaultValue: `受邀好友注册后，首次钱包充值专享 ${zhZhe} 折优惠（立减 ${discountPercent}%）。`,
                      }
                    )
                  : t(
                      'Friends registering via your link get {{percent}}% off their first wallet top-up.',
                      { percent: discountPercent }
                    )
                : t('First top-up invite discount is currently disabled.')}
            </p>
          </div>

          <div className='rounded-xl border border-white/[0.08] bg-[#050506]/80 p-3.5'>
            <div className='flex items-center gap-2'>
              <span className='flex size-7 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-zinc-200'>
                <Percent className='size-3.5' />
              </span>
              <span className='text-foreground text-xs font-semibold'>
                {t('Top-Up Commission')}
              </span>
            </div>
            <p className='text-muted-foreground mt-2 text-xs leading-relaxed tabular-nums'>
              {commissionEnabled && commissionRate > 0
                ? t(
                    'Earn {{rate}} commission on every completed paid top-up made by your invited friends.',
                    { rate: commissionRateText }
                  )
                : t('Referral top-up commission is currently paused.')}
            </p>
          </div>

          <div className='rounded-xl border border-white/[0.08] bg-[#050506]/80 p-3.5'>
            <div className='flex items-center gap-2'>
              <IconBadge tone='warning' size='sm'>
                {cooldownDays > 0 ? <Clock /> : <Wallet />}
              </IconBadge>
              <span className='text-foreground text-xs font-semibold'>
                {t('Automatic Settlement')}
              </span>
            </div>
            <p className='text-muted-foreground mt-2 text-xs leading-relaxed tabular-nums'>
              {cooldownDays > 0
                ? t(
                    'Commissions are automatically credited to your wallet balance after a {{days}}-day cooldown.',
                    { days: cooldownDays }
                  )
                : t(
                    'Commissions are automatically credited to your wallet balance once settled.'
                  )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
