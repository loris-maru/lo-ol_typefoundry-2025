import { singleFont } from "@/types/typefaces";

export default function FontList({ singleFontList }: { singleFontList: singleFont[] }) {
  // Check if family has optical size or width variations
  const hasOpticalSize = singleFontList.some(font => font.hasOpticalSize);
  const hasWidth = singleFontList.some(font => font.hasWidth);
  
  // Group fonts by optical size (if family has opsz) or by width (if family has wdth)
  const groupedFonts = singleFontList.reduce((groups, font) => {
    let groupKey;
    
    if (hasOpticalSize && font.opticalSizeName) {
      groupKey = font.opticalSizeName;
    } else if (hasWidth && font.widthName) {
      groupKey = font.widthName;
    } else {
      groupKey = 'normal';
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    
    groups[groupKey].push(font);
    
    return groups;
  }, {} as Record<string, singleFont[]>);

  // Sort groups by optical size or width order
  const sortedGroups = Object.entries(groupedFonts).sort(([a], [b]) => {
    if (hasOpticalSize) {
      // Sort optical sizes: Display, Text, Caption, etc.
      const order = ['Display', 'Text', 'Caption', 'Micro'];
      const aIndex = order.indexOf(a);
      const bIndex = order.indexOf(b);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
    }
    if (hasWidth) {
      // Sort widths: Condensed, Normal, Extended, etc.
      const order = ['Condensed', 'Normal', 'Extended', 'Wide'];
      const aIndex = order.indexOf(a);
      const bIndex = order.indexOf(b);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
    }
    return a.localeCompare(b);
  });

  return (
    <div className="w-full">
      {sortedGroups.map(([groupName, fonts], groupIndex) => (
        <div key={groupIndex} className="mb-6">
          {/* Group header */}
          <div className="font-whisper text-xs font-medium text-white/60 uppercase tracking-wider mb-3 text-left">
            {groupName}
          </div>
          
          {/* Fonts in this group */}
          <div className="grid grid-cols-6 gap-3">
            {fonts.map((font, fontIndex) => {
              const getFontName = (font: singleFont) => {
                let name = font.weightName;
                if (font.opticalSizeName && font.opticalSizeName !== groupName) {
                  name += ` ${font.opticalSizeName}`;
                }
                if (font.widthName && font.widthName !== groupName) {
                  name += ` ${font.widthName}`;
                }
                return name;
              };

              const fontName = getFontName(font);
              const hasItalic = singleFontList.some(f => 
                f.weightName === font.weightName && 
                f.opticalSizeName === font.opticalSizeName && 
                f.widthName === font.widthName && 
                f.hasSlant
              );

              return (
                <div key={fontIndex} className="font-whisper text-sm font-normal text-white text-left">
                  <div className="flex flex-row gap-x-2 ">
                    <span className="block capitalize">{fontName}</span>
                    {font.isItalic && (
                      <span className="block">
                        italic
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
