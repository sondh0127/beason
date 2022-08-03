import type { Session } from 'next-auth'

export type SessionContextValue<R extends boolean = false> = R extends true
  ?
    | { data: Session; status: 'authenticated' }
    | { data: null; status: 'loading' }
  :
    | { data: Session; status: 'authenticated' }
    | { data: null; status: 'unauthenticated' | 'loading' }
