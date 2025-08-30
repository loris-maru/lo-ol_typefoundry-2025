import { sanityServer } from "./sanity";

export async function testSanityConnection() {
  try {
    // Simple query to test connection
    const result = await sanityServer.fetch(
      '*[_type == "typefaces"][0..2] { _id, name, slug }',
    );
    console.log("✅ Sanity connection successful. Sample data:", result);
    return true;
  } catch (error) {
    console.error("❌ Sanity connection failed:", error);
    return false;
  }
}

export async function testTypefaceQuery(slug: string) {
  try {
    const query = `*[_type == "typefaces" && slug.current == $slug][0] { _id, name, slug }`;
    const result = await sanityServer.fetch(query, { slug });
    console.log(`Testing query for slug "${slug}":`, result);
    return result;
  } catch (error) {
    console.error(`Query failed for slug "${slug}":`, error);
    return null;
  }
}
