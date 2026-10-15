import { useRef } from "react";
function label(key: string) {
  const names: Record<string, string> = {
    blocks: "Headings and text",
    arrays: "Lists and cards",
    values: "Images and links",
  };
  if (names[key]) return names[key];
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (letter) => letter.toUpperCase());
}
function empty(value: unknown): unknown {
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, empty(item)]),
    );
  if (typeof value === "boolean") return false;
  if (typeof value === "number") return 0;
  return "";
}
export default function ContentFields({
  value,
  onChange,
  path = "Content",
  template,
}: {
  value: unknown;
  onChange: (value: unknown) => void;
  path?: string;
  template?: unknown;
}) {
  const itemTemplate = useRef(
    Array.isArray(value)
      ? (value[0] ?? (Array.isArray(template) ? template[0] : undefined))
      : undefined,
  );
  if (Array.isArray(value))
    return (
      <fieldset className="border rounded p-4 space-y-4">
        <legend className="font-semibold px-2">{path}</legend>
        {value.map((item, index) => (
          <div key={index} className="border-b pb-4">
            <ContentFields
              value={item}
              template={Array.isArray(template) ? template[0] : undefined}
              onChange={(updated) =>
                onChange(
                  value.map((original, i) =>
                    i === index ? updated : original,
                  ),
                )
              }
              path={`${path} ${index + 1}`}
            />
            <button
              type="button"
              className="text-sm text-red-700 mt-2"
              onClick={() => onChange(value.filter((_, i) => i !== index))}
            >
              Remove item
            </button>
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-[#96790f]"
          onClick={() =>
            onChange([...value, empty(value[0] ?? itemTemplate.current ?? "")])
          }
        >
          Add item
        </button>
      </fieldset>
    );
  if (value && typeof value === "object")
    return (
      <fieldset className="space-y-4">
        <legend className="font-semibold mb-3">{path}</legend>
        {Object.entries(value).map(([key, item]) => (
          <ContentFields
            key={key}
            value={item}
            template={
              template && typeof template === "object"
                ? (template as Record<string, unknown>)[key]
                : undefined
            }
            path={label(key)}
            onChange={(updated) => onChange({ ...value, [key]: updated })}
          />
        ))}
      </fieldset>
    );
  return (
    <label className="block text-sm">
      {path}
      {typeof value === "boolean" ? (
        <input
          aria-label={path}
          type="checkbox"
          className="ml-3"
          checked={value}
          onChange={(event) => onChange(event.target.checked)}
        />
      ) : typeof value === "number" ? (
        <input
          aria-label={path}
          type="number"
          className="block w-full border rounded p-2 mt-1"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      ) : (
        <textarea
          aria-label={path}
          rows={String(value ?? "").length > 100 ? 4 : 2}
          className="block w-full border rounded p-2 mt-1"
          value={String(value ?? "")}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}
