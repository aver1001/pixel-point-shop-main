import { createContext, useContext, useMemo, useState } from "react";
import { toast } from "sonner";
import { products as defaultProducts, type Product } from "@/data/products";
import { normalizeDiscountPercent } from "@/lib/product-pricing";

const PRODUCTS_STORAGE_KEY = "azel-point-shop-products";

type ProductInput = {
  name: string;
  nameKo: string;
  price: number;
  discountPercent: number;
  image: string;
  category: string;
  isNew?: boolean;
  isHot?: boolean;
  stock: number;
};

type ProductContextValue = {
  products: Product[];
  addProduct: (input: ProductInput) => boolean;
  updateProduct: (productId: number, input: ProductInput) => boolean;
  deleteProduct: (productId: number) => boolean;
};

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

type StoredProduct = Product & {
  discountPercent?: number | string;
  originalPrice?: number;
  tags?: string[];
};

const migrateProduct = (product: StoredProduct): Product => {
  const rawDiscountPercent =
    typeof product.discountPercent === "string"
      ? Number(product.discountPercent)
      : product.discountPercent;

  const { originalPrice, tags: _legacyTags, ...rest } = product;

  if (typeof rawDiscountPercent === "number" && Number.isFinite(rawDiscountPercent)) {
    return {
      ...rest,
      discountPercent: normalizeDiscountPercent(rawDiscountPercent),
    };
  }

  if (typeof originalPrice === "number" && originalPrice > product.price) {
    return {
      ...rest,
      price: originalPrice,
      discountPercent: normalizeDiscountPercent((1 - product.price / originalPrice) * 100),
    };
  }

  return {
    ...rest,
    discountPercent: 0,
  };
};

const readProducts = (): Product[] => {
  if (typeof window === "undefined") {
    return defaultProducts;
  }

  const raw = window.localStorage.getItem(PRODUCTS_STORAGE_KEY);

  if (!raw) {
    return defaultProducts;
  }

  try {
    const parsed = JSON.parse(raw) as StoredProduct[];

    if (Array.isArray(parsed) && parsed.length > 0) {
      const migrated = parsed.map(migrateProduct);
      writeProducts(migrated);
      return migrated;
    }

    return defaultProducts;
  } catch {
    return defaultProducts;
  }
};

const writeProducts = (products: Product[]) => {
  window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
};

const normalizeInput = (input: ProductInput): ProductInput => ({
  ...input,
  discountPercent: normalizeDiscountPercent(input.discountPercent),
  name: input.name.trim(),
  nameKo: input.nameKo.trim(),
  image: input.image.trim(),
  category: input.category.trim(),
});

const isValidDiscountPercent = (discountPercent?: number) => {
  if (typeof discountPercent !== "number" || !Number.isFinite(discountPercent)) {
    return false;
  }

  return Number.isInteger(discountPercent) && discountPercent >= 0 && discountPercent <= 100;
};

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(() => readProducts());

  const value = useMemo<ProductContextValue>(
    () => ({
      products,
      addProduct: (input) => {
        if (!isValidDiscountPercent(input.discountPercent)) {
          toast.error("할인율은 0%에서 100% 사이의 정수만 입력해 주세요.");
          return false;
        }

        const normalized = normalizeInput(input);

        if (!normalized.name || !normalized.nameKo || !normalized.image || !normalized.category) {
          toast.error("상품 필수 정보를 모두 입력해 주세요.");
          return false;
        }

        if (normalized.price <= 0 || normalized.stock < 0) {
          toast.error("가격과 재고 값을 다시 확인해 주세요.");
          return false;
        }

        const nextProduct: Product = {
          id: products.reduce((max, product) => Math.max(max, product.id), 0) + 1,
          ...normalized,
        };

        const nextProducts = [nextProduct, ...products];
        setProducts(nextProducts);
        writeProducts(nextProducts);
        toast.success("상품 등록이 완료되었습니다!");
        return true;
      },
      updateProduct: (productId, input) => {
        if (!isValidDiscountPercent(input.discountPercent)) {
          toast.error("할인율은 0%에서 100% 사이의 정수만 입력해 주세요.");
          return false;
        }

        if (!products.some((product) => product.id === productId)) {
          toast.error("수정할 상품을 찾을 수 없습니다.");
          return false;
        }

        const normalized = normalizeInput(input);

        if (!normalized.name || !normalized.nameKo || !normalized.image || !normalized.category) {
          toast.error("상품 필수 정보를 모두 입력해 주세요.");
          return false;
        }

        if (normalized.price <= 0 || normalized.stock < 0) {
          toast.error("가격과 재고 값을 다시 확인해 주세요.");
          return false;
        }

        const nextProducts = products.map((product) =>
          product.id === productId
            ? {
                ...product,
                ...normalized,
              }
            : product,
        );

        setProducts(nextProducts);
        writeProducts(nextProducts);
        toast.success("상품 수정이 완료되었습니다!");
        return true;
      },
      deleteProduct: (productId) => {
        const targetProduct = products.find((product) => product.id === productId);

        if (!targetProduct) {
          toast.error("삭제할 상품을 찾을 수 없습니다.");
          return false;
        }

        const nextProducts = products.filter((product) => product.id !== productId);
        setProducts(nextProducts);
        writeProducts(nextProducts);
        toast.success("상품 삭제가 완료되었습니다!");
        return true;
      },
    }),
    [products],
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProduct = () => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProduct must be used within ProductProvider");
  }

  return context;
};
