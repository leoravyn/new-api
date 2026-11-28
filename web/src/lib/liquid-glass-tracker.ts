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

const LIQUID_GLASS_SELECTOR =
  "[data-slot='card'], [data-slot='sidebar-inner'], .tokex-console-panel, .tokex-liquid-card"
const OUTER_PROXIMITY_PX = 136
const MAX_SCAN_COUNT = 80

function formatFactor(value: number): string {
  return value <= 0.004 ? '0' : value.toFixed(3)
}

function collectCandidateElements(target: EventTarget | null): HTMLElement[] {
  const all = document.querySelectorAll<HTMLElement>(LIQUID_GLASS_SELECTOR)
  if (all.length <= MAX_SCAN_COUNT) {
    return Array.from(all)
  }

  const candidates = new Set<HTMLElement>()
  if (target instanceof Element) {
    const closest = target.closest<HTMLElement>(LIQUID_GLASS_SELECTOR)
    if (closest) {
      candidates.add(closest)
      const ancestor = closest.parentElement?.parentElement ?? closest.parentElement
      if (ancestor) {
        ancestor
          .querySelectorAll<HTMLElement>(LIQUID_GLASS_SELECTOR)
          .forEach((node) => candidates.add(node))
      }
    }
  }
  return Array.from(candidates)
}

/**
 * Installs a zero-rerender rAF pointer tracker that drives inverse-distance
 * border illumination (`--lg-o`, `--lg-x`, `--lg-y`) on frosted glass surfaces.
 */
export function installLiquidGlassTracker(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {}
  }

  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return () => {}
  }

  const activeElements = new Set<HTMLElement>()
  let rafId = 0
  let lastX = 0
  let lastY = 0
  let lastTarget: EventTarget | null = null

  const clearElement = (element: HTMLElement) => {
    element.style.setProperty('--lg-o', '0')
    activeElements.delete(element)
  }

  const clearAll = () => {
    activeElements.forEach((element) => {
      element.style.setProperty('--lg-o', '0')
    })
    activeElements.clear()
  }

  const flushFrame = () => {
    rafId = 0
    const nextActive = new Set<HTMLElement>()
    const candidates = collectCandidateElements(lastTarget)

    for (const element of candidates) {
      const rect = element.getBoundingClientRect()
      if (
        rect.width <= 0 ||
        rect.height <= 0 ||
        lastX < rect.left - OUTER_PROXIMITY_PX ||
        lastX > rect.right + OUTER_PROXIMITY_PX ||
        lastY < rect.top - OUTER_PROXIMITY_PX ||
        lastY > rect.bottom + OUTER_PROXIMITY_PX
      ) {
        continue
      }

      const dx = Math.max(rect.left - lastX, 0, lastX - rect.right)
      const dy = Math.max(rect.top - lastY, 0, lastY - rect.bottom)
      const outerDistance = Math.hypot(dx, dy)
      if (outerDistance >= OUTER_PROXIMITY_PX) {
        continue
      }

      const outerT = 1 - outerDistance / OUTER_PROXIMITY_PX
      const borderIntensity = outerT * outerT

      element.style.setProperty('--lg-x', `${lastX - rect.left}px`)
      element.style.setProperty('--lg-y', `${lastY - rect.top}px`)
      element.style.setProperty('--lg-o', formatFactor(borderIntensity))
      nextActive.add(element)
    }

    activeElements.forEach((element) => {
      if (!nextActive.has(element)) {
        clearElement(element)
      }
    })
    nextActive.forEach((element) => activeElements.add(element))
  }

  const handlePointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return
    lastX = event.clientX
    lastY = event.clientY
    lastTarget = event.target
    if (!rafId) {
      rafId = window.requestAnimationFrame(flushFrame)
    }
  }

  const handlePointerLeave = () => {
    if (rafId) {
      window.cancelAnimationFrame(rafId)
      rafId = 0
    }
    clearAll()
  }

  document.addEventListener('pointermove', handlePointerMove, { passive: true })
  document.addEventListener('pointerleave', handlePointerLeave)
  window.addEventListener('blur', handlePointerLeave)

  return () => {
    if (rafId) {
      window.cancelAnimationFrame(rafId)
    }
    document.removeEventListener('pointermove', handlePointerMove)
    document.removeEventListener('pointerleave', handlePointerLeave)
    window.removeEventListener('blur', handlePointerLeave)
    clearAll()
  }
}
