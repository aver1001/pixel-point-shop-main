import { X, Star, ShoppingCart, Minus, Plus } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/data/products";
import { getSalePriceFromDiscount, normalizeDiscountPercent } from "@/lib/product-pricing";

const ProductDetail = ({
  product,
  onClose,
  onAddToCart,
  userPoints,
}: {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => boolean;
  userPoints: number;
}) => {
  const [quantity, setQuantity] = useState(1);
  const discount = normalizeDiscountPercent(product.discountPercent);
  const salePrice = getSalePriceFromDiscount(product.price, discount);
  const totalPrice = salePrice * quantity;
  const canAfford = userPoints >= totalPrice;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4"
      style={{ animation: "overlay-in 0.2s ease-out forwards" }}
    >
      {/* Overlay */}
      <button
        type="button"
        aria-label="닫기"
        className="absolute inset-0 bg-foreground/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-[480px] max-h-[90vh] overflow-y-auto border-[3px] border-border bg-card"
        style={{ animation: "modal-in 0.3s ease-out forwards" }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-card border-[3px] border-border hover:border-pixel-pink p-1.5 transition-colors"
        >
          <X className="w-4 h-4 text-foreground" />
        </button>

        {/* Image */}
        <div className="relative aspect-square bg-deep-void overflow-hidden">
          {/* Tags */}
          <div className="absolute top-0 left-0 flex gap-0">
            {product.isHot && (
              <span className="bg-pixel-pink text-black font-pixel text-[12px] px-3 py-1.5">
                HOT
              </span>
            )}
            {product.isNew && (
              <span className="bg-pixel-yellow text-black font-pixel text-[12px] px-3 py-1.5">
                NEW
              </span>
            )}
          </div>

          <img
            src={product.image}
            alt={product.nameKo}
            className="h-full w-full object-cover"
          />

          {/* Stock Warning */}
          {product.stock <= 5 && (
            <div className="absolute bottom-0 left-0 right-0 bg-pixel-yellow/90 px-3 py-1.5 text-center">
              <span className="font-pixel text-[12px] text-accent-foreground">
                ⚠ 품절 임박 — 잔여 {product.stock}개
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Name */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="mb-1 font-pixel text-[12px] text-foreground sm:text-[14px]">
                {product.name}
              </h2>
              <p className="font-body text-[12px] text-muted-foreground">
                {product.nameKo}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <div className="flex items-baseline justify-end gap-2">
                {discount > 0 && (
                  <span className="font-pixel text-[12px] text-pixel-pink sm:text-[13px]">
                    {discount}%
                  </span>
                )}
                <span className="font-pixel text-[15px] text-foreground sm:text-[17px]">
                  {salePrice.toLocaleString()}
                </span>
                <span className="font-body text-[12px] text-muted-foreground">P</span>
              </div>
              {discount > 0 && (
                <p className="mt-1 font-body text-[12px] text-muted-foreground line-through">
                  {product.price.toLocaleString()} P
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="font-body text-[12px] bg-deep-void text-muted-foreground px-3 py-1 border-2 border-border">
              작품명 {product.name}
            </span>
            <span className="font-body text-[12px] bg-pixel-lavender text-foreground px-3 py-1 border-2 border-border">
              {product.category}
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between">
            <span className="font-body text-[12px] text-foreground">수량</span>
            <div className="flex items-center border-[3px] border-border">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-deep-void transition-colors"
              >
                <Minus className="w-3.5 h-3.5 text-foreground" />
              </button>
              <span className="font-pixel text-[12px] sm:text-[14px] text-foreground px-4 py-2 border-x-[3px] border-border min-w-[48px] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-2 hover:bg-deep-void transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-foreground" />
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between border-t-[3px] border-border pt-4">
            <span className="font-body text-[12px] text-muted-foreground">합계</span>
            <div className="flex items-baseline gap-2">
              <Star className="w-4 h-4 text-pixel-yellow fill-pixel-yellow" />
              <span className="font-pixel text-[16px] sm:text-[18px] text-foreground">
                {totalPrice.toLocaleString()}
              </span>
              <span className="font-body text-[13px] text-muted-foreground">P</span>
            </div>
          </div>

          {/* User Points Info */}
          <div className="flex items-center justify-between text-sm">
            <span className="font-body text-[12px] text-muted-foreground">보유 포인트</span>
            <span className={`font-pixel text-[14px] sm:text-[16px] ${canAfford ? "text-foreground" : "text-pixel-pink"}`}>
              {userPoints.toLocaleString()} P
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onAddToCart(product, quantity)) {
                onClose();
              }
            }}
            className="w-full bg-pixel-pink text-card font-pixel text-[12px] sm:text-[14px] py-4 transition-all active:translate-y-[1px] flex items-center justify-center gap-2 hover:brightness-110"
          >
            <ShoppingCart className="w-4 h-4" />
            장바구니 담기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
