export default function ImageUploadField({
  label,
  value,
  disabled,
  onChange,
  onUpload,
}: {
  label: string;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<string | null>;
}) {
  return (
    <div className="mt-2 space-y-2">
      {value && (
        <img
          src={value}
          alt={`${label} preview`}
          className="max-h-40 max-w-full rounded border object-contain"
        />
      )}
      <input
        aria-label={`Upload ${label}`}
        disabled={disabled}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="block text-sm"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file)
            void onUpload(file).then((url) => {
              if (url) onChange(url);
            });
        }}
      />
    </div>
  );
}
