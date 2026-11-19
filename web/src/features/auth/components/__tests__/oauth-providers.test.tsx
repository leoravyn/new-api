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
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { OAuthProviders } from '../oauth-providers'
import type { CustomOAuthProviderInfo, SystemStatus } from '../../types'

function createCustomProvider(
  overrides: Partial<CustomOAuthProviderInfo> = {}
): CustomOAuthProviderInfo {
  return {
    id: 1,
    name: 'Google',
    slug: 'google',
    icon: 'google',
    client_id: 'google-client-id',
    authorization_endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    scopes: 'openid profile email',
    ...overrides,
  }
}

describe('OAuthProviders', () => {
  it.each(['google', 'Google', ' GOOGLE '])(
    'renders the Google SVG icon for custom OAuth provider icon=%j',
    (icon) => {
      const status: SystemStatus = {
        custom_oauth_providers: [createCustomProvider({ icon })],
      }

      render(<OAuthProviders status={status} />)

      const button = screen.getByRole('button', { name: 'Continue with Google' })
      const svg = button.querySelector('svg')
      expect(svg).not.toBeNull()
      expect(svg).toHaveClass('h-4', 'w-4')
      expect(svg?.querySelectorAll('path').length).toBe(4)
    }
  )

  it('does not render a special Google icon on built-in OIDC button', () => {
    const status: SystemStatus = {
      oidc_enabled: true,
      oidc_display_name: 'Google',
    }

    render(<OAuthProviders status={status} />)

    const button = screen.getByRole('button', { name: 'Continue with Google' })
    expect(button.querySelector('svg')).toBeNull()
  })

  it('omits icon for custom OAuth providers without a mapped icon identifier', () => {
    const status: SystemStatus = {
      custom_oauth_providers: [
        createCustomProvider({ name: 'Keycloak', slug: 'keycloak', icon: 'keycloak' }),
      ],
    }

    render(<OAuthProviders status={status} />)

    const button = screen.getByRole('button', { name: 'Continue with Keycloak' })
    expect(button.querySelector('svg')).toBeNull()
  })
})
