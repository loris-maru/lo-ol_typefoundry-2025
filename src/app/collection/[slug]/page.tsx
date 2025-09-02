import { getAllTypefaces, getTypefaceBySlug } from '@/api/typefaces';
import { PageProps } from '@/types/common';
import CollectionPage from '@/ui/segments/collection';
import Footer from '@/ui/segments/global/footer';
import { notFound } from 'next/navigation';

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
        <Footer />
      </main>
    );
  } catch (error) {
    console.error('Failed to fetch typeface:', error);
    return (
      <main className="relative w-full">
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600">Error Loading Typeface</h1>
          <p className="mt-2 text-gray-600">
            Failed to load typeface data. Please try again later.
          </p>
        </div>
        <Footer />
      </main>
    );
  }
}
