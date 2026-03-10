import { createContext, useContext, useMemo, useState } from "react";

export type AppView = "shop" | "cart" | "login" | "signup" | "my" | "notices";

type OpenViewOptions = {
  checkoutComplete?: boolean;
};

type AppViewContextValue = {
  currentView: AppView;
  checkoutComplete: boolean;
  openView: (view: AppView, options?: OpenViewOptions) => void;
  closeView: () => void;
};

const AppViewContext = createContext<AppViewContextValue | undefined>(undefined);

export const AppViewProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentView, setCurrentView] = useState<AppView>("shop");
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const value = useMemo(
    () => ({
      currentView,
      checkoutComplete,
      openView: (view: AppView, options?: OpenViewOptions) => {
        setCurrentView(view);
        setCheckoutComplete(options?.checkoutComplete ?? false);
      },
      closeView: () => {
        setCurrentView("shop");
        setCheckoutComplete(false);
      },
    }),
    [checkoutComplete, currentView],
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
