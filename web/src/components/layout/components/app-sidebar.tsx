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
import { LogOut } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'

import { SignOutDialog } from '@/components/sign-out-dialog'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useLayout } from '@/context/layout-provider'
import useDialogState from '@/hooks/use-dialog'
import { useSidebarView } from '@/hooks/use-sidebar-view'
import { useUserDisplay } from '@/hooks/use-user-display'
import { MOTION_TRANSITION, MOTION_VARIANTS } from '@/lib/motion'
import { useAuthStore } from '@/stores/auth-store'

import { NavGroup } from './nav-group'
import { SidebarViewHeader } from './sidebar-view-header'

/**
 * Application sidebar.
 *
 * Adopts the Vercel / Cloudflare "drill-in" pattern: the URL drives
 * which sidebar *view* is rendered. Clicking a top-level entry like
 * `System Settings` swaps the sidebar to a contextual workspace —
 * with a `← Back to Dashboard` affordance — instead of stacking the
 * sub-navigation inside the root tree.
 *
 * Architecture:
 *   - View resolution + filtering: {@link useSidebarView}
 *   - View registry: `layout/lib/sidebar-view-registry.ts`
 *   - Per-view header: {@link SidebarViewHeader}
 *
 * Adding a new nested view only requires registering a {@link SidebarView}
 * in the registry; this component requires no changes.
 */
export function AppSidebar() {
  const { t } = useTranslation()
  const { collapsible, variant } = useLayout()
  const { key, view, navGroups } = useSidebarView()
  const shouldReduce = useReducedMotion()
  const user = useAuthStore((s) => s.auth.user)
  const { displayName, roleLabel } = useUserDisplay(user)
  const [signOutOpen, setSignOutOpen] = useDialogState()

  return (
    <>
      <Sidebar collapsible={collapsible} variant={variant}>
        {view && <SidebarViewHeader view={view} />}

        <SidebarContent className='py-2.5'>
          <AnimatePresence mode='wait' initial={false}>
            <motion.div
              key={key}
              initial={
                shouldReduce ? false : MOTION_VARIANTS.sidebarSlide.initial
              }
              animate={MOTION_VARIANTS.sidebarSlide.animate}
              exit={
                shouldReduce ? undefined : MOTION_VARIANTS.sidebarSlide.exit
              }
              transition={MOTION_TRANSITION.fast}
              className='flex flex-col gap-5'
            >
              {navGroups.map((props) => (
                <NavGroup key={props.id || props.title} {...props} />
              ))}
            </motion.div>
          </AnimatePresence>
        </SidebarContent>

        <SidebarFooter className='border-t border-white/[0.06] px-2 py-2 group-data-[collapsible=icon]:px-0'>
          <SidebarMenu className='group-data-[collapsible=icon]:items-center'>
            <SidebarMenuItem>
              <div className='flex items-center justify-between gap-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0'>
                <Link
                  to='/profile'
                  className='flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors hover:bg-white/[0.05] group-data-[collapsible=icon]:hidden'
                >
                  <span className='truncate font-medium text-zinc-200'>
                    {displayName}
                  </span>
                  {roleLabel && (
                    <span className='shrink-0 rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-zinc-400'>
                      {roleLabel}
                    </span>
                  )}
                </Link>
                <SidebarMenuButton
                  tooltip={t('Sign out')}
                  onClick={() => setSignOutOpen(true)}
                  aria-label={t('Sign out')}
                  className='size-8 shrink-0 justify-center rounded-lg text-zinc-400 group-data-[collapsible=icon]:size-9! hover:bg-white/[0.06] hover:text-zinc-100'
                >
                  <LogOut className='size-4' />
                </SidebarMenuButton>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SignOutDialog open={!!signOutOpen} onOpenChange={setSignOutOpen} />
    </>
  )
}
