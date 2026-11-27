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
import { useTranslation } from 'react-i18next'

import { LanguageSwitcher } from '@/components/language-switcher'
import { NotificationPopover } from '@/components/notification-popover'
import { Search } from '@/components/search'
import { useNotifications } from '@/hooks/use-notifications'
import { useTopNavLinks } from '@/hooks/use-top-nav-links'

import { defaultTopNavLinks } from '../config/top-nav.config'
import type { TopNavLink } from '../types'
import { Header } from './header'
import {
  HeaderConsoleButton,
  splitHeaderNavLinks,
} from './header-console-action'
import { SystemBrand } from './system-brand'
import { TopNav } from './top-nav'

/**
 * General application Header component
 * Integrates navigation bar, search, configuration and profile functions
 *
 * @example
 * // Basic usage
 * <AppHeader />
 *
 * @example
 * // Custom navigation links
 * <AppHeader navLinks={customLinks} />
 *
 * @example
 * // Hide navigation bar and search box
 * <AppHeader showTopNav={false} showSearch={false} />
 *
 * @example
 * // Fully customize left and right content
 * <AppHeader
 *   leftContent={<CustomLeft />}
 *   rightContent={<CustomRight />}
 * />
 */
type AppHeaderProps = {
  /**
   * Custom navigation links, uses default global navigation or dynamically generated from backend if not provided
   */
  navLinks?: TopNavLink[]
  /**
   * Whether to show top navigation bar
   * @default true
   */
  showTopNav?: boolean
  /**
   * Left content, overrides TopNav if provided
   */
  leftContent?: React.ReactNode
  /**
   * Whether to show search box
   * @default true
   */
  showSearch?: boolean
  /**
   * Custom right content, overrides default right content if provided
   */
  rightContent?: React.ReactNode
  /**
   * Whether to show notification button
   * @default true
   */
  showNotifications?: boolean
  /**
   * @deprecated Theme customization is locked to the unified system style.
   */
  showConfigDrawer?: boolean
  /**
   * Whether to show profile dropdown
   * @default true
   */
  showProfileDropdown?: boolean
}

export function AppHeader({
  navLinks = defaultTopNavLinks,
  showTopNav = true,
  leftContent,
  showSearch = true,
  rightContent,
  showNotifications = true,
  showConfigDrawer: _showConfigDrawer = false,
  showProfileDropdown = true,
}: AppHeaderProps) {
  const { t } = useTranslation()
  // Prioritize dynamically generated links from backend
  const dynamicLinks = useTopNavLinks()
  const allLinks = dynamicLinks.length > 0 ? dynamicLinks : navLinks
  const { navLinks: links, consoleLink } = splitHeaderNavLinks(allLinks)
  const consoleLabel = consoleLink ? t(consoleLink.title) : t('Console')

  // Notifications hook
  const notifications = useNotifications()

  return (
    <Header>
      <div className='@container/system-brand flex min-w-0 flex-1 items-center gap-2'>
        <SystemBrand variant='inline' />
        {showSearch && (
          <Search className='ms-1 hidden w-8 flex-none sm:inline-flex sm:w-44 lg:w-52 [&>span]:hidden sm:[&>span]:inline' />
        )}
      </div>

      {leftContent ? (
        <div className='ms-2 flex items-center'>{leftContent}</div>
      ) : null}

      {rightContent ?? (
        <div className='ms-auto flex shrink-0 items-center gap-1 sm:gap-1.5'>
          {showTopNav && (
            <div className='hidden lg:block'>
              <TopNav links={links} />
            </div>
          )}
          {showTopNav && showNotifications && (
            <div className='mx-2 hidden h-4 w-px bg-[rgba(255,255,255,0.1)] lg:block' />
          )}
          {showSearch && (
            <Search className='w-8 flex-none sm:hidden [&>span]:hidden' />
          )}
          <LanguageSwitcher />
          {showNotifications && (
            <NotificationPopover
              open={notifications.popoverOpen}
              onOpenChange={notifications.setPopoverOpen}
              unreadCount={notifications.unreadCount}
              activeTab={notifications.activeTab}
              onTabChange={notifications.setActiveTab}
              notice={notifications.notice}
              announcements={notifications.announcements}
              loading={notifications.loading}
            />
          )}
          {showProfileDropdown && consoleLink && (
            <>
              <div className='mx-1.5 hidden h-4 w-px bg-[rgba(255,255,255,0.1)] sm:block' />
              <HeaderConsoleButton
                label={consoleLabel}
                emphasized={false}
                disabled={consoleLink.disabled}
              />
            </>
          )}
        </div>
      )}
    </Header>
  )
}
