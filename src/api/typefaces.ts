import { typeface } from "@/types/typefaces";
import { typefaces } from "./query/typefaces";
import { sanityFetch, sanityFetchAll } from "./sanityFetch";

export async function getAllTypefaces(): Promise<typeface[]> {
  return sanityFetchAll<typeface>(typefaces);
}

export async function getTypefaceBySlug(
  slug: string
): Promise<typeface | null> {
  // Update the query to properly handle slug.current
  const query = `*[_type == "typefaces" && slug.current == $slug][0] {
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
    hlsMobileHeaderVideo,
    mobileHeaderVideo,
    introduction,
    isItAHangulCharacterSet,
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
    "videoImageMobile": videoImageMobile.asset->url,
    weightList,
    "muxDesktopVideo": muxDesktopVideo.asset->{
      _id,
      assetId,
      playbackId,
      status,
      data
    },
    "muxMobileVideo": muxMobileVideo.asset->{
      _id,
      assetId,
      playbackId,
      status,
      data
    },
    mobileHeaderVideo,
        headerVideo,
  }`;

  const result = await sanityFetch<typeface>(query, { slug });
  return result || null;
}

export async function getFeaturedTypefaces(
  limit: number = 6
): Promise<typeface[]> {
  const query = `*[_type == "typefaces" && featured == true][0...${limit}] ${typefaces.replace(
    '*[_type == "typefaces"][]',
    ""
  )}`;
  return sanityFetchAll<typeface>(query);
}
