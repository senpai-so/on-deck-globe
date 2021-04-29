export const isServer = typeof window === 'undefined'
export const isDev =
  process.env.NODE_ENV === 'development' || !process.env.NODE_ENV

export const domain = getEnv('DOMAIN', 'ondeckglobe.com')
export const port = getEnv('PORT', '3000')
export const host = isDev ? `http://localhost:${port}` : `https://${domain}`

export const apiBaseUrl = `${host}/api`

export const api = {
  todo: `${apiBaseUrl}/todo`
}

export const fathomId = isDev ? null : process.env.NEXT_PUBLIC_FATHOM_ID

export const fathomConfig = fathomId
  ? {
      excludedDomains: ['localhost', 'localhost:3000']
    }
  : undefined

export const sessionSecret = getEnv('SESSION_SECRET', null)
export const sessionCookieName = getEnv('SESSION_COOKIE_NAME', 'on-deck-globe')

export const imageCDNHost = 'https://ssfy.io'

// ----------------------------------------------------------------------------

export function getEnv(
  key: string,
  defaultValue?: string,
  env = process.env
): string {
  const value = env[key]

  if (value !== undefined) {
    return value
  }

  if (defaultValue !== undefined) {
    return defaultValue
  }

  throw new Error(`Config error: missing required env variable "${key}"`)
}
