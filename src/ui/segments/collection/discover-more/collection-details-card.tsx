"use client";

export type CollectionDetailsCardProps = {
  cell1: string;
  cell2: string;
  cell3: string;
  cell4: string;
  cell5: string;
  cell6: string;
};

export default function CollectionDetailsCard({
  cell1,
  cell2,
  cell3,
  cell4,
  cell5,
  cell6,
}: CollectionDetailsCardProps) {
  return (
    <div className="grid grid-cols-3 grid-rows-2 w-[36vw] h-[80px] border border-white divide-x divide-y divide-white text-white">
      <div className="w-full h-full flex items-center px-3">{cell1}</div>
      <div className="w-full h-full flex items-center px-3">{cell2}</div>
      <div className="w-full h-full flex items-center px-3">{cell3}</div>
      <div className="w-full h-full flex items-center px-3">{cell4}</div>
      <div className="w-full h-full flex items-center px-3">{cell5}</div>
      <div className="w-full h-full flex items-center px-3">{cell6}</div>
    </div>
  );
}
