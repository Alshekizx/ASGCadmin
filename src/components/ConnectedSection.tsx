import { useEffect, useState } from "react"
import { requireSupabase } from "../lib/supabase"

interface ContentRow {
  id: string
  kind: string
  slug: string
  title: string
  status: string
  data: Record<string, unknown>
  sort_order: number
}
interface Submission {
  id: string
  kind: string
  status: string
  data: Record<string, string>
  created_at: string
}
type Field = {
  key: string
  label: string
  type?: "textarea" | "checkbox" | "number" | "image" | "file" | "lines"
  required?: boolean
}
const text = (
  key: string,
  label: string,
  type?: Field["type"],
  required = false,
): Field => ({ key, label, type, required })
const common = [text("img", "Image", "image")]
const definitions: Record<string, {
  kind: string
  label: string
  fields: Field[]
  defaults: Record<string, unknown>
}> = {
  news: {
    kind: "news",
    label: "News & Insights",
    fields: [
      text("category", "Category", undefined, true),
      text("date", "Display Date", undefined, true),
      text("author", "Author", undefined, true),
      text("excerpt", "Summary", "textarea", true),
      text(
        "body",
        "Article Body (paragraphs on separate lines; # for headings)",
        "textarea",
        true,
      ),
      text("featured", "Featured Story", "checkbox"),
      ...common,
    ],
    defaults: {
      category: "ASGC News",
      author: "ASGC Communications",
      date: new Date().toLocaleDateString("en-GB"),
      excerpt: "",
      body: "",
      featured: false,
      img: "",
    },
  },
  publications: {
    kind: "publication",
    label: "Publications",
    fields: [
      text("type", "Publication Type"),
      text("year", "Year"),
      text("author", "Author"),
      text("date", "Display Date"),
      text("summary", "Summary", "textarea"),
      text("pages", "Page Count"),
      ...common,
      text("file", "Publication PDF", "file"),
    ],
    defaults: {
      type: "Report",
      year: String(new Date().getFullYear()),
      author: "ASGC",
      date: "",
      summary: "",
      pages: "",
      img: "",
      file: "",
    },
  },
  media: {
    kind: "photo",
    label: "Photo Gallery",
    fields: [
      text("caption", "Caption", undefined, true),
      text("album", "Album"),
      ...common,
    ],
    defaults: { caption: "", album: "Events", img: "" },
  },
  video: {
    kind: "video",
    label: "Videos",
    fields: [
      text("url", "Video Link", undefined, true),
      text("description", "Description", "textarea"),
    ],
    defaults: { url: "", description: "" },
  },
  press: {
    kind: "press",
    label: "Press Releases",
    fields: [
      text("date", "Display Date"),
      text("excerpt", "Release", "textarea"),
      text("body", "Full Release", "textarea"),
    ],
    defaults: { date: "", excerpt: "", body: "" },
  },
  speech: {
    kind: "speech",
    label: "Speeches",
    fields: [
      text("date", "Display Date"),
      text("speaker", "Speaker"),
      text("event", "Event"),
      text("file", "Speech File", "file"),
    ],
    defaults: {
      date: "",
      speaker: "Ambassador Ahmed Sule",
      event: "",
      file: "",
    },
  },
  coverage: {
    kind: "coverage",
    label: "Media Coverage",
    fields: [
      text("date", "Display Date"),
      text("outlet", "Publication / Outlet"),
      text("url", "Article Link"),
    ],
    defaults: { date: "", outlet: "", url: "" },
  },
}
const inputClass = "w-full border border-gray-300 rounded-lg p-3 text-sm"
const buttonClass =
  "rounded-lg bg-[#0d1e35] text-white px-4 py-2 text-sm disabled:opacity-50"
const errorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : typeof error === "object" && error && "message" in error
      ? String(error.message)
      : "The request failed. Please try again."
const safeLink = (value: string) => /^(https?:\/\/|\/[^/])/.test(value)

export default function ConnectedSection({ section }: { section: string }) {
  const [mediaKind, setMediaKind] = useState("media")
  const key = section === "media" ? mediaKind : section.replace(/-editor$/, "")
  const definition = definitions[key]
  const [rows, setRows] = useState<ContentRow[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState<ContentRow | null>(null)
  const [search, setSearch] = useState("")
  const client = requireSupabase()

  useEffect(() => {
    let active = true
    let revision = 0
    setEditing(null)
    setLoading(true)
    setError("")
    setNotice("")
    setSearch("")
    const refresh = async () => {
      const current = ++revision
      const [content, incoming] = await Promise.all([
        client
          .from("asgc_content")
          .select("*")
          .order("sort_order")
          .order("updated_at", { ascending: false }),
        client
          .from("asgc_submissions")
          .select("*")
          .order("created_at", { ascending: false }),
      ])
      if (!active || current !== revision) return
      if (content.error || incoming.error)
        setError(errorMessage(content.error || incoming.error))
      else {
        setRows(content.data ?? [])
        setSubmissions(incoming.data ?? [])
        setError("")
      }
      setLoading(false)
    }
    void refresh()
    const channel = client
      .channel(`admin-${crypto.randomUUID()}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "asgc_content" },
        () => {
          void refresh()
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "asgc_submissions" },
        () => {
          void refresh()
        },
      )
    void client.auth.getSession().then(async ({ data }) => {
      if (!active || !data.session) return
      await client.realtime.setAuth(data.session.access_token)
      if (active) channel.subscribe()
    }).catch(() => {
      // Periodic refresh continues if the realtime connection is unavailable.
    })
    const focus = () => {
      void refresh()
    }
    window.addEventListener("focus", focus)
    const poll = window.setInterval(focus, 15000)
    return () => {
      active = false
      clearInterval(poll)
      window.removeEventListener("focus", focus)
      void client.removeChannel(channel)
    }
  }, [client, key])

  const mutate = async (
    operation: () => PromiseLike<{ error: unknown }>,
    done: () => void,
  ) => {
    if (busy) return
    setBusy(true)
    setError("")
    setNotice("")
    try {
      const { error } = await operation()
      if (error) throw error
      done()
      setNotice("Changes saved.")
    } catch (error) {
      setError(errorMessage(error))
    } finally {
      setBusy(false)
    }
  }
  const remove = (table: string, id: string) => {
    if (!window.confirm("Delete this item permanently?")) return
    void mutate(
      () => client.from(table).delete().eq("id", id),
      () => {
        if (table === "asgc_content")
          setRows((previous) => previous.filter((row) => row.id !== id))
        else
          setSubmissions((previous) => previous.filter((row) => row.id !== id))
      },
    )
  }
  const save = (event: React.FormEvent) => {
    event.preventDefault()
    if (!editing || !definition) return
    const data = { ...editing.data }
    if (definition.kind === "news") {
      const sections: { id: string; heading: string; paragraphs: string[] }[] = []
      for (const line of String(data.body ?? "")
        .split(/\n+/)
        .filter(Boolean)) {
        if (line.startsWith("# "))
          sections.push({
            id: `section-${sections.length + 1}`,
            heading: line.slice(2),
            paragraphs: [],
          })
        else {
          if (!sections.length)
            sections.push({ id: "section-1", heading: "", paragraphs: [] })
          sections[sections.length - 1].paragraphs.push(line)
        }
      }
      data.sections = sections
      data.readingMinutes = Math.max(
        1,
        Math.ceil(String(data.body ?? "").split(/\s+/).length / 200),
      )
    }
    if (definition.kind === "photo")
      data.caption = data.caption || editing.title
    for (const field of definition.fields)
      if (
        ["img", "file", "url"].includes(field.key) &&
        data[field.key] &&
        !safeLink(String(data[field.key]))
      ) {
        setError(
          "Image, file and website links must start with https://, http:// or /.",
        )
        return
      }
    const row = { ...editing, data, updated_at: new Date().toISOString() }
    void mutate(
      () => client.from("asgc_content").upsert(row, { onConflict: "id" }),
      () => {
        setRows((previous) => [
          row,
          ...previous.filter((item) => item.id !== row.id),
        ])
        setEditing(null)
      },
    )
  }
  const upload = async (file: File, field: string) => {
    if (busy) return
    if (file.size > 10 * 1024 * 1024) {
      setError("Please choose a file smaller than 10 MB.")
      return
    }
    setBusy(true)
    setError("")
    try {
      const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`
      const { error } = await client.storage
        .from("asgc-assets")
        .upload(path, file, { upsert: false })
      if (error) throw error
      const { data } = client.storage.from("asgc-assets").getPublicUrl(path)
      setEditing((previous) =>
        previous
          ? { ...previous, data: { ...previous.data, [field]: data.publicUrl } }
          : previous,
      )
    } catch (error) {
      setError(errorMessage(error))
    } finally {
      setBusy(false)
    }
  }
  const edit = (row: ContentRow) => {
    const data = { ...definition?.defaults, ...row.data }
    if (row.kind === "news" && !data.body)
      data.body = (
        data.sections as { heading: string; paragraphs: string[] }[] || []
      )
        .map((section) =>
          [section.heading ? "# " + section.heading : "", ...section.paragraphs]
            .filter(Boolean)
            .join("\n\n"),
        )
        .join("\n\n")
    setEditing({ ...row, data })
    setError("")
    setNotice("")
  }
  const incomingKind = section === "newsletter" ? "newsletter" : null
  const incomingRows = submissions
    .filter((row) =>
      incomingKind
        ? row.kind === incomingKind
        : ["contact", "partnership"].includes(row.kind),
    )
    .filter((row) =>
      JSON.stringify(row.data).toLowerCase().includes(search.toLowerCase()),
    )

  return (
    <section className="p-6 max-w-7xl mx-auto">
      {error && (
        <p role="alert" className="mb-4 rounded bg-red-50 text-red-700 p-4">
          {error}
        </p>
      )}
      {notice && (
        <p
          role="status"
          className="mb-4 rounded bg-green-50 text-green-800 p-4"
        >
          {notice}
        </p>
      )}
      {section === "media" && (
        <div className="flex flex-wrap gap-2 mb-5">
          {["media", "video", "press", "speech", "coverage"].map((kind) => (
            <button
              key={kind}
              className={buttonClass}
              onClick={() => setMediaKind(kind)}
            >
              {definitions[kind].label}
            </button>
          ))}
        </div>
      )}
      {loading ? (
        <p role="status">Loading…</p>
      ) : section === "dashboard" ? (
        <>
          <h1 className="text-2xl font-bold mb-6">ASGC Dashboard</h1>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              [
                "Published Content",
                rows.filter((row) => row.status === "published").length,
              ],
              [
                "Unread Enquiries",
                submissions.filter(
                  (row) =>
                    ["contact", "partnership"].includes(row.kind) &&
                    row.status === "unread",
                ).length,
              ],
              [
                "Publications",
                rows.filter((row) => row.kind === "publication").length,
              ],
              [
                "Subscribers",
                submissions.filter(
                  (row) =>
                    row.kind === "newsletter" && row.status !== "unsubscribed",
                ).length,
              ],
            ].map(([label, count]) => (
              <div key={label} className="bg-white rounded-xl p-6 border">
                <p className="text-3xl font-bold text-[#96790f]">{count}</p>
                <p className="text-sm mt-2">{label}</p>
              </div>
            ))}
          </div>
        </>
      ) : section === "users" ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Administrator Access</h1>
          <p>
            Administrator accounts are managed in Supabase Authentication. Only
            accounts approved in the ASGC administrator list can access this
            portal.
          </p>
        </>
      ) : definition ? (
        editing ? (
          <form
            onSubmit={save}
            className="bg-white rounded-xl p-6 space-y-5 max-w-3xl"
          >
            <h1 className="text-2xl font-bold">
              {editing.id ? "Edit" : "Add"} {definition.label}
            </h1>
            <label className="block text-sm">
              Title
              <input
                className={inputClass}
                required
                value={editing.title}
                onChange={(event) =>
                  setEditing({ ...editing, title: event.target.value })
                }
              />
            </label>
            <label className="block text-sm">
              {"URL Name"}
              <input
                className={inputClass}
                required
                pattern="[a-z0-9-]+"
                value={editing.slug}
                onChange={(event) =>
                  setEditing({ ...editing, slug: event.target.value })
                }
              />
            </label>
            {definition.fields.map((field) => (
              <label key={field.key} className="block text-sm">
                {field.label}
                {field.type === "checkbox" ? (
                  <input
                    type="checkbox"
                    className="ml-3"
                    checked={Boolean(editing.data[field.key])}
                    onChange={(event) =>
                      setEditing({
                        ...editing,
                        data: {
                          ...editing.data,
                          [field.key]: event.target.checked,
                        },
                      })
                    }
                  />
                ) : field.type === "textarea" || field.type === "lines" ? (
                  <textarea
                    rows={field.key === "body" ? 12 : 4}
                    className={inputClass}
                    required={field.required}
                    value={
                      field.type === "lines"
                        ? (editing.data[field.key] as string[] || []).join("\n")
                        : String(editing.data[field.key] ?? "")
                    }
                    onChange={(event) =>
                      setEditing({
                        ...editing,
                        data: {
                          ...editing.data,
                          [field.key]:
                            field.type === "lines"
                              ? event.target.value.split("\n")
                              : event.target.value,
                        },
                      })
                    }
                  />
                ) : (
                  <input
                    className={inputClass}
                    required={field.required}
                    type={field.type === "number" ? "number" : "text"}
                    value={String(editing.data[field.key] ?? "")}
                    onChange={(event) =>
                      setEditing({
                        ...editing,
                        data: {
                          ...editing.data,
                          [field.key]: event.target.value,
                        },
                      })
                    }
                  />
                )}
                {(field.type === "image" || field.type === "file") && (
                  <input
                    aria-label={`Upload ${field.label}`}
                    disabled={busy}
                    type="file"
                    accept={
                      field.type === "image"
                        ? "image/png,image/jpeg,image/webp"
                        : "application/pdf"
                    }
                    className="mt-2 block text-sm"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) void upload(file, field.key)
                    }}
                  />
                )}
              </label>
            ))}
            <label className="block text-sm">
              Status
              <select
                className={inputClass}
                value={editing.status}
                onChange={(event) =>
                  setEditing({ ...editing, status: event.target.value })
                }
              >
                {["draft", "published", "archived"].map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              Display Order
              <input
                type="number"
                className={inputClass}
                value={editing.sort_order}
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    sort_order: Number(event.target.value),
                  })
                }
              />
            </label>
            <div className="flex gap-3">
              <button type="submit" className={buttonClass} disabled={busy}>
                {busy ? "Saving…" : "Save Changes"}
              </button>
              <button
                type="button"
                disabled={busy}
                className="px-4 py-2"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex justify-between mb-6">
              <h1 className="text-2xl font-bold">{definition.label}</h1>
              <button
                className={buttonClass}
                onClick={() =>
                  edit({
                    id: crypto.randomUUID(),
                    kind: definition.kind,
                    slug: "",
                    title: "",
                    status: "draft",
                    data: { ...definition.defaults },
                    sort_order: 0,
                  })
                }
              >
                Add New
              </button>
            </div>
            <input
              aria-label="Search content"
              className={`${inputClass} mb-4`}
              placeholder="Search…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="space-y-3">
              {rows
                .filter(
                  (row) =>
                    row.kind === definition.kind &&
                    row.title.toLowerCase().includes(search.toLowerCase()),
                )
                .map((row) => (
                  <div
                    key={row.id}
                    className="bg-white rounded-xl border p-4 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div>
                      <p className="font-semibold">{row.title}</p>
                      <p className="text-xs text-gray-500">{row.status}</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        disabled={busy}
                        onClick={() => edit(row)}
                        className={buttonClass}
                      >
                        Edit
                      </button>
                      <button
                        disabled={busy}
                        className="text-sm text-red-700"
                        onClick={() => remove("asgc_content", row.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
            {!rows.some((row) => row.kind === definition.kind) && (
              <p className="text-gray-500 mt-6">
                No content yet. Add your first item.
              </p>
            )}
          </>
        )
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6">
            {incomingKind === "newsletter"
              ? "Newsletter Subscribers"
              : "Messages & Partnership Enquiries"}
          </h1>
          <input
            className={`${inputClass} mb-4`}
            aria-label="Search submissions"
            placeholder="Search…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {incomingRows.length === 0 && <p>No submissions yet.</p>}
          <div className="space-y-4">
            {incomingRows.map((row) => (
              <article key={row.id} className="bg-white border rounded-xl p-5">
                <div className="flex flex-wrap justify-between gap-3">
                  <h2 className="font-semibold">
                    {row.data.name || row.data.email}
                  </h2>
                  <span className="text-xs text-gray-500">
                    {new Date(row.created_at).toLocaleString("en-GB")} ·{" "}
                    {row.kind}
                  </span>
                </div>
                <a
                  className="text-sm text-[#96790f]"
                  href={`mailto:${row.data.email}`}
                >
                  {row.data.email}
                </a>
                <dl className="mt-4 space-y-2">
                  {Object.entries(row.data)
                    .filter(([key]) => !["name", "email"].includes(key))
                    .map(([key, value]) => (
                      <div key={key}>
                        <dt className="text-xs uppercase text-gray-500">
                          {key === "org"
                            ? "Organisation"
                            : key === "dept"
                              ? "Department"
                              : key}
                        </dt>
                        <dd className="text-sm whitespace-pre-wrap">{value}</dd>
                      </div>
                    ))}
                </dl>
                <div className="flex gap-4 mt-4">
                  <select
                    aria-label="Submission status"
                    className="border rounded p-2 text-sm"
                    disabled={busy}
                    value={row.status}
                    onChange={(event) => {
                      const status = event.target.value
                      void mutate(
                        () =>
                          client
                            .from("asgc_submissions")
                            .update({ status })
                            .eq("id", row.id),
                        () =>
                          setSubmissions((previous) =>
                            previous.map((item) =>
                              item.id === row.id ? { ...item, status } : item,
                            ),
                          ),
                      )
                    }}
                  >
                    {(row.kind === "newsletter"
                      ? ["unread", "active", "unsubscribed"]
                      : ["unread", "read", "archived"]
                    ).map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                  <button
                    className="text-red-700 text-sm"
                    disabled={busy}
                    onClick={() => remove("asgc_submissions", row.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
