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
import { ArrowRightLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { formatQuota } from '@/lib/format'

interface LegacyAffTransferBannerProps {
  legacyAffQuota: number
  complianceConfirmed?: boolean
  onTransfer: () => void
}

export function LegacyAffTransferBanner({
  legacyAffQuota,
  complianceConfirmed = true,
  onTransfer,
}: LegacyAffTransferBannerProps) {
  const { t } = useTranslation()

  if (legacyAffQuota <= 0) {
    return null
  }

  return (
    <div
      data-testid='legacy-aff-transfer-notice'
      className='flex flex-col gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5'
    >
      <div className='min-w-0 space-y-0.5'>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='text-sm font-semibold text-amber-200'>
            {t('Legacy Affiliate Balance Available')}
          </span>
          <span className='rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-amber-300 tabular-nums'>
            {formatQuota(legacyAffQuota)}
          </span>
        </div>
        <p className='text-muted-foreground text-xs'>
          {t(
            'New top-up commissions are automatically credited to your balance. You can still manually transfer your remaining legacy affiliate rewards below.'
          )}
        </p>
      </div>
      <Button
        type='button'
        size='sm'
        onClick={onTransfer}
        disabled={!complianceConfirmed}
        className='h-9 shrink-0 bg-[#FAFAFA] px-3.5 text-xs font-medium text-[#09090B] hover:bg-[#FAFAFA]/90'
      >
        <ArrowRightLeft className='size-3.5' />
        {t('Transfer to Balance')}
      </Button>
    </div>
  )
}
