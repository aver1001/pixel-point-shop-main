import { useAppView } from "@/components/app-view-provider";
import { Bell, ChevronRight } from "lucide-react";
import { notices } from "@/components/AnnouncementBoard";

const NoticesPage = () => {
  const { openView } = useAppView();

  return (
    <main className="container px-4 py-6 space-y-6">
        <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-[3px] flex-1 bg-border" />
          <div className="flex items-center gap-2 whitespace-nowrap">
            <Bell className="h-4 w-4 text-pixel-pink" />
            <h2 className="font-pixel text-[12px] sm:text-[14px] text-foreground">NOTICES</h2>
          </div>
          <div className="h-[3px] flex-1 bg-border" />
        </div>

        <section className="space-y-3">
          {notices.map((notice, index) => (
            <article key={notice} className="border-[3px] border-border bg-card p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="mt-1 font-pixel text-[11px] text-pixel-pink">0{index + 1}</span>
                <div className="space-y-2">
                  <p className="font-pixel text-[12px] sm:text-[14px] text-foreground">{notice}</p>
                  <p className="font-body text-[12px] text-muted-foreground">전광판에 노출되는 공지 항목입니다.</p>
                </div>
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
