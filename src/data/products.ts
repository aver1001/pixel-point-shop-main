import product1 from "@/assets/product-1.png";
import product2 from "@/assets/product-2.png";
import product3 from "@/assets/product-3.png";
import product4 from "@/assets/product-4.png";
import product5 from "@/assets/product-5.png";
import product6 from "@/assets/product-6.png";
import product7 from "@/assets/product-7.png";
import product8 from "@/assets/product-8.png";
import product9 from "@/assets/product-9.png";

export type Product = {
  id: number;
  name: string;
  nameKo: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  tags: string[];
  isNew?: boolean;
  isHot?: boolean;
  isLimited?: boolean;
  stock: number;
};

export const products: Product[] = [
  {
    id: 1,
    name: "PIXEL KNIGHT",
    nameKo: "픽셀 나이트 피규어",
    price: 35,
    originalPrice: 50,
    image: product1,
    category: "피규어",
    tags: ["판타지", "기사"],
    isHot: true,
    stock: 12,
  },
  {
    id: 2,
    name: "NEKO RIBBON",
    nameKo: "네코 리본 피규어",
    price: 22,
    image: product2,
    category: "피규어",
    tags: ["동물", "고양이"],
    isNew: true,
    stock: 25,
  },
  {
    id: 3,
    name: "MECHA UNIT-01",
    nameKo: "메카 유닛-01 피규어",
    price: 89,
    originalPrice: 120,
    image: product3,
    category: "피규어",
    tags: ["SF", "로봇"],
    isHot: true,
    stock: 5,
  },
  {
    id: 4,
    name: "DARK SAMURAI",
    nameKo: "다크 사무라이 피규어",
    price: 65,
    image: product4,
    category: "피규어",
    tags: ["전사", "일본"],
    stock: 18,
  },
  {
    id: 5,
    name: "DRAGON PLUSH",
    nameKo: "드래곤 플러시 인형",
    price: 42,
    image: product5,
    category: "굿즈",
    tags: ["인형", "드래곤"],
    isNew: true,
    stock: 30,
  },
  {
    id: 6,
    name: "WITCH LUNA",
    nameKo: "위치 루나 피규어",
    price: 58,
    originalPrice: 75,
    image: product6,
    category: "피규어",
    tags: ["마법", "마녀"],
    isLimited: true,
    stock: 3,
  },
  {
    id: 7,
    name: "KITSUNE SPIRIT",
    nameKo: "키츠네 스피릿 피규어",
    price: 72,
    image: product7,
    category: "피규어",
    tags: ["요괴", "여우"],
    isHot: true,
    stock: 8,
  },
  {
    id: 8,
    name: "ANGEL FEATHER",
    nameKo: "엔젤 페더 피규어",
    price: 48,
    image: product8,
    category: "피규어",
    tags: ["천사", "판타지"],
    isNew: true,
    stock: 15,
  },
  {
    id: 9,
    name: "CAPTAIN BONES",
    nameKo: "캡틴 본즈 피규어",
    price: 55,
    originalPrice: 80,
    image: product9,
    category: "피규어",
    tags: ["해적", "모험"],
    stock: 10,
  },
];

export const categories = [
  { id: "all", name: "전체", icon: "⭐" },
  { id: "피규어", name: "피규어", icon: "🎭" },
  { id: "굿즈", name: "굿즈", icon: "🎁" },
  { id: "한정판", name: "한정판", icon: "🔥" },
  { id: "신상품", name: "신상품", icon: "✨" },
  { id: "세일", name: "세일", icon: "💰" },
];
