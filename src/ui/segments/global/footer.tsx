import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">lo-ol type</h3>
            <p className="text-gray-300 mb-4">
              Crafting modern, high-quality Hangul & Latin fonts to elevate your
              brand and projects.
            </p>
            <div className="text-sm text-gray-400">
              <p>Type foundry</p>
              <p>Switzerland – Korea</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Collections</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link
                  href="/collection/fuzar"
                  className="hover:text-white transition-colors"
                >
                  Fuzar
                </Link>
              </li>
              <li>
                <Link
                  href="/collection/kronik-grotesk"
                  className="hover:text-white transition-colors"
                >
                  Kronik Grotesk
                </Link>
              </li>
              <li>
                <Link
                  href="/collection/whisper-mono"
                  className="hover:text-white transition-colors"
                >
                  Whisper Mono
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/license"
                  className="hover:text-white transition-colors"
                >
                  License
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 lo-ol type. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
