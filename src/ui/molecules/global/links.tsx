import { cn } from "@/utils/classNames";
import Link from "next/link";

export type Link = {
  label: string;
  link: string;
  className?: string;
};

export function SmallLink({ link, label, className = "border-white" }: Link) {
  return (
    <Link
      className={cn(
        "font-whisper relative mt-2 px-8 py-2 border border-solid rounded-full text-base transition-colors duration-300 ease-in-out hover:bg-black hover:text-white",
        className
      )}
      href={link}
    >
      <span className="relative top-0.5 inline-block">{label}</span>
    </Link>
  );
}
export function MediumLink({ link, label }: Link) {
  return (
    <Link
      className="font-whisper relative mt-2 px-12 py-6 border border-solid border-white rounded-full text-2xl transition-colors duration-300 ease-in-out hover:bg-black hover:text-white"
      href={link}
    >
      <span className="relative top-0.5 inline-block">{label}</span>
    </Link>
  );
}
export function LargeLink({ link, label }: Link) {
  return (
    <Link
      className="font-whisper relative mt-2 px-16 py-8 border border-solid border-white rounded-full text-5xl transition-colors duration-300 ease-in-out hover:bg-black hover:text-white"
      href={link}
    >
      <span className="relative top-0.5 inline-block">{label}</span>
    </Link>
  );
}
