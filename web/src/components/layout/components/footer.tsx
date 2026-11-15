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
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { useStatus } from '@/hooks/use-status'
import { useSystemConfig } from '@/hooks/use-system-config'
import { normalizeInterfaceLanguage } from '@/i18n/languages'
import { cn } from '@/lib/utils'

interface FooterLink {
  labelZh: string
  labelEn: string
  href: string
}

interface FooterProps {
  logo?: string
  name?: string
  copyright?: string
  className?: string
}

const FOOTER_LINKS: readonly FooterLink[] = [
  { labelZh: '模型广场', labelEn: 'Models', href: '/pricing' },
  { labelZh: '模型榜单', labelEn: 'Rankings', href: '/rankings' },
  { labelZh: '控制台', labelEn: 'Dashboard', href: '/dashboard' },
  { labelZh: 'API 密钥', labelEn: 'Keys', href: '/keys' },
  { labelZh: '调用日志', labelEn: 'Logs', href: '/usage-logs' },
]

function LegalLinks(props: { leadingSeparator?: boolean }) {
  const { t } = useTranslation()
  const { status } = useStatus()
  const items: { key: string; label: string; href: string }[] = []

  if (status?.user_agreement_enabled) {
    items.push({
      key: 'user-agreement',
      label: t('User Agreement'),
      href: '/user-agreement',
    })
  }
  if (status?.privacy_policy_enabled) {
    items.push({
      key: 'privacy-policy',
      label: t('Privacy Policy'),
      href: '/privacy-policy',
    })
  }
  if (items.length === 0) {
    return null
  }

  return (
    <>
      {items.map((item, index) => (
        <Fragment key={item.key}>
          {(props.leadingSeparator || index > 0) && (
            <span aria-hidden='true' className='text-zinc-600'>
              ·
            </span>
          )}
          <Link
            to={item.href}
            className='text-zinc-400 transition-colors duration-200 hover:text-white'
          >
            {item.label}
          </Link>
        </Fragment>
      ))}
    </>
  )
}

export function Footer(props: FooterProps) {
  const { i18n } = useTranslation()
  const { systemName, logo: systemLogo } = useSystemConfig()
  const isZh =
    normalizeInterfaceLanguage(i18n.resolvedLanguage || i18n.language) ===
    'zhCN'

  const displayLogo = systemLogo || props.logo || '/logo.png'
  const rawName = systemName || props.name || 'TOKEX'
  const displayName =
    rawName.toLowerCase() === 'new api' || rawName.toLowerCase() === 'tokex'
      ? 'TOKEX'
      : rawName
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className={cn(
        'relative z-10 border-t border-white/[0.08] bg-[#050506]/90 backdrop-blur-xl',
        props.className
      )}
    >
      <div className='mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-8 sm:flex-row sm:items-center'>
        <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
          <Link to='/' className='flex items-center gap-2'>
            <img
              src={displayLogo}
              alt={displayName}
              className='size-6 rounded-md object-contain'
            />
            <span className='text-sm font-semibold tracking-tight text-white'>
              {displayName}
            </span>
          </Link>
          <span className='text-xs text-zinc-500'>
            &copy; {currentYear} {displayName}.{' '}
            {props.copyright ??
              (isZh ? '统一大模型网关底座' : 'The Unified Interface for LLMs.')}
          </span>
          <span className='flex items-center gap-x-2 text-xs'>
            <LegalLinks />
          </span>
        </div>

        <nav
          aria-label={isZh ? '页脚导航' : 'Footer navigation'}
          className='flex flex-wrap items-center gap-x-6 gap-y-2'
        >
          {FOOTER_LINKS.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className='text-xs text-zinc-400 transition-colors duration-200 hover:text-white'
            >
              {isZh ? item.labelZh : item.labelEn}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
