import {
  appendHeader,
  defineEventHandler,
  isMethod,
  sendRedirect,
  setCookie,
} from 'h3'
import type { NextAuthAction, NextAuthOptions } from 'next-auth'
import type { RequestInternal } from 'next-auth/core'
import { NextAuthHandler } from 'next-auth/core'
import { createURL } from 'ufo'

const IMPORT_META_ENV = {
  VITE_NEXTAUTH_URL: 'http://localhost:3000',
  VITE_NEXTAUTH_SECRET: '4260a8a648e9cd8503485d46f93d1bd6',
}

const DATABASE_URL = 'sqlite://localhost/:memory:?synchronize=true'

export function createNextAuthHandler(options: NextAuthOptions) {
  return defineEventHandler(async (event) => {
    const { req, res } = event

    const $url = createURL(req.url!)

    // // const { NEXTAUTH_URL } = config

    // const app = createApp()

    const stringBody = isMethod(req, 'GET') ? '' : await useBody(event)
    // const body = Object.fromEntries(new URLSearchParams(stringBody))
    const body = stringBody
    const endpoint = '/api/auth'

    const nextauth = $url.pathname.substring(endpoint.length).split('/')
    options.secret
    = options.secret ?? options.jwt?.secret ?? import.meta.env.VITE_NEXTAUTH_SECRET
    console.log('[LOG] ~ file: next-auth.ts ~ line 40 ~ options.secret', options.secret)

    const nextRequest: RequestInternal = {
      // host: import.meta.env.VITE_NEXTAUTH_URL,
      host: IMPORT_META_ENV.VITE_NEXTAUTH_URL,
      body,
      cookies: parseCookies(event),
      query: getQuery(event),
      headers: req.headers,
      method: req.method,
      action: nextauth[1] as NextAuthAction,
      providerId: nextauth[2]?.split('?')[0],
      error: nextauth[2]?.split('?')[0],
    }

    const {
      status = 200,
      headers,
      cookies,
      body: nextBody,
      redirect,
    } = await NextAuthHandler({
      req: nextRequest,
      options,
    })

    res.statusCode = status

    headers?.forEach((header) => {
      appendHeader(event, header.key, header.value)
    })

    cookies?.forEach((cookie) => {
      setCookie(event, cookie.name, cookie.value, cookie.options)
    })

    if (redirect) {
      if (body.json !== 'true')
        return sendRedirect(event, redirect)

      return {
        url: redirect,
      }
    }
    return nextBody
  })
}
