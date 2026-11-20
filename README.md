# ak-coding.de – Portfolio

An Angular portfolio website presenting my profile, skills, projects, references and contact details. The interface supports German and English and includes the portfolio authentication dialog used for protected live-demo access.

## Technology

- Angular 21
- TypeScript
- SCSS
- RxJS
- npm 11.6.2 (pinned in `package.json`)
- Roboto Mono, bundled locally through `@fontsource/roboto-mono`

## Requirements

- Node.js 22 (the CI workflow uses Node.js 22)
- npm 11.6.2

Check the installed versions:

```bash
node --version
npm --version
```

## Local development

Install the exact dependency versions from the lockfile:

```bash
npm ci
```

Start the Angular development server:

```bash
npm start
```

The development server opens at `http://localhost:4200/`. The Angular CLI proxy in `proxy.conf.json` forwards `/api/**` and `/permission-api/**` to the configured T-95 host. This proxy is intended for the developer's local environment; adjust it only when the development backend address or TLS setup changes.

Alternatively:

```bash
npx ng serve
```

## Build and tests

Create the production build:

```bash
npm run build
```

The repository currently has no configured Angular test target and no end-to-end test framework. The `test` npm script is therefore not yet usable; the automated GitHub Actions check currently verifies dependency installation and the production build.

The repository's GitHub Actions workflow installs dependencies with `npm ci` and runs the production build for pushes to `main`, `feature/**` and `deploy/**`, and pull requests targeting `main`.

## Application routes

| Route | Purpose |
|---|---|
| `/` | Portfolio homepage |
| `/legal-notice` | Legal notice |
| `/privacy-policy` | Privacy policy |
| `/activate/:uid/:token` | Account activation from the email link (confirmation in the shared authentication dialog) |
| `/password-reset/:uid/:token` | Password-reset confirmation in the shared authentication dialog |

The language preference is stored in browser local storage under `portfolio-lang`.

## Project structure

```text
src/
  app/
    layout/                 Header and footer
    shared/
      components/           Hero, profile, skills, projects, contact and dialogs
      pages/                Main page, legal notice, privacy policy and password reset
      services/             Authentication, demo launch, dialogs and translations
  index.html                Browser title and favicon reference
  styles.scss              Global styles
public/
  favicon.svg               Custom portfolio favicon
  img/                      Portfolio images and icons
docs/
  demo-launch-integration.md
```

## Authentication and live demos

The frontend communicates with the T95 backend through same-origin API paths:

- `/api/auth/` for CSRF, registration, login, logout, refresh, session status and demo assertions.
- `/permission-api/api/demo/` for the separate Permission Handler.

The frontend does not contain private signing keys. The backend issues short-lived assertions; the Permission Handler must validate them and enforce the actual project grant. The required server-side handler deployment, Nginx routing and protected-project proxy rules are documented as separate deployment work. A working frontend alone does not make a demo endpoint safe to expose.

See [the demo launch integration notes](docs/demo-launch-integration.md) and the backend's [Ed25519 handoff documentation](https://github.com/AkviS24/T95-Backend/blob/main/docs/ed25519-demo-handoff.md).

## Deployment

The repository does not currently define an independent production deployment command or Docker image. The intended hosting target is the T-95 host behind its central Nginx reverse proxy. Production deployment must follow the deployment branch and the current T-95 Administrator Handbook; do not expose project containers directly.

## Accessibility

Templates use semantic landmarks, meaningful image alternatives, accessible names for interactive controls and dialog/status semantics where needed. Accessibility should be checked manually with keyboard navigation and a screen reader in addition to the automated build.

## License

Personal portfolio project. No open-source license is currently declared.
