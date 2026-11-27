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
import { motion, useReducedMotion } from 'motion/react'

const EASE_LIQUID = [0.22, 1, 0.36, 1] as const

export type AmbientBackdropPreset = 'home-0' | 'home-1' | 'default'

interface AmbientBackdropProps {
  preset?: AmbientBackdropPreset
}

export function AmbientBackdrop({ preset = 'default' }: AmbientBackdropProps) {
  const prefersReducedMotion = useReducedMotion()
  const isSecond = preset === 'home-1'
  const isDefault = preset === 'default'

  const primaryOffset = isSecond
    ? { x: '-32vw', y: '34vh', scale: 1.08, opacity: 0.85 }
    : isDefault
      ? { x: '-14vw', y: '8vh', scale: 1.02, opacity: 0.78 }
      : { x: '0vw', y: '0vh', scale: 1, opacity: 1 }

  const secondaryOffset = isSecond
    ? { x: '34vw', y: '-32vh', scale: 0.96, opacity: 0.9 }
    : isDefault
      ? { x: '12vw', y: '-10vh', scale: 0.98, opacity: 0.75 }
      : { x: '0vw', y: '0vh', scale: 1.04, opacity: 1 }

  return (
    <div
      aria-hidden='true'
      className='pointer-events-none fixed inset-0 z-0 overflow-hidden'
    >
      {/* Full-bleed architectural dot grid with subtle parallax */}
      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                y: isSecond ? -44 : isDefault ? -16 : 0,
                opacity: isSecond ? 0.28 : isDefault ? 0.24 : 0.36,
              }
        }
        transition={{ duration: 0.85, ease: EASE_LIQUID }}
        className='absolute -inset-y-16 inset-x-0 [background-image:radial-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:30px_30px] [mask-image:radial-gradient(88%_78%_at_50%_48%,#000_20%,transparent_98%)]'
      />

      {/* Primary diagonal silver ambient light */}
      <motion.div
        animate={prefersReducedMotion ? undefined : primaryOffset}
        transition={{ duration: 0.95, ease: EASE_LIQUID }}
        className='absolute -top-36 -right-24 h-[780px] w-[780px] rounded-full'
        style={{
          background:
            'radial-gradient(circle at center, rgba(228, 228, 238, 0.062) 0%, rgba(190, 200, 220, 0.025) 38%, transparent 72%)',
        }}
      />

      {/* Secondary counter-drifting cool silver glow */}
      <motion.div
        animate={prefersReducedMotion ? undefined : secondaryOffset}
        transition={{ duration: 1.05, ease: EASE_LIQUID }}
        className='absolute -bottom-44 -left-24 h-[680px] w-[680px] rounded-full'
        style={{
          background:
            'radial-gradient(circle at center, rgba(212, 220, 236, 0.048) 0%, rgba(160, 175, 200, 0.018) 42%, transparent 74%)',
        }}
      />

      {/* Restrained silver hairline diagonal beams */}
      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                x: isSecond ? '-6%' : isDefault ? '-2%' : '4%',
                y: isSecond ? '-8%' : isDefault ? '-3%' : '0%',
                rotate: isSecond ? -14 : -18,
              }
        }
        transition={{ duration: 0.95, ease: EASE_LIQUID }}
        className='absolute top-[18%] -left-1/4 h-[1px] w-[150%] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent'
      />
      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                x: isSecond ? '6%' : isDefault ? '2%' : '-4%',
                y: isSecond ? '6%' : isDefault ? '2%' : '0%',
                rotate: isSecond ? -14 : -18,
              }
        }
        transition={{ duration: 1.05, ease: EASE_LIQUID }}
        className='absolute top-[72%] -left-1/4 h-[1px] w-[150%] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent'
      />
    </div>
  )
}
