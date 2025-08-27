import { getAllTypefaces, getTypefaceBySlug } from "@/api/typefaces";
import CollectionPage from "@/ui/segments/collection";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  try {
    const { slug } = await params;
    const typeface = await getTypefaceBySlug(slug);
    const allTypefaces = await getAllTypefaces();

    if (!typeface) {
      notFound();
    }

    return (
      <main className="relative w-full">
        <CollectionPage content={typeface} allTypefaces={allTypefaces} />
      </main>
    );
  } catch (error) {
    console.error("Failed to fetch typeface:", error);
    return (
      <main className="relative w-full">
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Error Loading Typeface
          </h1>
          <p className="text-gray-600 mt-2">
            Failed to load typeface data. Please try again later.
          </p>
        </div>
      </main>
    );
  }
}
