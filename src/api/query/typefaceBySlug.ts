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
        "designers": designers[]->{
          ...,
          "portrait": portrait.asset->url
        }
}
`;
