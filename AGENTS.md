# Project Specific

## OVERVIEW

This project is named Check ETA. It is a React app that allows users to check the estimated time of arrival (ETA) for buses and MTR in Hong Kong.

## CONVENTIONS

- Write code that is short, obvious, and self-explanatory.
- Avoid tricky expressions and comments that simply explain what the code does.
- No cross-package relative imports: Use like `@/lib/auth` not `../../lib/auth/...` (they are defined in `compilerOptions.paths` in the `tsconfig.json` file).
- Adhere to the Google TypeScript Style Guide.
- Recommend existing libraries instead of custom solutions when available.
- Always use icons from `@phosphor-icons/react`.

## COMMANDS

### After Code Changes

Run these checks in order after every code change. Focus ONLY on errors directly related to your changes. Do NOT fix unrelated errors.

```bash
bunx tsc --noEmit                      # 1. type-check
bunx biome check --write <file_path>   # 2. lint + auto-fix + format
```

### Run Development Server

- NEVER execute development servers or long-running processes like `bun run dev` or `npm run start`. Instead, instruct the user to run these commands.

### Shadcn/ui

- shadcn/ui and some custom components are located in `@/components/ui`.
- Use shadcn skill when adding or modifying shadcn/ui components.

Query shadcn/ui component documentation from the command line:

```bash
bunx --bun shadcn@latest docs <component>   # Get component docs
bunx --bun shadcn@latest search <query>     # Search components
bunx --bun shadcn@latest add <component>    # Add a component
```

## TOOLCHAIN

- "@biomejs/biome": "2.5.13"
- "typescript": "^7.0.2"
- "@tanstack/react-query": "^5.101.0"
- "@tanstack/react-router": "latest"
- "react": "^19.2.7"
- "tailwindcss": "^4.3.0"
- "vite": "^8.1.3"
- "zod": "^4.4.3"
- "maplibre-gl": "^5.24.0"
