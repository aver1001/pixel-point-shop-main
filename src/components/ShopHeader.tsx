import { LogIn, LogOut, Menu, Moon, ShoppingCart, Star, UserRound } from "lucide-react";
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
import { useShop } from "@/components/shop-provider";

const ShopHeader = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const { openView } = useAppView();
  const { resolvedTheme, setTheme } = useTheme();
  const { cartCount, points } = useShop();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <header className="sticky top-0 z-50 bg-card border-b-[3px] border-border">
      <div className="container flex items-center justify-between h-16 sm:h-20 px-4 gap-3">
        {/* Logo */}
        <button type="button" onClick={() => openView("shop", { resetShop: true })} className="flex items-center gap-2 min-w-0 hover:opacity-90 transition-opacity">
          <span className="text-pixel-pink text-lg">✦</span>
          <h1 className="font-pixel text-[16px] sm:text-[20px] text-foreground leading-none whitespace-nowrap">
            AZEL POINT <span className="text-pixel-pink">SHOP</span>
          </h1>
        </button>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Points */}
          <button
            type="button"
            onClick={() => openView("my")}
            className="flex items-center gap-1.5 bg-deep-void px-3 py-1.5 border-2 border-border hover:border-pixel-pink transition-colors"
          >
            <Star className="w-3.5 h-3.5 text-pixel-yellow fill-pixel-yellow" />
            <span className="font-pixel text-[14px] sm:text-[16px] text-foreground">
              {points.toLocaleString()}
            </span>
            <span className="ml-0.5 font-body text-[13px] text-muted-foreground">P</span>
          </button>

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
                <div className="px-2 py-2">
                  <p className="font-pixel text-[11px] text-foreground">{user?.displayName ?? user?.username ?? "SHOP USER"}</p>
                  <p className="mt-1 font-body text-[12px] text-muted-foreground">@{user?.username}</p>
                </div>
              )}

              {isLoggedIn && <DropdownMenuSeparator className="bg-border" />}

              <DropdownMenuItem
                onSelect={() => {
                  if (isLoggedIn) {
                    setIsMenuOpen(false);
                    void logout();
                    return;
                  }

                  setIsMenuOpen(false);
                  openView("login");
                }}
                className="rounded-none px-2 py-2 font-body text-[13px] focus:bg-deep-void"
              >
                {isLoggedIn ? (
                  <LogOut className="mr-2 h-4 w-4 text-pixel-pink" />
                ) : (
                  <LogIn className="mr-2 h-4 w-4 text-pixel-pink" />
                )}
                {isLoggedIn ? "로그아웃" : "로그인"}
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => {
                  setIsMenuOpen(false);
                  openView("cart");
                }}
                className="rounded-none px-2 py-2 font-body text-[13px] focus:bg-deep-void"
              >
                <ShoppingCart className="mr-2 h-4 w-4 text-pixel-pink" />
                장바구니
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => {
                  setIsMenuOpen(false);
                  openView("my");
                }}
                className="rounded-none px-2 py-2 font-body text-[13px] focus:bg-deep-void"
              >
                <UserRound className="mr-2 h-4 w-4 text-pixel-pink" />
                마이페이지
              </DropdownMenuItem>

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
