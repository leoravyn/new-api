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

import { LEGAL_CONFIG } from '@/features/legal/content/legal-config'
import { useSystemConfig } from '@/hooks/use-system-config'
import { normalizeInterfaceLanguage } from '@/i18n/languages'
import { cn } from '@/lib/utils'

interface FooterLink {
  labelZh: string
  labelEn: string
  href: '/pricing' | '/rankings' | '/about'
}

interface LegalLinkItem {
  key: string
  labelZh: string
  labelEn: string
  href: '/terms' | '/privacy-policy' | '/aup'
}

interface FooterProps {
  logo?: string
  name?: string
  copyright?: string
  className?: string
}

const FOOTER_LINKS: readonly FooterLink[] = [
  { labelZh: '模型定价', labelEn: 'Pricing', href: '/pricing' },
  { labelZh: '模型榜单', labelEn: 'Rankings', href: '/rankings' },
  { labelZh: '关于我们', labelEn: 'About', href: '/about' },
]

const LEGAL_LINKS: readonly LegalLinkItem[] = [
  {
    key: 'terms',
    labelZh: '服务条款',
    labelEn: 'Terms of Service',
    href: '/terms',
  },
  {
    key: 'privacy-policy',
    labelZh: '隐私政策',
    labelEn: 'Privacy Policy',
    href: '/privacy-policy',
  },
  {
    key: 'aup',
    labelZh: '使用规范',
    labelEn: 'Acceptable Use',
    href: '/aup',
  },
]

function LegalLinks({ isZh }: { isZh: boolean }) {
  return (
    <>
      {LEGAL_LINKS.map((item, index) => (
        <Fragment key={item.key}>
          {index > 0 && (
            <span aria-hidden='true' className='text-[#6e7a94]/70'>
              ·
            </span>
          )}
          <Link
            to={item.href}
            className='text-[#94a0b8] transition-colors duration-200 hover:text-[#f4f6fa]'
          >
            {isZh ? item.labelZh : item.labelEn}
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

  const displayLogo = systemLogo || props.logo || '/favicon.svg'
  const rawName = systemName || props.name || LEGAL_CONFIG.brandName
  const displayName =
    rawName.toLowerCase() === 'new api' || rawName.toLowerCase() === 'tokex'
      ? LEGAL_CONFIG.brandName
      : rawName
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className={cn(
        'relative z-10 border-t border-[rgba(216,226,248,0.08)] bg-[#07080b]/90 backdrop-blur-xl',
        props.className
      )}
    >
      <div className='mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-8 lg:flex-row lg:items-center'>
        <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
          <Link
            to='/'
            aria-label={displayName}
            className='flex items-center gap-2'
          >
            {displayName === 'TOKEX' && !props.logo ? (
              <img
                src='/logo-tokex.svg'
                alt='TOKEX'
                width={226}
                height={64}
                className='h-7 w-auto object-contain select-none'
              />
            ) : (
              <>
                <img
                  src={displayLogo}
                  alt={displayName}
                  className='size-6 rounded-md object-contain'
                />
                <span className='text-sm font-semibold tracking-tight text-[#f4f6fa]'>
                  {displayName}
                </span>
              </>
            )}
          </Link>
          <span className='text-xs text-[#6e7a94]'>
            &copy; {currentYear} {displayName}.{' '}
            {props.copyright ??
              (isZh ? '保留所有权利。' : 'All rights reserved.')}
          </span>
          <span className='flex flex-wrap items-center gap-x-2 gap-y-1 text-xs'>
            <LegalLinks isZh={isZh} />
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
              className='text-xs text-[#94a0b8] transition-colors duration-200 hover:text-[#f4f6fa]'
            >
              {isZh ? item.labelZh : item.labelEn}
            </Link>
          ))}
          <a
            href={`mailto:${LEGAL_CONFIG.supportEmail}`}
            className='text-xs text-[#94a0b8] transition-colors duration-200 hover:text-[#f4f6fa]'
          >
            {LEGAL_CONFIG.supportEmail}
          </a>
        </nav>
      </div>
    </footer>
  )
}
