import { useState } from "react";

import { FiPlus } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";

import { useCartStore } from "@/states/cart";
import { FontSettings, singleFont } from "@/types/typefaces";
import License from "@/ui/segments/collection/shop/license";
import Users from "@/ui/segments/collection/shop/users";
import { cn } from "@/utils/classNames";
import { generateCartKey } from "@/utils/generateCartKey";
import slugify from "@/utils/slugify";

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

  const { addToCart, removeFromCart, cart } = useCartStore();

  const { hasOpticalSize, hasSlant, hasWidth, isItalic } = settings;


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

  // Calculate dynamic price based on user count and license
  const calculatePrice = () => {
    let multiplier = 1;

    // User count multiplier
    if (users[1] >= 5 && users[1] <= 20) {
      multiplier *= 1.5;
    } else if (users[1] >= 21 && users[1] <= 100) {
      multiplier *= 2.5;
    }

    // License type multiplier
    if (license === "desktop & web") {
      multiplier *= 1.5;
    }

    return Math.round(price * multiplier);
  };

  const displayPrice = calculatePrice();

  const item = {
    _key: generateCartKey(familyName),
    fullName: itemFullName(),
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
    price: displayPrice,
  };

  // Check if item is already in cart by comparing properties, not the generated key
  const isInCart = cart.some(
    (cartItem) =>
      cartItem.family === familyName &&
      cartItem.weightName === content.weightName &&
      cartItem.widthName === content.widthName &&
      cartItem.opticalSizeName === content.opticalSizeName &&
      cartItem.slantName === content.slantName &&
      cartItem.isItalic === content.isItalic,
  );

  const handleCartAction = () => {
    if (isInCart) {
      // Find the cart item to remove using the same logic as isInCart
      const cartItem = cart.find(
        (cartItem) =>
          cartItem.family === familyName &&
          cartItem.weightName === content.weightName &&
          cartItem.weightValue === content.weightValue &&
          cartItem.widthName === content.widthName &&
          cartItem.opticalSizeName === content.opticalSizeName &&
          cartItem.slantName === content.slantName &&
          cartItem.isItalic === content.isItalic,
      );

      if (cartItem) {
        console.log("Removing cart item:", cartItem);
        removeFromCart(cartItem._key);
      } else {
        console.log("Cart item not found for removal");
      }
    } else {
      addToCart(item);
    }
  };

  return (
    <div className="relative flex w-full flex-row items-center justify-between text-white">
      <div className="flex flex-row text-3xl">
        <div
          className="relative w-[40vw] capitalize"
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
      <div className="font-whisper text-2xl font-medium">
        <div className="group relative">
          <button
            type="button"
            name="add-or-remove-from-the-cart"
            aria-label={
              isInCart ? `Remove ${itemFullName()} from cart` : `Add ${itemFullName()} to cart`
            }
            onClick={handleCartAction}
            disabled={!isInCart && !license}
            className={cn(
              "flex w-32 cursor-pointer items-center justify-between rounded-full border px-4 py-2 text-base transition-all duration-300 ease-in-out",
              isInCart
                ? "border-white bg-white text-black"
                : !license
                  ? "cursor-not-allowed border-neutral-500 text-neutral-500 opacity-50"
                  : "border-neutral-700 text-neutral-400 hover:border-white hover:text-white",
            )}
            style={{
              fontVariationSettings: `'wght' ${isHovered ? 900 : 400}`,
            }}
            onMouseOver={() => !isInCart && license && setIsHovered(true)}
            onFocus={() => !isInCart && license && setIsHovered(true)}
            onMouseOut={() => setIsHovered(false)}
            onBlur={() => setIsHovered(false)}
          >
            <div className="relative top-px">${displayPrice}</div>
            {isInCart ? (
              <RiDeleteBinLine className="h-5 w-5 text-red-500" />
            ) : (
              <FiPlus className="h-5 w-5" />
            )}
          </button>

          {/* Tooltip for disabled button - hover only */}
          {!isInCart && !license && (
            <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-44 -translate-x-3/4 transform rounded-lg bg-white px-3 py-2 text-center text-sm text-black opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <div>Please choose</div>
              <div>a license first</div>
              <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-4 border-r-4 border-l-4 border-transparent border-t-black"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
