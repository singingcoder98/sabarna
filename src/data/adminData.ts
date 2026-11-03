import { SEED_PRODUCTS } from "./products";

export type OrderStatus = "Processing" | "Packed" | "Shipped" | "Delivered";

export type AdminOrder = {
  id: string;
  customer: string;
  email: string;
  placedAt: string;
  itemCount: number;
  productName: string;
  productImage: string;
  total: number;
  payment: "Paid" | "Refunded";
  paymentMethod: "UPI" | "Card" | "Netbanking";
  status: OrderStatus;
};

const IMG = (id: string) =>
  SEED_PRODUCTS.find((product) => product.id === id)?.image ?? SEED_PRODUCTS[0].image;

// Sample dashboard data for the front-end preview. All demo orders are prepaid online — COD is disabled store-wide.
export const DEMO_ORDERS: AdminOrder[] = [
  {
    id: "MB-10482",
    customer: "Aarav Sharma",
    email: "aarav.s@example.com",
    placedAt: "Today, 10:42 am",
    itemCount: 3,
    productName: "A2 Bilona Desi Ghee",
    productImage: IMG("ghee"),
    total: 2397,
    payment: "Paid",
    paymentMethod: "UPI",
    status: "Processing",
  },
  {
    id: "MB-10481",
    customer: "Meera Iyer",
    email: "meera.i@example.com",
    placedAt: "Today, 9:18 am",
    itemCount: 2,
    productName: "Raw Forest Honey",
    productImage: IMG("honey"),
    total: 698,
    payment: "Paid",
    paymentMethod: "Card",
    status: "Packed",
  },
  {
    id: "MB-10480",
    customer: "Kabir Malhotra",
    email: "kabir.m@example.com",
    placedAt: "Today, 8:36 am",
    itemCount: 4,
    productName: "Aam ka Achaar",
    productImage: IMG("pickle"),
    total: 996,
    payment: "Paid",
    paymentMethod: "UPI",
    status: "Shipped",
  },
  {
    id: "MB-10479",
    customer: "Ananya Rao",
    email: "ananya.r@example.com",
    placedAt: "Yesterday, 6:22 pm",
    itemCount: 1,
    productName: "A2 Bilona Desi Ghee",
    productImage: IMG("ghee"),
    total: 799,
    payment: "Paid",
    paymentMethod: "Netbanking",
    status: "Delivered",
  },
  {
    id: "MB-10478",
    customer: "Devika Nair",
    email: "devika.n@example.com",
    placedAt: "Yesterday, 4:07 pm",
    itemCount: 3,
    productName: "Raw Forest Honey",
    productImage: IMG("honey"),
    total: 1047,
    payment: "Paid",
    paymentMethod: "Card",
    status: "Delivered",
  },
  {
    id: "MB-10477",
    customer: "Ishaan Desai",
    email: "ishaan.d@example.com",
    placedAt: "Yesterday, 2:54 pm",
    itemCount: 2,
    productName: "Aam ka Achaar",
    productImage: IMG("pickle"),
    total: 498,
    payment: "Refunded",
    paymentMethod: "UPI",
    status: "Delivered",
  },
  {
    id: "MB-10476",
    customer: "Tara Kapoor",
    email: "tara.k@example.com",
    placedAt: "18 Oct, 11:30 am",
    itemCount: 2,
    productName: "Raw Forest Honey",
    productImage: IMG("honey"),
    total: 698,
    payment: "Paid",
    paymentMethod: "UPI",
    status: "Shipped",
  },
  {
    id: "MB-10475",
    customer: "Rohan Joshi",
    email: "rohan.j@example.com",
    placedAt: "18 Oct, 10:02 am",
    itemCount: 5,
    productName: "A2 Bilona Desi Ghee",
    productImage: IMG("ghee"),
    total: 3995,
    payment: "Paid",
    paymentMethod: "Netbanking",
    status: "Processing",
  },
];

export const WEEKLY_REVENUE = [
  { day: "Mon", amount: 22500 },
  { day: "Tue", amount: 29800 },
  { day: "Wed", amount: 24600 },
  { day: "Thu", amount: 35400 },
  { day: "Fri", amount: 31200 },
  { day: "Sat", amount: 42800 },
  { day: "Sun", amount: 38600 },
];
