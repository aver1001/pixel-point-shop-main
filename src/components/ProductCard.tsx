import { useState } from "react";
import type { Product } from "@/data/products";

const ProductCard = ({
  product,
  index,
  onAddToCart,
  onOpenDetail,
}: {
  product: Product;
  index: number;
  onAddToCart: (product: Product) => void;
  onOpenDetail: (product: Product) => void;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;
  const openDetail = () => onOpenDetail(product);

  return (
    <div
      className="flex h-full flex-col bg-card border-[3px] border-border hover:border-pixel-pink transition-colors group"
      style={{
        opacity: 0,
        animation: `stagger-up 0.4s ease-out ${index * 0.1}s forwards`,
      }}
    >
      <button type="button" className="flex flex-1 flex-col text-left" onClick={openDetail}>
        {/* Tags */}
        <div className="relative">
          <div className="absolute top-0 left-0 z-10 flex gap-0">
            {product.isHot && (
              <span className="bg-pixel-pink text-card font-pixel text-[10px] px-2 py-0.5">
                HOT
              </span>
            )}
            {product.isNew && (
              <span className="bg-pixel-yellow text-card font-pixel text-[10px] px-2 py-0.5">
                NEW
              </span>
            )}
            {product.isLimited && (
              <span className="bg-accent text-accent-foreground font-pixel text-[10px] px-2 py-0.5" style={{ animation: 'bounce-subtle 2s ease-in-out infinite' }}>
                한정판
              </span>
            )}
          </div>

          {/* Image */}
          <div className="aspect-square bg-deep-void flex items-center justify-center overflow-hidden p-3">
            <img
              src={product.image}
              alt={product.nameKo}
              className={`w-full h-full object-contain transition-all duration-700 group-hover:scale-110 ${
                imageLoaded ? "opacity-100" : "opacity-0 blur-md"
              }`}
              style={{ imageRendering: "auto" }}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-deep-void flex items-center justify-center">
                <span className="font-pixel text-[12px] text-muted-foreground animate-pulse">
                  LOADING...
                </span>
              </div>
            )}
          </div>

          {/* Stock Warning */}
          {product.stock <= 5 && (
            <div className="absolute bottom-0 left-0 right-0 bg-pixel-yellow/90 px-2 py-1">
              <span className="font-pixel text-[10px] text-accent-foreground">
                잔여 {product.stock}개
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col p-2.5 space-y-1.5">
          <p className="font-pixel text-[11px] sm:text-[13px] text-foreground leading-snug truncate">
            {product.name}
          </p>
          <p className="font-body text-[11px] text-muted-foreground truncate">
            {product.nameKo}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 flex-wrap content-start">
            <div className="flex items-baseline gap-1.5">
              {discount > 0 && (
                <span className="font-pixel text-[11px] text-pixel-pink">
                  {discount}%
                </span>
              )}
              <span className="font-pixel text-[12px] sm:text-[14px] text-foreground">
                {product.price.toLocaleString()}
              </span>
              <span className="font-body text-[11px] text-muted-foreground">P</span>
            </div>
            {product.originalPrice && (
              <p className="font-body text-[11px] text-muted-foreground line-through">
                {product.originalPrice.toLocaleString()} P
              </p>
            )}
          </div>
        </div>
      </button>

      {/* Buy Button */}
      <div className="p-2.5 pt-0">
        <button
          type="button"
          onClick={() => onAddToCart(product)}
          className="mt-auto w-full bg-pixel-pink text-card font-pixel text-[11px] sm:text-[13px] py-2 hover:brightness-110 active:translate-y-[1px] transition-all"
        >
          장바구니 담기
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
