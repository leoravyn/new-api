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
import { CheckCircle2, Clock, Coins, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { IconBadge, type IconBadgeTone } from '@/components/ui/icon-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatQuota } from '@/lib/format'

import { formatCommissionRatePercent } from '../lib'
import type { ReferralSummary } from '../types'

interface ReferralKpiCardsProps {
  summary: ReferralSummary | null
  loading?: boolean
}

export function ReferralKpiCards({ summary, loading }: ReferralKpiCardsProps) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
        {['invited', 'total', 'pending', 'settled'].map((key) => (
          <div
            key={key}
            className='rounded-2xl border border-white/[0.08] bg-[#0a0a0c]/95 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_12px_32px_-16px_rgba(0,0,0,0.72)]'
          >
            <Skeleton className='h-3.5 w-24' />
            <Skeleton className='mt-3 h-7 w-28' />
            <Skeleton className='mt-2 h-3.5 w-32' />
          </div>
        ))}
      </div>
    )
  }

  const cooldownDays = summary?.cooldown_days ?? 7
  const rateText = formatCommissionRatePercent(summary?.commission_rate ?? 0.05)

  const cards: {
    key: string
    label: string
    value: string
    subtext: string
    icon: typeof Users
    tone: IconBadgeTone
    valueClassName?: string
  }[] = [
    {
      key: 'invited',
      label: t('Invited Friends'),
      value: (summary?.invited_count ?? 0).toLocaleString(),
      subtext: t('{{count}} topped up', {
        count: summary?.qualified_invitee_count ?? 0,
      }),
      icon: Users,
      tone: 'info',
    },
    {
      key: 'total',
      label: t('Total Commission'),
      value: formatQuota(summary?.total_commission_quota ?? 0),
      subtext: t('{{rate}} commission rate', { rate: rateText }),
      icon: Coins,
      tone: 'chart-3',
    },
    {
      key: 'pending',
      label: t('Pending (Cooldown)'),
      value: formatQuota(summary?.pending_quota ?? 0),
      subtext:
        cooldownDays > 0
          ? t('{{days}}-day cooldown', { days: cooldownDays })
          : t('Awaiting auto-settlement'),
      icon: Clock,
      tone: 'warning',
      valueClassName:
        (summary?.pending_quota ?? 0) > 0 ? 'text-amber-400' : undefined,
    },
    {
      key: 'settled',
      label: t('Credited to Balance'),
      value: formatQuota(summary?.settled_quota ?? 0),
      subtext: t('Auto-credited to wallet'),
      icon: CheckCircle2,
      tone: 'success',
      valueClassName:
        (summary?.settled_quota ?? 0) > 0 ? 'text-emerald-400' : undefined,
    },
  ]

  return (
    <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
      {cards.map((item) => (
        <div
          key={item.key}
          className='min-w-0 rounded-2xl border border-white/[0.08] bg-[#0a0a0c]/95 px-3.5 py-3.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_12px_32px_-16px_rgba(0,0,0,0.72)] backdrop-blur-xl transition-[border-color] duration-200 hover:border-white/[0.14] sm:px-5 sm:py-4'
        >
          <div className='flex items-center gap-2'>
            <IconBadge tone={item.tone} size='stat'>
              <item.icon />
            </IconBadge>
            <div className='text-muted-foreground truncate text-[11px] font-medium tracking-wider uppercase sm:text-xs'>
              {item.label}
            </div>
          </div>
          <div
            className={`mt-2 font-mono text-lg font-bold tracking-tight break-all tabular-nums sm:mt-3 sm:text-2xl ${item.valueClassName ?? 'text-foreground'}`}
          >
            {item.value}
          </div>
          <div className='text-muted-foreground/80 mt-1 truncate text-xs tabular-nums'>
            {item.subtext}
          </div>
        </div>
      ))}
    </div>
  )
}
