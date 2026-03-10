import { useEffect, useRef, useState } from "react";
import { categories } from "@/data/products";

const CategoryBar = ({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) => {
  const [isHiddenOnMobile, setIsHiddenOnMobile] = useState(false);
  const [barHeight, setBarHeight] = useState(0);
  const lastScrollY = useRef(0);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (barRef.current) {
        setBarHeight(barRef.current.offsetHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 640) {
        setIsHiddenOnMobile(false);
        lastScrollY.current = window.scrollY;
        return;
      }

      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (currentScrollY <= 140) {
        setIsHiddenOnMobile(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (Math.abs(delta) < 12) {
        lastScrollY.current = currentScrollY;
        return;
      }

      if (delta > 0) {
        setIsHiddenOnMobile(true);
      } else {
        setIsHiddenOnMobile(false);
      }

      lastScrollY.current = currentScrollY;
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={barRef}
      className={`sticky top-[7.25rem] sm:top-[8.25rem] z-30 bg-background border-b-[3px] border-border will-change-[transform,opacity,margin-bottom] transition-[transform,opacity,margin-bottom] duration-500 ease-out ${
        isHiddenOnMobile
          ? "-translate-y-full opacity-0 sm:translate-y-0 sm:opacity-100 pointer-events-none sm:pointer-events-auto"
          : "translate-y-0 opacity-100"
      }`}
      style={{
        marginBottom: isHiddenOnMobile ? `${-barHeight}px` : "0px",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div className="container">
        <div className="mx-auto max-w-[960px]">
          <div className="grid grid-cols-3 gap-x-3 gap-y-1 px-3 py-2 sm:flex sm:overflow-x-auto sm:gap-0 sm:px-10 sm:py-0 lg:px-14 scrollbar-hide">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                className={`flex min-w-0 items-center justify-center gap-1.5 px-2 py-3 font-pixel text-[13px] text-center transition-colors sm:min-w-max sm:flex-1 sm:gap-2 sm:px-4 sm:text-[16px] whitespace-nowrap border-b-[3px] ${
                  selected === cat.id
                    ? "text-pixel-pink border-pixel-pink"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
