import type { TRPCClient, TRPCClientErrorLike, TRPCRequestOptions } from '@trpc/client'
import type { ProcedureRecord, inferHandlerInput, inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import type { Ref } from 'vue'
import type { UseMutationOptions, UseQueryOptions } from 'vue-query'
import {
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

export function useClient(): TRPCClient<TRouter> {
  const { $client } = useNuxtApp()
  return $client
}

type TQueries = TRouter['_def']['queries']

type TQueryValues = inferProcedures<TRouter['_def']['queries']>
type TMutationValues = inferProcedures<TRouter['_def']['mutations']>

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
