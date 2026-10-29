import Dashboard from "./Dashboard";
import type { AdminPage } from "../types/admin";
import ContentFields from "./ContentFields";
import Users from "./Users";
import { useEffect, useState } from "react";
import { requireSupabase } from "../lib/supabase";

interface ContentRow {
  id: string;
  kind: string;
  slug: string;
  title: string;
  status: string;
  data: Record<string, unknown>;
  sort_order: number;
  updated_at?: string;
}
interface Submission {
  id: string;
  kind: string;
  status: string;
  data: Record<string, string>;
  created_at: string;
}
type Field = {
  key: string;
  label: string;
  type?: "textarea" | "checkbox" | "number" | "image" | "file" | "lines";
  required?: boolean;
};
const text = (
  key: string,
  label: string,
  type?: Field["type"],
  required = false,
): Field => ({ key, label, type, required });
const common = [text("img", "Image", "image")];
const definitions: Record<
  string,
  {
    kind: string;
    label: string;
    fields: Field[];
    defaults: Record<string, unknown>;
  }
> = {
  events: {
    kind: "event",
    label: "Events",
    fields: [
      text("date", "Display date", undefined, true),
      text("location", "Location", undefined, true),
      text("type", "Event type"),
      text("desc", "Description", "textarea"),
      text("speakers", "Speakers (one per line)", "lines"),
      text("registration", "Registration open", "checkbox"),
      text("past", "Past event", "checkbox"),
      text("capacity", "Capacity (0 = unlimited)", "number"),
      ...common,
    ],
    defaults: {
      date: "",
      location: "",
      type: "Forum",
      desc: "",
      speakers: [],
      registration: false,
      past: false,
      capacity: 0,
      img: "",
    },
  },
  programmes: {
    kind: "programme",
    label: "Programmes",
    fields: [text("description", "Description", "textarea", true)],
    defaults: { description: "" },
  },
  leadership: {
    kind: "leadership",
    label: "Leadership",
    fields: [
      text("position", "Position"),
      text("biography", "Biography", "textarea"),
      text("founder", "Founder profile", "checkbox"),
      ...common,
    ],
    defaults: {
      name: "",
      position: "",
      biography: "",
      founder: false,
      img: "",
    },
  },
  partners: {
    kind: "partner",
    label: "Partners",
    fields: [
      text("description", "Description", "textarea"),
      text("url", "Website"),
      ...common,
    ],
    defaults: { name: "", description: "", url: "", img: "" },
  },
  "website-pages": {
    kind: "page",
    label: "Website Pages",
    fields: [],
    defaults: {
      blocks: { heading: "", description: "", body: "" },
      arrays: {},
      values: { img: "" },
    },
  },
  settings: {
    kind: "settings",
    label: "Website Settings",
    fields: [
      text("name", "Site name", undefined, true),
      text("fullName", "Organisation full name"),
      text("shortName", "Organisation short name"),
      text("email", "General enquiries email", undefined, true),
      text("ceoEmail", "CEO email", undefined, true),
      text("phone", "Phone", undefined, true),
      text("address", "Address", "textarea"),
      text("tagline", "Tagline"),
      text("description", "Metadata description", "textarea"),
      text("headerLogo", "Header logo", "image"),
      text("footerLogo", "Footer logo", "image"),
      text("primaryLogo", "Primary logo", "image"),
      text("metadataImage", "Social preview image", "image"),
      text("adminUrl", "Administrator website URL"),
      text("twitter", "Twitter / X URL"),
      text("linkedin", "LinkedIn URL"),
      text("facebook", "Facebook URL"),
      text("instagram", "Instagram URL"),
    ],
    defaults: {
      name: "",
      fullName: "",
      shortName: "",
      email: "",
      ceoEmail: "",
      phone: "",
      address: "",
      tagline: "",
      description: "",
      headerLogo: "",
      footerLogo: "",
      primaryLogo: "",
      metadataImage: "",
      adminUrl: "",
      twitter: "",
      linkedin: "",
      facebook: "",
      instagram: "",
    },
  },
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
      date: new Date().toLocaleDateString("en-GB", {
        timeZone: "Africa/Lagos",
      }),
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
    fields: [text("album", "Album"), ...common],
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
};
const inputClass = "w-full border border-gray-300 rounded-lg p-3 text-sm";
const buttonClass =
  "rounded-lg bg-[#0d1e35] text-white px-4 py-2 text-sm disabled:opacity-50";
const errorMessage = (error: unknown) =>
  typeof error === "object" &&
  error &&
  "code" in error &&
  error.code === "23505"
    ? "message" in error &&
      String(error.message).includes("asgc_one_published_founder")
      ? "There is already a published founder profile."
      : "This URL name or published settings record already exists."
    : error instanceof Error
      ? error.message
      : typeof error === "object" && error && "message" in error
        ? String(error.message)
        : "The request failed. Please try again.";
const safeLink = (value: string) => /^(https?:\/\/|\/[^/])/.test(value);

export default function ConnectedSection({
  section,
  onNavigate,
}: {
  section: string;
  onNavigate: (section: AdminPage) => void;
}) {
  const [mediaKind, setMediaKind] = useState("media");
  const key = section === "media" ? mediaKind : section.replace(/-editor$/, "");
  const definition = definitions[key];
  const [rows, setRows] = useState<ContentRow[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [editing, setEditing] = useState<ContentRow | null>(null);
  const [search, setSearch] = useState("");
  const client = requireSupabase();

  useEffect(() => {
    let active = true;
    let revision = 0;
    setEditing(null);
    setLoading(true);
    setError("");
    setNotice("");
    setSearch("");
    const refresh = async () => {
      const current = ++revision;
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
      ]);
      if (!active || current !== revision) return;
      if (content.error || incoming.error)
        setError(errorMessage(content.error || incoming.error));
      else {
        setRows(content.data ?? []);
        setSubmissions(incoming.data ?? []);
        setError("");
      }
      setLoading(false);
    };
    void refresh();
    const channel = client
      .channel(`admin-${crypto.randomUUID()}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "asgc_content" },
        () => {
          void refresh();
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "asgc_submissions" },
        () => {
          void refresh();
        },
      );
    void client.auth
      .getSession()
      .then(async ({ data }) => {
        if (!active || !data.session) return;
        await client.realtime.setAuth(data.session.access_token);
        if (active) channel.subscribe();
      })
      .catch(() => {
        // Periodic refresh continues if the realtime connection is unavailable.
      });
    const focus = () => {
      void refresh();
    };
    window.addEventListener("focus", focus);
    const poll = window.setInterval(focus, 15000);
    return () => {
      active = false;
      clearInterval(poll);
      window.removeEventListener("focus", focus);
      void client.removeChannel(channel);
    };
  }, [client, key]);

  const mutate = async (
    operation: () => PromiseLike<{ error: unknown }>,
    done: () => void,
  ) => {
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const { error } = await operation();
      if (error) throw error;
      done();
      setNotice("Changes saved.");
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  };
  const remove = (table: string, id: string) => {
    if (!window.confirm("Delete this item permanently?")) return;
    void mutate(
      () => client.from(table).delete().eq("id", id).select("id").single(),
      () => {
        if (table === "asgc_content")
          setRows((previous) => previous.filter((row) => row.id !== id));
        else
          setSubmissions((previous) => previous.filter((row) => row.id !== id));
      },
    );
  };
  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing || !definition) return;
    const data = { ...editing.data };
    if (definition.kind === "event") {
      const capacity = Number(data.capacity || 0);
      if (!Number.isSafeInteger(capacity) || capacity < 0) {
        setError("Capacity must be a whole number of zero or more.");
        return;
      }
      data.capacity = capacity;
    }
    if (
      definition.kind === "photo" &&
      editing.status === "published" &&
      !String(data.img ?? "").trim()
    ) {
      setError("Upload a photo or provide its image URL before publishing.");
      return;
    }
    if (
      definition.kind === "settings" &&
      data.adminUrl &&
      !/^https:\/\//.test(String(data.adminUrl))
    ) {
      setError("Use an https:// address for the administrator website.");
      return;
    }

    if (definition.kind === "news") {
      const sections: { id: string; heading: string; paragraphs: string[] }[] =
        [];
      for (const line of String(data.body ?? "")
        .split(/\n+/)
        .filter(Boolean)) {
        if (line.startsWith("# "))
          sections.push({
            id: `section-${sections.length + 1}`,
            heading: line.slice(2),
            paragraphs: [],
          });
        else {
          if (!sections.length)
            sections.push({ id: "section-1", heading: "", paragraphs: [] });
          sections[sections.length - 1].paragraphs.push(line);
        }
      }
      data.sections = sections;
      data.readingMinutes = Math.max(
        1,
        Math.ceil(String(data.body ?? "").split(/\s+/).length / 200),
      );
    }
    if (definition.kind === "photo") data.caption = editing.title;
    if (["leadership", "partner"].includes(definition.kind))
      data.name = editing.title;
    for (const field of definition.fields)
      if (
        [
          "img",
          "file",
          "url",
          "adminUrl",
          "twitter",
          "linkedin",
          "facebook",
          "instagram",
          "headerLogo",
          "footerLogo",
          "primaryLogo",
          "metadataImage",
        ].includes(field.key) &&
        data[field.key] &&
        !safeLink(String(data[field.key]))
      ) {
        setError(
          "Image, file and website links must start with https://, http:// or /.",
        );
        return;
      }
    const row = {
      ...editing,
      data,
      ...(definition.kind === "settings"
        ? { status: "published", slug: "global" }
        : {}),
      updated_at: new Date().toISOString(),
    };
    void mutate(
      () =>
        client
          .from("asgc_content")
          .upsert(row, { onConflict: "id" })
          .select("id")
          .single(),
      () => {
        setRows((previous) => [
          row,
          ...previous.filter((item) => item.id !== row.id),
        ]);
        setEditing(null);
      },
    );
  };
  const upload = async (file: File, field: string) => {
    if (busy) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("Please choose a file smaller than 10 MB.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
      const { error } = await client.storage
        .from("asgc-assets")
        .upload(path, file, { upsert: false });
      if (error) throw error;
      const { data } = client.storage.from("asgc-assets").getPublicUrl(path);
      setEditing((previous) =>
        previous
          ? { ...previous, data: { ...previous.data, [field]: data.publicUrl } }
          : previous,
      );
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  };
  const uploadPhotos = async (fileList: FileList | null) => {
    const selected = Array.from(fileList ?? []);
    if (!selected.length || busy) return;

    const validFiles = selected.filter(
      (file) =>
        ["image/jpeg", "image/png", "image/webp"].includes(file.type) &&
        file.size <= 10 * 1024 * 1024,
    );
    const skippedCount = selected.length - validFiles.length;
    if (!validFiles.length) {
      setError("Choose JPEG, PNG or WebP images under 10 MB each.");
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");
    setUploadProgress(`Uploading 0 of ${validFiles.length} photos…`);
    let finished = 0;
    let nextIndex = 0;
    const firstSortOrder =
      Math.max(
        -1,
        ...rows
          .filter((row) => row.kind === "photo")
          .map((row) => row.sort_order),
      ) + 1;
    const addedRows: ContentRow[] = [];
    const failures: string[] = [];
    const uploadOne = async () => {
      while (nextIndex < validFiles.length) {
        const fileIndex = nextIndex++;
        const file = validFiles[fileIndex];
        let storagePath: string | undefined;
        try {
          const id = crypto.randomUUID();
          storagePath = `${id}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
          const { error: uploadError } = await client.storage
            .from("asgc-assets")
            .upload(storagePath, file, { upsert: false });
          if (uploadError) throw uploadError;

          const { data } = client.storage
            .from("asgc-assets")
            .getPublicUrl(storagePath);
          const title = file.name
            .replace(/\.[^.]+$/, "")
            .replace(/[_-]+/g, " ")
            .trim();
          const row: ContentRow = {
            id,
            kind: "photo",
            slug: `photo-${id}`,
            title: title || "ASGC Photo",
            status: "published",
            data: {
              img: data.publicUrl,
              caption: title || "ASGC Photo",
              album: "ASGC Gallery",
            },
            sort_order: firstSortOrder + fileIndex,
            updated_at: new Date().toISOString(),
          };
          const { error: insertError } = await client
            .from("asgc_content")
            .insert(row);
          if (insertError) throw insertError;
          addedRows.push(row);
        } catch (uploadError) {
          if (storagePath) {
            await client.storage.from("asgc-assets").remove([storagePath]);
          }
          failures.push(`${file.name}: ${errorMessage(uploadError)}`);
        } finally {
          finished++;
          setUploadProgress(`Uploading ${finished} of ${validFiles.length} photos…`);
        }
      }
    };

    try {
      await Promise.all(
        Array.from(
          { length: Math.min(4, validFiles.length) },
          () => uploadOne(),
        ),
      );
      if (addedRows.length) {
        setRows((previous) => [...addedRows, ...previous]);
        setNotice(`Added ${addedRows.length} photo(s) to the Media gallery.`);
      }
      if (failures.length || skippedCount) {
        const details = failures.slice(0, 3).join("; ");
        setError(
          `${failures.length} upload(s) failed and ${skippedCount} file(s) were skipped.` +
            (details ? ` ${details}` : " Choose JPEG, PNG or WebP images under 10 MB each."),
        );
      }
    } finally {
      setBusy(false);
      setUploadProgress("");
    }
  };
  const edit = (row: ContentRow) => {
    const data = { ...definition?.defaults, ...row.data };
    if (row.kind === "news" && !data.body)
      data.body = (
        (data.sections as { heading: string; paragraphs: string[] }[]) || []
      )
        .map((section) =>
          [section.heading ? "# " + section.heading : "", ...section.paragraphs]
            .filter(Boolean)
            .join("\n\n"),
        )
        .join("\n\n");
    setEditing({ ...row, data });
    setError("");
    setNotice("");
  };
  const incomingKind =
    section === "newsletter"
      ? "newsletter"
      : ["registrations", "event-registrations"].includes(section)
        ? "registration"
        : null;
  const incomingRows = submissions
    .map((row) =>
      row.kind === "registration"
        ? {
            ...row,
            data: {
              ...row.data,
              event:
                rows.find((item) => item.id === row.data.event_id)?.title ||
                row.data.event,
            },
          }
        : row,
    )
    .filter((row) =>
      incomingKind
        ? row.kind === incomingKind
        : ["contact", "partnership"].includes(row.kind),
    )
    .filter((row) =>
      JSON.stringify(row.data).toLowerCase().includes(search.toLowerCase()),
    );

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
        <Dashboard
          rows={rows}
          submissions={submissions}
          onNavigate={onNavigate}
        />
      ) : section === "users" ? (
        <Users />
      ) : definition ? (
        editing ? (
          <form
            onSubmit={save}
            className="bg-white rounded-xl p-6 space-y-5 max-w-3xl"
          >
            <h1 className="text-2xl font-bold">
              {rows.some((row) => row.id === editing.id) ? "Edit" : "Add"}{" "}
              {definition.label}
            </h1>
            <label className="block text-sm">
              {definition.kind === "leadership" || definition.kind === "partner"
                ? "Name"
                : definition.kind === "photo"
                  ? "Caption"
                  : definition.kind === "page"
                    ? "Page name"
                    : "Title"}
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
            {definition.kind === "page" && (
              <ContentFields
                value={{
                  blocks: editing.data.blocks ?? {},
                  arrays: editing.data.arrays ?? {},
                  values: editing.data.values ?? {},
                }}
                path="Page content"
                template={{ arrays: editing.data.arrayTemplates ?? {} }}
                onChange={(value) =>
                  setEditing({
                    ...editing,
                    data: {
                      ...editing.data,
                      ...(value as Record<string, unknown>),
                    },
                  })
                }
              />
            )}
            <label className="block text-sm">
              Temporary test data{" "}
              <input
                type="checkbox"
                checked={Boolean(editing.data.test_data)}
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    data: { ...editing.data, test_data: event.target.checked },
                  })
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
                    aria-label={field.label}
                    rows={field.key === "body" ? 12 : 4}
                    className={inputClass}
                    required={field.required}
                    value={
                      field.type === "lines"
                        ? ((editing.data[field.key] as string[]) || []).join(
                            "\n",
                          )
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
                    aria-label={field.label}
                    className={inputClass}
                    required={field.required}
                    type={
                      field.type === "number"
                        ? "number"
                        : ["email", "ceoEmail"].includes(field.key)
                          ? "email"
                          : "text"
                    }
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
                      const file = event.target.files?.[0];
                      if (file) void upload(file, field.key);
                    }}
                  />
                )}
              </label>
            ))}
            <label className="block text-sm">
              Status
              <select
                aria-label="Status"
                className={inputClass}
                value={editing.status}
                onChange={(event) =>
                  setEditing({ ...editing, status: event.target.value })
                }
              >
                {(definition.kind === "settings"
                  ? ["published"]
                  : ["draft", "published", "archived"]
                ).map((status) => (
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
              <div className="flex flex-wrap gap-2">
                {section === "media" && definition.kind === "photo" && (
                  <label className={`${buttonClass} cursor-pointer`}>
                    {busy ? "Uploading photos…" : "Upload photos"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      disabled={busy}
                      className="sr-only"
                      onChange={(event) => {
                        void uploadPhotos(event.target.files);
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>
                )}
                {(definition.kind !== "settings" ||
                  !rows.some((row) => row.kind === "settings")) && (
                <button
                  className={buttonClass}
                  onClick={() =>
                    edit({
                      id: crypto.randomUUID(),
                      kind: definition.kind,
                      slug: definition.kind === "settings" ? "global" : "",
                      title: "",
                      status: "draft",
                      data: { ...definition.defaults },
                      sort_order: 0,
                    })
                  }
                >
                  Add New
                </button>
                )}
              </div>
            </div>
            {uploadProgress && (
              <p role="status" className="mb-4 text-sm text-gray-600">
                {uploadProgress}
              </p>
            )}
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
                      <p className="text-xs text-gray-500">
                        {row.status}
                        {row.data.test_data ? " · Test data" : ""}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        disabled={busy}
                        onClick={() => edit(row)}
                        className={buttonClass}
                      >
                        Edit
                      </button>
                      {definition.kind !== "settings" && (
                        <button
                          disabled={busy}
                          className="text-sm text-red-700"
                          onClick={() => remove("asgc_content", row.id)}
                        >
                          Delete
                        </button>
                      )}
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
              : incomingKind === "registration"
                ? "Event Registrations"
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
                    {new Date(row.created_at).toLocaleString("en-GB", {
                      timeZone: "Africa/Lagos",
                    })}{" "}
                    · {row.kind}
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
                    .filter(
                      ([key]) =>
                        !["name", "email", "test_data", "event_id"].includes(
                          key,
                        ),
                    )
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
                      const status = event.target.value;
                      void mutate(
                        () =>
                          client
                            .from("asgc_submissions")
                            .update({ status })
                            .eq("id", row.id)
                            .select("id")
                            .single(),
                        () =>
                          setSubmissions((previous) =>
                            previous.map((item) =>
                              item.id === row.id ? { ...item, status } : item,
                            ),
                          ),
                      );
                    }}
                  >
                    {(row.kind === "newsletter"
                      ? ["unread", "active", "unsubscribed"]
                      : row.kind === "registration"
                        ? ["unread", "confirmed", "cancelled"]
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
  );
}
