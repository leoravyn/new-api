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
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import {
  IconDiscord,
  IconGithub,
  IconLinuxDo,
  IconTelegram,
  IconWeChat,
} from '@/assets/brand-icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { useOAuthLogin } from '../hooks/use-oauth-login'
import type { SystemStatus } from '../types'

function IconGoogle({ className }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='currentColor'
      aria-hidden='true'
      className={className}
    >
      <path d='M21.805 10.023H12.18v3.955h5.52c-.238 1.273-.957 2.352-2.041 3.076v2.556h3.302c1.932-1.778 3.044-4.398 3.044-7.508 0-.707-.064-1.39-.2-2.079Z' />
      <path d='M12.18 22c2.755 0 5.066-.912 6.755-2.469l-3.302-2.556c-.914.614-2.084.978-3.453.978-2.654 0-4.904-1.792-5.708-4.2H3.063v2.634C4.742 19.721 8.191 22 12.18 22Z' />
      <path d='M6.472 13.753a5.988 5.988 0 0 1 0-3.506V7.613H3.063a9.997 9.997 0 0 0 0 8.774l3.409-2.634Z' />
      <path d='M12.18 6.047c1.498 0 2.842.515 3.9 1.525l2.927-2.927C17.241 3.001 14.93 2 12.18 2 8.191 2 4.742 4.279 3.063 7.613l3.409 2.634c.804-2.408 3.054-4.2 5.708-4.2Z' />
    </svg>
  )
}

type OAuthProvidersProps = {
  status: SystemStatus | null
  disabled?: boolean
  className?: string
  onWeChatLogin?: () => void
  isWeChatLoading?: boolean
  redirectTo?: string
}

type ProviderButton = {
  key: string
  label: string
  onClick: () => void
  icon?: ReactNode
  disabled?: boolean
}

export function OAuthProviders({
  status,
  disabled = false,
  className,
  onWeChatLogin,
  isWeChatLoading = false,
  redirectTo,
}: OAuthProvidersProps) {
  const { t } = useTranslation()
  const {
    isLoading,
    githubButtonText,
    githubButtonDisabled,
    handleGitHubLogin,
    handleDiscordLogin,
    handleOIDCLogin,
    handleLinuxDOLogin,
    handleTelegramLogin,
    handleCustomOAuthLogin,
  } = useOAuthLogin(status, redirectTo)

  const providerButtons: ProviderButton[] = []

  if (status?.wechat_login && onWeChatLogin) {
    providerButtons.push({
      key: 'wechat',
      label: t('Continue with WeChat'),
      onClick: onWeChatLogin,
      icon: <IconWeChat className='h-4 w-4' />,
      disabled: isWeChatLoading,
    })
  }

  if (status?.github_oauth) {
    providerButtons.push({
      key: 'github',
      label: githubButtonText || t('Continue with GitHub'),
      onClick: handleGitHubLogin,
      icon: <IconGithub className='h-4 w-4' />,
      disabled: githubButtonDisabled,
    })
  }

  if (status?.discord_oauth) {
    providerButtons.push({
      key: 'discord',
      label: t('Continue with Discord'),
      onClick: handleDiscordLogin,
      icon: <IconDiscord className='h-4 w-4' />,
    })
  }

  if (status?.oidc_enabled) {
    const oidcDisplayName = status.oidc_display_name?.trim() || 'OIDC'
    const isGoogle = oidcDisplayName.toLowerCase() === 'google'
    providerButtons.push({
      key: 'oidc',
      label: t('Continue with {{name}}', {
        name: oidcDisplayName,
      }),
      onClick: handleOIDCLogin,
      icon: isGoogle ? <IconGoogle className='h-4 w-4' /> : undefined,
    })
  }

  if (status?.linuxdo_oauth) {
    providerButtons.push({
      key: 'linuxdo',
      label: t('Continue with LinuxDO'),
      onClick: handleLinuxDOLogin,
      icon: <IconLinuxDo className='h-4 w-4' />,
    })
  }

  if (status?.telegram_oauth) {
    providerButtons.push({
      key: 'telegram',
      label: t('Continue with Telegram'),
      onClick: handleTelegramLogin,
      icon: <IconTelegram data-icon='inline-start' />,
    })
  }

  // Custom OAuth providers
  const customProviders = status?.custom_oauth_providers
  if (customProviders && customProviders.length > 0) {
    for (const provider of customProviders) {
      providerButtons.push({
        key: `custom-${provider.slug}`,
        label: t('Continue with {{name}}', { name: provider.name }),
        onClick: () => handleCustomOAuthLogin(provider),
      })
    }
  }

  if (providerButtons.length === 0) return null

  const useTwoColumnGrid = providerButtons.length === 2

  return (
    <div className={cn('space-y-4', className)}>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t border-white/[0.08]' />
        </div>
        <div className='relative flex justify-center text-[11px] uppercase'>
          <span className='bg-[#0a0a0c] px-3 font-medium tracking-wider text-zinc-500'>
            {t('Or continue with')}
          </span>
        </div>
      </div>

      <div
        className={cn(
          useTwoColumnGrid
            ? 'grid grid-cols-1 gap-2.5 sm:grid-cols-2'
            : 'flex flex-col gap-2.5'
        )}
      >
        {providerButtons.map(
          ({ key, label, onClick, icon, disabled: extraDisabled }) => (
            <Button
              key={key}
              variant='outline'
              type='button'
              disabled={disabled || isLoading || extraDisabled}
              onClick={onClick}
              className='h-10 w-full justify-center gap-2 rounded-xl border border-[#27272a] bg-[#141417] text-xs font-medium text-[#fafafa] shadow-none transition-all duration-200 hover:border-zinc-600 hover:bg-[#1c1c21] hover:text-white'
            >
              {icon}
              <span className='truncate'>{label}</span>
            </Button>
          )
        )}
      </div>
    </div>
  )
}
