import Link from 'next/link';

export default function Collections() {
  return (
    <div>
      <h4 className="mb-4 text-lg font-semibold">Collections</h4>
      <ul className="space-y-2 text-gray-300">
        <li>
          <Link href="/collection/fuzar" className="transition-colors hover:text-white">
            Fuzar
          </Link>
        </li>
        <li>
          <Link href="/collection/kronik-grotesk" className="transition-colors hover:text-white">
            Kronik Grotesk
          </Link>
        </li>
        <li>
          <Link href="/collection/whisper-mono" className="transition-colors hover:text-white">
            Whisper Mono
          </Link>
        </li>
      </ul>
    </div>
  );
}
