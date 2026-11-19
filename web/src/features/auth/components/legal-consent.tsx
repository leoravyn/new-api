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

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { normalizeInterfaceLanguage } from '@/i18n/languages'
import { cn } from '@/lib/utils'

import type { SystemStatus } from '../types'

interface LegalConsentProps {
  status: SystemStatus | null
  checked: boolean
  onCheckedChange: (nextValue: boolean) => void
  className?: string
}

const linkClassName = 'text-primary hover:underline underline-offset-4'

function LegalDocumentLinks({ isZh }: { isZh: boolean }) {
  if (isZh) {
    return (
      <>
        <Link
          to='/terms'
          target='_blank'
          rel='noopener noreferrer'
          className={linkClassName}
        >
          《服务条款》
        </Link>
        、
        <Link
          to='/privacy-policy'
          target='_blank'
          rel='noopener noreferrer'
          className={linkClassName}
        >
          《隐私政策》
        </Link>
        与
        <Link
          to='/aup'
          target='_blank'
          rel='noopener noreferrer'
          className={linkClassName}
        >
          《可接受使用政策》
        </Link>
      </>
    )
  }

  return (
    <>
      <Link
        to='/terms'
        target='_blank'
        rel='noopener noreferrer'
        className={linkClassName}
      >
        Terms of Service
      </Link>
      ,{' '}
      <Link
        to='/privacy-policy'
        target='_blank'
        rel='noopener noreferrer'
        className={linkClassName}
      >
        Privacy Policy
      </Link>
      , and{' '}
      <Link
        to='/aup'
        target='_blank'
        rel='noopener noreferrer'
        className={linkClassName}
      >
        Acceptable Use Policy
      </Link>
    </>
  )
}

export function LegalConsent({
  status,
  checked,
  onCheckedChange,
  className,
}: LegalConsentProps) {
  const { i18n } = useTranslation()
  const isZh =
    normalizeInterfaceLanguage(i18n.resolvedLanguage || i18n.language) ===
    'zhCN'
  const requiresExplicitConsent = Boolean(
    status?.user_agreement_enabled || status?.privacy_policy_enabled
  )

  const handleChange = (value: boolean) => {
    onCheckedChange(value === true)
  }

  if (!requiresExplicitConsent) {
    return (
      <div
        className={cn(
          'border-border/60 bg-muted/40 text-muted-foreground rounded-md border px-3 py-2.5 text-left text-xs leading-5',
          className
        )}
      >
        {isZh ? (
          <>
            继续登录或注册即代表您已阅读并同意 <LegalDocumentLinks isZh />。
          </>
        ) : (
          <>
            By continuing, you acknowledge and agree to our{' '}
            <LegalDocumentLinks isZh={false} />.
          </>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'border-border/60 bg-muted/40 flex items-start gap-3 rounded-md border p-3',
        className
      )}
    >
      <Checkbox
        id='legal-consent'
        checked={checked}
        onCheckedChange={handleChange}
        className='mt-0.5'
      />
      <Label
        htmlFor='legal-consent'
        className='text-muted-foreground items-start gap-1 text-left text-xs leading-5 font-normal'
      >
        <span>
          {isZh ? (
            <>
              我已阅读并同意 <LegalDocumentLinks isZh />。
            </>
          ) : (
            <>
              I have read and agree to the <LegalDocumentLinks isZh={false} />.
            </>
          )}
        </span>
      </Label>
    </div>
  )
}
