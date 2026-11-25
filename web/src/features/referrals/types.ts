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

export type ReferralCommissionStatus = 'pending' | 'settled' | 'cancelled'
export type ReferralCommissionFilter = 'all' | ReferralCommissionStatus

export interface ReferralSummary {
  aff_code: string
  commission_enabled: boolean
  commission_rate: number
  cooldown_days: number
  first_topup_discount: number
  invited_count: number
  qualified_invitee_count: number
  pending_quota: number
  settled_quota: number
  total_commission_quota: number
  legacy_aff_quota: number
  legacy_aff_history_quota: number
  compliance_confirmed: boolean
}

export interface ReferralCommissionItem {
  id: number
  invitee_masked: string
  trade_no: string
  payment_provider: string
  topup_amount: number
  paid_usd: number
  commission_rate: number
  commission_quota: number
  status: ReferralCommissionStatus
  cancel_reason: string
  created_at: number
  settle_at: number
  settled_at: number
}

export interface ReferralCommissionsPage {
  page: number
  page_size: number
  total: number
  items: ReferralCommissionItem[]
}

export interface ReferralApiResponse<T = unknown> {
  success?: boolean
  message?: string
  data?: T
}
