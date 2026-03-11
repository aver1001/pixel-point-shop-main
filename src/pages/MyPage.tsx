import { useEffect, useState } from "react";
import { useAppView } from "@/components/app-view-provider";
import { useAuth } from "@/components/auth-provider";
import { useShop } from "@/components/shop-provider";
import { Star, UserRound } from "lucide-react";

const MyPage = () => {
  const { checkoutComplete, openView } = useAppView();
  const { isAdmin, isLoggedIn, logout, user } = useAuth();
  const { points, totalSpent, orderHistory } = useShop();
  const [activeSection, setActiveSection] = useState<"account" | "point" | "order">(() => {
    if (typeof window === "undefined") {
      return "account";
    }

    const tab = new URLSearchParams(window.location.search).get("tab");

    if (tab === "account" || tab === "point" || tab === "order") {
      return tab;
    }

    return "account";
  });

  const sectionButtons = [
    { id: "account", label: "ACCOUNT" },
    { id: "point", label: "POINT" },
    { id: "order", label: "ORDER" },
  ] as const;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    params.set("tab", activeSection);
    const nextUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
    window.history.replaceState(window.history.state, "", nextUrl);
  }, [activeSection]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handlePopState = () => {
      const tab = new URLSearchParams(window.location.search).get("tab");

      if (tab === "account" || tab === "point" || tab === "order") {
        setActiveSection(tab);
        return;
      }

      setActiveSection("account");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <main className="container space-y-6 px-4 py-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {checkoutComplete && (
          <section className="border-[3px] border-pixel-pink bg-card p-4">
            <p className="font-pixel text-[12px] text-foreground sm:text-[14px]">CHECKOUT COMPLETE</p>
            <p className="mt-2 font-body text-[12px] text-muted-foreground">결제가 완료됐어요. 사용 포인트와 장바구니 상태가 아래에 반영되었습니다.</p>
          </section>
        )}

        <div className="flex items-center gap-3">
          <div className="h-[3px] flex-1 bg-border" />
          <div className="flex items-center gap-2 whitespace-nowrap">
            <UserRound className="h-4 w-4 text-pixel-pink" />
            <h2 className="font-pixel text-[12px] text-foreground sm:text-[14px]">MY PAGE</h2>
          </div>
          <div className="h-[3px] flex-1 bg-border" />
        </div>

        <section className="border-[3px] border-pixel-pink bg-card p-2">
          <div className="grid grid-cols-3 gap-2">
            {sectionButtons.map((section) => (
              <button
                type="button"
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`border-[3px] px-3 py-2 font-pixel text-[11px] transition-colors sm:text-[12px] ${
                  activeSection === section.id
                    ? "border-pixel-pink bg-pixel-pink text-card"
                    : "border-border bg-deep-void text-muted-foreground hover:text-foreground"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </section>

        {activeSection === "account" && (
          <section className="border-[3px] border-border bg-card p-5">
            <h3 className="font-pixel text-[12px] text-foreground sm:text-[14px]">ACCOUNT</h3>
            {isLoggedIn ? (
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-pixel text-[12px] text-foreground sm:text-[14px]">{user?.displayName ?? "SHOP USER"}</p>
                    {user?.role === "admin" && (
                      <span className="border-[2px] border-pixel-pink bg-pixel-pink/15 px-2 py-0.5 font-pixel text-[10px] text-pixel-pink">
                        ADMIN
                      </span>
                    )}
                  </div>
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
        )}

        {activeSection === "point" && (
          <section className="space-y-4">
            <section className="grid gap-4 sm:grid-cols-2">
              <article className="border-[3px] border-border bg-card p-4">
                <p className="font-body text-[12px] text-muted-foreground">남은 포인트</p>
                <div className="mt-2 flex items-center gap-2">
                  <Star className="h-4 w-4 fill-pixel-yellow text-pixel-yellow" />
                  <p className="font-pixel text-[16px] text-foreground sm:text-[18px]">{points.toLocaleString()} P</p>
                </div>
              </article>
              <article className="border-[3px] border-border bg-card p-4">
                <p className="font-body text-[12px] text-muted-foreground">누적 결제 포인트</p>
                <p className="mt-2 font-pixel text-[16px] text-foreground sm:text-[18px]">{totalSpent.toLocaleString()} P</p>
              </article>
            </section>

            <section className="border-[3px] border-border bg-card p-5">
              <h3 className="font-pixel text-[12px] text-foreground sm:text-[14px]">POINT HISTORY</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="border-[3px] border-border bg-deep-void p-4">
                  <p className="font-body text-[12px] text-muted-foreground">결제로 사용한 포인트</p>
                  <p className="mt-2 font-pixel text-[16px] text-foreground sm:text-[18px]">{totalSpent.toLocaleString()} P</p>
                </div>
                <div className="border-[3px] border-border bg-deep-void p-4">
                  <p className="font-body text-[12px] text-muted-foreground">현재 남은 포인트</p>
                  <p className="mt-2 font-pixel text-[16px] text-foreground sm:text-[18px]">{points.toLocaleString()} P</p>
                </div>
              </div>
            </section>
          </section>
        )}

        {activeSection === "order" && (
          <section className="border-[3px] border-border bg-card p-5">
            <h3 className="font-pixel text-[12px] text-foreground sm:text-[14px]">ORDER HISTORY</h3>
            {orderHistory.length > 0 ? (
              <div className="mt-4 space-y-3">
                {orderHistory.map((order) => (
                  <article key={order.id} className="border-[3px] border-border bg-deep-void p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b-[3px] border-border pb-2">
                    <p className="font-pixel text-[11px] text-foreground">{order.id}</p>
                    <div className="flex items-center gap-2">
                      <p className="font-body text-[12px] text-muted-foreground">
                        {new Date(order.orderedAt).toLocaleString("ko-KR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <span
                        className={`border-[2px] px-2 py-0.5 font-pixel text-[10px] ${
                          order.isFulfilled
                            ? "border-pixel-pink bg-pixel-pink/15 text-pixel-pink"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        {order.isFulfilled ? "지급 완료" : "지급 대기"}
                      </span>
                    </div>
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

                  <div className="mt-3 space-y-1 border-t-[3px] border-border pt-2">
                    <div className="flex items-center justify-between">
                      <p className="font-body text-[12px] text-muted-foreground">총 {order.totalQuantity}개</p>
                      <p className="font-pixel text-[14px] text-foreground">{order.total.toLocaleString()} P</p>
                    </div>
                    <p className="font-body text-[11px] text-muted-foreground">
                      포인트 {order.pointsBefore.toLocaleString()} P - {order.pointsUsed.toLocaleString()} P = {order.pointsAfter.toLocaleString()} P
                    </p>
                  </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-4 font-body text-[12px] text-muted-foreground">아직 주문 내역이 없습니다. 장바구니에서 결제하면 여기에 표시됩니다.</p>
            )}
          </section>
        )}

      </div>
    </main>
  );
};

export default MyPage;
