import { useMemo, useState } from "react";
import { useAppView } from "@/components/app-view-provider";
import { useAuth } from "@/components/auth-provider";
import { useProduct } from "@/components/product-provider";
import { categories, defaultSeriesOptions } from "@/data/products";
import { getSalePriceFromDiscount, normalizeDiscountPercent } from "@/lib/product-pricing";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronRight, ChevronsUpDown, PackagePlus, Search, ShieldCheck, SquarePen, Tags, TicketPercent, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

const productCategoryOptions = categories.filter((category) => category.id === "피규어" || category.id === "굿즈");

const emptyProductForm = {
  name: "",
  nameKo: "",
  price: "",
  discountPercent: "0",
  image: "",
  category: "피규어",
  stock: "0",
  isNew: false,
  isHot: false,
};

const normalizeDiscountInput = (value: string) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return "0";
  }

  return String(Math.min(100, Math.max(0, Math.round(parsed))));
};

const AdminProductsPage = () => {
  const { openView } = useAppView();
  const { isAdmin } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProduct();
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [activeSection, setActiveSection] = useState<"list" | "form">("list");
  const [search, setSearch] = useState("");
  const [seriesPickerOpen, setSeriesPickerOpen] = useState(false);
  const [seriesQuery, setSeriesQuery] = useState("");
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);

  const regularPrice = Number(productForm.price) || 0;
  const discountPercent = normalizeDiscountPercent(Number(productForm.discountPercent) || 0);
  const salePrice = getSalePriceFromDiscount(regularPrice, discountPercent);

  const seriesOptions = useMemo(
    () => Array.from(new Set([...defaultSeriesOptions, ...products.map((product) => product.name)])).sort((left, right) => left.localeCompare(right, "ko-KR")),
    [products],
  );

  const trimmedSeriesQuery = seriesQuery.trim();

  const filteredProducts = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) {
      return products;
    }

    return products.filter((product) =>
      [product.name, product.nameKo, product.category, String(product.id)].some((value) =>
        value.toLowerCase().includes(normalized),
      ),
    );
  }, [products, search]);

  const stats = useMemo(() => {
    const onSaleCount = products.filter((product) => (product.discountPercent ?? 0) > 0).length;
    const lowStockCount = products.filter((product) => product.stock <= 5).length;

    return {
      totalProducts: products.length,
      onSaleCount,
      lowStockCount,
    };
  }, [products]);

  const resetForm = () => {
    setEditingProductId(null);
    setProductForm(emptyProductForm);
    setSeriesQuery("");
    setSeriesPickerOpen(false);
    setCategoryPickerOpen(false);
  };

  const startEdit = (productId: number) => {
    const product = products.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      nameKo: product.nameKo,
      price: String(product.price),
      discountPercent: String(Math.max(0, product.discountPercent ?? 0)),
      image: product.image,
      category: product.category,
      stock: String(product.stock),
      isNew: Boolean(product.isNew),
      isHot: Boolean(product.isHot),
    });
    setSeriesQuery(product.name);
    setSeriesPickerOpen(false);
    setCategoryPickerOpen(false);
    setActiveSection("form");
  };

  if (!isAdmin) {
    return (
      <main className="container space-y-6 px-4 py-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <section className="border-[3px] border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-pixel-pink" />
              <h2 className="font-pixel text-[12px] text-foreground sm:text-[14px]">ADMIN PRODUCTS</h2>
            </div>
            <p className="mt-4 font-body text-[12px] text-muted-foreground">관리자 계정으로 로그인해야 상품관리 화면에 접근할 수 있습니다.</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="container space-y-6 px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-[3px] flex-1 bg-border" />
          <div className="flex items-center gap-2 whitespace-nowrap">
            <PackagePlus className="h-4 w-4 text-pixel-pink" />
            <h2 className="font-pixel text-[12px] text-foreground sm:text-[14px]">ADMIN PRODUCT MANAGER</h2>
          </div>
          <div className="h-[3px] flex-1 bg-border" />
        </div>

        <section className="border-[3px] border-border bg-card p-4">
          <div className="grid grid-cols-3 items-center gap-3 text-center">
            <div className="space-y-2 border-r-[3px] border-border pr-3 last:border-r-0">
              <p className="font-body text-[12px] leading-4 text-muted-foreground">전체<br />상품 수</p>
              <p className="font-pixel text-[15px] text-foreground sm:text-[17px]">{stats.totalProducts}</p>
            </div>
            <div className="space-y-2 border-r-[3px] border-border px-3 last:border-r-0">
              <p className="font-body text-[12px] leading-4 text-muted-foreground">할인<br />상품 수</p>
              <p className="font-pixel text-[15px] text-foreground sm:text-[17px]">{stats.onSaleCount}</p>
            </div>
            <div className="space-y-2 pl-3">
              <p className="font-body text-[12px] leading-4 text-muted-foreground">재고 부족<br />상품 수</p>
              <p className="font-pixel text-[15px] text-foreground sm:text-[17px]">{stats.lowStockCount}</p>
            </div>
          </div>
        </section>

        <section className="border-[3px] border-pixel-pink bg-card p-5">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveSection("list")}
              className={cn(
                "border-[3px] px-4 py-3 font-pixel text-[12px] transition-colors",
                activeSection === "list"
                  ? "border-border bg-pixel-pink text-card"
                  : "border-border bg-deep-void text-foreground hover:border-pixel-pink",
              )}
            >
              상품목록
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setActiveSection("form");
              }}
              className={cn(
                "border-[3px] px-4 py-3 font-pixel text-[12px] transition-colors",
                activeSection === "form"
                  ? "border-border bg-pixel-pink text-card"
                  : "border-border bg-deep-void text-foreground hover:border-pixel-pink",
              )}
            >
              상품등록
            </button>
          </div>
        </section>

        {activeSection === "list" && (
          <>
            <section className="border-[3px] border-border bg-card p-5">
              <label className="block space-y-2">
                <span className="font-pixel text-[11px] text-muted-foreground">SEARCH PRODUCT</span>
                <div className="flex items-center gap-3 border-[3px] border-border bg-deep-void px-4 py-3">
                  <Search className="h-4 w-4 text-pixel-pink" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="작품명, 상품명, 카테고리, 상품 ID 검색"
                    className="w-full bg-transparent font-body text-[13px] text-foreground outline-none"
                  />
                </div>
              </label>
            </section>

            <section className="space-y-3">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product.id} className="border-[3px] border-border bg-card p-4 transition-colors hover:border-pixel-pink sm:p-5">
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => startEdit(product.id)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-pixel text-[12px] text-foreground sm:text-[14px]">{product.name}</p>
                          <span className="font-body text-[11px] text-muted-foreground">#{product.id}</span>
                        </div>
                        <p className="mt-1 font-body text-[12px] text-muted-foreground">{product.nameKo}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 font-body text-[12px] text-muted-foreground">
                          <span>{product.category}</span>
                          <span>정가 {product.price.toLocaleString()} P</span>
                          <span>판매가 {getSalePriceFromDiscount(product.price, product.discountPercent).toLocaleString()} P</span>
                          <span>할인 {product.discountPercent ?? 0}%</span>
                          <span>재고 {product.stock}</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const deleted = deleteProduct(product.id);

                          if (deleted && editingProductId === product.id) {
                            resetForm();
                            setActiveSection("list");
                          }
                        }}
                        className="inline-flex shrink-0 items-center gap-2 border-[3px] border-border bg-deep-void px-3 py-2 font-pixel text-[11px] text-foreground hover:border-pixel-pink"
                      >
                        <Trash2 className="h-4 w-4 text-pixel-pink" />
                        삭제
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <section className="border-[3px] border-dashed border-border bg-card p-8 text-center">
                  <Tags className="mx-auto h-8 w-8 text-pixel-pink" />
                  <p className="mt-4 font-pixel text-[12px] text-foreground sm:text-[14px]">NO PRODUCT FOUND</p>
                  <p className="mt-2 font-body text-[12px] text-muted-foreground">검색어와 일치하는 상품이 없습니다.</p>
                </section>
              )}
            </section>
          </>
        )}

        {activeSection === "form" && (
          <section className="border-[3px] border-pixel-pink bg-card p-5">
            {editingProductId && (
              <div className="mb-4 flex items-center justify-between gap-3 border-[3px] border-border bg-deep-void px-4 py-3">
                <div className="min-w-0">
                  <p className="font-pixel text-[11px] text-pixel-pink">EDIT MODE</p>
                  <p className="mt-1 truncate font-body text-[12px] text-muted-foreground">
                    현재 선택한 상품을 수정 중입니다. 새 상품을 등록하려면 상단의 `상품등록` 버튼을 다시 눌러주세요.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => resetForm()}
                  className="shrink-0 border-[3px] border-border bg-card px-3 py-2 font-pixel text-[11px] text-foreground hover:border-pixel-pink"
                >
                  새 등록 전환
                </button>
              </div>
            )}

            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();

                const payload = {
                  name: productForm.name,
                  nameKo: productForm.nameKo,
                  price: Number(productForm.price),
                  discountPercent: Number(productForm.discountPercent),
                  image: productForm.image,
                  category: productForm.category,
                  stock: Number(productForm.stock),
                  isNew: productForm.isNew,
                  isHot: productForm.isHot,
                };

                const saved = editingProductId ? updateProduct(editingProductId, payload) : addProduct(payload);

                if (saved) {
                  resetForm();
                  setActiveSection("list");
                }
              }}
            >
              <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                <div className="col-span-2 space-y-2 xl:col-span-2">
                  <span className="font-body text-[12px] text-muted-foreground">작품명</span>
                  <Popover open={seriesPickerOpen} onOpenChange={setSeriesPickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={seriesPickerOpen}
                        className="h-auto w-full justify-between rounded-none border-[3px] border-border bg-deep-void px-4 py-3 font-body text-[13px] text-foreground hover:bg-deep-void hover:border-pixel-pink"
                      >
                        <span className="truncate text-left">{productForm.name || "작품명을 검색하거나 선택"}</span>
                        <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] rounded-none border-[3px] border-border bg-card p-0 shadow-none">
                      <Command className="rounded-none bg-card">
                        <CommandInput
                          value={seriesQuery}
                          onValueChange={(value) => {
                            setSeriesQuery(value);
                            setProductForm((prev) => ({ ...prev, name: value.trimStart() }));
                          }}
                          placeholder="작품명 검색"
                          className="font-body text-[13px]"
                        />
                        <CommandList>
                          <CommandEmpty className="px-4 py-4 text-left font-body text-[12px] text-muted-foreground">
                            {trimmedSeriesQuery ? `"${trimmedSeriesQuery}" 작품명을 새로 등록할 수 있어요.` : "작품명을 검색해 주세요."}
                          </CommandEmpty>
                          <CommandGroup heading="SERIES LIST">
                            {seriesOptions.map((seriesName) => (
                              <CommandItem
                                key={seriesName}
                                value={seriesName}
                                onSelect={(value) => {
                                  setProductForm((prev) => ({ ...prev, name: value }));
                                  setSeriesQuery(value);
                                  setSeriesPickerOpen(false);
                                }}
                                className="rounded-none px-3 py-3 font-body text-[13px]"
                              >
                                <Check className={cn("mr-2 h-4 w-4 text-pixel-pink", productForm.name === seriesName ? "opacity-100" : "opacity-0")} />
                                {seriesName}
                              </CommandItem>
                            ))}
                            {trimmedSeriesQuery && !seriesOptions.some((seriesName) => seriesName.toLowerCase() === trimmedSeriesQuery.toLowerCase()) && (
                              <CommandItem
                                value={`__custom__${trimmedSeriesQuery}`}
                                onSelect={() => {
                                  setProductForm((prev) => ({ ...prev, name: trimmedSeriesQuery }));
                                  setSeriesQuery(trimmedSeriesQuery);
                                  setSeriesPickerOpen(false);
                                }}
                                className="rounded-none border-t-[3px] border-border px-3 py-3 font-body text-[13px]"
                              >
                                <PackagePlus className="mr-2 h-4 w-4 text-pixel-pink" />
                                새 작품명 등록: {trimmedSeriesQuery}
                              </CommandItem>
                            )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <p className="font-body text-[11px] text-muted-foreground">목록에서 고르거나 검색창에 직접 입력해서 새 작품명으로 등록할 수 있습니다.</p>
                </div>

                <label className="col-span-2 space-y-2 xl:col-span-2">
                  <span className="font-body text-[12px] text-muted-foreground">상품명</span>
                  <input value={productForm.nameKo} onChange={(event) => setProductForm((prev) => ({ ...prev, nameKo: event.target.value }))} className="w-full border-[3px] border-border bg-deep-void px-4 py-3 font-body text-[13px] text-foreground outline-none focus:border-pixel-pink" />
                </label>

                <label className="space-y-2">
                  <span className="font-body text-[12px] text-muted-foreground">정가(P)</span>
                  <input type="number" min="1" value={productForm.price} onChange={(event) => setProductForm((prev) => ({ ...prev, price: event.target.value }))} className="w-full border-[3px] border-border bg-deep-void px-4 py-3 font-body text-[13px] text-foreground outline-none focus:border-pixel-pink" />
                </label>

                <label className="space-y-2">
                  <span className="font-body text-[12px] text-muted-foreground">할인율(%)</span>
                  <input type="number" min="0" max="100" step="1" inputMode="numeric" value={productForm.discountPercent} onChange={(event) => setProductForm((prev) => ({ ...prev, discountPercent: normalizeDiscountInput(event.target.value) }))} className="w-full border-[3px] border-border bg-deep-void px-4 py-3 font-body text-[13px] text-foreground outline-none focus:border-pixel-pink" />
                </label>

                <div className="space-y-2">
                  <span className="font-body text-[12px] text-muted-foreground">카테고리</span>
                  <Popover open={categoryPickerOpen} onOpenChange={setCategoryPickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={categoryPickerOpen}
                        className="h-auto w-full justify-between rounded-none border-[3px] border-border bg-deep-void px-4 py-3 font-body text-[13px] text-foreground hover:bg-deep-void hover:border-pixel-pink"
                      >
                        <span>{productForm.category}</span>
                        <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] rounded-none border-[3px] border-border bg-card p-0 shadow-none">
                      <Command className="rounded-none bg-card">
                        <CommandList>
                          <CommandGroup heading="CATEGORY LIST">
                            {productCategoryOptions.map((category) => (
                              <CommandItem
                                key={category.id}
                                value={category.name}
                                onSelect={() => {
                                  setProductForm((prev) => ({ ...prev, category: category.id }));
                                  setCategoryPickerOpen(false);
                                }}
                                className="rounded-none px-3 py-3 font-body text-[13px]"
                              >
                                <Check className={cn("mr-2 h-4 w-4 text-pixel-pink", productForm.category === category.id ? "opacity-100" : "opacity-0")} />
                                {category.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <label className="space-y-2">
                  <span className="font-body text-[12px] text-muted-foreground">재고</span>
                  <input type="number" min="0" value={productForm.stock} onChange={(event) => setProductForm((prev) => ({ ...prev, stock: event.target.value }))} className="w-full border-[3px] border-border bg-deep-void px-4 py-3 font-body text-[13px] text-foreground outline-none focus:border-pixel-pink" />
                </label>

                <label className="col-span-2 space-y-2 xl:col-span-2">
                  <span className="font-body text-[12px] text-muted-foreground">이미지 URL</span>
                  <input value={productForm.image} onChange={(event) => setProductForm((prev) => ({ ...prev, image: event.target.value }))} className="w-full border-[3px] border-border bg-deep-void px-4 py-3 font-body text-[13px] text-foreground outline-none focus:border-pixel-pink" placeholder="https://... 또는 기존 이미지 경로" />
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-4 border-[3px] border-border bg-deep-void px-4 py-3">
                {([
                  ["isNew", "신상품"],
                  ["isHot", "인기 상품"],
                ] as const).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 font-body text-[12px] text-foreground">
                    <input type="checkbox" checked={productForm[key]} onChange={(event) => setProductForm((prev) => ({ ...prev, [key]: event.target.checked }))} />
                    {label}
                  </label>
                ))}
              </div>

              <div className="border-[3px] border-border bg-deep-void p-4">
                <p className="font-pixel text-[11px] text-muted-foreground">PRICE PREVIEW</p>
                <div className="mt-3 overflow-hidden border-[3px] border-border bg-card">
                  <div className="grid grid-cols-3 border-b-[3px] border-border text-center">
                    <p className="border-r-[3px] border-border px-2 py-2 font-body text-[11px] leading-4 text-muted-foreground">정가</p>
                    <p className="border-r-[3px] border-border px-2 py-2 font-body text-[11px] leading-4 text-muted-foreground">할인율</p>
                    <p className="px-2 py-2 font-body text-[11px] leading-4 text-muted-foreground">판매가격</p>
                  </div>
                  <div className="grid grid-cols-3 text-center">
                    <p className="border-r-[3px] border-border px-2 py-3 font-pixel text-[14px] text-foreground sm:text-[16px]">{regularPrice.toLocaleString()} P</p>
                    <p className="border-r-[3px] border-border px-2 py-3 font-pixel text-[14px] text-pixel-pink sm:text-[16px]">{discountPercent}%</p>
                    <p className="px-2 py-3 font-pixel text-[14px] text-foreground sm:text-[16px]">{salePrice.toLocaleString()} P</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <button type="submit" className="inline-flex items-center gap-2 border-[3px] border-border bg-pixel-pink px-4 py-3 font-pixel text-[12px] text-card hover:brightness-110">
                  <PackagePlus className="h-4 w-4" />
                  {editingProductId ? "상품 수정 저장" : "상품 등록"}
                </button>
                {editingProductId && (
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setActiveSection("list");
                    }}
                    className="inline-flex items-center gap-2 border-[3px] border-border bg-deep-void px-4 py-3 font-pixel text-[12px] text-foreground hover:border-pixel-pink"
                  >
                    <X className="h-4 w-4 text-pixel-pink" />
                    수정 취소
                  </button>
                )}
              </div>
            </form>
          </section>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => openView("my")}
            className="inline-flex items-center gap-2 border-[3px] border-border bg-deep-void px-4 py-3 font-pixel text-[12px] text-foreground hover:border-pixel-pink"
          >
            MY PAGE
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
};

export default AdminProductsPage;
