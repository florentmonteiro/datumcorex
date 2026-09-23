import type { User } from '@supabase/supabase-js'

export type Role = 'utilisateur' | 'concepteur' | 'proprietaire'

/**
 * Le rôle est lu dans app_metadata, que seul un administrateur (ou le serveur)
 * peut écrire. JAMAIS dans user_metadata : l'utilisateur peut le modifier lui-même.
 * Par défaut : le rôle le plus restreint.
 */
export function roleOf(user: User): Role {
  const r = (user.app_metadata as Record<string, unknown> | undefined)?.role
  return r === 'concepteur' || r === 'proprietaire' ? r : 'utilisateur'
}
