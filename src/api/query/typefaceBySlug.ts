export const typefaceBySlugQuery = `
*[_type == "typefaces" && slug.current == $slug][0] {
        _id,
        name,
        "slug": slug.current,
        description,
        pricePerFont,
        customFontPrice,
        variableFontPrice,
        hangulCharacterSet,
        hasHangul,
        has_MONO,
        has_SERF,
        has_STEN,
        has_italic,
        has_opsz,
        has_packages,
        has_slnt,
        has_wdth,
        "headerVideo": headerVideo.asset->url,
        hlsMobileHeaderVideo,
        mobileHeaderVideo,
        introduction,
        isItAHangulCharacterSet,
        muxDesktopVideo,
        "specimen": pdfSpecimen.asset->url,
        "seoImage": seoImage.asset->url,
        seoKeywords,
        seoTitle,
        singleFontList,
        supportedLanguages,
        "thumbnailImage": thumbnailImage.asset->url,
        totalGlyphs,
        "trialFont": trialFontPackage.asset->url,
        "uprightTTFVar": uprightTTFVarFile.asset->url,
        "varFont": variableFontUpright.asset->url,
        "videoImageDesktop": videoImageDesktop.asset->url,
        "videoImageMobile": videoImageMobile.asset -> url,
        weightList,
}
`;

// In usage

// "use client";
// import { useSanity } from "@/hooks/useSanity";
// import { typefaceBySlugQuery } from "@/queries/typefaceBySlug";

// export default function Typeface({ slug }: { slug: string }) {
//   const { data, isLoading, error } = useSanity(
//     typefaceBySlugQuery,
//     { slug } // passed into $slug
//   );

//   if (isLoading) return <p>Loading…</p>;
//   if (error) return <p>Something went wrong</p>;

//   return <div>{data?.name}</div>;
// }
