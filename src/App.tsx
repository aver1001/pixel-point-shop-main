import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { AuthProvider } from "@/components/auth-provider";
import { AppViewProvider, type AppView, useAppView } from "@/components/app-view-provider";
import { NoticeProvider } from "@/components/notice-provider";
import { ProductProvider } from "@/components/product-provider";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { ShopProvider } from "@/components/shop-provider";
import ShopLayout from "@/components/ShopLayout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import CartPage from "./pages/CartPage.tsx";
import AdminCustomersPage from "./pages/AdminCustomersPage.tsx";
import AdminOrdersPage from "./pages/AdminOrdersPage.tsx";
import AdminProductsPage from "./pages/AdminProductsPage.tsx";
import Index from "./pages/Index.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import MyPage from "./pages/MyPage.tsx";
import NoticesPage from "./pages/NoticesPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";

const queryClient = new QueryClient();

const AppContent = () => {
  const { currentView, shopViewVersion } = useAppView();
  const scrollResetKey = `${currentView}:${shopViewVersion}`;

  useEffect(() => {
    if (!scrollResetKey) {
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [scrollResetKey]);

  const pages = {
    shop: <Index key={shopViewVersion} />,
    cart: <CartPage />,
    login: <LoginPage />,
    signup: <SignupPage />,
    my: <MyPage />,
    notices: <NoticesPage />,
    "admin-products": <AdminProductsPage />,
    "admin-customers": <AdminCustomersPage />,
    "admin-orders": <AdminOrdersPage />,
  } satisfies Record<AppView, JSX.Element>;

  const currentPage = pages[currentView] ?? pages.shop;

  return (
    <ShopLayout>
      {currentPage}
    </ShopLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange storageKey="azel-point-shop-theme">
      <AuthProvider>
          <ProductProvider>
        <ShopProvider>
            <NoticeProvider>
              <AppViewProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <AppContent />
                </TooltipProvider>
              </AppViewProvider>
            </NoticeProvider>
        </ShopProvider>
          </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
