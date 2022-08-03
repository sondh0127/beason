import type { BuiltInProviderType, ProviderType } from 'next-auth/providers'

/**
 * Util type that matches some strings literally, but allows any other string as well.
 * @source https://github.com/microsoft/TypeScript/issues/29729#issuecomment-832522611
 */
export type LiteralUnion<T extends U, U = string> =
 | T
 | (U & Record<never, never>)

export interface SignInOptions extends Record<string, unknown> {
  /**
   * Defaults to the current URL.
   * @docs https://next-auth.js.org/getting-started/client#specifying-a-callbackurl
   */
  callbackUrl?: string
  /** @docs https://next-auth.js.org/getting-started/client#using-the-redirect-false-option */
  redirect?: boolean
}

/** Match `inputType` of `new URLSearchParams(inputType)` */
export type SignInAuthorizationParams =
  | string
  | string[][]
  | Record<string, string>
  | URLSearchParams

export interface SignInResponse {
  error: string | undefined
  status: number
  ok: boolean
  url: string | null
}

export interface ClientSafeProvider {
  id: LiteralUnion<BuiltInProviderType>
  name: string
  type: ProviderType
  signinUrl: string
  callbackUrl: string
}
