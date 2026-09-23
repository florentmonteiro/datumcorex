# DATUM CORE-X — SaaS, étape 1

Ton application actuelle (v17.59), en ligne, derrière une connexion.
Le fichier HTML n'est pas modifié : il est rangé dans `private/` et servi
uniquement à un utilisateur connecté, par la route `/designer`.

## Ce que fait ce squelette

| Élément | Rôle |
|---|---|
| `proxy.ts` | Toute page sans session renvoie vers `/login` |
| `app/login/` | Écran de connexion (e-mail + mot de passe) |
| `app/designer/route.ts` | Sert l'app après une 2ᵉ vérification de session ; ajoute `window.DATUM_SESSION` (e-mail, rôle) et un bouton « Se déconnecter » |
| `app/api/me` | Renvoie l'utilisateur et son rôle (prépare l'étape 3) |
| `lib/roles.ts` | Rôle lu dans `app_metadata` (non modifiable par l'utilisateur) |
| `next.config.ts` | En-têtes de sécurité (anti-iframe, HSTS…) |

## Mise en route pas à pas

### 1. Supabase (15 min)
1. Créer un compte sur supabase.com, puis **New project**, région **Europe (Frankfurt ou Paris)**.
2. **Authentication > Sign In / Providers** : laisser Email activé, **désactiver « Allow new users to sign up »** (en B2B, c'est toi qui crées les accès).
3. **Authentication > Users > Add user** : créer ton compte (cocher « Auto confirm »).
4. **SQL Editor** : exécuter `supabase/definir-role.sql` avec ton e-mail pour te donner le rôle `proprietaire`.
5. **Project Settings > API** : copier l'URL et la clé `anon` / `publishable`.

### 2. En local (10 min)
Prérequis : Node.js 20 ou plus.
```bash
cp .env.example .env.local      # puis coller l'URL et la clé anon
npm install
npm run dev
```
Ouvrir http://localhost:3000 → redirection vers la connexion → l'app s'ouvre.

### 3. GitHub (5 min)
Créer un dépôt **privé**, puis :
```bash
git init
git add .
git commit -m "Étape 1 : DATUM CORE-X derrière une connexion"
git branch -M main
git remote add origin https://github.com/<compte>/datum-core-x-saas.git
git push -u origin main
```
Vérifier que `.env.local` n'apparaît **pas** sur GitHub.

### 4. Vercel (10 min)
1. vercel.com > **Add New Project** > importer le dépôt.
2. **Environment Variables** : ajouter `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. **Settings > Functions** : région `cdg1` (Paris) ou `fra1`.
4. Déployer, puis dans Supabase > **Authentication > URL Configuration**, mettre l'adresse Vercel dans **Site URL**.

## Mettre à jour l'application
Remplacer `private/datum-core-x.html` par la nouvelle version (même nom de fichier),
commit, push : Vercel redéploie tout seul.

## Limites connues de l'étape 1 (traitées ensuite)
- Les cartes restent enregistrées dans le navigateur (localStorage / dossier DATUM/SAVE) → **étape 2** : table `maps` avec RLS.
- Les rôles de l'app sont encore choisis dans l'interface → **étape 3** : l'app lit `window.DATUM_SESSION.role` et l'API refuse les écritures non autorisées.
- Les imports Excel/JSON ne sont pas validés côté serveur → **étape 4**.

## Contrôles de sécurité déjà couverts
2 et 3 (aucune clé secrète côté navigateur), 4 (`.env` ignoré par Git), 7 (session en cookie httpOnly, pas en localStorage), 8 partiel (accès vérifié par le serveur).
