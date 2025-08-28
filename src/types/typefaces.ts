export type introduction = {
  _key: string;
  language: string;
  value: string;
};

export type muxVideosData = {
  aspect_ratio: string;
  created_at: number;
  duration: number;
  encoding_tier: string;
  id: string;
  ingest_type: string;
  master_access: string;
  max_resolution_tier: string;
  max_stored_frame_rate: number;
  max_stored_resolution: string;
  mp4_support: string;
  non_standard_input_reasons: { [key: string]: string };
  passthrough: string;
  playback_ids: string[];
  progress: { [key: string]: string };
  resolution_tier: string;
  static_renditions: { [key: string]: string };
  status: string;
  tracks: string[];
  upload_id: string;
  video_quality: string;
};

export type muxVideos = {
  _createdAt: string;
  _id: string;
  _originalId: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
  assetId: string;
  data: muxVideosData;
  playbackId: string;
  status: string;
  uploadId: string;
};

export type singleFont = {
  _key: string;
  _type: string;
  hasOpticalSize: boolean;
  hasSerif: boolean;
  hasSlant: boolean;
  hasWidth: boolean;
  has_MONO: boolean;
  has_STEN: boolean;
  inPackage: string;
  isItalic: boolean;
  weightName: string;
  weightValue: number;
};

export type singleWeight = {
  fullName: string;
  role: string;
  emailAddress: number;
  biography: string;
  twitter: string;
  portrait: string;
};

export type designers = {
  name: string;
  url: string;
};

export type typeface = {
  _id: string;
  name: string;
  color: string;
  category: string;
  axis: number;
  axisNames: string[];
  slug: string;
  description: string;
  pricePerFont: number;
  customFontPrice: number;
  variableFontPrice: number;
  hangulCharacterSet: number;
  hasHangul: boolean;
  has_MONO: boolean;
  has_SERF: boolean;
  has_STEN: boolean;
  has_italic: boolean;
  has_opsz: boolean;
  has_packages: boolean;
  has_slnt: boolean;
  has_wdth: boolean;

  // VIDEOS
  headerVideo: string;
  mobileHeaderVideo: string;
  hlsMobileHeaderVideo: string;
  muxDesktopVideo: muxVideos;
  muxMobileVideo: muxVideos;
  videoImageDesktop: string;
  videoImageMobile: string;

  // FONTS
  uprightTTFVar: string;
  varFont: string;

  introduction: introduction[];
  isItAHangulCharacterSet: boolean | null;
  specimen: string;
  seoImage: string;
  seoKeywords: string;
  seoTitle: string;
  singleFontList: singleFont[];
  supportedLanguages: string;
  thumbnailImage: string;
  totalGlyphs: number;
  trialFont: string;
  weightList: singleWeight[];
  designers: designers[];
};
