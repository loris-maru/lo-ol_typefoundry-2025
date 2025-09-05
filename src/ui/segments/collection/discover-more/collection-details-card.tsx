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
    <div className="font-kronik grid h-[80px] w-[46vw] grid-cols-3 grid-rows-2 divide-x divide-y divide-white border border-white font-medium text-white">
      <div className="flex h-full w-full items-center px-3">{cell1}</div>
      <div className="flex h-full w-full items-center px-3">{cell2}</div>
      <div className="flex h-full w-full items-center px-3">{cell3}</div>
      <div className="flex h-full w-full items-center px-3">{cell4}</div>
      <div className="flex h-full w-full items-center px-3">{cell5}</div>
      <div className="flex h-full w-full items-center px-3">{cell6}</div>
    </div>
  );
}
