import { LogIn, LogOut, Menu, Moon, PackageCheck, PackagePlus, Search, ShoppingCart, UserRound, UsersRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useTheme } from "next-themes";
import { useAppView } from "@/components/app-view-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useShop } from "@/components/shop-provider";

const ShopHeader = () => {
  const { isAdmin, isLoggedIn, logout, user } = useAuth();
  const { currentView, openView, setShopSearchQuery, shopSearchQuery } = useAppView();
  const { resolvedTheme, setTheme } = useTheme();
  const { cartCount } = useShop();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <header className="sticky top-0 z-50 bg-card border-b-[3px] border-border">
      <div className="container flex items-center justify-between h-16 sm:h-20 px-4 gap-3">
        {/* Logo */}
        <button type="button" onClick={() => {
          setIsSearchOpen(false);
          openView("shop", { resetShop: true });
        }} className="flex items-center gap-2 min-w-0 hover:opacity-90 transition-opacity">
          <span className="text-pixel-pink text-lg">✦</span>
          <h1 className="font-pixel text-[16px] sm:text-[20px] text-foreground leading-none whitespace-nowrap">
            AZEL POINT <span className="text-pixel-pink">SHOP</span>
          </h1>
        </button>

        <div className="flex items-center gap-2 sm:gap-4">
          <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1.5 border-2 border-border bg-deep-void px-3 py-1.5 transition-colors hover:border-pixel-pink"
                aria-label="상품 검색 열기"
              >
                <Search className="h-3.5 w-3.5 text-pixel-pink" />
                <span className="font-body text-[12px] text-foreground">검색</span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[min(320px,calc(100vw-2rem))] rounded-none border-[3px] border-border bg-card p-3 shadow-none">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-pixel text-[11px] text-muted-foreground">SEARCH TITLE</p>
                  {shopSearchQuery && (
                    <button
                      type="button"
                    onClick={() => setShopSearchQuery("")}
                      className="inline-flex items-center gap-1 font-body text-[11px] text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5 text-pixel-pink" />
                      초기화
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3 border-[3px] border-border bg-deep-void px-4 py-3">
                  <Search className="h-4 w-4 text-pixel-pink" />
                  <input
                    value={shopSearchQuery}
                    onChange={(event) => {
                      if (currentView !== "shop") {
                        setIsSearchOpen(false);
                        openView("shop");
                      }

                      setShopSearchQuery(event.target.value);
                    }}
                    placeholder="작품명 또는 상품명으로 검색"
                    className="w-full bg-transparent font-body text-[13px] text-foreground outline-none"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu modal={false} open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="relative flex items-center gap-1.5 bg-deep-void px-3 py-1.5 border-2 border-border hover:border-pixel-pink transition-colors"
              >
                <Menu className="w-3.5 h-3.5 text-pixel-pink" />
                <span className="font-body text-[12px] text-foreground">메뉴</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pixel-pink text-card font-pixel text-[12px] w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-52 rounded-none border-[3px] border-border bg-card p-2 text-foreground shadow-none"
            >
              <DropdownMenuLabel className="font-pixel text-[11px] text-muted-foreground">
                QUICK MENU
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />

              {isLoggedIn && (
                <>
                  <div className="flex w-full items-center justify-between px-2 py-2">
                    <div className="min-w-0 pr-3">
                      <p className="truncate font-pixel text-[11px] text-foreground">{user?.displayName ?? user?.username ?? "SHOP USER"}</p>
                      <p className="mt-1 truncate font-body text-[12px] text-muted-foreground">@{user?.username}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        void logout();
                      }}
                      className="flex shrink-0 items-center border-l-[2px] border-border pl-3 transition-colors hover:text-pixel-pink"
                    >
                      <LogOut className="mr-1 h-3.5 w-3.5 text-pixel-pink" />
                      <div className="leading-none">
                        <p className="font-pixel text-[10px] text-foreground">로그</p>
                        <p className="mt-0.5 font-pixel text-[10px] text-foreground">아웃</p>
                      </div>
                    </button>
                  </div>
                  <DropdownMenuSeparator className="bg-border" />
                </>
              )}

              {!isLoggedIn && (
                <DropdownMenuItem
                  onSelect={() => {
                    setIsMenuOpen(false);
                    setIsSearchOpen(false);
                    openView("login");
                  }}
                  className="rounded-none px-2 py-2 font-body text-[13px] focus:bg-deep-void"
                >
                  <LogIn className="mr-2 h-4 w-4 text-pixel-pink" />
                  로그인
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                onSelect={() => {
                  setIsMenuOpen(false);
                  setIsSearchOpen(false);
                  openView("cart");
                }}
                className="rounded-none px-2 py-2 font-body text-[13px] focus:bg-deep-void"
              >
                <ShoppingCart className="mr-2 h-4 w-4 text-pixel-pink" />
                장바구니
                {cartCount > 0 && (
                  <span className="ml-auto border-[2px] border-pixel-pink bg-pixel-pink px-1.5 py-0.5 font-pixel text-[10px] leading-none text-card">
                    {cartCount}
                  </span>
                )}
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => {
                  setIsMenuOpen(false);
                  setIsSearchOpen(false);
                  openView("my");
                }}
                className="rounded-none px-2 py-2 font-body text-[13px] focus:bg-deep-void"
              >
                <UserRound className="mr-2 h-4 w-4 text-pixel-pink" />
                마이페이지
              </DropdownMenuItem>

              {isAdmin && (
                <>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuLabel className="font-pixel text-[11px] text-muted-foreground">
                    ADMIN MENU
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    onSelect={() => {
                      setIsMenuOpen(false);
                      setIsSearchOpen(false);
                      openView("admin-products");
                    }}
                    className="rounded-none px-2 py-2 font-body text-[13px] focus:bg-deep-void"
                  >
                    <PackagePlus className="mr-2 h-4 w-4 text-pixel-pink" />
                    상품관리
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      setIsMenuOpen(false);
                      setIsSearchOpen(false);
                      openView("admin-customers");
                    }}
                    className="rounded-none px-2 py-2 font-body text-[13px] focus:bg-deep-void"
                  >
                    <UsersRound className="mr-2 h-4 w-4 text-pixel-pink" />
                    고객관리
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      setIsMenuOpen(false);
                      setIsSearchOpen(false);
                      openView("admin-orders");
                    }}
                    className="rounded-none px-2 py-2 font-body text-[13px] focus:bg-deep-void"
                  >
                    <PackageCheck className="mr-2 h-4 w-4 text-pixel-pink" />
                    주문관리
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuSeparator className="bg-border" />

              <DropdownMenuItem
                onSelect={() => {
                  setIsMenuOpen(false);
                  setTheme(isDark ? "light" : "dark");
                }}
                className="rounded-none px-2 py-2 font-body text-[13px] focus:bg-deep-void"
              >
                <span className="flex items-center gap-2">
                  <Moon className={`h-4 w-4 ${isDark ? "text-pixel-yellow" : "text-pixel-pink"}`} />
                  다크모드
                </span>
                <span className="ml-auto font-pixel text-[12px] text-pixel-pink">
                  {isDark ? "✓" : ""}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default ShopHeader;
