import { useAppView } from "@/components/app-view-provider";
import { Star, UserRound } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useShop } from "@/components/shop-provider";

const MyPage = () => {
  const { checkoutComplete, openView } = useAppView();
  const { isLoggedIn, logout, user } = useAuth();
  const { cartCount, points, totalSpent, orderHistory } = useShop();

  return (
    <main className="container px-4 py-6 space-y-6">
        <div className="mx-auto max-w-5xl space-y-6">
        {checkoutComplete && (
          <section className="border-[3px] border-pixel-pink bg-card p-4">
            <p className="font-pixel text-[12px] sm:text-[14px] text-foreground">CHECKOUT COMPLETE</p>
            <p className="mt-2 font-body text-[12px] text-muted-foreground">결제가 완료됐어요. 사용 포인트와 장바구니 상태가 아래에 반영되었습니다.</p>
          </section>
        )}

        <div className="flex items-center gap-3">
          <div className="h-[3px] flex-1 bg-border" />
          <div className="flex items-center gap-2 whitespace-nowrap">
            <UserRound className="h-4 w-4 text-pixel-pink" />
            <h2 className="font-pixel text-[12px] sm:text-[14px] text-foreground">MY PAGE</h2>
          </div>
          <div className="h-[3px] flex-1 bg-border" />
        </div>

        <section className="border-[3px] border-border bg-card p-5">
          <h3 className="font-pixel text-[12px] sm:text-[14px] text-foreground">ACCOUNT</h3>
          {isLoggedIn ? (
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-pixel text-[12px] sm:text-[14px] text-foreground">{user?.displayName ?? "SHOP USER"}</p>
                <p className="mt-1 font-body text-[12px] text-muted-foreground">@{user?.username}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  void logout();
                }}
                className="border-[3px] border-border bg-deep-void px-4 py-2 font-pixel text-[12px] text-foreground hover:border-pixel-pink"
              >
                LOG OUT
              </button>
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-body text-[12px] text-muted-foreground">로그인하면 마이페이지에 계정 정보가 표시됩니다.</p>
              <button
                type="button"
                onClick={() => openView("login")}
                className="border-[3px] border-border bg-pixel-pink px-4 py-2 text-center font-pixel text-[12px] text-card hover:brightness-110"
              >
                로그인
              </button>
            </div>
          )}
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <article className="border-[3px] border-border bg-card p-4">
            <p className="font-body text-[12px] text-muted-foreground">남은 포인트</p>
            <div className="mt-2 flex items-center gap-2">
              <Star className="h-4 w-4 text-pixel-yellow fill-pixel-yellow" />
              <p className="font-pixel text-[16px] sm:text-[18px] text-foreground">{points.toLocaleString()} P</p>
            </div>
          </article>
          <article className="border-[3px] border-border bg-card p-4">
            <p className="font-body text-[12px] text-muted-foreground">장바구니 수량</p>
            <p className="mt-2 font-pixel text-[14px] sm:text-[16px] text-foreground">{cartCount} PCS</p>
          </article>
          <article className="border-[3px] border-border bg-card p-4">
            <p className="font-body text-[12px] text-muted-foreground">누적 결제 포인트</p>
            <p className="mt-2 font-pixel text-[16px] sm:text-[18px] text-foreground">{totalSpent.toLocaleString()} P</p>
          </article>
        </section>

        <section className="border-[3px] border-border bg-card p-5">
          <h3 className="font-pixel text-[12px] sm:text-[14px] text-foreground">POINT HISTORY</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="border-[3px] border-border bg-deep-void p-4">
              <p className="font-body text-[12px] text-muted-foreground">결제로 사용한 포인트</p>
              <p className="mt-2 font-pixel text-[16px] sm:text-[18px] text-foreground">{totalSpent.toLocaleString()} P</p>
            </div>
            <div className="border-[3px] border-border bg-deep-void p-4">
              <p className="font-body text-[12px] text-muted-foreground">현재 남은 포인트</p>
              <p className="mt-2 font-pixel text-[16px] sm:text-[18px] text-foreground">{points.toLocaleString()} P</p>
            </div>
          </div>
        </section>

        <section className="border-[3px] border-border bg-card p-5">
          <h3 className="font-pixel text-[12px] sm:text-[14px] text-foreground">ORDER HISTORY</h3>
          {orderHistory.length > 0 ? (
            <div className="mt-4 space-y-3">
              {orderHistory.map((order) => (
                <article key={order.id} className="border-[3px] border-border bg-deep-void p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b-[3px] border-border pb-2">
                    <p className="font-pixel text-[11px] text-foreground">{order.id}</p>
                    <p className="font-body text-[12px] text-muted-foreground">
                      {new Date(order.orderedAt).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <ul className="mt-3 space-y-1.5">
                    {order.items.map((item) => (
                      <li key={`${order.id}-${item.productId}`} className="flex items-center justify-between gap-2">
                        <p className="min-w-0 truncate font-body text-[12px] text-foreground">
                          {item.nameKo}
                          <span className="ml-1 text-muted-foreground">x{item.quantity}</span>
                        </p>
                        <p className="font-pixel text-[12px] text-foreground">{(item.price * item.quantity).toLocaleString()} P</p>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-3 flex items-center justify-between border-t-[3px] border-border pt-2">
                    <p className="font-body text-[12px] text-muted-foreground">총 {order.totalQuantity}개</p>
                    <p className="font-pixel text-[14px] text-foreground">{order.total.toLocaleString()} P</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-4 font-body text-[12px] text-muted-foreground">아직 주문 내역이 없습니다. 장바구니에서 결제하면 여기에 표시됩니다.</p>
          )}
        </section>
        </div>
      </main>
  );
};

export default MyPage;
