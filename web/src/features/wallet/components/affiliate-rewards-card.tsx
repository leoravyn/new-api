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
import { useRouter } from '@tanstack/react-router'
import { ArrowRight, Gift } from 'lucide-react'
import type { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { IconBadge } from '@/components/ui/icon-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatQuota } from '@/lib/format'
import { cn } from '@/lib/utils'

import type { UserWalletData } from '../types'

interface AffiliateRewardsCardProps {
  user: UserWalletData | null
  affiliateLink?: string
  onTransfer: () => void
  complianceConfirmed?: boolean
  loading?: boolean
}

export function AffiliateRewardsCard({
  user,
  onTransfer,
  complianceConfirmed = true,
  loading,
}: AffiliateRewardsCardProps) {
  const { t } = useTranslation()
  const router = useRouter({ warn: false })

  if (loading) {
    return (
      <Card data-card-hover='false' className='py-0'>
        <CardContent className='flex items-center justify-between gap-4 p-3.5 sm:p-4'>
          <div className='space-y-1.5'>
            <Skeleton className='h-4 w-36' />
            <Skeleton className='h-3.5 w-64 max-w-full' />
          </div>
          <Skeleton className='h-9 w-28 rounded-lg' />
        </CardContent>
      </Card>
    )
  }

  const hasLegacyRewards = (user?.aff_quota ?? 0) > 0

  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      !router ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return
    }
    event.preventDefault()
    void router.navigate({ to: '/referrals' })
  }

  return (
    <Card data-card-hover='false' className='py-0'>
      <CardContent className='flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center sm:justify-between sm:p-4'>
        <div className='flex min-w-0 items-center gap-3'>
          <IconBadge tone='chart-3'>
            <Gift />
          </IconBadge>
          <div className='min-w-0'>
            <div className='flex flex-wrap items-center gap-2'>
              <h3 className='truncate text-sm font-semibold'>
                {t('Referral Program')}
              </h3>
              {hasLegacyRewards && (
                <span className='rounded-md border border-amber-500/25 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[11px] font-medium text-amber-300 tabular-nums'>
                  {t('Legacy balance: {{amount}}', {
                    amount: formatQuota(user?.aff_quota ?? 0),
                  })}
                </span>
              )}
            </div>
            <p className='text-muted-foreground truncate text-xs'>
              {t(
                'Invite friends for a first top-up discount and earn commissions auto-credited to your balance.'
              )}
            </p>
          </div>
        </div>

        <div className='flex shrink-0 items-center gap-2'>
          {hasLegacyRewards && (
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={onTransfer}
              disabled={!complianceConfirmed}
              className='h-9 border-white/[0.1] bg-white/[0.03] px-3 hover:bg-white/[0.08]'
            >
              {t('Transfer to Balance')}
            </Button>
          )}
          <a
            href='/referrals'
            onClick={handleNavigate}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'h-9 border-white/[0.12] bg-white/[0.04] px-3.5 text-zinc-100 hover:border-white/[0.2] hover:bg-white/[0.08]'
            )}
          >
            {t('View Referrals')}
            <ArrowRight className='size-3.5' />
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
