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
  discountPercent?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isHot?: boolean;
  stock: number;
};

export type CategoryId = "all" | "피규어" | "굿즈";
export type CategoryIconKey = "sparkles" | "drama" | "gift";

export type Category = {
  id: CategoryId;
  name: string;
  iconKey: CategoryIconKey;
};

export const products: Product[] = [
  {
    id: 1,
    name: "PIXEL KNIGHT",
    nameKo: "픽셀 나이트 피규어",
    price: 50,
    discountPercent: 30,
    image: product1,
    category: "피규어",
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
    isNew: true,
    stock: 25,
  },
  {
    id: 3,
    name: "MECHA UNIT-01",
    nameKo: "메카 유닛-01 피규어",
    price: 120,
    discountPercent: 26,
    image: product3,
    category: "피규어",
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
    stock: 18,
  },
  {
    id: 5,
    name: "DRAGON PLUSH",
    nameKo: "드래곤 플러시 인형",
    price: 42,
    image: product5,
    category: "굿즈",
    isNew: true,
    stock: 30,
  },
  {
    id: 6,
    name: "WITCH LUNA",
    nameKo: "위치 루나 피규어",
    price: 75,
    discountPercent: 23,
    image: product6,
    category: "피규어",
    stock: 3,
  },
  {
    id: 7,
    name: "KITSUNE SPIRIT",
    nameKo: "키츠네 스피릿 피규어",
    price: 72,
    image: product7,
    category: "피규어",
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
    isNew: true,
    stock: 15,
  },
  {
    id: 9,
    name: "CAPTAIN BONES",
    nameKo: "캡틴 본즈 피규어",
    price: 80,
    discountPercent: 31,
    image: product9,
    category: "피규어",
    stock: 10,
  },
];

export const defaultSeriesOptions = [
  "원피스",
  "나루토",
  "귀멸의 칼날",
  "주술회전",
  "진격의 거인",
  "하이큐!!",
  "체인소 맨",
  "스파이 패밀리",
  "포켓몬",
  "블루 록",
];

export const categories: Category[] = [
  { id: "all", name: "전체", iconKey: "sparkles" },
  { id: "피규어", name: "피규어", iconKey: "drama" },
  { id: "굿즈", name: "굿즈", iconKey: "gift" },
];
