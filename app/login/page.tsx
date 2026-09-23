import { signIn } from './actions'

const MESSAGES: Record<string, string> = {
  invalid: 'E-mail ou mot de passe incorrect. Vérifiez la saisie ou demandez un accès à votre administrateur.',
  missing: 'Renseignez votre e-mail et votre mot de passe.',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>
}) {
  const { error, next } = await searchParams
  const message = error ? MESSAGES[error] ?? MESSAGES.invalid : null

  return (
    <main className="login">
      <section className="login-brand" aria-hidden="true">
        <p className="wordmark">
          DATUM CORE<span className="wordmark-x">-X</span>
        </p>
        <p className="tagline">Du métier à SAP, sans ressaisie.</p>
        <svg className="structure" viewBox="0 0 320 180" role="img" aria-label="">
          <g className="links">
            <path d="M160 34 V62 M160 62 H70 V92 M160 62 H250 V92 M70 118 V140 M70 140 H30 V150 M70 140 H110 V150 M250 118 V150" />
          </g>
          <g className="nodes">
            <rect x="118" y="10" width="84" height="24" rx="4" />
            <rect x="28" y="92" width="84" height="26" rx="4" />
            <rect x="208" y="92" width="84" height="26" rx="4" className="accent" />
            <rect x="4" y="150" width="52" height="22" rx="4" />
            <rect x="84" y="150" width="52" height="22" rx="4" />
            <rect x="224" y="150" width="52" height="22" rx="4" />
          </g>
          <g className="labels">
            <text x="160" y="26">Société</text>
            <text x="70" y="109">Org. achat</text>
            <text x="250" y="109">Division</text>
            <text x="30" y="165">Magasin</text>
            <text x="110" y="165">Magasin</text>
            <text x="250" y="165">Entrepôt</text>
          </g>
        </svg>
      </section>

      <section className="login-panel">
        <form action={signIn} className="login-form">
          <h1>Connexion à votre espace</h1>

          {message && (
            <p className="login-error" role="alert">
              {message}
            </p>
          )}

          <input type="hidden" name="next" value={next ?? '/designer'} />

          <label htmlFor="email">Adresse e-mail</label>
          <input id="email" name="email" type="email" autoComplete="email" required autoFocus />

          <label htmlFor="password">Mot de passe</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />

          <button type="submit">Se connecter</button>

          <p className="login-note">Les accès sont créés par l’administrateur de votre projet.</p>
        </form>
      </section>
    </main>
  )
}
