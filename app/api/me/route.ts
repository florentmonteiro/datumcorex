import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { roleOf } from '@/lib/roles'

export const dynamic = 'force-dynamic'

/** Identité et rôle de l'utilisateur connecté (servira à l'étape 3 pour piloter les droits). */
export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
  return NextResponse.json(
    { email: user.email, role: roleOf(user) },
    { headers: { 'Cache-Control': 'private, no-store' } },
  )
}
