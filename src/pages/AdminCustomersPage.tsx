import { useMemo, useState } from "react";
import { useAppView } from "@/components/app-view-provider";
import { useAuth } from "@/components/auth-provider";
import { useShop } from "@/components/shop-provider";
import { ChevronDown, ChevronRight, Search, ShieldCheck, UsersRound } from "lucide-react";

const AdminCustomersPage = () => {
  const { openView } = useAppView();
  const { isAdmin } = useAuth();
  const { customerSummaries, getCustomerDetail, adjustCustomerPoints, adjustAllCustomerPoints } = useShop();
  const [search, setSearch] = useState("");
  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(null);
  const [pointDrafts, setPointDrafts] = useState<Record<string, string>>({});
  const [bulkPointDraft, setBulkPointDraft] = useState("");

  const filteredCustomers = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) {
      return customerSummaries;
    }

    return customerSummaries.filter((customer) =>
      [customer.displayName, customer.username, customer.id].some((value) =>
        value.toLowerCase().includes(normalized),
      ),
    );
  }, [customerSummaries, search]);

  const stats = useMemo(() => {
    const totalPoints = customerSummaries.reduce((sum, customer) => sum + customer.points, 0);
    const totalSpent = customerSummaries.reduce((sum, customer) => sum + customer.totalSpent, 0);

    return {
      totalCustomers: customerSummaries.length,
      totalPoints,
      totalSpent,
    };
  }, [customerSummaries]);

  if (!isAdmin) {
    return (
      <main className="container space-y-6 px-4 py-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <section className="border-[3px] border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-pixel-pink" />
              <h2 className="font-pixel text-[12px] text-foreground sm:text-[14px]">ADMIN CUSTOMERS</h2>
            </div>
            <p className="mt-4 font-body text-[12px] text-muted-foreground">관리자 계정으로 로그인해야 고객관리 화면에 접근할 수 있습니다.</p>
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
            <UsersRound className="h-4 w-4 text-pixel-pink" />
            <h2 className="font-pixel text-[12px] text-foreground sm:text-[14px]">ADMIN CUSTOMER MANAGER</h2>
          </div>
          <div className="h-[3px] flex-1 bg-border" />
        </div>

        <section className="border-[3px] border-border bg-card p-4">
          <div className="grid grid-cols-3 items-center gap-3 text-center">
            <div className="space-y-2 border-r-[3px] border-border pr-3 last:border-r-0">
              <p className="font-body text-[12px] leading-4 text-muted-foreground">
                전체
                <br />
                고객 수
              </p>
              <p className="font-pixel text-[15px] text-foreground sm:text-[17px]">{stats.totalCustomers}</p>
            </div>
            <div className="space-y-2 border-r-[3px] border-border px-3 last:border-r-0">
              <p className="font-body text-[12px] leading-4 text-muted-foreground">
                전체
                <br />
                보유 포인트
              </p>
              <p className="font-pixel text-[15px] text-foreground sm:text-[17px]">{stats.totalPoints.toLocaleString()} P</p>
            </div>
            <div className="space-y-2 pl-3">
              <p className="font-body text-[12px] leading-4 text-muted-foreground">
                전체
                <br />
                사용 포인트
              </p>
              <p className="font-pixel text-[15px] text-foreground sm:text-[17px]">{stats.totalSpent.toLocaleString()} P</p>
            </div>
          </div>
        </section>

        <section className="border-[3px] border-pixel-pink bg-card p-5">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <label className="block space-y-2">
              <span className="font-pixel text-[11px] text-muted-foreground">SEARCH CUSTOMER</span>
              <div className="flex items-center gap-3 border-[3px] border-border bg-deep-void px-4 py-3">
                <Search className="h-4 w-4 text-pixel-pink" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="이름, 아이디, 고객 ID 검색"
                  className="w-full bg-transparent font-body text-[13px] text-foreground outline-none"
                />
              </div>
            </label>

            <div className="space-y-2">
              <span className="font-pixel text-[11px] text-muted-foreground">BULK POINT ADJUST</span>
              <div className="flex items-center gap-2 border-[3px] border-border bg-deep-void p-2">
                <input
                  type="number"
                  step="1"
                  inputMode="numeric"
                  value={bulkPointDraft}
                  onChange={(event) => setBulkPointDraft(event.target.value)}
                  placeholder="예: 100, -50"
                  className="min-w-0 flex-1 bg-transparent px-2 py-2 font-body text-[13px] text-foreground outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    const changed = adjustAllCustomerPoints(Number(bulkPointDraft || "0"));

                    if (changed) {
                      setBulkPointDraft("");
                    }
                  }}
                  className="shrink-0 border-[3px] border-border bg-pixel-pink px-4 py-2 font-pixel text-[11px] text-card hover:brightness-110"
                >
                  전체 적용
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => {
              const isExpanded = expandedCustomerId === customer.id;
              const detail = isExpanded ? getCustomerDetail(customer.id) : null;

              return (
                <article key={customer.id} className="border-[3px] border-border bg-card p-4 sm:p-5">
                  <div className="flex flex-col gap-4">
                    <button
                      type="button"
                      onClick={() => setExpandedCustomerId(isExpanded ? null : customer.id)}
                      className="flex w-full flex-col gap-4 text-left transition-opacity hover:opacity-90 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-2 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-pixel text-[12px] text-foreground sm:text-[14px]">{customer.displayName}</p>
                          <span className="font-body text-[11px] text-muted-foreground">@{customer.username}</span>
                        </div>
                        <p className="font-body text-[12px] text-muted-foreground">고객 ID: {customer.id}</p>
                      </div>

                      <div className="inline-flex items-center gap-2 self-start text-muted-foreground sm:self-center">
                        <span className="font-body text-[12px]">상세</span>
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </div>
                    </button>

                    {isExpanded && detail && (
                      <div className="space-y-3 border-t-[3px] border-border pt-4">
                        <div className="border-[3px] border-border bg-deep-void p-3">
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            <div className="flex items-center gap-2">
                              <p className="font-body text-[11px] text-muted-foreground">보유 포인트</p>
                              <p className="font-pixel text-[14px] text-foreground">{customer.points.toLocaleString()} P</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="font-body text-[11px] text-muted-foreground">사용 포인트</p>
                              <p className="font-pixel text-[14px] text-foreground">{customer.totalSpent.toLocaleString()} P</p>
                            </div>
                          </div>
                        </div>

                        <div className="border-[3px] border-border bg-deep-void p-4">
                          <p className="font-body text-[12px] text-muted-foreground">
                            가입일 {new Date(customer.createdAt).toLocaleString("ko-KR", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>

                        <div className="space-y-2 border-[3px] border-border bg-deep-void p-4">
                          <span className="font-body text-[12px] text-muted-foreground">포인트 조정</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              step="1"
                              inputMode="numeric"
                              value={pointDrafts[customer.id] ?? ""}
                              onChange={(event) =>
                                setPointDrafts((prev) => ({
                                  ...prev,
                                  [customer.id]: event.target.value,
                                }))
                              }
                              placeholder="예: 100, -50"
                              className="min-w-0 flex-1 border-[3px] border-border bg-card px-4 py-3 font-body text-[13px] text-foreground outline-none focus:border-pixel-pink"
                            />

                            <button
                              type="button"
                              onClick={() => {
                                const amount = Number(pointDrafts[customer.id] ?? "0");
                                const changed = adjustCustomerPoints(customer.id, amount);

                                if (changed) {
                                  setPointDrafts((prev) => ({ ...prev, [customer.id]: "" }));
                                }
                              }}
                              className="inline-flex h-[54px] shrink-0 items-center gap-2 border-[3px] border-border bg-pixel-pink px-4 py-3 font-pixel text-[12px] text-card hover:brightness-110"
                            >
                              포인트 적용
                            </button>
                          </div>
                        </div>

                        <h3 className="font-pixel text-[11px] text-muted-foreground">ORDER HISTORY DETAIL</h3>
                        {detail.orderHistory.length > 0 ? (
                          detail.orderHistory.map((order) => (
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
                                  <li key={`${order.id}-${item.productId}`} className="flex items-center justify-between gap-3">
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
                          ))
                        ) : (
                          <p className="font-body text-[12px] text-muted-foreground">아직 주문 내역이 없습니다.</p>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })
          ) : (
            <section className="border-[3px] border-dashed border-border bg-card p-8 text-center">
              <UsersRound className="mx-auto h-8 w-8 text-pixel-pink" />
              <p className="mt-4 font-pixel text-[12px] text-foreground sm:text-[14px]">NO CUSTOMER FOUND</p>
              <p className="mt-2 font-body text-[12px] text-muted-foreground">검색어와 일치하는 고객이 없습니다.</p>
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

export default AdminCustomersPage;
