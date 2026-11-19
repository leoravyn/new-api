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
import { EXCLUDED_GROUPS, FILTER_ALL, QUOTA_TYPE_VALUES } from '../constants'
import type { PricingModel } from '../types'

// ----------------------------------------------------------------------------
// Model Helper Utilities
// ----------------------------------------------------------------------------

/**
 * Get available groups for a model
 */
export function getAvailableGroups(
  model: PricingModel,
  usableGroup: Record<string, { desc: string; ratio: number }>
): string[] {
  const modelEnableGroups = Array.isArray(model.enable_groups)
    ? model.enable_groups
    : []

  return Object.keys(usableGroup)
    .filter((g) => !EXCLUDED_GROUPS.includes(g))
    .filter((g) => modelEnableGroups.includes(g))
}

const GROUP_RATIO_EPSILON = 1e-6

/**
 * Whether a group ratio multiplier differs meaningfully from 1x.
 * Applies symmetrically to discounts (< 1x), free groups (0x), and markups (> 1x).
 */
export function isNonUnitGroupRatio(ratio: number | undefined): boolean {
  return (
    typeof ratio === 'number' &&
    Number.isFinite(ratio) &&
    Math.abs(ratio - 1) > GROUP_RATIO_EPSILON
  )
}

export type PriceComparison = {
  current: string
  original?: string
  groupRatio: number
}

/**
 * Build a current-vs-original price comparison, omitting the strikethrough
 * original whenever the group ratio is 1x or the formatted values match.
 */
export function buildPriceComparison(
  current: string,
  original: string | undefined,
  groupRatio: number
): PriceComparison {
  const showOriginal =
    isNonUnitGroupRatio(groupRatio) &&
    original !== undefined &&
    original !== current
  return {
    current,
    ...(showOriginal ? { original } : {}),
    groupRatio,
  }
}

/**
 * Read a configured group ratio while preserving valid zero ratios.
 */
export function getConfiguredGroupRatio(
  groupRatio: Record<string, number>,
  group: string
): number {
  const ratio = groupRatio[group]
  return typeof ratio === 'number' && Number.isFinite(ratio) ? ratio : 1
}

/**
 * Resolve the group ratio used by model square summary prices.
 *
 * When no specific group is selected, the model square shows the best price
 * available to the viewer. When a group filter is active, it shows that
 * group's price instead.
 */
export function getDisplayGroupRatio(
  model: PricingModel,
  selectedGroup?: string
): number {
  const modelEnableGroups = Array.isArray(model.enable_groups)
    ? model.enable_groups
    : []
  const groupRatio = model.group_ratio || {}

  if (
    selectedGroup &&
    selectedGroup !== FILTER_ALL &&
    !EXCLUDED_GROUPS.includes(selectedGroup) &&
    modelEnableGroups.includes(selectedGroup)
  ) {
    return getConfiguredGroupRatio(groupRatio, selectedGroup)
  }

  if (modelEnableGroups.length === 0) {
    return 1
  }

  let minRatio = Number.POSITIVE_INFINITY

  for (const group of modelEnableGroups) {
    if (EXCLUDED_GROUPS.includes(group)) continue
    const ratio = groupRatio[group]
    if (
      typeof ratio === 'number' &&
      Number.isFinite(ratio) &&
      ratio < minRatio
    ) {
      minRatio = ratio
    }
  }

  return minRatio === Number.POSITIVE_INFINITY ? 1 : minRatio
}

/**
 * Replace model placeholder in endpoint path
 */
export function replaceModelInPath(path: string, modelName: string): string {
  return path.replaceAll('{model}', modelName)
}

/**
 * Format a numeric multiplier ratio concisely (e.g. 1 -> "1x", 0.3 -> "0.3x")
 */
export function formatRatioMultiplier(
  ratio: number | undefined
): string | undefined {
  if (ratio == null || !Number.isFinite(ratio)) return undefined
  const formatted = Number.isInteger(ratio)
    ? ratio.toString()
    : ratio.toFixed(3).replace(/0+$/, '').replace(/\.$/, '')
  return `${formatted}x`
}

export interface ModelGroupMultiplier {
  group: string
  ratio: number
  label: string
}

/**
 * Resolve displayable enabled groups and their group multipliers for a model
 */
export function getModelGroupMultipliers(
  model: PricingModel,
  selectedGroup?: string
): ModelGroupMultiplier[] {
  const rawGroups = Array.isArray(model.enable_groups)
    ? model.enable_groups
    : []
  const uniqueGroups: string[] = []
  const seen = new Set<string>()
  for (const group of rawGroups) {
    if (!group || group === 'auto' || seen.has(group)) continue
    seen.add(group)
    uniqueGroups.push(group)
  }

  const groupRatio = model.group_ratio || {}
  const toEntry = (group: string): ModelGroupMultiplier => {
    const ratio = getConfiguredGroupRatio(groupRatio, group)
    const formatted = formatRatioMultiplier(ratio) ?? `${ratio}x`
    return {
      group,
      ratio,
      label: `${group} · ${formatted}`,
    }
  }

  if (
    selectedGroup &&
    selectedGroup !== FILTER_ALL &&
    uniqueGroups.includes(selectedGroup)
  ) {
    return [toEntry(selectedGroup)]
  }

  return uniqueGroups.map(toEntry)
}

/**
 * Check if model is token-based pricing
 */
export function isTokenBasedModel(model: PricingModel): boolean {
  return model.quota_type === QUOTA_TYPE_VALUES.TOKEN
}
