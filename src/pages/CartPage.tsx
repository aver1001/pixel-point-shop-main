import { useState } from "react";
import { useAppView } from "@/components/app-view-provider";
import { Minus, Plus, ShoppingCart, Star, Trash2 } from "lucide-react";
import { useShop } from "@/components/shop-provider";

const CartPage = () => {
  const {
    cartCount,
    cartItems,
    cartTotal,
    checkoutCart,
    points,
    removeFromCart,
    updateCartItemQuantity,
  } = useShop();
  const { openView } = useAppView();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const canCheckout = cartItems.length > 0 && points >= cartTotal;

  return (
    <main className="container px-4 py-6 space-y-6">
        <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-[3px] flex-1 bg-border" />
          <div className="flex items-center gap-2 whitespace-nowrap">
            <ShoppingCart className="h-4 w-4 text-pixel-pink" />
            <h2 className="font-pixel text-[12px] sm:text-[14px] text-foreground">CART STATION</h2>
          </div>
          <div className="h-[3px] flex-1 bg-border" />
        </div>

        {cartItems.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-[1.6fr_0.9fr]">
            <section className="space-y-4">
              {cartItems.map(({ product, quantity }) => (
                <article key={product.id} className="grid grid-cols-[84px_1fr] gap-3 border-[3px] border-border bg-card p-3 sm:grid-cols-[96px_1fr_auto] sm:items-center sm:gap-4 sm:p-4">
                  <div className="aspect-square bg-deep-void p-2 sm:p-3 flex items-center justify-center">
                    <img src={product.image} alt={product.nameKo} className="h-full w-full object-contain" />
                  </div>

                  <div className="min-w-0 space-y-2 sm:space-y-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-pixel text-[12px] sm:text-[14px] text-foreground truncate">{product.name}</h3>
                        <p className="mt-1 font-body text-[12px] text-muted-foreground truncate">{product.nameKo}</p>
                      </div>

                      <div className="hidden sm:block space-y-1 text-right">
                        <p className="font-body text-[12px] text-muted-foreground">상품 금액</p>
                        <div className="flex items-baseline justify-end gap-2">
                          <span className="font-pixel text-[15px] sm:text-[17px] text-foreground">{product.price.toLocaleString()}</span>
                          <span className="font-body text-[13px] text-muted-foreground">P</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="sm:hidden border-[3px] border-border bg-deep-void p-2 text-muted-foreground hover:border-pixel-pink hover:text-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="space-y-1 sm:hidden">
                        <p className="font-body text-[12px] text-muted-foreground">상품 금액</p>
                        <div className="flex items-baseline gap-2">
                          <span className="font-pixel text-[15px] sm:text-[17px] text-foreground">{product.price.toLocaleString()}</span>
                          <span className="font-body text-[13px] text-muted-foreground">P</span>
                        </div>
                      </div>

                      <div className="flex items-center border-[3px] border-border bg-background">
                        <button
                          type="button"
                          onClick={() => updateCartItemQuantity(product.id, quantity - 1)}
                          className="px-3 py-2 hover:bg-deep-void"
                        >
                          <Minus className="h-3.5 w-3.5 text-foreground" />
                        </button>
                        <span className="min-w-[52px] border-x-[3px] border-border px-4 py-2 text-center font-pixel text-[12px] sm:text-[14px] text-foreground">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartItemQuantity(product.id, quantity + 1)}
                          className="px-3 py-2 hover:bg-deep-void"
                        >
                          <Plus className="h-3.5 w-3.5 text-foreground" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    className="hidden sm:flex border-[3px] border-border bg-deep-void p-2 text-muted-foreground hover:border-pixel-pink hover:text-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </article>
              ))}
            </section>

            <aside className="h-fit border-[3px] border-border bg-card p-5 space-y-4 lg:sticky lg:top-24">
              <h3 className="font-pixel text-[12px] sm:text-[14px] text-foreground">CHECKOUT</h3>
              <div className="space-y-2 border-t-[3px] border-border pt-4">
                <div className="flex items-center justify-between font-body text-[12px] text-muted-foreground">
                  <span>장바구니 수량</span>
                  <span>{cartCount} PCS</span>
                </div>
                <div className="flex items-center justify-between font-body text-[12px] text-muted-foreground">
                  <span>보유 포인트</span>
                  <span>{points.toLocaleString()} P</span>
                </div>
                <div className="flex items-center justify-between border-t-[3px] border-border pt-3">
                  <span className="font-body text-[12px] text-muted-foreground">결제 금액</span>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-pixel-yellow fill-pixel-yellow" />
                    <span className="font-pixel text-[16px] sm:text-[18px] text-foreground">{cartTotal.toLocaleString()} P</span>
                  </div>
                </div>
              </div>

              {!canCheckout && (
                <p className="font-body text-[12px] text-pixel-pink">
                  {cartItems.length === 0 ? "장바구니가 비어 있습니다." : "포인트가 부족합니다. 상품 수량을 조정해보세요."}
                </p>
              )}

              <button
                type="button"
                disabled={!canCheckout || isCheckingOut}
                onClick={() => {
                  if (isCheckingOut) {
                    return;
                  }

                  setIsCheckingOut(true);

                  if (checkoutCart()) {
                    openView("my", { checkoutComplete: true });
                    return;
                  }

                  setIsCheckingOut(false);
                }}
                className={`w-full border-[3px] border-border px-4 py-3 font-pixel text-[12px] sm:text-[14px] transition-all ${
                  canCheckout && !isCheckingOut
                    ? "bg-pixel-pink text-card hover:brightness-110"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {isCheckingOut ? "PROCESSING..." : "CHECK OUT"}
              </button>

              <button
                type="button"
                onClick={() => openView("shop")}
                className="block border-[3px] border-border bg-deep-void px-4 py-3 text-center font-pixel text-[12px] text-foreground hover:border-pixel-pink"
              >
                CONTINUE SHOP
              </button>
            </aside>
          </div>
        ) : (
          <section className="mx-auto max-w-2xl border-[3px] border-dashed border-border bg-card p-8 text-center">
            <ShoppingCart className="mx-auto h-8 w-8 text-pixel-pink" />
            <h2 className="mt-4 font-pixel text-[12px] sm:text-[14px] text-foreground">CART EMPTY</h2>
            <p className="mt-3 font-body text-[12px] text-muted-foreground">상품 상세나 카드에서 장바구니에 담은 뒤 여기서 결제할 수 있어요.</p>
            <button
              type="button"
              onClick={() => openView("shop")}
              className="mt-6 inline-flex border-[3px] border-border bg-pixel-pink px-4 py-2 font-pixel text-[12px] text-card hover:brightness-110"
            >
              SHOP GO
            </button>
          </section>
        )}
        </div>
      </main>
  );
};

export default CartPage;
