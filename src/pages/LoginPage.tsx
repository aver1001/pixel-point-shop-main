import { useAppView } from "@/components/app-view-provider";
import { KeyRound, LogIn, UserRound } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useState } from "react";

const LoginPage = () => {
  const { isLoggedIn, isReady, isSubmitting, login, logout, user } = useAuth();
  const { openView } = useAppView();
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });

  return (
    <main className="container px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-[3px] flex-1 bg-border" />
            <div className="flex items-center gap-2 whitespace-nowrap">
              <LogIn className="h-4 w-4 text-pixel-pink" />
              <h2 className="font-pixel text-[12px] sm:text-[14px] text-foreground">LOGIN</h2>
            </div>
            <div className="h-[3px] flex-1 bg-border" />
          </div>

          <section className="border-[3px] border-border bg-card p-6 sm:p-8">
            {isReady && isLoggedIn ? (
              <div className="space-y-5 text-center sm:text-left">
                <div className="space-y-2">
                  <p className="font-pixel text-[12px] sm:text-[14px] text-foreground">이미 로그인되어 있어요</p>
                  <p className="font-body text-[12px] text-muted-foreground">현재 계정 정보를 확인하고 바로 마이페이지로 이동할 수 있습니다.</p>
                </div>

                <div className="flex flex-col items-center gap-3 border-[3px] border-border bg-deep-void p-4 sm:flex-row">
                  <div className="flex h-16 w-16 items-center justify-center border-[3px] border-border bg-card">
                    <UserRound className="h-8 w-8 text-pixel-pink" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-pixel text-[12px] sm:text-[14px] text-foreground">{user?.displayName ?? "SHOP USER"}</p>
                      {user?.role === "admin" && (
                        <span className="border-[2px] border-pixel-pink bg-pixel-pink/15 px-2 py-0.5 font-pixel text-[10px] text-pixel-pink">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-body text-[12px] text-muted-foreground">@{user?.username}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => openView("my")}
                    className="inline-flex items-center justify-center border-[3px] border-border bg-pixel-pink px-4 py-3 font-pixel text-[12px] text-card hover:brightness-110"
                  >
                    MY PAGE
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void logout();
                    }}
                    className="border-[3px] border-border bg-deep-void px-4 py-3 font-pixel text-[12px] text-foreground hover:border-pixel-pink"
                  >
                    LOG OUT
                  </button>
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-xl border-[3px] border-border bg-deep-void p-5">
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        void login(loginForm).then((ok) => {
                          if (ok) {
                            openView("my");
                          }
                        });
                      }}
                  >
                    <div className="space-y-2 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center border-[3px] border-border bg-card">
                        <LogIn className="h-7 w-7 text-pixel-pink" />
                      </div>
                      <p className="font-pixel text-[12px] sm:text-[14px] text-foreground">로그인</p>
                    </div>

                    <label className="block space-y-2">
                      <span className="font-body text-[12px] text-muted-foreground">아이디</span>
                      <input
                        value={loginForm.username}
                        onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))}
                        className="w-full border-[3px] border-border bg-card px-4 py-3 font-body text-[13px] text-foreground outline-none focus:border-pixel-pink"
                        placeholder="아이디 입력"
                      />
                    </label>

                    <label className="block space-y-2">
                      <span className="font-body text-[12px] text-muted-foreground">비밀번호</span>
                      <input
                        type="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                        className="w-full border-[3px] border-border bg-card px-4 py-3 font-body text-[13px] text-foreground outline-none focus:border-pixel-pink"
                        placeholder="비밀번호 입력"
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={isSubmitting || !isReady}
                      className="inline-flex w-full items-center justify-center gap-2 border-[3px] border-border bg-pixel-pink px-5 py-3 font-pixel text-[12px] text-card hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <KeyRound className="h-4 w-4" />
                      {isSubmitting ? "PROCESSING..." : "로그인"}
                    </button>

                    <p className="text-center font-body text-[12px] text-muted-foreground">
                      아직 계정이 없나요? <button type="button" onClick={() => openView("signup")} className="text-pixel-pink underline underline-offset-2">회원가입</button>
                    </p>
                  </form>
              </div>
            )}
          </section>
        </div>
      </main>
  );
};

export default LoginPage;
