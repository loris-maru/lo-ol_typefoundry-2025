import { useState } from "react";

import { useCartStore } from "@/states/cart";
import { FontSettings, singleFont } from "@/types/typefaces";
import License from "@/ui/segments/collection/shop/license";
import Users from "@/ui/segments/collection/shop/users";
import { generateCartKey } from "@/utils/generateCartKey";
import slugify from "@/utils/slugify";
import { FiPlus } from "react-icons/fi";

export default function SingleFontItem({
  content,
  settings,
  familyName,
  price,
}: {
  content: singleFont;
  settings: FontSettings;
  familyName: string;
  price: number;
}) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [license, setLicense] = useState<string>("");
  const [users, setUsers] = useState<[number, number]>([1, 1]);

  const { addToCart } = useCartStore();

  const { hasOpticalSize, hasSlant, hasWidth, isItalic } = settings;

  console.log("What are my settings? ", settings);

  const itemFullName = () => {
    let fullName = familyName;

    if (hasOpticalSize) {
      fullName += ` ${content.opticalSizeName}`;
    }

    if (hasSlant) {
      fullName += " Slanted";
    }

    if (hasWidth) {
      fullName += ` ${content.widthName}`;
    }

    fullName += ` ${content.weightName}`;

    if (isItalic) {
      fullName += " Italic";
    }

    return fullName;
  };

  //   WIDTH
  const widthValue = () => {
    if (hasWidth) {
      return content.widthValue;
    }
    return 900;
  };

  //   SLANT
  const slantValue = () => {
    if (hasSlant) {
      return content.slantValue;
    }
    return 0;
  };

  //   OPSZ
  const opszValue = () => {
    if (hasOpticalSize) {
      return content.opticalSizeValue;
    }
    return 100;
  };

  const item = {
    _key: generateCartKey(familyName),
    license: license,
    users: users,
    family: familyName,
    weightName: content.weightName,
    weightValue: content.weightValue,
    widthName: content.widthName,
    widthValue: content.widthValue,
    opticalSizeName: content.opticalSizeName,
    opticalSizeValue: content.opticalSizeValue,
    slantName: content.slantName,
    slantValue: content.slantValue,
    isItalic: content.isItalic,
    hasSerif: content.hasSerif,
    serifStyleValue: content.serifStyleValue,
    has_MONO: content.has_MONO,
    monoStyleName: content.monoStyleName,
    monoStyleValue: content.monoStyleValue,
    has_STEN: content.has_STEN,
    stencilStyleName: content.stencilStyleName,
    stencilStyleValue: content.stencilStyleValue,
    price: price,
  };

  return (
    <div className="relative w-full flex flex-row justify-between items-center text-white">
      <div className="flex flex-row text-3xl">
        <div
          className="relative w-[32vw] capitalize"
          style={{
            fontFamily: slugify(familyName),
            fontVariationSettings: `'wght' ${
              content.weightValue
            }, 'wdth' ${widthValue()}, 'slnt' ${slantValue()}, 'opsz' ${opszValue()}`,
          }}
        >
          {itemFullName()}
        </div>
        <div className="relative flex flex-row gap-x-3">
          <Users users={users} setUsers={setUsers} />
          <License license={license} setLicense={setLicense} />
        </div>
      </div>
      <div className="text-2xl font-medium font-whisper">
        <button
          type="button"
          name="add-to-cart"
          aria-label={`Add ${itemFullName()} to cart`}
          onClick={() => addToCart(item)}
          className="border border-neutral-700 rounded-full px-4 py-2 text-base flex items-center justify-between w-32 transition-all duration-300 ease-in-out hover:border-white hover:text-white"
          style={{
            fontVariationSettings: `'wght' ${isHovered ? 900 : 400}`,
          }}
          onMouseOver={() => setIsHovered(true)}
          onFocus={() => setIsHovered(true)}
          onMouseOut={() => setIsHovered(false)}
          onBlur={() => setIsHovered(false)}
        >
          <div className="relative top-px">${price}</div>
          <FiPlus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
