export default function FontInfoPanel() {
  return (
    <div className="px-8 text-center">
      <h2 className="text-5xl font-black tracking-tight">Font Info</h2>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
        <div className="p-6 rounded-xl bg-white shadow-sm">
          <div className="text-xs uppercase tracking-wide text-neutral-500">
            Designer
          </div>
          <div className="mt-2 text-lg">Your Name</div>
        </div>
        <div className="p-6 rounded-xl bg-white shadow-sm">
          <div className="text-xs uppercase tracking-wide text-neutral-500">
            Release
          </div>
          <div className="mt-2 text-lg">2025</div>
        </div>
        <div className="p-6 rounded-xl bg-white shadow-sm">
          <div className="text-xs uppercase tracking-wide text-neutral-500">
            License
          </div>
          <div className="mt-2 text-lg">Desktop · Web · App</div>
        </div>
      </div>
    </div>
  );
}
