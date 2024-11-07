// NO FUNCIONA POR EL NOMBRE DEL ARCHIVO
// SOLO ES RESPALDO PARA VALIDACION LOCAL

import type { MiddlewareNext } from 'astro'
import { defineMiddleware } from 'astro:middleware'

const privateRoutes = ['/protected']

export const onRequest = defineMiddleware((context, next) => {
  const { url, request } = context

  const authHeaders = request.headers.get('authorization') ?? ''

  if (privateRoutes.includes(url.pathname)) {
    return checkLocalAuth(authHeaders, next)
  }
  next()
})

const checkLocalAuth = (authHeaders: string, next: MiddlewareNext) => {
  if (authHeaders) {
    const authValue = authHeaders.split(' ').at(-1) ?? 'user:pass'
    const decodedValue = atob(authValue).split(':')
    const [user, pass] = decodedValue
    if (user === 'admin' && pass === 'admin') {
      return next()
    }
  }

  return new Response('Auth necesaria', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic real="Secure Area"'
    }
  })
}
