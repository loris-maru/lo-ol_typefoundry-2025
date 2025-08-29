export default function License({
  license,
  setLicense,
}: {
  license: string;
  setLicense: (license: string) => void;
}) {
  return (
    <div className="flex flex-row items-center gap-x-3">
      <label className="font-whisper text-white text-base">License</label>
      <select
        name="license"
        id="license"
        value={license}
        onChange={(e) => setLicense(e.target.value)}
        className="text-white font-whisper text-base border border-solid border-gray-600 rounded-full px-3 py-2"
      >
        <option value="">Select license</option>
        <option value="web">Web</option>
        <option value="desktop">Desktop</option>
        <option value="web-desktop">Web + Desktop</option>
      </select>
    </div>
  );
}
