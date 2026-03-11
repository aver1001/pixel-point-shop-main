import { useMemo, useState } from "react";
import { Drama } from "lucide-react";
import AnnouncementBoard from "@/components/AnnouncementBoard";
import { useAppView } from "@/components/app-view-provider";
import { useProduct } from "@/components/product-provider";
import { useShop } from "@/components/shop-provider";
import CategoryBar from "@/components/CategoryBar";
import ProductCard from "@/components/ProductCard";
import ProductDetail from "@/components/ProductDetail";
import type { Product } from "@/data/products";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { shopSearchQuery } = useAppView();
  const { points, addToCart } = useShop();
  const { products } = useProduct();

  const filteredProducts = useMemo(() => {
    const normalizedSearch = shopSearchQuery.trim().toLowerCase();

    const categoryFiltered = selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

    if (!normalizedSearch) {
      return categoryFiltered;
    }

    return categoryFiltered.filter((product) =>
      [product.name, product.nameKo].some((value) => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [products, selectedCategory, shopSearchQuery]);

  return (
    <>
      <AnnouncementBoard />
      <CategoryBar selected={selectedCategory} onSelect={setSelectedCategory} />

      <main className="container py-6 px-4">
        {/* Section Title */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="h-[3px] flex-1 bg-border" />
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-pixel-yellow">★</span>
              <h2 className="font-pixel text-[12px] sm:text-[14px] text-foreground">
                {selectedCategory === "all"
                  ? "PRODUCT LIST"
                  : selectedCategory.toUpperCase()}
              </h2>
            </div>
            <div className="h-[3px] flex-1 bg-border" />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredProducts.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              onAddToCart={(p) => addToCart(p)}
              onOpenDetail={setSelectedProduct}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Drama className="mb-4 h-8 w-8 text-muted-foreground" aria-hidden="true" />
            <p className="font-pixel text-[12px] sm:text-[14px] text-muted-foreground">
              상품이 없습니다
            </p>
          </div>
        )}
      </main>

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
          userPoints={points}
        />
      )}
    </>
  );
};

export default Index;
