# Local Preview Notes

- Vendored replacements for `@supabase/supabase-js` and the `@types/*` packages remain in place so that we do not rely on sc
oped modules from npm.
- Removed the `autoprefixer` dependency and plugin from the PostCSS pipeline so the toolchain no longer needs that blocked pac
kage.
- Added support for `VITE_*` Supabase environment variables (mirrored into the `NEXT_PUBLIC_*` equivalents via `next.config.mj
s`) so the provided credentials work without renaming.
- `npm install` still fails before `node_modules` can be created because every request to `https://registry.npmjs.org/` (and ev
en mirror registries) now returns `403 Forbidden` starting with `clsx`. Until outbound registry access is restored, `npm run dev
` cannot be executed inside this environment.
