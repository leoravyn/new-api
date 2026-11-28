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
import { useRouterState } from '@tanstack/react-router'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

const ConsoleScrollStateContext = createContext<boolean>(false)
const ConsoleScrollDispatchContext = createContext<
  ((scrollTop: number) => void) | null
>(null)

const SCROLL_ELEVATION_THRESHOLD = 8

/**
 * Tracks scroll offset of the active console page inside AuthenticatedLayout
 * so the desktop header matches PublicHeader's scroll-triggered frosted glass.
 * Splits state and dispatch contexts so scroll reporters never re-render or reset on state flips.
 */
export function ConsoleScrollProvider({ children }: { children: ReactNode }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    setIsScrolled(false)
  }, [pathname])

  const reportScrollTop = useCallback((scrollTop: number) => {
    const next = scrollTop > SCROLL_ELEVATION_THRESHOLD
    setIsScrolled((prev) => (prev === next ? prev : next))
  }, [])

  return (
    <ConsoleScrollDispatchContext value={reportScrollTop}>
      <ConsoleScrollStateContext value={isScrolled}>
        {children}
      </ConsoleScrollStateContext>
    </ConsoleScrollDispatchContext>
  )
}

export function useConsoleHeaderScrolled(): boolean {
  return useContext(ConsoleScrollStateContext)
}

export function useConsoleScrollReporter(): (scrollTop: number) => void {
  const dispatch = useContext(ConsoleScrollDispatchContext)
  return useCallback(
    (scrollTop: number) => {
      dispatch?.(scrollTop)
    },
    [dispatch]
  )
}
