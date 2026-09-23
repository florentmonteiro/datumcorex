-- À exécuter dans Supabase > SQL Editor, après avoir créé l'utilisateur
-- (Authentication > Users > Add user).
-- Rôles possibles : 'utilisateur' (par défaut), 'concepteur', 'proprietaire'.
-- app_metadata n'est modifiable que par l'administrateur : c'est la bonne place pour un rôle.

update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role": "proprietaire"}'::jsonb
where email = 'prenom.nom@exemple.com';

-- Vérification
select email, raw_app_meta_data ->> 'role' as role from auth.users order by email;
