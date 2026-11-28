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
import { useQuery } from '@tanstack/react-query'
import { Gauge, HeartPulse, Timer } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { IconBadge } from '@/components/ui/icon-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getPerfMetricsSummary } from '@/features/performance-metrics/api'
import {
  formatLatency,
  formatThroughput,
  formatUptimePct,
  getSuccessRateDotClass,
  getSuccessRateTextClass,
} from '@/features/performance-metrics/lib/format'
import { requireServerSuccess } from '@/lib/server-error-message'
import { cn } from '@/lib/utils'

const PERFORMANCE_WINDOW_HOURS = 24

export function PerformanceHealthPanel() {
  const { t } = useTranslation()
  const metricsQuery = useQuery({
    queryKey: ['perf-metrics-summary', PERFORMANCE_WINDOW_HOURS],
    queryFn: async () =>
      requireServerSuccess(
        await getPerfMetricsSummary(PERFORMANCE_WINDOW_HOURS)
      ),
    staleTime: 60 * 1000,
    retry: false,
  })

  const summary = metricsQuery.data?.data.summary
  const loading = metricsQuery.isLoading
  const successRate = summary?.success_rate ?? Number.NaN

  return (
    <section className='tokex-console-panel flex h-full flex-col'>
      <div className='border-border/60 flex items-center justify-between gap-2 border-b px-4 py-3 sm:px-5 dark:border-white/[0.06]'>
        <div className='flex min-w-0 items-center gap-2'>
          <IconBadge tone='success' size='sm'>
            <HeartPulse />
          </IconBadge>
          <h3 className='truncate text-sm font-semibold'>
            {t('Performance health')}
          </h3>
        </div>
        <span className='text-muted-foreground shrink-0 text-xs'>
          {t('Performance metrics for the last 24 hours')}
        </span>
      </div>

      <div className='tokex-content-enter grid flex-1 grid-cols-3 items-center divide-x divide-border/50 px-1 py-3.5 sm:px-2 sm:py-4 dark:divide-white/[0.06]'>
        <TelemetryMetric
          icon={HeartPulse}
          label={t('Success rate')}
          value={formatUptimePct(successRate)}
          loading={loading}
          valueClassName={getSuccessRateTextClass(successRate)}
          dotClassName={
            Number.isFinite(successRate)
              ? getSuccessRateDotClass(successRate)
              : undefined
          }
        />
        <TelemetryMetric
          icon={Timer}
          label={t('Average latency')}
          value={formatLatency(summary?.avg_latency_ms ?? 0)}
          loading={loading}
        />
        <TelemetryMetric
          icon={Gauge}
          label={t('Throughput')}
          value={formatThroughput(summary?.avg_tps ?? 0)}
          loading={loading}
        />
      </div>
    </section>
  )
}

function TelemetryMetric(props: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  loading: boolean
  valueClassName?: string
  dotClassName?: string
}) {
  const Icon = props.icon

  return (
    <div className='flex min-w-0 flex-col gap-1.5 px-3 sm:px-4'>
      <div className='text-muted-foreground flex items-center gap-1.5 text-[11px] font-medium'>
        <Icon className='size-3.5 shrink-0 opacity-75' aria-hidden='true' />
        <span className='truncate'>{props.label}</span>
      </div>
      {props.loading ? (
        <Skeleton className='h-6 w-16' />
      ) : (
        <div className='flex items-center gap-1.5'>
          {props.dotClassName && (
            <span
              className={cn('size-1.5 shrink-0 rounded-full', props.dotClassName)}
              aria-hidden='true'
            />
          )}
          <span
            className={cn(
              'truncate font-mono text-base font-semibold tracking-tight tabular-nums sm:text-lg',
              props.valueClassName
            )}
          >
            {props.value}
          </span>
        </div>
      )}
    </div>
  )
}
