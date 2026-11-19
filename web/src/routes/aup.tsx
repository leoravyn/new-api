import { createFileRoute } from '@tanstack/react-router'

import { AcceptableUsePolicy } from '@/features/legal'

export const Route = createFileRoute('/aup')({
  component: AcceptableUsePolicy,
})
