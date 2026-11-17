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
import { useNavigate } from '@tanstack/react-router'
import {
  ChevronRight,
  LogOut,
  Settings,
  ShieldCheck,
  User,
  Wallet,
} from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { SignOutDialog } from '@/components/sign-out-dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useDialogState from '@/hooks/use-dialog'
import { useIsSidebarModuleVisible } from '@/hooks/use-sidebar-config'
import { useUserDisplay } from '@/hooks/use-user-display'
import { getUserAvatarFallback, getUserAvatarStyle } from '@/lib/avatar'
import { ROLE } from '@/lib/roles'
import { useAuthStore } from '@/stores/auth-store'

const avatarFallbackClassName = 'font-semibold text-white'

export function ProfileDropdown() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [open, setOpen] = useDialogState()
  const user = useAuthStore((state) => state.auth.user)
  const { displayName, roleLabel } = useUserDisplay(user)
  const isSuperAdmin = user?.role === ROLE.SUPER_ADMIN
  const isWalletVisible = useIsSidebarModuleVisible('/wallet')
  const isSecurityVisible = useIsSidebarModuleVisible('/security')
  const avatarName = user?.username || displayName
  const avatarFallback = getUserAvatarFallback(avatarName)
  const avatarFallbackStyle = useMemo(
    () => getUserAvatarStyle(avatarName),
    [avatarName]
  )

  const navItemClass =
    'group/nav-item flex items-center gap-2.5 rounded-xl px-2 py-2 text-zinc-200 transition-all hover:bg-white/[0.06] hover:text-white focus:bg-white/[0.06] focus:text-white'
  const navIconBoxClass =
    'flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-300 transition-colors group-hover/nav-item:border-white/[0.16] group-hover/nav-item:bg-white/[0.08] group-hover/nav-item:text-white'
  const navChevronClass =
    'ml-auto size-3.5 text-zinc-600 transition-all group-hover/nav-item:translate-x-0.5 group-hover/nav-item:text-zinc-300'

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          render={
            <Button
              variant='ghost'
              className='relative size-8 rounded-full border border-white/[0.12] bg-white/[0.04] p-0 transition-all hover:border-white/25 hover:bg-white/[0.08]'
            />
          }
        >
          <Avatar className='size-7'>
            <AvatarFallback
              className={`${avatarFallbackClassName} text-[11px]`}
              style={avatarFallbackStyle}
            >
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' sideOffset={10} className='w-72 p-1.5'>
          <div className='mb-1 rounded-xl border border-white/[0.07] bg-white/[0.025] p-2.5'>
            <div className='flex items-center gap-2.5'>
              <Avatar className='size-9 border border-white/[0.14]'>
                <AvatarFallback
                  className={`${avatarFallbackClassName} text-xs`}
                  style={avatarFallbackStyle}
                >
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
              <div className='flex min-w-0 flex-1 flex-col gap-1'>
                <div className='flex items-center gap-1.5'>
                  <p className='truncate text-sm font-semibold text-white'>
                    {displayName}
                  </p>
                  <span className='shrink-0 rounded-md border border-white/[0.1] bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-medium text-zinc-300'>
                    {roleLabel}
                  </span>
                </div>
                <div className='flex items-center gap-1.5 text-xs text-zinc-400'>
                  {user?.username && (
                    <span className='truncate font-mono text-[11px]'>
                      @{user.username}
                    </span>
                  )}
                  {user?.group && (
                    <>
                      <span className='text-zinc-600'>·</span>
                      <span className='truncate text-[11px] text-zinc-400'>
                        {String(user.group)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className={navItemClass}
            onClick={() => navigate({ to: '/profile' })}
          >
            <span className={navIconBoxClass}>
              <User className='size-3.5' />
            </span>
            <span className='font-medium'>{t('Profile')}</span>
            <ChevronRight className={navChevronClass} />
          </DropdownMenuItem>

          {isSecurityVisible && (
            <DropdownMenuItem
              className={navItemClass}
              onClick={() => navigate({ to: '/security' })}
            >
              <span className={navIconBoxClass}>
                <ShieldCheck className='size-3.5' />
              </span>
              <span className='font-medium'>{t('Security & Access')}</span>
              <ChevronRight className={navChevronClass} />
            </DropdownMenuItem>
          )}

          {isWalletVisible && (
            <DropdownMenuItem
              className={navItemClass}
              onClick={() => navigate({ to: '/wallet' })}
            >
              <span className={navIconBoxClass}>
                <Wallet className='size-3.5' />
              </span>
              <span className='font-medium'>{t('Wallet')}</span>
              <ChevronRight className={navChevronClass} />
            </DropdownMenuItem>
          )}

          {isSuperAdmin && (
            <DropdownMenuItem
              className={navItemClass}
              onClick={() =>
                navigate({
                  to: '/system-settings/site/$section',
                  params: { section: 'system-info' },
                })
              }
            >
              <span className={navIconBoxClass}>
                <Settings className='size-3.5' />
              </span>
              <span className='font-medium'>{t('System Settings')}</span>
              <ChevronRight className={navChevronClass} />
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant='destructive'
            className='group/signout flex items-center gap-2.5 rounded-xl px-2 py-2'
            onClick={() => setOpen(true)}
          >
            <span className='border-destructive/25 bg-destructive/10 text-destructive flex size-7 shrink-0 items-center justify-center rounded-lg border'>
              <LogOut className='size-3.5' />
            </span>
            <span className='font-medium'>{t('Sign out')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
