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
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'

import {
  type ContentLayout,
  DEFAULT_THEME_CUSTOMIZATION,
  resolveThemeFont,
  type ThemeCustomization,
  type ThemeFont,
  type ThemePreset,
  type ThemeRadius,
  type ThemeScale,
} from '@/lib/theme-customization'
import { THEME_STORAGE_KEYS, writeThemePreference } from '@/lib/theme-storage'

function applyAttribute(name: string, value: string | null) {
  if (typeof document === 'undefined') return
  const body = document.body
  if (!body) return
  if (value === null) {
    body.removeAttribute(name)
  } else {
    body.setAttribute(name, value)
  }
}

type ThemeCustomizationContextType = {
  defaults: ThemeCustomization
  customization: ThemeCustomization
  setPreset: (preset: ThemePreset) => void
  setFont: (font: ThemeFont) => void
  setRadius: (radius: ThemeRadius) => void
  setScale: (scale: ThemeScale) => void
  setContentLayout: (contentLayout: ContentLayout) => void
  resetCustomization: () => void
}

const FALLBACK_CONTEXT: ThemeCustomizationContextType = {
  defaults: DEFAULT_THEME_CUSTOMIZATION,
  customization: DEFAULT_THEME_CUSTOMIZATION,
  setPreset: () => {},
  setFont: () => {},
  setRadius: () => {},
  setScale: () => {},
  setContentLayout: () => {},
  resetCustomization: () => {},
}

const ThemeCustomizationContext =
  createContext<ThemeCustomizationContextType>(FALLBACK_CONTEXT)

export function ThemeCustomizationProvider(props: {
  children: React.ReactNode
}) {
  // Lock site appearance to the single default monochrome theme with no user overrides.
  useEffect(() => {
    applyAttribute('data-theme-preset', null)
    applyAttribute(
      'data-theme-font',
      resolveThemeFont(
        DEFAULT_THEME_CUSTOMIZATION.font,
        DEFAULT_THEME_CUSTOMIZATION.preset
      )
    )
    applyAttribute('data-theme-radius', null)
    applyAttribute('data-theme-scale', null)
    applyAttribute(
      'data-theme-content-layout',
      DEFAULT_THEME_CUSTOMIZATION.contentLayout
    )

    writeThemePreference(THEME_STORAGE_KEYS.preset, null)
    writeThemePreference(THEME_STORAGE_KEYS.font, null)
    writeThemePreference(THEME_STORAGE_KEYS.radius, null)
    writeThemePreference(THEME_STORAGE_KEYS.scale, null)
    writeThemePreference(THEME_STORAGE_KEYS.contentLayout, null)
  }, [])

  const noop = useCallback(() => {}, [])

  const value = useMemo<ThemeCustomizationContextType>(
    () => ({
      defaults: DEFAULT_THEME_CUSTOMIZATION,
      customization: DEFAULT_THEME_CUSTOMIZATION,
      setPreset: noop,
      setFont: noop,
      setRadius: noop,
      setScale: noop,
      setContentLayout: noop,
      resetCustomization: noop,
    }),
    [noop]
  )

  return (
    <ThemeCustomizationContext.Provider value={value}>
      {props.children}
    </ThemeCustomizationContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useThemeCustomization() {
  return useContext(ThemeCustomizationContext)
}
