import AsideLinks from "@/ui/segments/global/footer/aside-links";
import Collections from "@/ui/segments/global/footer/collections";
import Infos from "@/ui/segments/global/footer/infos";
import Legal from "@/ui/segments/global/footer/legal";

export default function Footer() {
  return (
    <footer className="relative h-full w-full bg-black px-8 py-16 text-white">
      <div className="mx-auto h-full max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Company Info */}
          <Infos />

          {/* Collection Links */}
          <Collections />

          {/* Contact & Legal */}
          <AsideLinks />
        </div>

        <Legal />
      </div>
    </footer>
  );
}
