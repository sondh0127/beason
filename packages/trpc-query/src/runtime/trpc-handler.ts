import { resolveHTTPResponse } from '@trpc/server'
import { createURL } from 'ufo'
import type {
  AnyRouter,
  ProcedureType,
  ResponseMeta,
  TRPCError,
  inferRouterContext,
  inferRouterError,
} from '@trpc/server'
import type { TRPCResponse } from '@trpc/server/dist/declarations/src/rpc'
import type { CompatibilityEvent } from 'h3'
import { createContext, router } from '~/server/trpc'

interface Router extends AnyRouter {}
export interface ResponseMetaFnPayload<TRouter extends AnyRouter> {
  data: TRPCResponse<unknown, inferRouterError<TRouter>>[]
  ctx?: inferRouterContext<TRouter>
  paths?: string[]
  type: ProcedureType | 'unknown'
  errors: TRPCError[]
}

// @trpc/server/dist/declarations/src/http/internals/types.d.ts
export type ResponseMetaFn<TRouter extends AnyRouter> = (opts: ResponseMetaFnPayload<TRouter>) => ResponseMeta

export interface OnErrorPayload<TRouter extends AnyRouter> {
  error: TRPCError
  type: ProcedureType | 'unknown'
  path: string | undefined
  req: CompatibilityEvent['req']
  input: unknown
  ctx: undefined | inferRouterContext<TRouter>
}

// @trpc/server/dist/declarations/src/internals/onErrorFunction.d.ts
export type OnErrorFn<TRouter extends AnyRouter> = (opts: OnErrorPayload<TRouter>) => void

export default defineEventHandler(async (event) => {
  const { req, res } = event

  const $url = createURL(req.url!)
  const config = useRuntimeConfig().public.trpcQuery
  const { endpoint } = config

  // not found the usage yet
  const responseMeta: ResponseMetaFn<Router> | undefined = undefined
  const onError: OnErrorFn<Router> | undefined = undefined

  const httpResponse = await resolveHTTPResponse({
    router,
    req: {
      method: req.method!,
      headers: req.headers,
      body: isMethod(event, 'GET') ? null : await useBody(event),
      query: $url.searchParams,
    },
    path: $url.pathname.substring(endpoint.length + 1),
    createContext: async () => createContext?.(event),
    responseMeta,
    onError: (o) => {
      onError?.({
        ...o,
        req,
      })
    },
  })

  const { status, headers, body } = httpResponse
  res.statusCode = status

  headers && Object.keys(headers).forEach((key) => {
    res.setHeader(key, headers[key])
  })

  return body
})
