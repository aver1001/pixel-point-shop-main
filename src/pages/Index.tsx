import { useMemo, useState } from "react";
import AnnouncementBoard from "@/components/AnnouncementBoard";
import { useShop } from "@/components/shop-provider";
import CategoryBar from "@/components/CategoryBar";
import ProductCard from "@/components/ProductCard";
import ProductDetail from "@/components/ProductDetail";
import { products, type Product } from "@/data/products";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { points, addToCart } = useShop();

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    if (selectedCategory === "한정판") return products.filter((p) => p.isLimited);
    if (selectedCategory === "신상품") return products.filter((p) => p.isNew);
    if (selectedCategory === "세일") return products.filter((p) => p.originalPrice);
    return products.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

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
                  ? "BEST & NEW"
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
            <span className="font-pixel text-2xl mb-4">🎭</span>
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
