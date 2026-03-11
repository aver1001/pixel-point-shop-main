import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { getRegisteredUsers, useAuth } from "@/components/auth-provider";
import { useProduct } from "@/components/product-provider";
import { getSalePriceFromDiscount } from "@/lib/product-pricing";

const CUSTOMER_RECORDS_STORAGE_KEY = "azel-point-shop-customer-records";
const GUEST_CUSTOMER_ID = "guest-user";

type RawCartEntry = {
  productId: number;
  quantity: number;
};

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

export type OrderHistoryEntry = {
  id: string;
  orderedAt: string;
  total: number;
  totalQuantity: number;
  pointsBefore: number;
  pointsUsed: number;
  pointsAfter: number;
  isFulfilled: boolean;
  fulfilledAt?: string;
  items: OrderItem[];
};

type CustomerRecord = {
  points: number;
  totalSpent: number;
  orderHistory: OrderHistoryEntry[];
  cartEntries: RawCartEntry[];
};

type StoredCustomerRecord = Partial<CustomerRecord>;

export type CustomerSummary = {
  id: string;
  username: string;
  displayName: string;
  createdAt: string;
  points: number;
  totalSpent: number;
};

export type CustomerDetail = CustomerSummary & {
  orderHistory: OrderHistoryEntry[];
};

export type AdminOrderEntry = OrderHistoryEntry & {
  customerId: string;
  customerUsername: string;
  customerDisplayName: string;
};

type ShopContextValue = {
  points: number;
  cartItems: ShopEntry[];
  cartCount: number;
  cartTotal: number;
  totalSpent: number;
  orderHistory: OrderHistoryEntry[];
  customerSummaries: CustomerSummary[];
  adminOrders: AdminOrderEntry[];
  getCustomerDetail: (customerId: string) => CustomerDetail | null;
  adjustCustomerPoints: (customerId: string, amount: number) => boolean;
  adjustAllCustomerPoints: (amount: number) => boolean;
  completeOrder: (customerId: string, orderId: string) => boolean;
  addToCart: (product: Product, quantity?: number) => boolean;
  updateCartItemQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  checkoutCart: () => boolean;
};

const ShopContext = createContext<ShopContextValue | undefined>(undefined);

const defaultCustomerRecord = (): CustomerRecord => ({
  points: 500,
  totalSpent: 0,
  orderHistory: [],
  cartEntries: [],
});

const createOrderId = (date: Date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, "0");

  return `ORD-${year}${month}${day}-${hours}${minutes}${seconds}-${random}`;
};

const normalizeOrderHistory = (orderHistory: unknown): OrderHistoryEntry[] => {
  if (!Array.isArray(orderHistory)) {
    return [];
  }

  return orderHistory.map((order) => {
    const entry = order as Partial<OrderHistoryEntry>;
    const normalizedItems = Array.isArray(entry.items)
      ? entry.items.filter(
          (item): item is OrderItem =>
            Boolean(item) &&
            typeof item.productId === "number" &&
            typeof item.name === "string" &&
            typeof item.nameKo === "string" &&
            typeof item.price === "number" &&
            typeof item.quantity === "number",
        )
      : [];

    const total = typeof entry.total === "number" ? entry.total : 0;
    const pointsUsed = typeof entry.pointsUsed === "number" ? entry.pointsUsed : total;
    const pointsBefore = typeof entry.pointsBefore === "number"
      ? entry.pointsBefore
      : typeof entry.pointsAfter === "number"
        ? entry.pointsAfter + pointsUsed
        : pointsUsed;
    const pointsAfter = typeof entry.pointsAfter === "number" ? entry.pointsAfter : Math.max(0, pointsBefore - pointsUsed);

    return {
      id: typeof entry.id === "string" ? entry.id : createOrderId(),
      orderedAt: typeof entry.orderedAt === "string" ? entry.orderedAt : new Date().toISOString(),
      total,
      totalQuantity: typeof entry.totalQuantity === "number" ? entry.totalQuantity : 0,
      pointsBefore,
      pointsUsed,
      pointsAfter,
      isFulfilled: entry.isFulfilled === true,
      fulfilledAt: typeof entry.fulfilledAt === "string" ? entry.fulfilledAt : undefined,
      items: normalizedItems,
    };
  });
};

const readCustomerRecords = (): Record<string, CustomerRecord> => {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(CUSTOMER_RECORDS_STORAGE_KEY);

  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, StoredCustomerRecord>;

    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).map(([key, value]) => [
        key,
        {
          points: typeof value?.points === "number" ? value.points : 500,
          totalSpent: typeof value?.totalSpent === "number" ? value.totalSpent : 0,
          orderHistory: normalizeOrderHistory(value?.orderHistory),
          cartEntries: Array.isArray(value?.cartEntries) ? value.cartEntries : [],
        },
      ]),
    );
  } catch {
    return {};
  }
};

const writeCustomerRecords = (records: Record<string, CustomerRecord>) => {
  window.localStorage.setItem(CUSTOMER_RECORDS_STORAGE_KEY, JSON.stringify(records));
};

const mergeItem = (items: RawCartEntry[], product: Product, quantity: number) => {
  const existing = items.find((item) => item.productId === product.id);

  if (!existing) {
    return [...items, { productId: product.id, quantity: Math.min(product.stock, quantity) }];
  }

  return items.map((item) =>
    item.productId === product.id
      ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
      : item,
  );
};

export const ShopProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { products } = useProduct();
  const [customerRecords, setCustomerRecords] = useState<Record<string, CustomerRecord>>(() => readCustomerRecords());

  const activeCustomerId = user?.id ?? GUEST_CUSTOMER_ID;
  const activeRecord = customerRecords[activeCustomerId] ?? defaultCustomerRecord();

  const updateActiveRecord = useCallback(
    (updater: (record: CustomerRecord) => CustomerRecord) => {
      setCustomerRecords((prev) => {
        const currentRecord = prev[activeCustomerId] ?? defaultCustomerRecord();
        const nextRecord = updater(currentRecord);
        const nextRecords = {
          ...prev,
          [activeCustomerId]: nextRecord,
        };
        writeCustomerRecords(nextRecords);
        return nextRecords;
      });
    },
    [activeCustomerId],
  );

  const cartItems = useMemo(
    () =>
      activeRecord.cartEntries.flatMap((entry) => {
        const product = products.find((item) => item.id === entry.productId);

        if (!product) {
          return [];
        }

        const quantity = Math.min(product.stock, entry.quantity);

        if (quantity <= 0) {
          return [];
        }

        return [{ product, quantity }];
      }),
    [activeRecord.cartEntries, products],
  );

  const registeredUsers = getRegisteredUsers();

  const customerSummaries = useMemo(
    () =>
      registeredUsers
        .map((registeredUser) => {
          const record = customerRecords[registeredUser.id] ?? defaultCustomerRecord();

          return {
            id: registeredUser.id,
            username: registeredUser.username,
            displayName: registeredUser.displayName,
            createdAt: registeredUser.createdAt,
            points: record.points,
            totalSpent: record.totalSpent,
          };
        })
        .sort((left, right) => left.displayName.localeCompare(right.displayName, "ko-KR")),
    [customerRecords, registeredUsers],
  );

  const adminOrders = useMemo(
    () =>
      registeredUsers
        .flatMap((registeredUser) => {
          const record = customerRecords[registeredUser.id] ?? defaultCustomerRecord();

          return record.orderHistory.map((order) => ({
            ...order,
            customerId: registeredUser.id,
            customerUsername: registeredUser.username,
            customerDisplayName: registeredUser.displayName,
          }));
        })
        .sort((left, right) => {
          if (left.isFulfilled !== right.isFulfilled) {
            return left.isFulfilled ? 1 : -1;
          }

          const leftTime = new Date(left.isFulfilled ? left.fulfilledAt ?? left.orderedAt : left.orderedAt).getTime();
          const rightTime = new Date(right.isFulfilled ? right.fulfilledAt ?? right.orderedAt : right.orderedAt).getTime();
          return rightTime - leftTime;
        }),
    [customerRecords, registeredUsers],
  );

  const addToCart = useCallback(
    (product: Product, quantity: number = 1) => {
      updateActiveRecord((record) => ({
        ...record,
        cartEntries: mergeItem(record.cartEntries, product, quantity),
      }));

      toast.success("장바구니에 담았습니다!", {
        description: `${product.nameKo} x${quantity}`,
      });

      return true;
    },
    [updateActiveRecord],
  );

  const getCustomerDetail = useCallback(
    (customerId: string) => {
      const targetUser = registeredUsers.find((registeredUser) => registeredUser.id === customerId);

      if (!targetUser) {
        return null;
      }

      const record = customerRecords[targetUser.id] ?? defaultCustomerRecord();

      return {
        id: targetUser.id,
        username: targetUser.username,
        displayName: targetUser.displayName,
        createdAt: targetUser.createdAt,
        points: record.points,
        totalSpent: record.totalSpent,
        orderHistory: record.orderHistory,
      };
    },
    [customerRecords, registeredUsers],
  );

  const adjustCustomerPoints = useCallback((customerId: string, amount: number) => {
    const delta = Math.trunc(amount);

    if (!Number.isFinite(amount) || delta === 0) {
      toast.error("조정할 포인트 값을 입력해 주세요.");
      return false;
    }

    const targetUser = registeredUsers.find((registeredUser) => registeredUser.id === customerId);

    if (!targetUser) {
      toast.error("고객 정보를 찾을 수 없습니다.");
      return false;
    }

    setCustomerRecords((prev) => {
      const currentRecord = prev[customerId] ?? defaultCustomerRecord();
      const nextRecord = {
        ...currentRecord,
        points: Math.max(0, currentRecord.points + delta),
      };
      const nextRecords = {
        ...prev,
        [customerId]: nextRecord,
      };
      writeCustomerRecords(nextRecords);
      return nextRecords;
    });

    toast.success(`${targetUser.displayName} 고객의 포인트를 조정했습니다.`);
    return true;
  }, [registeredUsers]);

  const adjustAllCustomerPoints = useCallback((amount: number) => {
    const delta = Math.trunc(amount);

    if (!Number.isFinite(amount) || delta === 0) {
      toast.error("일괄 조정할 포인트 값을 입력해 주세요.");
      return false;
    }

    if (registeredUsers.length === 0) {
      toast.error("조정할 고객이 없습니다.");
      return false;
    }

    setCustomerRecords((prev) => {
      const nextRecords = { ...prev };

      for (const registeredUser of registeredUsers) {
        const currentRecord = nextRecords[registeredUser.id] ?? defaultCustomerRecord();
        nextRecords[registeredUser.id] = {
          ...currentRecord,
          points: Math.max(0, currentRecord.points + delta),
        };
      }

      writeCustomerRecords(nextRecords);
      return nextRecords;
    });

    toast.success(`전체 고객 포인트를 ${delta.toLocaleString()}P 조정했습니다.`);
    return true;
  }, [registeredUsers]);

  const completeOrder = useCallback((customerId: string, orderId: string) => {
    const targetUser = registeredUsers.find((registeredUser) => registeredUser.id === customerId);

    if (!targetUser) {
      toast.error("주문 고객 정보를 찾을 수 없습니다.");
      return false;
    }

    let changed = false;

    setCustomerRecords((prev) => {
      const currentRecord = prev[customerId] ?? defaultCustomerRecord();
      const nextOrderHistory = currentRecord.orderHistory.map((order) => {
        if (order.id !== orderId) {
          return order;
        }

        if (order.isFulfilled) {
          return order;
        }

        changed = true;
        return {
          ...order,
          isFulfilled: true,
          fulfilledAt: new Date().toISOString(),
        };
      });

      if (!changed) {
        return prev;
      }

      const nextRecords = {
        ...prev,
        [customerId]: {
          ...currentRecord,
          orderHistory: nextOrderHistory,
        },
      };

      writeCustomerRecords(nextRecords);
      return nextRecords;
    });

    if (!changed) {
      toast.error("지급 처리할 주문을 찾을 수 없습니다.");
      return false;
    }

    toast.success(`${targetUser.displayName} 고객 주문을 지급 완료 처리했습니다.`);
    return true;
  }, [registeredUsers]);

  const updateCartItemQuantity = useCallback(
    (productId: number, quantity: number) => {
      updateActiveRecord((record) => {
        if (quantity <= 0) {
          return {
            ...record,
            cartEntries: record.cartEntries.filter((item) => item.productId !== productId),
          };
        }

        const product = products.find((item) => item.id === productId);

        if (!product) {
          return {
            ...record,
            cartEntries: record.cartEntries.filter((item) => item.productId !== productId),
          };
        }

        return {
          ...record,
          cartEntries: record.cartEntries.map((item) =>
            item.productId === productId
              ? { ...item, quantity: Math.min(product.stock, quantity) }
              : item,
          ),
        };
      });
    },
    [products, updateActiveRecord],
  );

  const removeFromCart = useCallback(
    (productId: number) => {
      updateActiveRecord((record) => ({
        ...record,
        cartEntries: record.cartEntries.filter((item) => item.productId !== productId),
      }));
    },
    [updateActiveRecord],
  );

  const checkoutCart = useCallback(() => {
    const unavailableItem = activeRecord.cartEntries.find((entry) => !products.some((product) => product.id === entry.productId));

    if (unavailableItem) {
      updateActiveRecord((record) => ({
        ...record,
        cartEntries: record.cartEntries.filter((item) => item.productId !== unavailableItem.productId),
      }));
      toast.error("장바구니 상품 정보를 다시 불러왔습니다.");
      return false;
    }

    if (cartItems.length === 0) {
      toast("장바구니가 비어 있어요.");
      return false;
    }

    const stockMismatch = activeRecord.cartEntries.find((entry) => {
      const product = products.find((item) => item.id === entry.productId);
      return product ? entry.quantity > product.stock : false;
    });

    if (stockMismatch) {
      const product = products.find((item) => item.id === stockMismatch.productId);

      if (product) {
        updateCartItemQuantity(stockMismatch.productId, product.stock);
      }

      toast.error("재고가 변경되어 장바구니 수량을 조정했습니다.");
      return false;
    }

    const total = cartItems.reduce((sum, item) => sum + getSalePriceFromDiscount(item.product.price, item.product.discountPercent) * item.quantity, 0);

    if (activeRecord.points < total) {
      toast.error("포인트가 부족합니다!", {
        description: `필요: ${total.toLocaleString()}P / 보유: ${activeRecord.points.toLocaleString()}P`,
      });
      return false;
    }

    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const pointsBefore = activeRecord.points;
    const pointsUsed = total;
    const pointsAfter = pointsBefore - pointsUsed;
    const newOrder: OrderHistoryEntry = {
      id: createOrderId(),
      orderedAt: new Date().toISOString(),
      total,
      totalQuantity,
      pointsBefore,
      pointsUsed,
      pointsAfter,
      isFulfilled: false,
      items: cartItems.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        nameKo: item.product.nameKo,
        price: getSalePriceFromDiscount(item.product.price, item.product.discountPercent),
        quantity: item.quantity,
      })),
    };

    updateActiveRecord((record) => ({
      ...record,
      points: record.points - total,
      totalSpent: record.totalSpent + total,
      orderHistory: [newOrder, ...record.orderHistory],
      cartEntries: [],
    }));

    toast.success("결제가 완료되었습니다!", {
      description: `${totalQuantity}개 상품 / ${total.toLocaleString()}P 사용`,
    });
    return true;
  }, [activeRecord.cartEntries, activeRecord.points, cartItems, products, updateActiveRecord, updateCartItemQuantity]);

  const value = useMemo(() => {
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cartItems.reduce((sum, item) => sum + getSalePriceFromDiscount(item.product.price, item.product.discountPercent) * item.quantity, 0);

    return {
      points: activeRecord.points,
      cartItems,
      cartCount,
      cartTotal,
      totalSpent: activeRecord.totalSpent,
      orderHistory: activeRecord.orderHistory,
      customerSummaries,
      adminOrders,
      getCustomerDetail,
      adjustCustomerPoints,
      adjustAllCustomerPoints,
      completeOrder,
      addToCart,
      updateCartItemQuantity,
      removeFromCart,
      checkoutCart,
    };
  }, [activeRecord.orderHistory, activeRecord.points, activeRecord.totalSpent, addToCart, adjustAllCustomerPoints, adjustCustomerPoints, adminOrders, cartItems, checkoutCart, completeOrder, customerSummaries, getCustomerDetail, removeFromCart, updateCartItemQuantity]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = () => {
  const context = useContext(ShopContext);

  if (!context) {
    throw new Error("useShop must be used within ShopProvider");
  }

  return context;
};
