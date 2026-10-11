/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ATM_SUPABASE_URL?: string
  readonly VITE_ATM_SUPABASE_ANON_KEY?: string
  readonly VITE_ATM_APP_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'virtual:github-contributions' {
  const data: import('../plugins/githubContributions').Contributions | null
  export default data
}
