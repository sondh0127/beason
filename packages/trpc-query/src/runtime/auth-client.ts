import type { LoggerInstance } from 'next-auth'
import type { BuiltInProviderType, RedirectableProviderType } from 'next-auth/providers'
// import { proxyLogger } from 'next-auth/utils/logger'
import parseUrl from './parse-url'
import type { ClientSafeProvider, LiteralUnion, SignInAuthorizationParams, SignInOptions, SignInResponse } from './types'
import type { CtxOrReq, NextAuthClientConfig } from './_utils'
import { apiBaseUrl, fetchData } from './_utils'

// This behaviour mirrors the default behaviour for getting the site name that
// happens server side in server/index.js
// 1. An empty value is legitimate when the code is being invoked client side as
//    relative URLs are valid in that context and so defaults to empty.
// 2. When invoked server side the value is picked up from an environment
//    variable and defaults to 'http://localhost:3000'.

const processEnv = {
  NEXTAUTH_URL: 'http://localhost:3000/api/auth',
  VERCEL_URL: 'http://localhost:3000/api/auth',
  NEXTAUTH_URL_INTERNAL: 'http://localhost:3000/api/auth',

}
const __NEXTAUTH: NextAuthClientConfig = {
  baseUrl: parseUrl(processEnv.NEXTAUTH_URL ?? processEnv.VERCEL_URL).origin,
  basePath: parseUrl(processEnv.NEXTAUTH_URL).path,
  baseUrlServer: parseUrl(
    processEnv.NEXTAUTH_URL_INTERNAL
    ?? processEnv.NEXTAUTH_URL
    ?? processEnv.VERCEL_URL,
  ).origin,
  basePathServer: parseUrl(
    processEnv.NEXTAUTH_URL_INTERNAL ?? processEnv.NEXTAUTH_URL,
  ).path,
  _lastSync: 0,
  _session: undefined,
  _getSession: () => { },
}

// const logger = proxyLogger(_logger, __NEXTAUTH.basePath)
const logger = console as LoggerInstance

/**
 * Returns the current Cross Site Request Forgery Token (CSRF Token)
 * required to make POST requests (e.g. for signing in and signing out).
 * You likely only need to use this if you are not using the built-in
 * `signIn()` and `signOut()` methods.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#getcsrftoken)
 */
export async function getCsrfToken(params?: CtxOrReq) {
  const response = await fetchData<{ csrfToken: string }>(
    'csrf',
    __NEXTAUTH,
    logger,
    params,
  )
  return response?.csrfToken
}

/**
 * It calls `/api/auth/providers` and returns
 * a list of the currently configured authentication providers.
 * It can be useful if you are creating a dynamic custom sign in page.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#getproviders)
 */
export async function getProviders() {
  return await fetchData<
    Record<LiteralUnion<BuiltInProviderType>, ClientSafeProvider>
  >('providers', __NEXTAUTH, logger)
}

/**
 * Client-side method to initiate a signin flow
 * or send the user to the signin page listing all possible providers.
 * Automatically adds the CSRF token to the request.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#signin)
 */
export async function signIn<
  P extends RedirectableProviderType | undefined = undefined,
  >(
  provider?: LiteralUnion<
      P extends RedirectableProviderType
        ? P | BuiltInProviderType
        : BuiltInProviderType
    >,
  options?: SignInOptions,
  authorizationParams?: SignInAuthorizationParams,
): Promise<
  P extends RedirectableProviderType ? SignInResponse | undefined : undefined
> {
  const { callbackUrl = window.location.href, redirect = true } = options ?? {}

  const baseUrl = apiBaseUrl(__NEXTAUTH)
  const providers = await getProviders()
  console.log('[LOG] ~ file: auth-client.ts ~ line 96 ~ providers', providers)

  if (!providers) {
    window.location.href = `${baseUrl}/error`
    return
  }

  if (!provider || !(provider in providers)) {
    window.location.href = `${baseUrl}/signin?${new URLSearchParams({
      callbackUrl,
    })}`
    return
  }

  const isCredentials = providers[provider].type === 'credentials'
  const isEmail = providers[provider].type === 'email'
  const isSupportingReturn = isCredentials || isEmail

  const signInUrl = `${baseUrl}/${isCredentials ? 'callback' : 'signin'
    }/${provider}`

  const _signInUrl = `${signInUrl}?${new URLSearchParams(authorizationParams)}`
  console.log('[LOG] ~ file: auth-client.ts ~ line 117 ~ _signInUrl', _signInUrl)

  const res = await fetch(_signInUrl, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    // @ts-expect-error
    body: new URLSearchParams({
      ...options,
      csrfToken: await getCsrfToken(),
      callbackUrl,
      json: true,
    }),
  })

  const data = await res.json()

  // TODO: Do not redirect for Credentials and Email providers by default in next major
  if (redirect || !isSupportingReturn) {
    const url = data.url ?? callbackUrl
    window.location.href = url
    // If url contains a hash, the browser does not reload the page. We reload manually
    if (url.includes('#'))
      window.location.reload()
    return
  }

  const error = new URL(data.url).searchParams.get('error')

  if (res.ok)
    await __NEXTAUTH._getSession({ event: 'storage' })

  return {
    error,
    status: res.status,
    ok: res.ok,
    url: error ? null : data.url,
  } as any
}
