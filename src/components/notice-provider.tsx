import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const NOTICES_STORAGE_KEY = "azel-point-shop-notices";

export type NoticeEntry = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  createdBy: string;
};

type CreateNoticeInput = {
  title: string;
  body: string;
  createdBy: string;
};

type NoticeContextValue = {
  notices: NoticeEntry[];
  addNotice: (input: CreateNoticeInput) => boolean;
  updateNotice: (noticeId: string, input: CreateNoticeInput) => boolean;
  deleteNotice: (noticeId: string) => void;
};

const DEFAULT_NOTICES: NoticeEntry[] = [
  {
    id: "notice-default-1",
    title: "신규 회원 가입 시 바로 쇼핑 가능",
    body: "회원가입을 완료하면 별도 승인 없이 바로 상품 조회와 장바구니 이용이 가능합니다.",
    createdAt: "2026-03-01T10:00:00.000Z",
    createdBy: "SYSTEM",
  },
  {
    id: "notice-default-2",
    title: "장바구니 결제 후 마이페이지에서 상태 확인",
    body: "결제가 끝나면 마이페이지 주문 내역과 포인트 사용 현황이 즉시 갱신됩니다.",
    createdAt: "2026-03-02T10:00:00.000Z",
    createdBy: "SYSTEM",
  },
  {
    id: "notice-default-3",
    title: "AZEL POINT SHOP 운영 시간 10:00 - 19:00",
    body: "공지 응대와 관리자 확인은 운영 시간 기준으로 순차 처리됩니다.",
    createdAt: "2026-03-03T10:00:00.000Z",
    createdBy: "SYSTEM",
  },
];

const NoticeContext = createContext<NoticeContextValue | undefined>(undefined);

const createNoticeId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const readNotices = (): NoticeEntry[] => {
  if (typeof window === "undefined") {
    return DEFAULT_NOTICES;
  }

  const raw = window.localStorage.getItem(NOTICES_STORAGE_KEY);

  if (!raw) {
    return DEFAULT_NOTICES;
  }

  try {
    const parsed = JSON.parse(raw) as NoticeEntry[];

    if (!Array.isArray(parsed)) {
      return DEFAULT_NOTICES;
    }

    return parsed;
  } catch {
    return DEFAULT_NOTICES;
  }
};

const writeNotices = (notices: NoticeEntry[]) => {
  window.localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(notices));
};

export const NoticeProvider = ({ children }: { children: React.ReactNode }) => {
  const [notices, setNotices] = useState<NoticeEntry[]>(DEFAULT_NOTICES);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = readNotices();
    setNotices(stored);
    writeNotices(stored);
  }, []);

  const value = useMemo<NoticeContextValue>(
    () => ({
      notices,
      addNotice: ({ title, body, createdBy }) => {
        const normalizedTitle = title.trim();
        const normalizedBody = body.trim();

        if (!normalizedTitle || !normalizedBody) {
          toast.error("제목과 내용을 모두 입력해 주세요.");
          return false;
        }

        const nextNotice: NoticeEntry = {
          id: createNoticeId(),
          title: normalizedTitle,
          body: normalizedBody,
          createdAt: new Date().toISOString(),
          createdBy: createdBy.trim() || "ADMIN",
        };

        const nextNotices = [nextNotice, ...notices];
        setNotices(nextNotices);
        writeNotices(nextNotices);
        toast.success("공지 등록이 완료되었습니다!");
        return true;
      },
      updateNotice: (noticeId, { title, body }) => {
        const normalizedTitle = title.trim();
        const normalizedBody = body.trim();

        if (!normalizedTitle || !normalizedBody) {
          toast.error("제목과 내용을 모두 입력해 주세요.");
          return false;
        }

        const nextNotices = notices.map((notice) =>
          notice.id === noticeId
            ? {
                ...notice,
                title: normalizedTitle,
                body: normalizedBody,
              }
            : notice,
        );

        setNotices(nextNotices);
        writeNotices(nextNotices);
        toast.success("공지 수정이 완료되었습니다!");
        return true;
      },
      deleteNotice: (noticeId: string) => {
        const nextNotices = notices.filter((notice) => notice.id !== noticeId);
        setNotices(nextNotices);
        writeNotices(nextNotices);
        toast.success("공지 삭제가 완료되었습니다.");
      },
    }),
    [notices],
  );

  return <NoticeContext.Provider value={value}>{children}</NoticeContext.Provider>;
};

export const useNotice = () => {
  const context = useContext(NoticeContext);

  if (!context) {
    throw new Error("useNotice must be used within NoticeProvider");
  }

  return context;
};
