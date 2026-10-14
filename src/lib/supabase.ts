import { createClient } from "@supabase/supabase-js"

const url =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://szrrdgiivhfhvugemvfu.supabase.co"
const key =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_TUjsVuBDIR9NwRyt-9tbdw_u623eJSy"
export const supabase = url && key ? createClient(url, key) : null

export function requireSupabase() {
  if (!supabase)
    throw new Error(
      "Online services are unavailable. Please contact info@asgc.us.com.",
    )
  return supabase
}

export async function submitEnquiry(
  kind: "contact" | "partnership" | "newsletter",
  data: Record<string, string>,
) {
  const client = requireSupabase()
  const { error } = await client.from("asgc_submissions").insert({ kind, data })
  if (error)
    throw new Error(
      "Your submission could not be saved. Please try again or email info@asgc.us.com.",
    )
}
