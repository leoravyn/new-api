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
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { normalizeInterfaceLanguage } from '@/i18n/languages'
import { cn } from '@/lib/utils'

import type { SystemStatus } from '../types'

interface TermsFooterProps {
  variant?: 'sign-in' | 'sign-up'
  className?: string
  status?: SystemStatus | null
}

const linkClassName =
  'hover:text-primary underline decoration-white/30 underline-offset-4 transition-colors'

export function TermsFooter({
  variant = 'sign-in',
  className,
  status,
}: TermsFooterProps) {
  const { i18n } = useTranslation()
  const requiresExplicitConsent = Boolean(
    status?.user_agreement_enabled || status?.privacy_policy_enabled
  )
  if (requiresExplicitConsent) {
    return null
  }

  const isZh =
    normalizeInterfaceLanguage(i18n.resolvedLanguage || i18n.language) ===
    'zhCN'

  if (isZh) {
    return (
      <p className={cn('text-muted-foreground text-center text-xs', className)}>
        {variant === 'sign-in'
          ? '继续登录即表示您同意我们的'
          : '创建账户即表示您同意我们的'}
        <Link to='/terms' className={linkClassName}>
          《服务条款》
        </Link>
        、
        <Link to='/privacy-policy' className={linkClassName}>
          《隐私政策》
        </Link>
        与
        <Link to='/aup' className={linkClassName}>
          《可接受使用政策》
        </Link>
        。
      </p>
    )
  }

  return (
    <p className={cn('text-muted-foreground text-center text-xs', className)}>
      {variant === 'sign-in'
        ? 'By continuing, you agree to our '
        : 'By creating an account, you agree to our '}
      <Link to='/terms' className={linkClassName}>
        Terms of Service
      </Link>
      ,{' '}
      <Link to='/privacy-policy' className={linkClassName}>
        Privacy Policy
      </Link>
      , and{' '}
      <Link to='/aup' className={linkClassName}>
        Acceptable Use Policy
      </Link>
      .
    </p>
  )
}
