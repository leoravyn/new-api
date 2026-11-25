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
import { useCallback, useEffect, useRef, useState } from 'react'

import { handleServerError } from '@/lib/handle-server-error'
import { requireServerSuccess } from '@/lib/server-error-message'

import { getReferralCommissions } from '../api'
import type {
  ReferralCommissionFilter,
  ReferralCommissionItem,
} from '../types'

export function useReferralCommissions(initialPageSize = 20) {
  const [items, setItems] = useState<ReferralCommissionItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [status, setStatus] = useState<ReferralCommissionFilter>('all')
  const [loading, setLoading] = useState(true)
  const requestIdRef = useRef(0)

  const fetchCommissions = useCallback(
    async (
      targetPage: number,
      targetPageSize: number,
      targetStatus: ReferralCommissionFilter
    ) => {
      const requestId = ++requestIdRef.current
      try {
        setLoading(true)
        const response = requireServerSuccess(
          await getReferralCommissions({
            page: targetPage,
            pageSize: targetPageSize,
            status: targetStatus,
          })
        )
        if (requestId !== requestIdRef.current) {
          return
        }
        if (response.success && response.data) {
          setItems(
            Array.isArray(response.data.items) ? response.data.items : []
          )
          setTotal(Number(response.data.total) || 0)
        }
      } catch (error) {
        if (requestId === requestIdRef.current) {
          handleServerError(error)
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false)
        }
      }
    },
    []
  )

  useEffect(() => {
    void fetchCommissions(page, pageSize, status)
  }, [fetchCommissions, page, pageSize, status])

  const handleStatusChange = useCallback(
    (nextStatus: ReferralCommissionFilter) => {
      setStatus(nextStatus)
      setPage(1)
    },
    []
  )

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage)
  }, [])

  const handlePageSizeChange = useCallback((nextPageSize: number) => {
    setPageSize(nextPageSize)
    setPage(1)
  }, [])

  const refetch = useCallback(() => {
    return fetchCommissions(page, pageSize, status)
  }, [fetchCommissions, page, pageSize, status])

  return {
    items,
    total,
    page,
    pageSize,
    status,
    loading,
    handleStatusChange,
    handlePageChange,
    handlePageSizeChange,
    refetch,
  }
}
