export const isServer = typeof window === 'undefined'
export const isDev =
  process.env.NODE_ENV === 'development' || !process.env.NODE_ENV

export const domain = getEnv('DOMAIN', 'ondeckglobe.com')
export const port = getEnv('PORT', '3000')
export const host = isDev ? `http://localhost:${port}` : `https://${domain}`

export const googleMapsApiKey =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? null

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

export const imageCDNHost = 'https://ssfy.io'

export const signupLink =
  'https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Fpublish.twitter.com%2F&ref_src=twsrc%5Etfw&screen_name=ondeckglobe&text=%23MakeMePublic%20%F0%9F%93%A3%20I%20am%20going%20public%20on%20OnDeckGlobe.com%20with%20the%20On%20Deck%20Fellows.%20Join%20us%20on%20the%20globe!%20%20%23ondeck%20%23odf9%20%F0%9F%9A%80%F0%9F%9A%80%F0%9F%9A%80&tw_p=tweetbutton'

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

const defaultEnvValueForGoogle = isServer ? undefined : null

export const googleProjectId = getEnv(
  'GCLOUD_PROJECT',
  defaultEnvValueForGoogle
)

export const googleApplicationCredentials = getGoogleApplicationCredentials()

export const firebaseCollectionUsers = getEnv(
  'FIREBASE_COLLECTION_USERS',
  defaultEnvValueForGoogle
)

// this hack is necessary because vercel doesn't support secret files so we need to encode our google
// credentials a base64-encoded string of the JSON-ified content
function getGoogleApplicationCredentials() {
  if (!isServer) {
    return null
  }

  try {
    const googleApplicationCredentialsBase64 = getEnv(
      'GOOGLE_APPLICATION_CREDENTIALS',
      defaultEnvValueForGoogle
    )

    return JSON.parse(
      Buffer.from(googleApplicationCredentialsBase64, 'base64').toString()
    )
  } catch (err) {
    console.error(
      'Firebase config error: invalid "GOOGLE_APPLICATION_CREDENTIALS" should be base64-encoded JSON\n'
    )

    throw err
  }
}
