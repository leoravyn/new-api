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

import { LanguageSwitcher } from '@/components/language-switcher'
import { Skeleton } from '@/components/ui/skeleton'
import { useSystemConfig } from '@/hooks/use-system-config'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation()
  const { systemName, logo, loading } = useSystemConfig()
  const rawName = systemName?.trim() || 'TOKEX'
  const displayName =
    rawName.toLowerCase() === 'new api' || rawName.toLowerCase() === 'tokex'
      ? 'TOKEX'
      : rawName

  return (
    <div className='relative flex min-h-svh flex-col justify-center overflow-hidden bg-[#000000] px-4 py-20 text-[#fafafa]'>
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.045),transparent_65%)]'
      />

      <header className='absolute inset-x-0 top-0 z-20 mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8 sm:py-6'>
        <Link
          to='/'
          aria-label={displayName}
          className='flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-[#0a0a0c]/85 px-2.5 py-1.5 backdrop-blur-xl transition-all duration-200 hover:border-white/[0.16] hover:bg-[#141417]'
        >
          {loading ? (
            <Skeleton className='h-7 w-24 rounded-md' />
          ) : displayName === 'TOKEX' ? (
            <img
              src='/logo-tokex.svg'
              alt='TOKEX'
              width={226}
              height={64}
              className='h-7 w-auto object-contain select-none'
            />
          ) : (
            <>
              <div className='relative h-6 w-6'>
                <img
                  src={logo || '/favicon.svg'}
                  alt={t('Logo')}
                  className='h-6 w-6 rounded-md object-contain'
                />
              </div>
              <span className='text-sm font-semibold tracking-tight text-[#fafafa]'>
                {displayName}
              </span>
            </>
          )}
        </Link>

        <LanguageSwitcher />
      </header>

      <div className='relative z-10 mx-auto w-full max-w-[440px]'>
        <div className='flex w-full flex-col justify-center rounded-2xl border border-white/[0.08] bg-[#0a0a0c]/90 p-6 shadow-[0_24px_64px_-20px_rgba(0,0,0,0.95)] backdrop-blur-2xl sm:p-8'>
          {children}
        </div>
      </div>
    </div>
  )
}
