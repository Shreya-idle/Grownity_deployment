# CommunityConnect — Run locally

Quick steps to run this project on Windows (PowerShell).

Prerequisites

- Node.js (v18+ recommended)
- npm (comes with Node)

1. Install dependencies

```powershell
npm install
```

2. Development (recommended)

- Runs the Express server which embeds Vite in middleware mode (hot-reload for client)

```powershell
# PowerShell-safe way to run the dev server
# sets NODE_ENV for this session then runs tsx
$env:NODE_ENV = "development"
npm run dev
```

If you'd rather run the package.json script directly, we added `cross-env` so this should also work:

```powershell
npm run dev
```

3. Production build + start

```powershell
npm run build
$env:NODE_ENV = "production"
$env:PORT = "5000"
node dist/index.js
```

Environment variables

- PORT: the port the server listens on (defaults to 5000)
- NODE_ENV: development or production

Notes

- The server uses an in-memory storage by default, so no DB setup is required for basic testing.
- If you run into issues with environment variables on PowerShell, use the `$env:NAME = "value"` approach shown above.

Troubleshooting

- If `npm install` fails, please paste the error and I'll help debug.
- If `npm run dev` exits with a Vite error, share the terminal output; the server's Vite logger exits the process on critical vite errors.
