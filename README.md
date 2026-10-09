# Telepk

React + TypeScript + Vite project for Telepk.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Local Admin and Email Configuration

Copy `.env.example` to `.env.local` and set the admin email and password. The current local admin values are in the ignored `.env.local` file; replace them with your own values.

For customer signup email verification, create a Resend account, verify a sender domain, then set `RESEND_API_KEY` and `EMAIL_FROM` in `.env.local`. The OTP is sent only to the email entered during signup and is never returned to the browser. Restart `npm run dev` after editing environment values.

The email and admin endpoints are served by the Vite Node process for local development and preview. Audit events are currently held in that server process's memory, and orders/CRM records are stored in this browser's local storage. This workspace does not yet connect those datasets to PostgreSQL. A static `dist` deployment does not include the API endpoints; production hosting must provide persistent database-backed endpoints and environment variables.

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
