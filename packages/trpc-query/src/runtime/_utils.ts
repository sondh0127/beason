import type { IncomingMessage } from 'http'
import type { LoggerInstance, Session } from 'next-auth'

export interface NextAuthClientConfig {
  baseUrl: string
  basePath: string
  baseUrlServer: string
  basePathServer: string
  /** Stores last session response */
  _session?: Session | null | undefined
  /** Used for timestamp since last sycned (in seconds) */
  _lastSync: number
  /**
   * Stores the `SessionProvider`'s session update method to be able to
   * trigger session updates from places like `signIn` or `signOut`
   */
  _getSession: (...args: any[]) => any
}

export function apiBaseUrl(__NEXTAUTH: NextAuthClientConfig) {
  if (typeof window === 'undefined') {
    // Return absolute path when called server side
    return `${__NEXTAUTH.baseUrlServer}${__NEXTAUTH.basePathServer}`
  }
  // Return relative path when called client side
  return __NEXTAUTH.basePath
}

export interface CtxOrReq {
  req?: IncomingMessage
  ctx?: { req: IncomingMessage }
}

/**
 * If passed 'appContext' via getInitialProps() in _app.js
 * then get the req object from ctx and use that for the
 * req value to allow `fetchData` to
 * work seemlessly in getInitialProps() on server side
 * pages *and* in _app.js.
 */
export async function fetchData<T = any>(
  path: string,
  __NEXTAUTH: NextAuthClientConfig,
  logger?: LoggerInstance,
  { ctx, req = ctx?.req }: CtxOrReq = {},
): Promise<T | null> {
  const url = `${apiBaseUrl(__NEXTAUTH)}/${path}`
  try {
    const options = req?.headers.cookie
      ? { headers: { cookie: req.headers.cookie } }
      : {}
    const res = await fetch(url, options)
    const data = await res.json()
    if (!res.ok)
      throw data
    return Object.keys(data).length > 0 ? data : null // Return null if data empty
  }
  catch (error) {
    logger?.error('CLIENT_FETCH_ERROR', { error: error as Error, url })
    return null
  }
}
