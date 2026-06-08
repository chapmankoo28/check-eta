# Project Specific

## OVERVIEW

This project is named Check ETA. It is a React app that allows users to check the estimated time of arrival (ETA) for buses and MTR in Hong Kong.

## CONVENTIONS

- Write code that is short, obvious, and self-explanatory.
- Avoid tricky expressions and comments that simply explain what the code does.
- No cross-package relative imports: Use like `@/lib/auth` not `../../lib/auth/...` (they are defined in `compilerOptions.paths` in the `tsconfig.json` file).
- When coding, adhere to the Google TypeScript Style Guide.
- Recommend existing libraries instead of custom solutions when available.
- Always use Kumo for UI components.
- Always use icons from @phosphor-icons/react

## COMMANDS

### After Code Changes

Run these checks in order after every code change. Focus ONLY on errors directly related to your changes. Do NOT fix unrelated errors.

```bash
bunx tsgo --noEmit    # 1. type-check (tsgo is used in this project)
bunx astro check       # 2. Astro validation
bunx biome check --write <file_path>   # 3. lint + auto-fix
bunx prettier --write <file_path>      # 4. format
```

### Run Development Server

- NEVER execute development servers or long-running processes like `bun run dev` or `npm run start`. Instead, instruct the user to run these commands.

### Kumo Docs

Query component documentation from the command line:

```bash
bunx @cloudflare/kumo ls          # List all components
bunx @cloudflare/kumo doc Button  # Get component docs
bunx @cloudflare/kumo docs        # Get all docs
```

## TOOLCHAIN

- "@biomejs/biome": "2.3.8"
- "@typescript/native-preview": "^7.0.0-dev.20260607.1"
- "astro": "^6.4.4"
- "@astrojs/react": "^5.0.7"
- "react": "^19.2.7"
- "tailwindcss": "^4.1.16"
- "@cloudflare/kumo": "^2.5.0" (Cloudflare's component library)
