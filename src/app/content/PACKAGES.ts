export type Package = {
  key: string;
  name: string;
  price: string;
  fonts: { weight: string; italic: string }[];
  videoBg: string;
};

export const PACKAGES: Package[] = [
  {
    key: 'S',
    name: 'Small',
    price: '$59',
    fonts: [
      { weight: 'Regular', italic: 'Regular Italic' },
      { weight: 'Bold', italic: 'Bold Italic' },
    ],
    videoBg:
      'https://player.vimeo.com/progressive_redirect/playback/1108969691/rendition/1440p/file.mp4?loc=external&log_user=0&signature=092023c86b728f8b5c502191d62b3e27d92d6596507089a7b18820097988c448', // You'll need to add these video files
  },
  {
    key: 'M',
    name: 'Medium',
    price: '$119',
    fonts: [
      { weight: 'Light', italic: 'Light Italic' },
      { weight: 'Regular', italic: 'Regular Italic' },
      { weight: 'Medium', italic: 'Medium Italic' },
      { weight: 'Bold', italic: 'Bold Italic' },
      { weight: 'ExtraBold', italic: 'ExtraBold Italic' },
    ],
    videoBg:
      'https://player.vimeo.com/progressive_redirect/playback/1108969691/rendition/1440p/file.mp4?loc=external&log_user=0&signature=092023c86b728f8b5c502191d62b3e27d92d6596507089a7b18820097988c448',
  },
  {
    key: 'L',
    name: 'Large',
    price: '$199',
    fonts: [
      { weight: 'Thin', italic: 'Thin Italic' },
      { weight: 'ExtraLight', italic: 'ExtraLight Italic' },
      { weight: 'Light', italic: 'Light Italic' },
      { weight: 'Regular', italic: 'Regular Italic' },
      { weight: 'Medium', italic: 'Medium Italic' },
      { weight: 'Semibold', italic: 'Semibold Italic' },
      { weight: 'Bold', italic: 'Bold Italic' },
      { weight: 'ExtraBold', italic: 'ExtraBold Italic' },
      { weight: 'Black', italic: 'Black Italic' },
    ],
    videoBg:
      'https://player.vimeo.com/progressive_redirect/playback/1108969691/rendition/1440p/file.mp4?loc=external&log_user=0&signature=092023c86b728f8b5c502191d62b3e27d92d6596507089a7b18820097988c448',
  },
];
