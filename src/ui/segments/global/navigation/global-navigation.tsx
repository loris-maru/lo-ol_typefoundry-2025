'use client';

import { typeface } from '@/types/typefaces';
import CartButton from '@/ui/segments/global/navigation/cart-button';
import MenuButton from '@/ui/segments/global/navigation/menu-button';

export default function GlobalNavigation({ allTypefaces }: { allTypefaces: typeface[] }) {
  return (
    <>
      <MenuButton allTypefaces={allTypefaces} />
      <CartButton />
    </>
  );
}
