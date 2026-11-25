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
  ChevronLeft,
  ChevronRight,
  Copy,
  History,
  Inbox,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TitledCard } from '@/components/ui/titled-card'
import { formatUsdAmount } from '@/features/wallet/lib/format'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { formatQuota, formatTimestampToDate } from '@/lib/format'
import { cn } from '@/lib/utils'

import {
  formatCancelReason,
  formatCommissionRatePercent,
  formatPaymentProviderLabel,
} from '../lib'
import type {
  ReferralCommissionFilter,
  ReferralCommissionItem,
  ReferralCommissionStatus,
} from '../types'

interface ReferralCommissionsTableProps {
  items: ReferralCommissionItem[]
  total: number
  page: number
  pageSize: number
  status: ReferralCommissionFilter
  loading?: boolean
  onStatusChange: (status: ReferralCommissionFilter) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

function CommissionStatusPill({
  status,
  cancelReason,
}: {
  status: ReferralCommissionStatus
  cancelReason: string
}) {
  const { t } = useTranslation()

  if (status === 'settled') {
    return (
      <span className='inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400'>
        <span className='size-1.5 rounded-full bg-emerald-400' />
        {t('Credited')}
      </span>
    )
  }

  if (status === 'pending') {
    return (
      <span className='inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400'>
        <span className='size-1.5 rounded-full bg-amber-400' />
        {t('Cooldown')}
      </span>
    )
  }

  return (
    <div className='flex flex-col items-start gap-0.5'>
      <span className='inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] px-2 py-0.5 text-xs font-medium text-zinc-400'>
        <span className='size-1.5 rounded-full bg-zinc-500' />
        {t('Cancelled')}
      </span>
      {cancelReason ? (
        <span
          data-table-text='secondary'
          className='text-muted-foreground max-w-[180px] truncate text-[11px]'
          title={formatCancelReason(cancelReason, t)}
        >
          {formatCancelReason(cancelReason, t)}
        </span>
      ) : null}
    </div>
  )
}

export function ReferralCommissionsTable({
  items,
  total,
  page,
  pageSize,
  status,
  loading,
  onStatusChange,
  onPageChange,
  onPageSizeChange,
}: ReferralCommissionsTableProps) {
  const { t } = useTranslation()
  const { copyToClipboard, copiedText } = useCopyToClipboard({ notify: false })

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <TitledCard
      title={t('Commission History')}
      description={t(
        'Track invited friends top-ups, cooldown countdowns, and automatic balance credits'
      )}
      icon={<History className='h-4 w-4' />}
      iconTone='info'
      disableHoverEffect
      action={
        <Tabs
          value={status}
          onValueChange={(value) =>
            onStatusChange(value as ReferralCommissionFilter)
          }
        >
          <TabsList className='w-full sm:w-auto'>
            <TabsTrigger value='all'>{t('All')}</TabsTrigger>
            <TabsTrigger value='pending'>{t('Cooldown')}</TabsTrigger>
            <TabsTrigger value='settled'>{t('Credited')}</TabsTrigger>
            <TabsTrigger value='cancelled'>{t('Cancelled')}</TabsTrigger>
          </TabsList>
        </Tabs>
      }
      contentClassName='space-y-4'
    >
      {loading ? (
        <div className='space-y-2.5'>
          {['r1', 'r2', 'r3', 'r4'].map((key) => (
            <Skeleton key={key} className='h-12 w-full rounded-xl' />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className='flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-[#050506]/60 px-4 py-10 text-center'>
          <div className='flex size-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-400'>
            <Inbox className='size-5' />
          </div>
          <p className='text-foreground mt-3 text-sm font-medium'>
            {t('No commission records yet')}
          </p>
          <p className='text-muted-foreground mt-1 max-w-sm text-xs'>
            {status === 'all'
              ? t(
                  'Share your referral link to start earning commissions whenever invited friends top up.'
                )
              : t('No commission records match the selected status filter.')}
          </p>
        </div>
      ) : (
        <div className='overflow-hidden rounded-xl border border-white/[0.08] bg-[#050506]/60'>
          <Table>
            <TableHeader>
              <TableRow className='border-white/[0.08] hover:bg-transparent'>
                <TableHead>{t('Invitee')}</TableHead>
                <TableHead>{t('Order / Provider')}</TableHead>
                <TableHead className='text-right'>{t('Paid (USD)')}</TableHead>
                <TableHead className='text-right'>{t('Commission')}</TableHead>
                <TableHead>{t('Status')}</TableHead>
                <TableHead className='text-right'>
                  {t('Settlement Schedule')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <span className='font-mono text-zinc-200'>
                      {item.invitee_masked}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-col gap-0.5'>
                      <span className='text-foreground text-xs font-medium'>
                        {formatPaymentProviderLabel(item.payment_provider, t)}
                      </span>
                      <div className='flex items-center gap-1'>
                        <code
                          data-table-text='secondary'
                          className='text-muted-foreground max-w-[180px] truncate font-mono text-xs'
                          title={item.trade_no}
                        >
                          {item.trade_no}
                        </code>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon-xs'
                          className='h-5 w-5 text-zinc-400 hover:text-white'
                          onClick={() => copyToClipboard(item.trade_no)}
                          aria-label={t('Copy order number')}
                        >
                          {copiedText === item.trade_no ? (
                            <Check className='size-3 text-emerald-400' />
                          ) : (
                            <Copy className='size-3' />
                          )}
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='text-right font-mono tabular-nums'>
                    <div className='flex flex-col items-end gap-0.5'>
                      <span className='text-foreground'>
                        {formatUsdAmount(item.paid_usd)}
                      </span>
                      {item.topup_amount > 0 &&
                        Math.abs(item.topup_amount - item.paid_usd) > 0.005 && (
                          <span
                            data-table-text='secondary'
                            className='text-muted-foreground text-[11px]'
                          >
                            {t('Face {{amount}}', {
                              amount: formatUsdAmount(item.topup_amount, {
                                trimWholeCents: true,
                              }),
                            })}
                          </span>
                        )}
                    </div>
                  </TableCell>
                  <TableCell className='text-right font-mono tabular-nums'>
                    <div className='flex flex-col items-end gap-0.5'>
                      <span
                        className={cn(
                          'font-semibold',
                          item.status === 'settled' && 'text-emerald-400',
                          item.status === 'pending' && 'text-amber-400',
                          item.status === 'cancelled' &&
                            'text-zinc-500 line-through'
                        )}
                      >
                        +{formatQuota(item.commission_quota)}
                      </span>
                      <span
                        data-table-text='secondary'
                        className='text-muted-foreground text-[11px]'
                      >
                        {formatCommissionRatePercent(item.commission_rate)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <CommissionStatusPill
                      status={item.status}
                      cancelReason={item.cancel_reason}
                    />
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex flex-col items-end gap-0.5 tabular-nums'>
                      {item.status === 'pending' && (
                        <span className='text-xs text-amber-300/90'>
                          {t('Est. {{time}}', {
                            time: formatTimestampToDate(item.settle_at),
                          })}
                        </span>
                      )}
                      {item.status === 'settled' && (
                        <span className='text-xs text-emerald-400/90'>
                          {t('Credited {{time}}', {
                            time: formatTimestampToDate(
                              item.settled_at || item.settle_at
                            ),
                          })}
                        </span>
                      )}
                      {item.status === 'cancelled' && (
                        <span className='text-muted-foreground text-xs'>
                          {formatTimestampToDate(
                            item.settled_at || item.created_at
                          )}
                        </span>
                      )}
                      <span
                        data-table-text='secondary'
                        className='text-muted-foreground text-[11px]'
                      >
                        {t('Created {{time}}', {
                          time: formatTimestampToDate(item.created_at),
                        })}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination Footer */}
      {total > 0 && (
        <div className='flex flex-col gap-3 border-t border-white/[0.08] pt-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='text-muted-foreground text-xs tabular-nums'>
            {t('Showing {{from}}-{{to}} of {{total}} records', {
              from: (page - 1) * pageSize + 1,
              to: Math.min(page * pageSize, total),
              total,
            })}
          </div>
          <div className='flex items-center justify-between gap-2 sm:justify-end'>
            <Select
              items={[
                { value: '10', label: t('10 / page') },
                { value: '20', label: t('20 / page') },
                { value: '50', label: t('50 / page') },
              ]}
              value={String(pageSize)}
              onValueChange={(value) =>
                value !== null && onPageSizeChange(Number.parseInt(value, 10))
              }
            >
              <SelectTrigger className='h-8 w-[104px] text-xs'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectGroup>
                  <SelectItem value='10'>{t('10 / page')}</SelectItem>
                  <SelectItem value='20'>{t('20 / page')}</SelectItem>
                  <SelectItem value='50'>{t('50 / page')}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className='flex items-center gap-1.5'>
              <Button
                type='button'
                variant='outline'
                size='icon-sm'
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page <= 1 || loading}
                aria-label={t('Previous page')}
              >
                <ChevronLeft className='size-4' />
              </Button>
              <span className='text-muted-foreground min-w-[64px] text-center font-mono text-xs tabular-nums'>
                {page} / {totalPages}
              </span>
              <Button
                type='button'
                variant='outline'
                size='icon-sm'
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages || loading}
                aria-label={t('Next page')}
              >
                <ChevronRight className='size-4' />
              </Button>
            </div>
          </div>
        </div>
      )}
    </TitledCard>
  )
}
