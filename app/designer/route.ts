import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { roleOf } from '@/lib/roles'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const APP_FILE = path.join(process.cwd(), 'private', 'datum-core-x.html')
let cached: string | null = null

/**
 * Sert l'application DATUM CORE-X existante, uniquement à un utilisateur connecté.
 * Double contrôle : le proxy redirige déjà, mais la route revérifie elle-même
 * (une route ne doit jamais compter sur le seul proxy).
 */
export async function GET(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  cached ??= await readFile(APP_FILE, 'utf8')

  // Ajout non intrusif avant </body> : identité de session + bouton de déconnexion.
  // Le cœur de l'application n'est pas modifié.
  const session = JSON.stringify({ email: user.email, role: roleOf(user) }).replace(/</g, '\\u003c')
  const injection = `
<script>window.DATUM_SESSION = Object.freeze(${session});</script>
<form method="post" action="/auth/signout" id="datum-saas-signout"
  style="position:fixed;right:12px;bottom:12px;z-index:2147483000;margin:0">
  <button type="submit" title="Connecté : ${user.email?.replace(/[<>"&]/g, '') ?? ''}"
    style="font:500 12px 'IBM Plex Sans',system-ui,sans-serif;color:#12263F;background:#fff;
    border:1px solid #cfd6cd;border-radius:6px;padding:6px 10px;cursor:pointer;opacity:.85">
    Se déconnecter
  </button>
</form>
`
  const i = cached.lastIndexOf('</body>')
  const html = i === -1 ? cached + injection : cached.slice(0, i) + injection + cached.slice(i)

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
    },
  })
}
