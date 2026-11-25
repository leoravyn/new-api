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
import { api } from '@/lib/api'

import type {
  ReferralApiResponse,
  ReferralCommissionFilter,
  ReferralCommissionsPage,
  ReferralSummary,
} from './types'

export async function getReferralSummary(): Promise<
  ReferralApiResponse<ReferralSummary>
> {
  const res = await api.get('/api/user/referral/summary')
  return res.data
}

export interface GetReferralCommissionsParams {
  page: number
  pageSize: number
  status?: ReferralCommissionFilter
}

export async function getReferralCommissions({
  page,
  pageSize,
  status,
}: GetReferralCommissionsParams): Promise<
  ReferralApiResponse<ReferralCommissionsPage>
> {
  const params = new URLSearchParams({
    p: String(page),
    page_size: String(pageSize),
  })
  if (status && status !== 'all') {
    params.set('status', status)
  }
  const res = await api.get(`/api/user/referral/commissions?${params.toString()}`)
  return res.data
}
