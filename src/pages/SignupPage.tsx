import { useState } from "react";
import { useAppView } from "@/components/app-view-provider";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";

const SignupPage = () => {
  const { isReady, isSubmitting, signup } = useAuth();
  const { openView } = useAppView();
  const [form, setForm] = useState({ displayName: "", username: "", password: "", confirmPassword: "" });

  return (
    <main className="container px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-[3px] flex-1 bg-border" />
            <div className="flex items-center gap-2 whitespace-nowrap">
              <UserPlus className="h-4 w-4 text-pixel-yellow" />
              <h2 className="font-pixel text-[12px] sm:text-[14px] text-foreground">SIGN UP</h2>
            </div>
            <div className="h-[3px] flex-1 bg-border" />
          </div>

          <section className="border-[3px] border-border bg-card p-6 sm:p-8">
            <div className="mx-auto max-w-xl border-[3px] border-border bg-deep-void p-5">
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();

                    if (form.password !== form.confirmPassword) {
                      toast.error("비밀번호가 서로 다릅니다.");
                      return;
                    }

                    void signup({
                      displayName: form.displayName,
                      username: form.username,
                      password: form.password,
                    }).then((ok) => {
                      if (ok) {
                        openView("my");
                      }
                    });
                  }}
                >
                  <div className="space-y-2 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center border-[3px] border-border bg-card">
                      <UserPlus className="h-7 w-7 text-pixel-yellow" />
                    </div>
                    <p className="font-pixel text-[12px] sm:text-[14px] text-foreground">회원가입</p>
                  </div>

                  <label className="block space-y-2">
                    <span className="font-body text-[12px] text-muted-foreground">이름</span>
                    <input
                      value={form.displayName}
                      onChange={(e) => setForm((prev) => ({ ...prev, displayName: e.target.value }))}
                      className="w-full border-[3px] border-border bg-card px-4 py-3 font-body text-[13px] text-foreground outline-none focus:border-pixel-yellow"
                      placeholder="표시될 이름"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="font-body text-[12px] text-muted-foreground">아이디</span>
                    <input
                      value={form.username}
                      onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                      className="w-full border-[3px] border-border bg-card px-4 py-3 font-body text-[13px] text-foreground outline-none focus:border-pixel-yellow"
                      placeholder="로그인 아이디"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="font-body text-[12px] text-muted-foreground">비밀번호</span>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                      className="w-full border-[3px] border-border bg-card px-4 py-3 font-body text-[13px] text-foreground outline-none focus:border-pixel-yellow"
                      placeholder="4자 이상 입력"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="font-body text-[12px] text-muted-foreground">비밀번호 확인</span>
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full border-[3px] border-border bg-card px-4 py-3 font-body text-[13px] text-foreground outline-none focus:border-pixel-yellow"
                      placeholder="비밀번호 다시 입력"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !isReady ||
                      !form.displayName ||
                      !form.username ||
                      !form.password ||
                      form.password !== form.confirmPassword
                    }
                    className="inline-flex w-full items-center justify-center gap-2 border-[3px] border-border bg-pixel-yellow px-5 py-3 font-pixel text-[12px] text-card hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <UserPlus className="h-4 w-4" />
                    {isSubmitting ? "PROCESSING..." : "회원가입"}
                  </button>

                  <p className="text-center font-body text-[12px] text-muted-foreground">
                    이미 계정이 있나요? <button type="button" onClick={() => openView("login")} className="text-pixel-pink underline underline-offset-2">로그인</button>
                  </p>
                </form>
            </div>
          </section>
        </div>
      </main>
  );
};

export default SignupPage;
