import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { supabaseEnv } from './env'

const PUBLIC_PATHS = ['/login', '/auth']

/** Rafraîchit la session à chaque requête et renvoie vers /login si personne n'est connecté. */
export async function updateSession(request: NextRequest) {
  const { url, key } = supabaseEnv()
  let response = NextResponse.next({ request })

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  // getUser() interroge Supabase : le jeton est vérifié, pas seulement décodé.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isPublic = PUBLIC_PATHS.some((p) => path === p || path.startsWith(p + '/'))

  if (!user && path.startsWith('/api/')) {
    return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
  }

  if (!user && !isPublic) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.search = ''
    loginUrl.searchParams.set('next', path)
    return NextResponse.redirect(loginUrl)
  }

  if (user && path === '/login') {
    const home = request.nextUrl.clone()
    home.pathname = '/designer'
    home.search = ''
    return NextResponse.redirect(home)
  }

  return response
}
