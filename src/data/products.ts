export type ComboItem = {
  name: string;
  qty: number;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  unit: string;
  rating: number;
  reviews: number;
  image: string;
  tag?: string;
  description: string;
  /** Hidden products stay in the catalogue but are not shown in the shop. */
  active: boolean;
  stock: number;
  sold: number;
  /** Combo / bundle products live in their own "Special Combos" section. */
  isCombo?: boolean;
  /** What is inside a combo, shown on the combo card and in the cart. */
  comboItems?: ComboItem[];
  /** The hero combo gets the biggest, most eye-catching card. */
  featured?: boolean;
};

export type SiteSettings = {
  brandName: string;
  tagline: string;
  logo: string;
  email: string;
  phone: string;
  /** WhatsApp number with country code, digits only. Example: 919876543210 */
  whatsapp: string;
  address: string;
  heroKicker: string;
  heroTitle1: string;
  heroTitle2: string;
  heroText: string;
};

export const SEED_SETTINGS: SiteSettings = {
  brandName: "Matibari",
  tagline: "Handcrafted | Natural | Traditional",
  logo: "/images/logo.png",
  email: "hello@matibari.in",
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  address: "14/2, Krishi Bhavan Road, Indore, Madhya Pradesh 452001, India",
  heroKicker: "100% Certified Organic · Made in India",
  heroTitle1: "From Our Soil to",
  heroTitle2: "Your Soul.",
  heroText:
    "Matibari brings you pesticide-free spices, grains, honey and ghee sourced directly from small farmers across India — grown the way nature intended, for three generations and counting.",
};

export const SEED_PRODUCTS: Product[] = [
  {
    id: "ghee",
    name: "A2 Bilona Desi Ghee",
    category: "Dairy",
    price: 799,
    mrp: 899,
    unit: "500ml",
    rating: 4.9,
    reviews: 521,
    image: "/images/product-ghee.jpg",
    tag: "Bestseller",
    description:
      "Slow-cooked from cultured A2 milk using the traditional bilona method — rich aroma, granular texture and pure nutrition.",
    active: true,
    stock: 41,
    sold: 176,
  },
  {
    id: "honey",
    name: "Raw Forest Honey",
    category: "Sweeteners",
    price: 349,
    mrp: 420,
    unit: "500g",
    rating: 4.9,
    reviews: 456,
    image: "/images/product-honey.jpg",
    tag: "Farmer's Pick",
    description:
      "Unheated, unfiltered honey collected from wild forest hives — naturally rich in antioxidants and flavour.",
    active: true,
    stock: 62,
    sold: 198,
  },
  {
    id: "pickle",
    name: "Aam ka Achaar",
    category: "Pickles",
    price: 249,
    mrp: 299,
    unit: "400g",
    rating: 4.8,
    reviews: 187,
    image: "/images/product-pickle.jpg",
    tag: "New",
    description:
      "Sun-matured raw mango pickle with cold-pressed mustard oil and hand-ground masala, made using a family recipe.",
    active: true,
    stock: 28,
    sold: 96,
  },
  {
    id: "bori-pack-4",
    name: "Bori — Pack of 4",
    category: "Bori",
    price: 250,
    mrp: 320,
    unit: "Pack of 4",
    rating: 4.8,
    reviews: 96,
    image: "",
    tag: "Traditional",
    description:
      "Sun-dried lentil bori, hand-made the traditional way — crisp, wholesome and perfect for curries and dals.",
    active: true,
    stock: 40,
    sold: 62,
  },
  {
    id: "bori-pack-3",
    name: "Bori — Pack of 3",
    category: "Bori",
    price: 250,
    mrp: 260,
    unit: "Pack of 3",
    rating: 4.8,
    reviews: 74,
    image: "",
    description:
      "Sun-dried lentil bori, hand-made the traditional way — crisp, wholesome and perfect for curries and dals.",
    active: true,
    stock: 45,
    sold: 51,
  },
  {
    id: "bori-pack-2",
    name: "Bori — Pack of 2",
    category: "Bori",
    price: 250,
    mrp: 255,
    unit: "Pack of 2",
    rating: 4.7,
    reviews: 58,
    image: "",
    description:
      "Sun-dried lentil bori, hand-made the traditional way — crisp, wholesome and perfect for curries and dals.",
    active: true,
    stock: 55,
    sold: 44,
  },
  {
    id: "achar-tok-jhal-250",
    name: "Tok-Jhal Achar Combo",
    category: "Pickles",
    price: 250,
    mrp: 299,
    unit: "250g combo",
    rating: 4.9,
    reviews: 132,
    image: "/images/product-pickle.jpg",
    tag: "Tok + Jhal",
    description:
      "A tangy-spicy duo — our classic Tok (sour) and Jhal (spicy) mango pickles packed together in one combo.",
    active: true,
    stock: 36,
    sold: 88,
  },
  {
    id: "achar-tok-jhal-500",
    name: "Tok-Jhal Achar Combo",
    category: "Pickles",
    price: 500,
    mrp: 579,
    unit: "500g combo",
    rating: 4.9,
    reviews: 132,
    image: "/images/product-pickle.jpg",
    tag: "Family Pack",
    description:
      "The bigger Tok + Jhal mango pickle duo — same tangy-spicy taste, double the quantity for the whole family.",
    active: true,
    stock: 22,
    sold: 57,
  },
  {
    id: "combo-achar-bori",
    name: "Achar + Bori Combo",
    category: "Special Combos",
    price: 449,
    mrp: 500,
    unit: "2 products",
    rating: 4.9,
    reviews: 64,
    image: "/images/product-pickle.jpg",
    tag: "Special Combo",
    description:
      "Our tangy Tok-Jhal Achar paired with traditional sun-dried Bori — a match made in a Bengali kitchen.",
    active: true,
    stock: 30,
    sold: 41,
    isCombo: true,
    comboItems: [
      { name: "Tok-Jhal Achar", qty: 1, image: "/images/product-pickle.jpg" },
      { name: "Bori", qty: 1, image: "" },
    ],
  },
  {
    id: "combo-trio",
    name: "Honey + Bori + Achar Combo",
    category: "Special Combos",
    price: 799,
    mrp: 999,
    unit: "3 products",
    rating: 5,
    reviews: 118,
    image: "/images/product-honey.jpg",
    tag: "Best Value",
    description:
      "The complete Matibari experience — Raw Forest Honey, traditional Bori and our tangy Tok-Jhal Achar, bundled at one special price.",
    active: true,
    stock: 25,
    sold: 73,
    isCombo: true,
    featured: true,
    comboItems: [
      { name: "Raw Forest Honey", qty: 1, image: "/images/product-honey.jpg" },
      { name: "Bori", qty: 1, image: "" },
      { name: "Tok-Jhal Achar", qty: 1, image: "/images/product-pickle.jpg" },
    ],
  },
  {
    id: "turmeric",
    name: "Lakadong Turmeric Powder",
    category: "Spices",
    price: 249,
    mrp: 299,
    unit: "200g",
    rating: 4.8,
    reviews: 312,
    image: "/images/product-turmeric.jpg",
    tag: "Bestseller",
    description: "High-curcumin turmeric, stone-ground in small batches.",
    active: false,
    stock: 84,
    sold: 326,
  },
  {
    id: "rice",
    name: "Aged Organic Basmati Rice",
    category: "Grains",
    price: 399,
    mrp: 450,
    unit: "1kg",
    rating: 4.7,
    reviews: 208,
    image: "/images/product-rice.jpg",
    description: "Naturally aged aromatic basmati from organic paddies.",
    active: false,
    stock: 52,
    sold: 214,
  },
  {
    id: "spices",
    name: "Everyday Masala Spice Box",
    category: "Spices",
    price: 599,
    mrp: 699,
    unit: "Set of 7",
    rating: 4.6,
    reviews: 174,
    image: "/images/product-spices.jpg",
    description: "Seven everyday organic spices in one handcrafted box.",
    active: false,
    stock: 9,
    sold: 143,
  },
  {
    id: "oil",
    name: "Cold-Pressed Coconut Oil",
    category: "Oils",
    price: 299,
    mrp: 349,
    unit: "1L",
    rating: 4.7,
    reviews: 265,
    image: "/images/product-oil.jpg",
    description: "Wood-pressed virgin coconut oil with no additives.",
    active: false,
    stock: 63,
    sold: 126,
  },
];
