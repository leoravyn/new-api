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
import {
  Children,
  isValidElement,
  useEffect,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'

import { useConsoleScrollReporter } from './console-scroll-context'
import { Main } from './main'
import { PageFooterProvider } from './page-footer'

type SlotProps = { children?: ReactNode }

function SectionPageLayoutTitle(_props: SlotProps) {
  return null
}
SectionPageLayoutTitle.displayName = 'SectionPageLayout.Title'

function SectionPageLayoutActions(_props: SlotProps) {
  return null
}
SectionPageLayoutActions.displayName = 'SectionPageLayout.Actions'

function SectionPageLayoutContent(_props: SlotProps) {
  return null
}
SectionPageLayoutContent.displayName = 'SectionPageLayout.Content'

function SectionPageLayoutBreadcrumb(_props: SlotProps) {
  return null
}
SectionPageLayoutBreadcrumb.displayName = 'SectionPageLayout.Breadcrumb'

export type SectionPageLayoutProps = {
  children: ReactNode
  fixedContent?: boolean
  stackActionsOnMobile?: boolean
}

export function SectionPageLayout(props: SectionPageLayoutProps) {
  const [footerContainer, setFooterContainer] = useState<HTMLDivElement | null>(
    null
  )
  const reportScrollTop = useConsoleScrollReporter()

  useEffect(() => {
    reportScrollTop(0)
    return () => {
      reportScrollTop(0)
    }
  }, [props.fixedContent, reportScrollTop])

  let title: ReactNode = null
  let actions: ReactNode = null
  let content: ReactNode = null
  let breadcrumb: ReactNode = null

  Children.forEach(props.children, (node) => {
    if (!isValidElement(node)) return
    const child = node as ReactElement<SlotProps>
    if (child.type === SectionPageLayoutTitle) title = child.props.children
    else if (child.type === SectionPageLayoutActions) {
      actions = child.props.children
    } else if (child.type === SectionPageLayoutContent) {
      content = child.props.children
    } else if (child.type === SectionPageLayoutBreadcrumb) {
      breadcrumb = child.props.children
    }
  })

  const headerBlock = (
    <div
      className={
        props.fixedContent
          ? 'shrink-0 px-3 pt-2 pb-2 sm:px-5 sm:pt-3 sm:pb-2.5'
          : 'px-3 pt-2 pb-2.5 sm:px-5 sm:pt-3 md:pt-[calc(var(--app-header-height,3.5rem)+0.75rem)] sm:pb-3'
      }
    >
      {breadcrumb != null && (
        <div className='mb-2 sm:mb-3'>{breadcrumb}</div>
      )}
      <div className='flex flex-wrap items-center justify-between gap-x-3 gap-y-2 sm:gap-x-4'>
        <div
          className={
            props.stackActionsOnMobile
              ? 'min-w-0 flex-1 max-sm:basis-full'
              : 'min-w-0 flex-1'
          }
        >
          <h2 className='text-foreground truncate text-lg font-semibold tracking-tight sm:text-xl'>
            {title}
          </h2>
        </div>
        {actions != null && (
          <div className='flex max-w-full shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-x-3'>
            {actions}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <PageFooterProvider container={footerContainer}>
      <Main flushTop={!props.fixedContent}>
        {props.fixedContent ? (
          <>
            {headerBlock}
            <div className='min-h-0 flex-1 overflow-hidden px-3 pt-1 pb-3 sm:px-5 sm:pt-1.5 sm:pb-4'>
              {content}
            </div>
          </>
        ) : (
          <div
            data-testid='console-scroll-container'
            onScroll={(event) => reportScrollTop(event.currentTarget.scrollTop)}
            className='tokex-scrollbar min-h-0 flex-1 overflow-y-auto'
          >
            {headerBlock}
            <div className='px-3 pt-1 pb-6 sm:px-5 sm:pt-1.5 sm:pb-8'>
              {content}
            </div>
          </div>
        )}

        <div
          ref={setFooterContainer}
          className='border-border/50 bg-background/80 shrink-0 border-t px-3 py-2.5 backdrop-blur-xl empty:hidden sm:px-5 sm:py-3 dark:border-white/[0.05] dark:bg-[#07070a]/55'
        />
      </Main>
    </PageFooterProvider>
  )
}

SectionPageLayout.Title = SectionPageLayoutTitle
SectionPageLayout.Actions = SectionPageLayoutActions
SectionPageLayout.Content = SectionPageLayoutContent
SectionPageLayout.Breadcrumb = SectionPageLayoutBreadcrumb
