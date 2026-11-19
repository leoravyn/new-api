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
import { Globe, ShieldCheck } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'

import { normalizeInterfaceLanguage } from '@/i18n/languages'
import { cn } from '@/lib/utils'

interface WaffoSettlementNoteProps {
  className?: string
}

/**
 * Concise notice explaining that top-ups are settled in USD via Waffo
 * with local-currency FX handled on Waffo's checkout page.
 */
export function WaffoSettlementNote({ className }: WaffoSettlementNoteProps) {
  const { t, i18n } = useTranslation()
  const isZh =
    normalizeInterfaceLanguage(i18n.resolvedLanguage || i18n.language) ===
    'zhCN'

  return (
    <p
      className={cn(
        'text-muted-foreground flex items-start gap-1.5 text-xs leading-relaxed',
        className
      )}
    >
      <Globe className='mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-400/80' />
      <span>
        {t(
          'Orders are settled in USD via Waffo. If you pay in a local currency, Waffo applies exchange rates at checkout.',
          {
            defaultValue: isZh
              ? '订单以美元 (USD) 通过 Waffo 结算；如使用本地货币支付，Waffo 将在结账页自动按汇率换算。'
              : 'Orders are settled in USD via Waffo. If you pay in a local currency, Waffo applies exchange rates at checkout.',
          }
        )}
      </span>
    </p>
  )
}

interface CheckoutPolicyNoticeProps {
  compact?: boolean
  className?: string
}

const policyLinkClassName =
  'text-foreground/90 hover:text-foreground underline underline-offset-4 transition-colors'

/**
 * Checkout compliance notice showing instant digital delivery
 * and links to Terms of Service, Privacy Policy, and AUP.
 */
export function CheckoutPolicyNotice({
  compact = false,
  className,
}: CheckoutPolicyNoticeProps) {
  const { t, i18n } = useTranslation()
  const isZh =
    normalizeInterfaceLanguage(i18n.resolvedLanguage || i18n.language) ===
    'zhCN'

  return (
    <div
      className={cn(
        'rounded-xl border border-white/[0.08] bg-white/[0.025] text-xs leading-relaxed',
        compact ? 'space-y-1.5 p-3' : 'space-y-2 p-3.5',
        className
      )}
    >
      <div className='text-muted-foreground flex items-start gap-2'>
        <ShieldCheck className='mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400/85' />
        <div className='space-y-1'>
          <p>
            {t('Digital API credits are delivered instantly upon payment.', {
              defaultValue: isZh
                ? '数字 API 额度支付后即时到账。'
                : 'Digital API credits are delivered instantly upon payment.',
            })}
          </p>
          <p>
            <Trans
              t={t}
              i18nKey='By proceeding to checkout, you agree to our <terms>Terms of Service</terms>, <privacy>Privacy Policy</privacy>, and <aup>Acceptable Use Policy</aup>.'
              defaults={
                isZh
                  ? '继续支付即表示您同意我们的<terms>服务条款</terms>、<privacy>隐私政策</privacy>和<aup>可接受使用政策</aup>。'
                  : 'By proceeding to checkout, you agree to our <terms>Terms of Service</terms>, <privacy>Privacy Policy</privacy>, and <aup>Acceptable Use Policy</aup>.'
              }
              components={{
                terms: (
                  <a
                    href='/terms'
                    target='_blank'
                    rel='noopener noreferrer'
                    className={policyLinkClassName}
                  />
                ),
                privacy: (
                  <a
                    href='/privacy-policy'
                    target='_blank'
                    rel='noopener noreferrer'
                    className={policyLinkClassName}
                  />
                ),
                aup: (
                  <a
                    href='/aup'
                    target='_blank'
                    rel='noopener noreferrer'
                    className={policyLinkClassName}
                  />
                ),
              }}
            />
          </p>
        </div>
      </div>
    </div>
  )
}
