import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/data/products";

type ShopEntry = {
  product: Product;
  quantity: number;
};

type OrderItem = {
  productId: number;
  name: string;
  nameKo: string;
  price: number;
  quantity: number;
};

type OrderHistoryEntry = {
  id: string;
  orderedAt: string;
  total: number;
  totalQuantity: number;
  items: OrderItem[];
};

type ShopContextValue = {
  points: number;
  cartItems: ShopEntry[];
  cartCount: number;
  cartTotal: number;
  totalSpent: number;
  orderHistory: OrderHistoryEntry[];
  addToCart: (product: Product, quantity?: number) => boolean;
  updateCartItemQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  checkoutCart: () => boolean;
};

const ShopContext = createContext<ShopContextValue | undefined>(undefined);

const mergeItem = (items: ShopEntry[], product: Product, quantity: number) => {
  const existing = items.find((item) => item.product.id === product.id);

  if (!existing) {
    return [...items, { product, quantity: Math.min(product.stock, quantity) }];
  }

  return items.map((item) =>
    item.product.id === product.id
      ? { ...item, quantity: Math.min(item.product.stock, item.quantity + quantity) }
      : item,
  );
};

export const ShopProvider = ({ children }: { children: React.ReactNode }) => {
  const [points, setPoints] = useState(500);
  const [cartItems, setCartItems] = useState<ShopEntry[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [orderHistory, setOrderHistory] = useState<OrderHistoryEntry[]>([]);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCartItems((prev) => mergeItem(prev, product, quantity));

    toast.success("장바구니에 담았습니다!", {
      description: `${product.nameKo} x${quantity}`,
    });

    return true;
  }, []);

  const updateCartItemQuantity = useCallback((productId: number, quantity: number) => {
    setCartItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.product.id !== productId);
      }

      return prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(item.product.stock, quantity) }
          : item,
      );
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const checkoutCart = useCallback(() => {
    if (cartItems.length === 0) {
      toast("장바구니가 비어 있어요.");
      return false;
    }

    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    if (points < total) {
      toast.error("포인트가 부족합니다!", {
        description: `필요: ${total.toLocaleString()}P / 보유: ${points.toLocaleString()}P`,
      });

      return false;
    }

    setPoints((prev) => prev - total);
    setTotalSpent((prev) => prev + total);
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const newOrder: OrderHistoryEntry = {
      id: `ORD-${Date.now()}`,
      orderedAt: new Date().toISOString(),
      total,
      totalQuantity,
      items: cartItems.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        nameKo: item.product.nameKo,
        price: item.product.price,
        quantity: item.quantity,
      })),
    };

    setOrderHistory((prev) => [newOrder, ...prev]);
    setCartItems([]);

    toast.success("결제가 완료되었습니다!", {
      description: `${totalQuantity}개 상품 / ${total.toLocaleString()}P 사용`,
    });

    return true;
  }, [cartItems, points]);

  const value = useMemo(() => {
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return {
      points,
      cartItems,
      cartCount,
      cartTotal,
      totalSpent,
      orderHistory,
      addToCart,
      updateCartItemQuantity,
      removeFromCart,
      checkoutCart,
    };
  }, [addToCart, cartItems, checkoutCart, orderHistory, points, removeFromCart, totalSpent, updateCartItemQuantity]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = () => {
  const context = useContext(ShopContext);

  if (!context) {
    throw new Error("useShop must be used within ShopProvider");
  }

  return context;
};
