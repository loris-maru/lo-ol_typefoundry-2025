import { getAllTypefaces } from '@/api/typefaces';
import HomePage from '@/ui/segments/home';

export default async function Home() {
  try {
    const typefaces = await getAllTypefaces();

    return <HomePage typefaces={typefaces} />;
  } catch (error) {
    console.error('Failed to fetch typefaces:', error);
    return (
      <main className="relative w-full">
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600">Error Loading Typefaces</h1>
          <p className="mt-2 text-gray-600">
            Failed to load typeface data. Please try again later.
          </p>
        </div>
      </main>
    );
  }
}
