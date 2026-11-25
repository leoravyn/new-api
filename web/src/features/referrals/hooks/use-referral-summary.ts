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
import i18next from 'i18next'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { transferAffiliateQuota } from '@/features/wallet/api'
import { generateAffiliateLink } from '@/features/wallet/lib/affiliate'
import { getSelf } from '@/lib/api'
import { handleServerError } from '@/lib/handle-server-error'
import {
  getServerMessage,
  requireServerSuccess,
} from '@/lib/server-error-message'

import { getReferralSummary } from '../api'
import type { ReferralSummary } from '../types'

export function useReferralSummary() {
  const [summary, setSummary] = useState<ReferralSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [transferring, setTransferring] = useState(false)

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true)
      const response = requireServerSuccess(await getReferralSummary())
      if (response.success && response.data) {
        setSummary(response.data)
      }
    } catch (error) {
      handleServerError(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchSummary()
  }, [fetchSummary])

  const transferLegacyQuota = useCallback(
    async (quota: number): Promise<boolean> => {
      try {
        setTransferring(true)
        const response = await transferAffiliateQuota({ quota })
        if (response.success) {
          toast.success(
            getServerMessage(response) || i18next.t('Transfer successful')
          )
          await Promise.all([getSelf(), fetchSummary()])
          return true
        }
        handleServerError(response, i18next.t('Transfer failed'))
        return false
      } catch (error) {
        handleServerError(error, i18next.t('Transfer failed'))
        return false
      } finally {
        setTransferring(false)
      }
    },
    [fetchSummary]
  )

  const referralLink = summary?.aff_code
    ? generateAffiliateLink(summary.aff_code)
    : ''

  return {
    summary,
    referralLink,
    loading,
    transferring,
    transferLegacyQuota,
    refetch: fetchSummary,
  }
}
