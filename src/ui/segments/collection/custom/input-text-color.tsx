export default function InputTextColor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="font-whisper flex flex-row items-center text-sm text-black">
      <div className="mr-2 block">Text</div>
      <label className="flex flex-row items-center border border-solid border-black px-2 py-1">
        <div className="mr-2">Color</div>
        <input
          className="h-6 w-6 rounded-full border border-solid border-black/50"
          type="color"
          onChange={(e) => onChange(e.target.value)}
          value={value}
        />
      </label>
    </div>
  );
}
