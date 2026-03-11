import { useMemo } from "react";
import { useAppView } from "@/components/app-view-provider";
import { useAuth } from "@/components/auth-provider";
import { useShop } from "@/components/shop-provider";
import { CheckCircle2, ChevronRight, PackageCheck, ShieldCheck } from "lucide-react";

const AdminOrdersPage = () => {
  const { openView } = useAppView();
  const { isAdmin } = useAuth();
  const { adminOrders, completeOrder } = useShop();

  const stats = useMemo(() => {
    const pendingOrders = adminOrders.filter((order) => !order.isFulfilled);
    const completedOrders = adminOrders.filter((order) => order.isFulfilled);

    return {
      totalOrders: adminOrders.length,
      pendingCount: pendingOrders.length,
      completedCount: completedOrders.length,
    };
  }, [adminOrders]);

  if (!isAdmin) {
    return (
      <main className="container space-y-6 px-4 py-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <section className="border-[3px] border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-pixel-pink" />
              <h2 className="font-pixel text-[12px] text-foreground sm:text-[14px]">ADMIN ORDERS</h2>
            </div>
            <p className="mt-4 font-body text-[12px] text-muted-foreground">관리자 계정으로 로그인해야 주문관리 화면에 접근할 수 있습니다.</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="container space-y-6 px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-[3px] flex-1 bg-border" />
          <div className="flex items-center gap-2 whitespace-nowrap">
            <PackageCheck className="h-4 w-4 text-pixel-pink" />
            <h2 className="font-pixel text-[12px] text-foreground sm:text-[14px]">ADMIN ORDER MANAGER</h2>
          </div>
          <div className="h-[3px] flex-1 bg-border" />
        </div>

        <section className="border-[3px] border-border bg-card p-4">
          <div className="grid grid-cols-3 items-center gap-3 text-center">
            <div className="space-y-2 border-r-[3px] border-border pr-3 last:border-r-0">
              <p className="font-body text-[12px] leading-4 text-muted-foreground">전체<br />주문 수</p>
              <p className="font-pixel text-[15px] text-foreground sm:text-[17px]">{stats.totalOrders}</p>
            </div>
            <div className="space-y-2 border-r-[3px] border-border px-3 last:border-r-0">
              <p className="font-body text-[12px] leading-4 text-muted-foreground">미지급<br />주문 수</p>
              <p className="font-pixel text-[15px] text-foreground sm:text-[17px]">{stats.pendingCount}</p>
            </div>
            <div className="space-y-2 pl-3">
              <p className="font-body text-[12px] leading-4 text-muted-foreground">지급 완료<br />주문 수</p>
              <p className="font-pixel text-[15px] text-foreground sm:text-[17px]">{stats.completedCount}</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          {adminOrders.length > 0 ? (
            adminOrders.map((order) => (
              <article
                key={`${order.customerId}-${order.id}`}
                className={`border-[3px] p-4 transition-colors sm:p-5 ${
                  order.isFulfilled
                    ? "border-border/60 bg-card/55 opacity-60"
                    : "border-border bg-card"
                }`}
              >
                <div className="space-y-2 min-w-0">
                  <div className="flex items-start justify-between gap-4 border-b-[3px] border-border pb-3">
                    <div className="min-w-0 space-y-2 font-body text-[12px] text-muted-foreground">
                      <div className="grid grid-cols-[56px_10px_minmax(0,1fr)] items-start gap-x-2">
                        <span className="shrink-0">주문자</span>
                        <span>|</span>
                        <div className="min-w-0 space-y-0.5">
                          <p className="font-pixel text-[12px] leading-none text-foreground sm:text-[14px]">{order.customerDisplayName}</p>
                          <p className="truncate text-[11px] leading-none text-muted-foreground">@{order.customerUsername}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-[56px_10px_minmax(0,1fr)] items-start gap-x-2">
                        <span className="shrink-0">주문번호</span>
                        <span>|</span>
                        <span className="truncate">{order.id}</span>
                      </div>
                      <div className="grid grid-cols-[56px_10px_minmax(0,1fr)] items-start gap-x-2">
                        <span className="shrink-0">주문일</span>
                        <span>|</span>
                        <span>
                          {new Date(order.orderedAt).toLocaleString("ko-KR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="grid grid-cols-[56px_10px_minmax(0,1fr)] items-start gap-x-2">
                        <span className="shrink-0">포인트</span>
                        <span>|</span>
                        <span className="break-all">
                          {order.pointsBefore.toLocaleString()} P - {order.pointsUsed.toLocaleString()} P = {order.pointsAfter.toLocaleString()} P
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={order.isFulfilled}
                      onClick={() => completeOrder(order.customerId, order.id)}
                      className={`inline-flex min-w-[84px] flex-col items-center justify-center gap-1 border-[3px] px-3 py-3 font-pixel text-[11px] leading-none transition-colors ${
                        order.isFulfilled
                          ? "cursor-not-allowed border-border/60 bg-deep-void/60 text-muted-foreground"
                          : "border-border bg-pixel-pink text-card hover:brightness-110"
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>주문</span>
                      <span>완료</span>
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {order.items.map((item) => (
                    <div key={`${order.id}-${item.productId}`} className="flex items-center justify-between gap-3 font-body text-[12px] text-foreground">
                      <p className="min-w-0 truncate">
                        {item.nameKo}
                        <span className="ml-1 text-muted-foreground">x{item.quantity}</span>
                      </p>
                      <p className="shrink-0 font-pixel text-[12px] text-foreground">{(item.price * item.quantity).toLocaleString()} P</p>
                    </div>
                  ))}

                  <div className="mt-3 flex items-center justify-between border-t-[3px] border-border pt-3">
                    <p className="font-body text-[12px] text-muted-foreground">합계 {order.totalQuantity}개</p>
                    <p className="font-pixel text-[14px] text-foreground">{order.total.toLocaleString()} P</p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <section className="border-[3px] border-dashed border-border bg-card p-8 text-center">
              <PackageCheck className="mx-auto h-8 w-8 text-pixel-pink" />
              <p className="mt-4 font-pixel text-[12px] text-foreground sm:text-[14px]">NO ORDER FOUND</p>
              <p className="mt-2 font-body text-[12px] text-muted-foreground">아직 주문 내역이 없습니다.</p>
            </section>
          )}
        </section>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => openView("my")}
            className="inline-flex items-center gap-2 border-[3px] border-border bg-deep-void px-4 py-3 font-pixel text-[12px] text-foreground hover:border-pixel-pink"
          >
            MY PAGE
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
};

export default AdminOrdersPage;
