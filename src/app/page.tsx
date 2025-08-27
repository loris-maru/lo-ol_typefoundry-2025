import { getAllTypefaces } from "@/api/typefaces";

export default async function Home() {
  try {
    const typefaces = await getAllTypefaces();

    return (
      <main className="relative w-full">
        <div>Home page</div>
        <div className="flex flex-col gap-y-6">
          {typefaces.map((typeface) => (
            <div key={typeface.name}>{typeface.name}</div>
          ))}
        </div>
      </main>
    );
  } catch (error) {
    console.error("Failed to fetch typefaces:", error);
    return (
      <main className="relative w-full">
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Error Loading Typefaces
          </h1>
          <p className="text-gray-600 mt-2">
            Failed to load typeface data. Please try again later.
          </p>
        </div>
      </main>
    );
  }
}
