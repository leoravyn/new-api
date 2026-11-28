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

import { cn } from '@/lib/utils'

const EASE_LIQUID = [0.22, 1, 0.36, 1] as const

export type AmbientBackdropPreset = 'home-0' | 'home-1' | 'default' | 'console'

interface AmbientBackdropProps {
  preset?: AmbientBackdropPreset
  className?: string
}

export function AmbientBackdrop({
  preset = 'default',
  className,
}: AmbientBackdropProps) {
  const prefersReducedMotion = useReducedMotion()
  const isSecond = preset === 'home-1'
  const isDefault = preset === 'default'
  const isConsole = preset === 'console'

  const primaryOffset = isSecond
    ? { x: '-26vw', y: '28vh', scale: 1.08, rotate: -14, opacity: 0.92 }
    : isConsole
      ? { x: '-4vw', y: '0vh', scale: 0.98, rotate: -20, opacity: 0.78 }
      : isDefault
        ? { x: '-10vw', y: '6vh', scale: 1.02, rotate: -20, opacity: 0.84 }
        : { x: '0vw', y: '0vh', scale: 1, rotate: -22, opacity: 1 }

  const secondaryOffset = isSecond
    ? { x: '28vw', y: '-26vh', scale: 0.98, rotate: 12, opacity: 0.9 }
    : isConsole
      ? { x: '6vw', y: '2vh', scale: 0.98, rotate: 16, opacity: 0.74 }
      : isDefault
        ? { x: '10vw', y: '-6vh', scale: 1, rotate: 16, opacity: 0.8 }
        : { x: '0vw', y: '0vh', scale: 1.04, rotate: 16, opacity: 1 }

  const dotOpacity = isSecond
    ? 0.44
    : isConsole
      ? 0.42
      : isDefault
        ? 0.44
        : 0.5

  const beamScaleOpacity = isConsole ? 0.9 : 1

  return (
    <div
      aria-hidden='true'
      data-testid='ambient-backdrop'
      data-preset={preset}
      className={cn(
        'pointer-events-none fixed inset-0 z-0 overflow-hidden',
        className
      )}
    >
      {/* Full-bleed architectural dot matrix calibrated to preserve deep obsidian dark ground */}
      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                y: isSecond ? -48 : isConsole ? -10 : isDefault ? -16 : 0,
                opacity: dotOpacity,
              }
        }
        transition={{ duration: 0.85, ease: EASE_LIQUID }}
        className='absolute -inset-y-16 inset-x-0 [background-image:radial-gradient(rgba(255,255,255,0.24)_1px,transparent_1px)] [background-size:30px_30px] [mask-image:radial-gradient(108%_94%_at_50%_48%,rgba(0,0,0,0.48)_0%,#000_56%,transparent_100%)]'
      />

      {/* Soft mid-canvas optical plane so large central cards & console panels refract tonal depth */}
      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                opacity: isConsole ? 0.72 : 0.65,
                scale: isSecond ? 1.06 : 1,
              }
        }
        transition={{ duration: 1.0, ease: EASE_LIQUID }}
        className='absolute top-[36%] left-1/2 h-[540px] w-[1040px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl'
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(218, 218, 224, 0.042) 0%, rgba(182, 182, 188, 0.014) 48%, transparent 74%)',
        }}
      />

      {/* Restrained horizon silver optical wash */}
      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                x: isSecond ? '-4vw' : '0vw',
                y: isSecond ? '10vh' : isConsole ? '-2vh' : '0vh',
                opacity: isConsole ? 0.68 : 0.85,
              }
        }
        transition={{ duration: 1.05, ease: EASE_LIQUID }}
        className='absolute -top-20 left-1/2 h-[640px] w-[1120px] -translate-x-1/2 rounded-full'
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(228, 228, 232, 0.03) 0%, rgba(190, 190, 196, 0.01) 44%, transparent 72%)',
        }}
      />

      {/* Primary diagonal silver ambient light plane */}
      <motion.div
        animate={prefersReducedMotion ? undefined : primaryOffset}
        transition={{ duration: 0.95, ease: EASE_LIQUID }}
        className='absolute -top-24 -right-12 h-[500px] w-[820px] rounded-full blur-2xl'
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(235, 235, 240, 0.062) 0%, rgba(200, 200, 206, 0.024) 42%, transparent 74%)',
        }}
      />

      {/* Secondary counter-drifting silver glow */}
      <motion.div
        animate={prefersReducedMotion ? undefined : secondaryOffset}
        transition={{ duration: 1.05, ease: EASE_LIQUID }}
        className='absolute -bottom-28 -left-12 h-[460px] w-[760px] rounded-full blur-2xl'
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(222, 222, 228, 0.048) 0%, rgba(184, 184, 190, 0.018) 44%, transparent 74%)',
        }}
      />

      {/* Distant peripheral spatial depth arcs (clear of center copy & Hero SVG) */}
      <motion.svg
        viewBox='0 0 1600 900'
        preserveAspectRatio='xMidYMid slice'
        animate={
          prefersReducedMotion
            ? undefined
            : {
                opacity: isConsole ? 0.72 : 0.95,
              }
        }
        transition={{ duration: 0.9, ease: EASE_LIQUID }}
        className='absolute inset-0 size-full'
      >
        <defs>
          <linearGradient id='tokex-arc-top' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor='rgba(255,255,255,0)' />
            <stop offset='48%' stopColor='rgba(240,240,244,0.16)' />
            <stop offset='100%' stopColor='rgba(255,255,255,0)' />
          </linearGradient>
          <linearGradient
            id='tokex-arc-bottom'
            x1='0%'
            y1='100%'
            x2='100%'
            y2='0%'
          >
            <stop offset='0%' stopColor='rgba(255,255,255,0)' />
            <stop offset='52%' stopColor='rgba(226,226,232,0.13)' />
            <stop offset='100%' stopColor='rgba(255,255,255,0)' />
          </linearGradient>
        </defs>

        <motion.g
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  x: isSecond ? -42 : isConsole ? -12 : 0,
                  y: isSecond ? 28 : 0,
                  rotate: isSecond ? 7 : isConsole ? 2 : 0,
                }
          }
          transition={{ duration: 1.05, ease: EASE_LIQUID }}
          style={{ transformOrigin: '1460px -100px' }}
        >
          <circle
            cx='1460'
            cy='-100'
            r='690'
            fill='none'
            stroke='url(#tokex-arc-top)'
            strokeWidth='1'
          />
        </motion.g>

        <motion.g
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  x: isSecond ? 38 : isConsole ? 10 : 0,
                  y: isSecond ? -24 : 0,
                  rotate: isSecond ? -6 : isConsole ? -2 : 0,
                }
          }
          transition={{ duration: 1.05, ease: EASE_LIQUID }}
          style={{ transformOrigin: '130px 1020px' }}
        >
          <circle
            cx='130'
            cy='1020'
            r='640'
            fill='none'
            stroke='url(#tokex-arc-bottom)'
            strokeWidth='0.95'
          />
          <circle
            cx='130'
            cy='1020'
            r='760'
            fill='none'
            stroke='url(#tokex-arc-bottom)'
            strokeWidth='0.75'
            strokeDasharray='3 10'
            opacity='0.75'
          />
        </motion.g>
      </motion.svg>

      {/* Primary parallel silver hairline beam cluster */}
      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                x: isSecond ? '-7%' : isConsole ? '-2%' : isDefault ? '-3%' : '3%',
                y: isSecond ? '-7%' : isConsole ? '-1%' : isDefault ? '-2%' : '0%',
                rotate: isSecond ? -12 : -16,
                opacity: beamScaleOpacity,
              }
        }
        transition={{ duration: 0.95, ease: EASE_LIQUID }}
        className='absolute top-[16%] -left-1/4 h-[1px] w-[150%] overflow-hidden bg-gradient-to-r from-transparent via-white/[0.2] to-transparent'
      >
        {!prefersReducedMotion && (
          <motion.div
            animate={{ x: ['-15%', '115%'] }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              repeatDelay: 5.5,
              ease: 'easeInOut',
            }}
            className='h-full w-64 bg-gradient-to-r from-transparent via-white/[0.26] to-transparent'
          />
        )}
      </motion.div>

      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                x: isSecond ? '-4%' : isConsole ? '-1%' : isDefault ? '-2%' : '2%',
                y: isSecond ? '-5%' : 0,
                rotate: isSecond ? -12 : -16,
                opacity: beamScaleOpacity,
              }
        }
        transition={{ duration: 1.0, ease: EASE_LIQUID }}
        className='absolute top-[20.5%] -left-1/4 h-[1px] w-[150%] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent'
      />

      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                x: isSecond ? '7%' : isConsole ? '2%' : isDefault ? '3%' : '-3%',
                y: isSecond ? '6%' : isConsole ? '1%' : isDefault ? '2%' : '0%',
                rotate: isSecond ? -12 : -16,
                opacity: beamScaleOpacity,
              }
        }
        transition={{ duration: 1.05, ease: EASE_LIQUID }}
        className='absolute top-[78%] -left-1/4 h-[1px] w-[150%] overflow-hidden bg-gradient-to-r from-transparent via-white/[0.155] to-transparent'
      >
        {!prefersReducedMotion && (
          <motion.div
            animate={{ x: ['115%', '-15%'] }}
            transition={{
              duration: 6.5,
              repeat: Infinity,
              repeatDelay: 7,
              ease: 'easeInOut',
            }}
            className='h-full w-56 bg-gradient-to-r from-transparent via-white/[0.22] to-transparent'
          />
        )}
      </motion.div>

      {/* Asymmetric counter-angle architectural hairlines */}
      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                x: isSecond ? '6%' : isConsole ? '1%' : '0%',
                y: isSecond ? '-5%' : '0%',
                rotate: isSecond ? 16 : 13,
                opacity: beamScaleOpacity,
              }
        }
        transition={{ duration: 1.05, ease: EASE_LIQUID }}
        className='absolute top-[26%] -left-1/4 h-[1px] w-[150%] bg-gradient-to-r from-transparent via-white/[0.11] to-transparent'
      />
      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                x: isSecond ? '-5%' : isConsole ? '-1%' : '0%',
                y: isSecond ? '5%' : '0%',
                rotate: isSecond ? 16 : 13,
                opacity: beamScaleOpacity,
              }
        }
        transition={{ duration: 1.1, ease: EASE_LIQUID }}
        className='absolute top-[68%] -left-1/4 h-[1px] w-[150%] bg-gradient-to-r from-transparent via-white/[0.095] to-transparent'
      />

      {/* Mid-canvas asymmetric silver hairlines passing cleanly behind central panels */}
      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                x: isSecond ? '-3%' : isConsole ? '1.5%' : '0%',
                rotate: isSecond ? -9 : -11,
                opacity: isConsole ? 0.88 : 0.72,
              }
        }
        transition={{ duration: 1.05, ease: EASE_LIQUID }}
        className='absolute top-[41%] -left-1/4 h-[1px] w-[150%] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent'
      />
      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                x: isSecond ? '4%' : isConsole ? '-1.5%' : '0%',
                rotate: isSecond ? 11 : 9,
                opacity: isConsole ? 0.84 : 0.68,
              }
        }
        transition={{ duration: 1.1, ease: EASE_LIQUID }}
        className='absolute top-[55%] -left-1/4 h-[1px] w-[150%] bg-gradient-to-r from-transparent via-white/[0.095] to-transparent'
      />
    </div>
  )
}
