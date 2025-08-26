export default function CollectionDetailsCard({
  cell1,
  cell2,
  cell3,
  cell4,
  cell5,
  cell6,
}: {
  cell1: string;
  cell2: string;
  cell3: string;
  cell4: string;
  cell5: string;
  cell6: string;
}) {
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-4 p-6 bg-black/80 backdrop-blur-sm rounded-lg border border-white">
      {/* Row 1 */}
      <div className="text-center border-r border-b border-white/50 pb-2 pr-2">
        <div className="text-white text-base font-sans">{cell1}</div>
      </div>
      <div className="text-center border-r border-b border-white/50 pb-2 pr-2">
        <div className="text-white text-base font-sans">{cell2}</div>
      </div>
      <div className="text-center border-b border-white/50 pb-2">
        <div className="text-white text-base font-sans">{cell3}</div>
      </div>

      {/* Row 2 */}
      <div className="text-center border-r border-white/50 pr-2">
        <div className="text-white text-base font-sans">{cell4}</div>
      </div>
      <div className="text-center border-r border-white/50 pr-2">
        <div className="text-white text-base font-sans">{cell5}</div>
      </div>
      <div className="text-center">
        <div className="text-white text-base font-sans">{cell6}</div>
      </div>
    </div>
  );
}
