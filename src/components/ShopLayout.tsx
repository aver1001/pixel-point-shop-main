import ShopFooter from "@/components/ShopFooter";
import ShopHeader from "@/components/ShopHeader";

const ShopLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ShopHeader />
      <div className="flex-1">{children}</div>
      <ShopFooter />
    </div>
  );
};

export default ShopLayout;
