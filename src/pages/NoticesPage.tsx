import { useEffect, useRef, useState } from "react";
import { useAppView } from "@/components/app-view-provider";
import { useAuth } from "@/components/auth-provider";
import { useNotice } from "@/components/notice-provider";
import { Bell, ChevronRight, PencilLine, ShieldCheck, SquarePen, Trash2, X } from "lucide-react";

const NoticesPage = () => {
  const { openView } = useAppView();
  const { isAdmin, user } = useAuth();
  const { notices, addNotice, updateNotice, deleteNotice } = useNotice();
  const [form, setForm] = useState({ title: "", body: "" });
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(null);
  const selectedNotice = notices.find((notice) => notice.id === selectedNoticeId) ?? null;
  const detailCardRef = useRef<HTMLElement | null>(null);
  const detailCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const noticeButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const selectedScrollYRef = useRef(0);
  const selectedTriggerIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (selectedNoticeId && !selectedNotice) {
      setSelectedNoticeId(null);
    }
  }, [selectedNotice, selectedNoticeId]);

  useEffect(() => {
    if (!selectedNotice) {
      return;
    }

    window.requestAnimationFrame(() => {
      detailCloseButtonRef.current?.focus({ preventScroll: true });
      detailCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [selectedNotice]);

  const openNoticeDetail = (noticeId: string) => {
    if (typeof window !== "undefined") {
      selectedScrollYRef.current = window.scrollY;
    }

    selectedTriggerIdRef.current = noticeId;
    setSelectedNoticeId(noticeId);
  };

  const closeNoticeDetail = () => {
    setSelectedNoticeId(null);

    const triggerId = selectedTriggerIdRef.current;
    const triggerButton = triggerId ? noticeButtonRefs.current[triggerId] : null;

    window.requestAnimationFrame(() => {
      triggerButton?.focus({ preventScroll: true });

      if (typeof window !== "undefined") {
        window.scrollTo({ top: selectedScrollYRef.current, behavior: "auto" });
      }
    });
  };

  return (
    <main className="container space-y-6 px-4 py-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-[3px] flex-1 bg-border" />
          <div className="flex items-center gap-2 whitespace-nowrap">
            <Bell className="h-4 w-4 text-pixel-pink" />
            <h2 className="font-pixel text-[12px] text-foreground sm:text-[14px]">NOTICES</h2>
          </div>
          <div className="h-[3px] flex-1 bg-border" />
        </div>

        {isAdmin && (
          <section className="border-[3px] border-pixel-pink bg-card p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-pixel-pink" />
              <h3 className="font-pixel text-[12px] text-foreground sm:text-[14px]">ADMIN NOTICE EDITOR</h3>
            </div>

            <form
              className="mt-4 space-y-3"
              onSubmit={(event) => {
                event.preventDefault();

                const payload = {
                  title: form.title,
                  body: form.body,
                  createdBy: user?.displayName ?? user?.username ?? "ADMIN",
                };

                const saved = editingNoticeId ? updateNotice(editingNoticeId, payload) : addNotice(payload);

                if (saved) {
                  setForm({ title: "", body: "" });
                  setEditingNoticeId(null);
                }
              }}
            >
              <label className="block space-y-2">
                <span className="font-body text-[12px] text-muted-foreground">제목</span>
                <input
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  className="w-full border-[3px] border-border bg-deep-void px-4 py-3 font-body text-[13px] text-foreground outline-none focus:border-pixel-pink"
                  placeholder="공지 제목 입력"
                />
              </label>

              <label className="block space-y-2">
                <span className="font-body text-[12px] text-muted-foreground">내용</span>
                <textarea
                  value={form.body}
                  onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))}
                  className="min-h-[120px] w-full resize-y border-[3px] border-border bg-deep-void px-4 py-3 font-body text-[13px] text-foreground outline-none focus:border-pixel-pink"
                  placeholder="공지 내용을 입력하세요"
                />
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 border-[3px] border-border bg-pixel-pink px-4 py-3 font-pixel text-[12px] text-card hover:brightness-110"
                >
                  <PencilLine className="h-4 w-4" />
                  {editingNoticeId ? "공지 수정 저장" : "공지 등록"}
                </button>

                {editingNoticeId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingNoticeId(null);
                      setForm({ title: "", body: "" });
                    }}
                    className="inline-flex items-center gap-2 border-[3px] border-border bg-deep-void px-4 py-3 font-pixel text-[12px] text-foreground hover:border-pixel-pink"
                  >
                    <X className="h-4 w-4 text-pixel-pink" />
                    수정 취소
                  </button>
                )}
              </div>
            </form>
          </section>
        )}

        <section className="space-y-3">
          {selectedNotice && (
            <article ref={detailCardRef} className="border-[3px] border-pixel-pink bg-card p-5">
              <div className="flex items-start justify-between gap-3 border-b-[3px] border-border pb-3">
                <div>
                  <p className="font-pixel text-[12px] text-foreground sm:text-[14px]">{selectedNotice.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 font-body text-[11px] text-muted-foreground">
                    <span>작성자 {selectedNotice.createdBy}</span>
                    <span>•</span>
                    <span>
                      {new Date(selectedNotice.createdAt).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                <button
                  ref={detailCloseButtonRef}
                  type="button"
                  onClick={closeNoticeDetail}
                  className="inline-flex shrink-0 items-center gap-1 border-[3px] border-border bg-deep-void px-3 py-2 font-pixel text-[11px] text-foreground hover:border-pixel-pink"
                >
                  닫기
                  <X className="h-4 w-4 text-pixel-pink" />
                </button>
              </div>
              <p className="mt-4 whitespace-pre-line font-body text-[13px] leading-7 text-foreground">{selectedNotice.body}</p>
            </article>
          )}

          {notices.map((notice, index) => (
            <article key={notice.id} className="border-[3px] border-border bg-card p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <button
                  ref={(element) => {
                    noticeButtonRefs.current[notice.id] = element;
                  }}
                  type="button"
                  onClick={() => openNoticeDetail(notice.id)}
                  className="flex min-w-0 flex-1 items-start gap-3 text-left transition-opacity hover:opacity-90"
                >
                  <span className="mt-1 font-pixel text-[11px] text-pixel-pink">{String(index + 1).padStart(2, "0")}</span>
                  <div className="min-w-0 space-y-2">
                    <p className="font-pixel text-[12px] text-foreground sm:text-[14px]">{notice.title}</p>
                    <p className="truncate font-body text-[12px] text-muted-foreground">{notice.body}</p>
                    <div className="flex flex-wrap items-center gap-2 font-body text-[11px] text-muted-foreground">
                      <span>작성자 {notice.createdBy}</span>
                      <span>•</span>
                      <span>
                        {new Date(notice.createdAt).toLocaleString("ko-KR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </button>

                {isAdmin && (
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNoticeId(notice.id);
                        setForm({ title: notice.title, body: notice.body });
                      }}
                      className="inline-flex items-center gap-2 border-[3px] border-border bg-deep-void px-3 py-2 font-pixel text-[11px] text-foreground hover:border-pixel-pink"
                    >
                      <SquarePen className="h-4 w-4 text-pixel-pink" />
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteNotice(notice.id)}
                      className="inline-flex items-center gap-2 border-[3px] border-border bg-deep-void px-3 py-2 font-pixel text-[11px] text-foreground hover:border-pixel-pink"
                    >
                      <Trash2 className="h-4 w-4 text-pixel-pink" />
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </section>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => openView("shop")}
            className="inline-flex items-center gap-2 border-[3px] border-border bg-deep-void px-4 py-3 font-pixel text-[12px] text-foreground hover:border-pixel-pink"
          >
            SHOP GO
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
};

export default NoticesPage;
