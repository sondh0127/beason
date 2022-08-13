import {
  appendHeader,
  createApp,
  defineEventHandler,
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
  const { req, res } = event
  options.secret = options.secret ?? options.jwt?.secret ?? import.meta.env.VITE_NEXTAUTH_SECRET

  const session = await NextAuthHandler<Session>({
    req: {
      host: IMPORT_META_ENV.VITE_NEXTAUTH_URL,
      action: 'session',
      method: 'GET',
      cookies: useCookies(event),
      headers: req.headers,
    },
    options,
  })

  const { body, cookies, headers, redirect, status } = session

  if (body && Object.keys(body).length)
    return body as Session
  return null
})
