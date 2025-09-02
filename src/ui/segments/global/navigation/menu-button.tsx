'use client';

import { useScrollBlock } from '@/hooks/useScrollBlock';
import { useCartStore } from '@/states/cart';
import { useMenuStore } from '@/states/menu';
import { typeface } from '@/types/typefaces';
import CollectionLink from '@/ui/molecules/global/collection-link';
import { MediumLink } from '@/ui/molecules/global/links';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import CloseButton from './close-button';

export default function MenuButton({ allTypefaces }: { allTypefaces: typeface[] }) {
  const { menuOpen, setMenuOpen } = useMenuStore();
  const [mouseY, setMouseY] = useState(0);
  const { cart } = useCartStore();

  // Block page scrolling when menu is open
  useScrollBlock(menuOpen);

  // Track mouse Y position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };

    if (menuOpen) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [menuOpen]);

  const handleMenuClick = () => {
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(false);
  };

  // Calculate position based on cart visibility
  const hasCartItems = cart.length > 0;
  const rightPosition = hasCartItems ? 'right-[62px]' : 'right-[30px]'; // 62px = 30px + 32px (cart button right-4 = 16px + 46px cart width)

  return (
    <motion.nav
      className={`fixed ${rightPosition} top-4 z-50`}
      animate={{
        width: menuOpen ? '100vw' : '46px',
        height: menuOpen ? '100vh' : '46px',
        right: menuOpen ? 0 : hasCartItems ? '75px' : '30px',
        top: menuOpen ? 0 : '16px',
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        zIndex: menuOpen ? 60 : 50, // Menu above shop when open
      }}
    >
      <motion.button
        onClick={handleMenuClick}
        className="flex h-full w-full items-center justify-center rounded-full bg-black text-white transition-colors duration-200 hover:bg-gray-800"
        animate={{
          borderRadius: menuOpen ? '0px' : '9999px',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {!menuOpen && <FiMenu className="h-5 w-5" />}
      </motion.button>

      {/* Menu Content - Only appears after expansion */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="absolute top-0 left-0 flex h-full w-full flex-row p-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            <div
              id="collection-links-list"
              className="relative flex w-3/4 flex-col gap-y-5 pr-8 text-xl text-white"
            >
              {allTypefaces.map((typeface: typeface) => (
                <div key={typeface.slug}>
                  <CollectionLink
                    link={`/collection/${typeface.slug}`}
                    label={typeface.name}
                    category={typeface.category}
                    fontsNumber={typeface.singleFontList.length}
                  />
                </div>
              ))}
              <div
                id="single-font-background-container"
                className="pointer-none: absolute -left-4 z-30 h-12 w-full rounded-full bg-white mix-blend-difference transition-transform duration-75 ease-out"
                style={{
                  transform: `translateY(${mouseY - 82}px)`, // Center the div on mouse Y position (24px = half of h-12)
                }}
              />
            </div>
            <div className="relative flex w-1/4 flex-col text-xl text-white">
              <MediumLink link="/about" label="About" />
              <MediumLink link="/license" label="License" />
              <MediumLink link="/the-lab" label="The Lab" />
              <MediumLink link="/hangeul" label="Hangeul" />
              <MediumLink link="/contact" label="Contact" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close Button for Menu - Positioned at same location as shop close button */}
      <AnimatePresence>
        {menuOpen && (
          <CloseButton
            onClick={handleClose}
            className="bg-transparent text-white hover:bg-gray-100"
            zIndex={70}
          />
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
