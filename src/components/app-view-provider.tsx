import { createContext, useContext, useMemo, useState } from "react";

export type AppView = "shop" | "cart" | "login" | "signup" | "my" | "notices" | "admin-products" | "admin-customers" | "admin-orders";

type OpenViewOptions = {
  checkoutComplete?: boolean;
  resetShop?: boolean;
};

type AppViewContextValue = {
  currentView: AppView;
  checkoutComplete: boolean;
  shopViewVersion: number;
  shopSearchQuery: string;
  setShopSearchQuery: (value: string) => void;
  openView: (view: AppView, options?: OpenViewOptions) => void;
  closeView: () => void;
};

const AppViewContext = createContext<AppViewContextValue | undefined>(undefined);

export const AppViewProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentView, setCurrentView] = useState<AppView>("shop");
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [shopViewVersion, setShopViewVersion] = useState(0);
  const [shopSearchQuery, setShopSearchQuery] = useState("");

  const value = useMemo(
    () => ({
      currentView,
      checkoutComplete,
      shopViewVersion,
      shopSearchQuery,
      setShopSearchQuery,
      openView: (view: AppView, options?: OpenViewOptions) => {
        setCurrentView(view);
        setCheckoutComplete(options?.checkoutComplete ?? false);

        if (view === "shop" && options?.resetShop) {
          setShopViewVersion((prev) => prev + 1);
          setShopSearchQuery("");
        }
      },
      closeView: () => {
        setCurrentView("shop");
        setCheckoutComplete(false);
      },
    }),
    [checkoutComplete, currentView, shopSearchQuery, shopViewVersion],
  );

  return <AppViewContext.Provider value={value}>{children}</AppViewContext.Provider>;
};

export const useAppView = () => {
  const context = useContext(AppViewContext);

  if (!context) {
    throw new Error("useAppView must be used within AppViewProvider");
  }

  return context;
};
