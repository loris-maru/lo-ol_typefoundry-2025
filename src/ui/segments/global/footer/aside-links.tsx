import Link from "next/link";

export default function AsideLinks() {
  return (
    <div>
      <h4 className="mb-4 text-lg font-semibold">Contact</h4>
      <ul className="space-y-2 text-gray-300">
        <li>
          <Link href="/about" className="transition-colors hover:text-white">
            About
          </Link>
        </li>
        <li>
          <Link href="/license" className="transition-colors hover:text-white">
            License
          </Link>
        </li>
        <li>
          <Link href="/contact" className="transition-colors hover:text-white">
            Contact
          </Link>
        </li>
      </ul>
    </div>
  );
}
