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
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createInstance } from 'i18next'
import type { ReactNode } from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Referrals } from '@/features/referrals'
import en from '@/i18n/locales/en.json'
import zh from '@/i18n/locales/zh.json'
import { api } from '@/lib/api'

vi.mock('@/components/layout', () => {
  const SectionPageLayout = ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  )
  SectionPageLayout.Title = ({ children }: { children: ReactNode }) => (
    <h1>{children}</h1>
  )
  SectionPageLayout.Content = ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  )
  return { SectionPageLayout }
})

const i18n = createInstance()

beforeEach(async () => {
  vi.restoreAllMocks()
  await i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: false,
    nsSeparator: false,
    resources: { en, zh },
    interpolation: { escapeValue: false },
  })
})

describe('Referrals page', () => {
  it('renders referral link, dynamic rules, 4 KPI cards, and hides legacy banner when legacy_aff_quota is 0', async () => {
    const getSpy = vi
      .spyOn(api, 'get')
      .mockImplementation(async (url: string) => {
        if (url === '/api/user/referral/summary') {
          return {
            data: {
              success: true,
              message: '',
              data: {
                aff_code: 'Ab12',
                commission_enabled: true,
                commission_rate: 0.05,
                cooldown_days: 7,
                first_topup_discount: 0.9,
                invited_count: 12,
                qualified_invitee_count: 5,
                pending_quota: 2500000,
                settled_quota: 12500000,
                total_commission_quota: 15000000,
                legacy_aff_quota: 0,
                legacy_aff_history_quota: 12500000,
                compliance_confirmed: true,
              },
            },
          }
        }
        if (url.startsWith('/api/user/referral/commissions')) {
          const isPendingFilter = url.includes('status=pending')
          return {
            data: {
              success: true,
              message: '',
              data: {
                page: 1,
                page_size: 20,
                total: isPendingFilter ? 1 : 2,
                items: isPendingFilter
                  ? [
                      {
                        id: 101,
                        invitee_masked: 'al***e',
                        trade_no: 'WAFFO_PANCAKE-101',
                        payment_provider: 'waffo_pancake',
                        topup_amount: 100,
                        paid_usd: 90.0,
                        commission_rate: 0.05,
                        commission_quota: 2250000,
                        status: 'pending',
                        cancel_reason: '',
                        created_at: 1764100000,
                        settle_at: 1764704800,
                        settled_at: 0,
                      },
                    ]
                  : [
                      {
                        id: 101,
                        invitee_masked: 'al***e',
                        trade_no: 'WAFFO_PANCAKE-101',
                        payment_provider: 'waffo_pancake',
                        topup_amount: 100,
                        paid_usd: 90.0,
                        commission_rate: 0.05,
                        commission_quota: 2250000,
                        status: 'pending',
                        cancel_reason: '',
                        created_at: 1764100000,
                        settle_at: 1764704800,
                        settled_at: 0,
                      },
                      {
                        id: 102,
                        invitee_masked: 'bo***b',
                        trade_no: 'EPAY-102',
                        payment_provider: 'epay',
                        topup_amount: 200,
                        paid_usd: 200.0,
                        commission_rate: 0.05,
                        commission_quota: 5000000,
                        status: 'settled',
                        cancel_reason: '',
                        created_at: 1763000000,
                        settle_at: 1763604800,
                        settled_at: 1763605000,
                      },
                    ],
              },
            },
          }
        }
        return { data: { success: true, data: null } }
      })

    render(
      <I18nextProvider i18n={i18n}>
        <Referrals />
      </I18nextProvider>
    )

    // Referral link and invite code
    const linkInput = await screen.findByLabelText('Your Referral Link')
    expect(linkInput).toHaveValue(`${window.location.origin}/sign-up?aff=Ab12`)
    expect(screen.getByText('Ab12')).toBeVisible()

    // Dynamic rule highlights
    expect(screen.getByText('10% Off First Top-Up')).toBeVisible()
    expect(
      screen.getByText(
        /Earn 5% commission on every completed paid top-up made by your invited friends\./
      )
    ).toBeVisible()
    expect(
      screen.getByText(
        /Commissions are automatically credited to your wallet balance after a 7-day cooldown\./
      )
    ).toBeVisible()

    // 4 KPI cards
    expect(screen.getByText('Invited Friends')).toBeVisible()
    expect(screen.getByText('12')).toBeVisible()
    expect(screen.getByText('5 topped up')).toBeVisible()
    expect(screen.getByText('Total Commission')).toBeVisible()
    expect(screen.getByText('Pending (Cooldown)')).toBeVisible()
    expect(screen.getByText('Credited to Balance')).toBeVisible()

    // Legacy transfer banner hidden when legacy_aff_quota == 0
    expect(
      screen.queryByTestId('legacy-aff-transfer-notice')
    ).not.toBeInTheDocument()

    // Commission table rows (masked invitees, trade numbers, amounts)
    expect(await screen.findByText('al***e')).toBeVisible()
    expect(screen.getByText('bo***b')).toBeVisible()
    expect(screen.getByText('WAFFO_PANCAKE-101')).toBeVisible()
    expect(screen.getByText('$90.00')).toBeVisible()

    // Status filter triggers new query with status=pending
    const cooldownTab = screen.getByRole('tab', { name: 'Cooldown' })
    await act(async () => {
      fireEvent.click(cooldownTab)
    })

    await waitFor(() => {
      expect(getSpy).toHaveBeenCalledWith(
        '/api/user/referral/commissions?p=1&page_size=20&status=pending'
      )
    })
    await waitFor(() => {
      expect(screen.queryByText('bo***b')).not.toBeInTheDocument()
    })

    // Bilingual switch to zh
    await act(() => i18n.changeLanguage('zh'))
    expect(screen.getByText('受邀首充 9 折')).toBeVisible()
    expect(screen.getByText('复制推广链接')).toBeVisible()
    expect(screen.getByText('已邀请好友')).toBeVisible()
  })

  it('shows legacy manual transfer banner only when legacy_aff_quota > 0', async () => {
    vi.spyOn(api, 'get').mockImplementation(async (url: string) => {
      if (url === '/api/user/referral/summary') {
        return {
          data: {
            success: true,
            message: '',
            data: {
              aff_code: 'OLD9',
              commission_enabled: true,
              commission_rate: 0.05,
              cooldown_days: 7,
              first_topup_discount: 0.9,
              invited_count: 3,
              qualified_invitee_count: 1,
              pending_quota: 0,
              settled_quota: 0,
              total_commission_quota: 0,
              legacy_aff_quota: 1000000,
              legacy_aff_history_quota: 1000000,
              compliance_confirmed: true,
            },
          },
        }
      }
      if (url.startsWith('/api/user/referral/commissions')) {
        return {
          data: {
            success: true,
            message: '',
            data: {
              page: 1,
              page_size: 20,
              total: 0,
              items: [],
            },
          },
        }
      }
      return { data: { success: true, data: null } }
    })

    render(
      <I18nextProvider i18n={i18n}>
        <Referrals />
      </I18nextProvider>
    )

    const banner = await screen.findByTestId('legacy-aff-transfer-notice')
    expect(banner).toBeVisible()
    expect(banner).toHaveTextContent('Legacy Affiliate Balance Available')
    expect(
      screen.getByRole('button', { name: 'Transfer to Balance' })
    ).toBeEnabled()
  })
})
