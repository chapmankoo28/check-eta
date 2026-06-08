# Project Specific

## OVERVIEW

This project is named Check ETA. It is a React app that allows users to check the estimated time of arrival (ETA) for buses and MTR in Hong Kong.

## CONVENTIONS

- Write code that is short, obvious, and self-explanatory.
- Avoid tricky expressions and comments that simply explain what the code does.
- No cross-package relative imports: Use like `@/lib/auth` not `../../lib/auth/...` (they are defined in `compilerOptions.paths` in the `tsconfig.json` file).
- When coding, adhere to the Google TypeScript Style Guide.
- Recommend existing libraries instead of custom solutions when available.

### Shadcn/ui Components Specific

- shadcn/ui and some custom components are located in `@/components/ui`.
- Do not add `className` to icons inside shadcn/ui buttons; the component handles icon styling automatically.
- Never use size sm and xs like `size="sm"` or `text-xs`.

## COMMANDS

### Check For Errors

Focus ONLY on fixing errors directly related to your code changes. Do NOT attempt to fix unrelated errors in the codebase.

```bash
bunx tsgo --noEmit # since tsgo is used in this project
bunx astro check
bunx biome check --write <file_path>
```

### Format Code

Focus ONLY on formatting code directly related to your changes. Do NOT run format commands like `bun run format` or `bunx prettier --write .` for the entire codebase.

```bash
bunx prettier --write <file_path>
```

### Run Development Server

- NEVER execute development servers or long-running processes like `bun run dev` or `npm run start`. Instead, instruct the user to run these commands.

## TOOLCHAIN

- "@biomejs/biome": "2.3.8",
- "@typescript/native-preview": "^7.0.0-dev.20260607.1",
- "astro": "^6.4.4",
- "@astrojs/react": "^5.0.7",
- "react": "^19.2.7",
- "tailwindcss": "^4.1.16",
- "tldraw": "^4.1.2"
