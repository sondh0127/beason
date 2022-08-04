import cookie from 'cookie'
import { createURL } from 'ufo'

export async function getServerSession(
  request: Request,
  options: NextAuthOptions,
): Promise<Session | null> {
  // options.secret = import.meta.env.VITE_NEXTAUTH_SECRET

  const session = await NextAuthHandler<Session>({
    req: {
      // host: import.meta.env.VITE_NEXTAUTH_URL,
      host: IMPORT_META_ENV.VITE_NEXTAUTH_URL,
      action: 'session',
      method: 'GET',
      cookies: cookie.parse(request.headers.get('cookie') ?? ''),
      headers: request.headers,
    },
    options,
  })

  // const { body, cookies } = session
  // // cookies?.forEach(cookie => setCookie(res, cookie))

  // if (body && Object.keys(body).length)
  //   return body as Session
  // return null
  return session
}

export default defineEventHandler(async (event) => {
  const { req, res } = event
  console.log('[LOG] ~ file: next-auth.ts ~ line 31 ~ req', req.url)

  const $url = createURL()
  // // const config = useRuntimeConfig().public.trpcQuery
  // // const { NEXTAUTH_URL } = config

  // const app = createApp()

  const stringBody = isMethod(req, 'GET') ? '' : await useBody(event)
  // const body = Object.fromEntries(new URLSearchParams(stringBody))
  const body = stringBody
  const endpoint = '/api/auth'

  const nextauth = $url.pathname.substring(endpoint.length).split('/')
  console.log('[LOG] ~ file: next-auth.ts ~ line 44 ~ nextauth', nextauth)
  // // options.secret = import.meta.env.VITE_NEXTAUTH_SECRET
  // options.secret = '4260a8a648e9cd8503485d46f93d1bd6'

  // const nextRequest: RequestInternal = {
  //   // host: import.meta.env.VITE_NEXTAUTH_URL,
  //   host: IMPORT_META_ENV.VITE_NEXTAUTH_URL,
  //   body,
  //   cookies: useCookies(event),
  //   query: useQuery(event),
  //   headers: req.headers,
  //   method: req.method,
  //   action: nextauth[1] as NextAuthAction,
  //   providerId: nextauth[2]?.split('?')[0],
  //   error: nextauth[2]?.split('?')[0],
  // }

  const session = await getServerSession(req, options)
  const {} = session

  // headers?.forEach((header) => {
  //   appendHeader(event, header.key, header.value)
  // })

  cookies?.forEach((cookie) => {
    setCookie(event, cookie.name, cookie.value, cookie.options)
  })

  return nextBody
})
