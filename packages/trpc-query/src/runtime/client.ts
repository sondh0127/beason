import type { TRPCClient, TRPCClientErrorLike, TRPCRequestOptions } from '@trpc/client'
import type { ProcedureRecord, inferHandlerInput, inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import type { Ref } from 'vue'
import type { UseInfiniteQueryOptions, UseMutationOptions, UseQueryOptions } from 'vue-query'
import {
  useInfiniteQuery as __useInfiniteQuery,
  useMutation as __useMutation,
  useQuery as __useQuery,
} from 'vue-query'
import type { router } from '~/server/trpc'

type MaybeRef<T> = T | Ref<T>

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
  opts?: Omit<UseQueryOptions<TQueryFnData, TError, TData, [TPath, TQueryValues[TPath]['input']]>, 'queryKey' | 'queryFn'> & { ssr?: boolean },
  trpcOptions?: TRPCRequestOptions,
) {
  const { $client } = useNuxtApp()

  // https://github.com/trpc/trpc/blob/main/packages/react/src/createReactQueryHooks.tsx#L296
  // const actualOpts = useSSRQueryOptionsIfNeeded(pathAndInput, opts);
  const query = __useQuery(
    pathAndInput,
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

export function useMutation<
  TPath extends keyof TMutationValues & string,
  TContext = unknown,
  >(
  path: TPath | [TPath],
  opts?: Omit<UseMutationOptions<TMutationValues[TPath]['output'], TError, TMutationValues[TPath]['input'], TContext>, 'mutationFn'>,
  trpcOptions?: TRPCRequestOptions,
) {
  const { $client } = useNuxtApp()

  return __useMutation((input) => {
    const actualPath = Array.isArray(path) ? path[0] : path
    return $client.mutation(actualPath, input, trpcOptions)
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
  // const { client, isPrepass, prefetchInfiniteQuery, queryClient }
  //   = useContext()
  const [path, input] = pathAndInput
  const { $client } = useNuxtApp()

  // if (
  //   typeof window === 'undefined'
  //   && isPrepass
  //   && opts?.ssr !== false
  //   && opts?.enabled !== false
  //   && !queryClient.getQueryCache().find(pathAndInput)
  // )
  //   prefetchInfiniteQuery(pathAndInput as any, opts as any)

  // const actualOpts = useSSRQueryOptionsIfNeeded(pathAndInput, opts)

  return __useInfiniteQuery(
    pathAndInput,
    ({ pageParam }) => {
      const actualInput = { ...(input ?? {}), cursor: pageParam }
      return $client.query(path, actualInput, trpcOptions)
    },
    opts,
  )
}
