'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/** N'accepte qu'un chemin interne, pour éviter les redirections vers un site tiers. */
function safeNext(value: FormDataEntryValue | null) {
  const v = typeof value === 'string' ? value : ''
  return v.startsWith('/') && !v.startsWith('//') ? v : '/designer'
}

export async function signIn(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const next = safeNext(formData.get('next'))

  if (!email || !password) {
    redirect(`/login?error=missing&next=${encodeURIComponent(next)}`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect(`/login?error=invalid&next=${encodeURIComponent(next)}`)
  }
  redirect(next)
}
