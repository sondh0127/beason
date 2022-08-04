import {
  appendHeader,
  createApp,
  sendRedirect,
  setCookie,
  useBody,
  useCookies,
  useQuery,
} from 'h3'
import type { NextAuthAction, NextAuthOptions, Session } from 'next-auth'
import type { RequestInternal } from 'next-auth/core'
import { NextAuthHandler } from 'next-auth/core'
import { createURL } from 'ufo'
import GithubProvider from 'next-auth/providers/github'
import cookie from 'cookie'
import { getServerSession } from './next-auth'

const options: NextAuthOptions = {
  providers: [
    GithubProvider.default({
      // clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
      // clientSecret: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
      clientId: '381722ffda6d5d24f6b5',
      clientSecret: 'f299271f4191972ee2f15dbef06071f5e4fb7da4',
    }),
  ],
}

const IMPORT_META_ENV = {
  VITE_NEXTAUTH_URL: 'http://localhost:3000',
  VITE_NEXTAUTH_SECRET: '4260a8a648e9cd8503485d46f93d1bd6',
}

const DATABASE_URL = 'sqlite://localhost/:memory:?synchronize=true'

export default defineEventHandler(async (event) => {
  // console.log('[LOG] ~ file: next-auth-session.ts ~ line 36 ~ event', event)
  const { req, res } = event
  // console.log('[LOG] ~ file: next-auth.ts ~ line 31 ~ req', req.url)

  // const $url = createURL(req.url!)
  // // // const config = useRuntimeConfig().public.trpcQuery
  // // // const { NEXTAUTH_URL } = config

  // // const app = createApp()

  // const stringBody = isMethod(req, 'GET') ? '' : await useBody(event)
  // // const body = Object.fromEntries(new URLSearchParams(stringBody))
  // const body = stringBody
  // const endpoint = '/api/auth'

  // const nextauth = $url.pathname.substring(endpoint.length).split('/')
  // console.log('[LOG] ~ file: next-auth.ts ~ line 44 ~ nextauth', nextauth)
  // // // options.secret = import.meta.env.VITE_NEXTAUTH_SECRET
  // // options.secret = '4260a8a648e9cd8503485d46f93d1bd6'

  const _session = await getServerSession(event, options)
  event.context.session = _session
  // const session = useState('session', () => _session)

  // res.statusCode = status

  // headers?.forEach((header) => {
  //   appendHeader(event, header.key, header.value)
  // })

  // cookies?.forEach((cookie) => {
  //   setCookie(event, cookie.name, cookie.value, cookie.options)
  // })

  // if (redirect) {
  //   if (body.json !== 'true')
  //     return sendRedirect(event, redirect)

  //   return {
  //     url: redirect,
  //   }
  // }
  // return nextBody
})