import { useAppView } from "@/components/app-view-provider";
import { useNotice } from "@/components/notice-provider";

const AnnouncementBoard = () => {
  const { openView } = useAppView();
  const { notices } = useNotice();
  const marqueeText = `${notices.map((notice) => notice.title).join("   ✦   ")}   ✦   `;

  return (
    <section className="sticky top-16 sm:top-20 z-40 border-b-[3px] border-border bg-deep-void">
      <div className="container px-4 py-2">
        <button
          type="button"
          onClick={() => openView("notices")}
          className="relative block w-full min-w-0 overflow-hidden border-[3px] border-border bg-[#fbf3dc] px-3 py-2 text-left shadow-[inset_0_0_0_2px_rgba(122,84,18,0.08)] transition-transform hover:-translate-y-[1px] dark:bg-[#120d1f] dark:shadow-[inset_0_0_0_2px_rgba(255,255,255,0.03)]"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,128,0,0.08)_0,rgba(255,128,0,0)_60%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,80,140,0.16)_0,rgba(255,80,140,0)_60%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-15 dark:opacity-35" style={{ backgroundImage: "radial-gradient(circle, rgba(255, 181, 71, 0.42) 1px, transparent 1px)", backgroundSize: "8px 8px" }} />

          <div className="relative flex min-w-0 items-center gap-3 overflow-hidden">
            <span className="shrink-0 border-[3px] border-pixel-pink bg-pixel-pink/15 px-2 py-1 font-pixel text-[11px] text-pixel-pink shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_0_10px_rgba(255,86,150,0.18)] dark:bg-pixel-pink/20 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_0_12px_rgba(255,86,150,0.35),0_0_20px_rgba(255,86,150,0.18)]">
              NOTICE
            </span>

            <div className="relative min-w-0 flex-1 overflow-hidden">
              <div className="announcement-marquee-track font-pixel text-[11px] sm:text-[12px] text-[#7a4a00] dark:text-[#ffd95c]">
                <span className="announcement-marquee-item">{marqueeText}</span>
                <span className="announcement-marquee-item" aria-hidden="true">{marqueeText}</span>
              </div>
            </div>
          </div>
        </button>
      </div>
    </section>
  );
};

export default AnnouncementBoard;
