import type { TRPCClient, TRPCClientErrorLike, TRPCRequestOptions } from '@trpc/client'
import type { ProcedureRecord, inferHandlerInput, inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import type { InvalidateOptions, InvalidateQueryFilters, UseInfiniteQueryOptions, UseMutationOptions, UseQueryOptions } from 'vue-query'
import {
  useInfiniteQuery as __useInfiniteQuery,
  useMutation as __useMutation,
  useQuery as __useQuery,
  useQueryClient as __useQueryClient,
} from 'vue-query'
import type { MaybeRefDeep } from 'vue-query/lib/vuejs/types'
import type { router } from '~/server/trpc'

// interface TRouter extends AnyRouter {}
type TRouter = typeof router

type inferProcedures<
  TObj extends ProcedureRecord<any, any, any, any, any, any>,
  > = {
    [TPath in keyof TObj]: {
      input: inferProcedureInput<TObj[TPath]>
      output: inferProcedureOutput<TObj[TPath]>
    };
  }

type inferInfiniteQueryNames<
  TObj extends ProcedureRecord<any, any, any, any, any, any>,
  > = {
    [TPath in keyof TObj]: inferProcedureInput<TObj[TPath]> extends {
      cursor?: any
    }
      ? TPath
      : never;
  }[keyof TObj]

export function useClient(): TRPCClient<TRouter> {
  const { $client } = useNuxtApp()
  return $client
}

type TQueries = TRouter['_def']['queries']
type TMutations = TRouter['_def']['mutations']

type TQueryValues = inferProcedures<TQueries>
type TMutationValues = inferProcedures<TMutations>
type TInfiniteQueryNames = inferInfiniteQueryNames<TQueries>

type TError = TRPCClientErrorLike<TRouter>
export function useQuery<
  TPath extends keyof TQueryValues & string,
  TQueryFnData = TQueryValues[TPath]['output'],
  TData = TQueryValues[TPath]['output'],
  >(
  pathAndInput: [path: TPath, ...args: inferHandlerInput<TQueries[TPath]>],
  opts?: Omit<UseQueryOptions<TQueryFnData, TError, TData, [TPath, ...inferHandlerInput<TQueries[TPath]>]>, 'queryKey' | 'queryFn'> & { ssr?: boolean },
  trpcOptions?: TRPCRequestOptions,
) {
  const [path, input] = pathAndInput
  const { $client } = useNuxtApp()

  const query = __useQuery(
    [path, input],
    () => $client.query(...pathAndInput, trpcOptions),
    opts,
  )
  if (opts?.ssr) {
    onServerPrefetch(async () => {
      await query.suspense()
    })
  }
  return query
}
// inferHandlerInput<TMutations[TPath]>
export function useMutation<
  TPath extends keyof TMutationValues & string,
  TContext = unknown,
  >(
  // path: TPath | [TPath],
  path: TPath,
  opts?: Omit<UseMutationOptions<TMutationValues[TPath]['output'], TError, [...inferHandlerInput<TMutations[TPath]>], TContext>, 'mutationFn'>,
  trpcOptions?: TRPCRequestOptions,
) {
  const { $client } = useNuxtApp()

  return __useMutation((input) => {
    // const actualPath = Array.isArray(path) ? path[0] : path
    const pathAndInput = [path, ...input] as const
    return $client.mutation(...pathAndInput, trpcOptions)
  }, opts)
}

export function useInfiniteQuery<
  TPath extends TInfiniteQueryNames & string,
  TQueryFnData = TQueryValues[TPath]['output'],
  TData = TQueryValues[TPath]['output'],
  TInput = Omit<TQueryValues[TPath]['input'], 'cursor'>,
  >(
  pathAndInput: [path: TPath, input: TInput],
  opts?: Omit<UseInfiniteQueryOptions<TQueryFnData, TError, TData, [TPath, TInput]>, 'queryKey' | 'queryFn'> & { ssr?: boolean },
  trpcOptions?: TRPCRequestOptions,
) {
  const [path, input] = pathAndInput
  const { $client } = useNuxtApp()

  const query = __useInfiniteQuery(
    pathAndInput,
    ({ pageParam }) => {
      const actualInput = { ...(input ?? {}), cursor: pageParam }
      return $client.query(path, actualInput, trpcOptions)
    },
    opts,
  )

  if (opts?.ssr) {
    onServerPrefetch(async () => {
      await query.suspense()
    })
  }

  return query
}

export function useQueryClient(id?: string) {
  const client = __useQueryClient(id)
  return {
    invalidateQueries: async<
      TPath extends keyof TRouter['_def']['queries'] & string,
      TPageData extends TQueryValues[TPath]['output'],
      TInput extends inferProcedureInput<TQueries[TPath]>,
      >(
      pathAndInput?: [TPath, TInput?] | TPath,
      filters?: MaybeRefDeep<InvalidateQueryFilters<TPageData>>,
      options?: MaybeRefDeep<InvalidateOptions>,
    ) => {
      client.invalidateQueries(pathAndInput as any, filters, options)
    },
  }
}
