import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Boxes,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Clock3,
  IndianRupee,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { DEMO_ORDERS, WEEKLY_REVENUE, type AdminOrder, type OrderStatus } from "../../data/adminData";
import { useSite } from "../../context/SiteContext";
import AdminCatalogue from "./AdminCatalogue";
import AdminSettings from "./AdminSettings";

type DashboardView = "overview" | "orders" | "inventory" | "catalogue" | "settings";

const CURRENCY = (value: number) => `₹${value.toLocaleString("en-IN")}`;

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ClipboardList, badge: "18" },
  { id: "catalogue", label: "Products", icon: Package },
  { id: "inventory", label: "Inventory", icon: Boxes },
  { id: "settings", label: "Store settings", icon: Settings },
] as const;

const STATUS_CLASSES: Record<OrderStatus, string> = {
  Processing: "bg-[#fff3dc] text-[#9b661a]",
  Packed: "bg-[#edf1fc] text-[#4a5c9a]",
  Shipped: "bg-[#e8f4ed] text-[#39734c]",
  Delivered: "bg-[#eef0ed] text-[#667164]",
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  Processing: "Packed",
  Packed: "Shipped",
  Shipped: "Delivered",
};

function MetricCard({
  icon: Icon,
  label,
  value,
  change,
  note,
  negative = false,
}: {
  icon: typeof IndianRupee;
  label: string;
  value: string;
  change: string;
  note: string;
  negative?: boolean;
}) {
  return (
    <article className="rounded-2xl border border-[#e5e9e1] bg-white p-5 shadow-[0_2px_10px_rgba(31,49,34,0.025)] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3ea] text-[#49694a]">
          <Icon size={19} strokeWidth={1.9} />
        </span>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${negative ? "bg-[#fff0ec] text-[#b85e45]" : "bg-[#e9f5ed] text-[#3f7b50]"}`}>
          {negative ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}
          {change}
        </span>
      </div>
      <p className="mt-5 text-xs font-medium text-[#758073]">{label}</p>
      <div className="mt-1 flex items-end justify-between gap-2">
        <p className="font-serif text-2xl font-semibold tracking-tight text-[#243627] sm:text-[1.8rem]">{value}</p>
        <p className="pb-1 text-[10px] text-[#899286]">{note}</p>
      </div>
    </article>
  );
}

function RevenueChart() {
  const values = WEEKLY_REVENUE.map((point) => point.amount);
  const min = Math.min(...values) - 5000;
  const max = Math.max(...values) + 5000;
  const points = WEEKLY_REVENUE.map((point, index) => {
    const x = 24 + index * (652 / (WEEKLY_REVENUE.length - 1));
    const y = 178 - ((point.amount - min) / (max - min)) * 140;
    return { ...point, x, y };
  });
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `M${points[0].x},190 L${points.map((point) => `${point.x},${point.y}`).join(" L")} L${points[points.length - 1].x},190 Z`;

  return (
    <section className="rounded-2xl border border-[#e5e9e1] bg-white p-5 shadow-[0_2px_10px_rgba(31,49,34,0.025)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#2a3b2d]">Sales overview</p>
          <p className="mt-1 text-xs text-[#879083]">Revenue performance for this week</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-[#e4e8e1] px-3 py-2 text-[11px] font-semibold text-[#60705e] transition-colors hover:bg-[#f7f8f4]">
          <CalendarDays size={14} />
          This week
          <ChevronDown size={13} />
        </button>
      </div>

      <div className="mt-5 flex items-baseline gap-2">
        <p className="font-serif text-3xl font-semibold text-[#263b28]">₹2,44,900</p>
        <span className="inline-flex items-center text-xs font-semibold text-[#4a8759]">
          <TrendingUp size={14} className="mr-1" /> 12.8%
        </span>
      </div>

      <div className="mt-4">
        <div className="flex h-[190px] gap-2">
          <div className="flex w-9 flex-col justify-between pb-1 pt-1 text-[9px] text-[#98a093]">
            <span>₹50k</span>
            <span>₹35k</span>
            <span>₹20k</span>
          </div>
          <div className="relative min-w-0 flex-1">
            <div className="absolute inset-x-0 top-[8px] border-t border-dashed border-[#e8ece5]" />
            <div className="absolute inset-x-0 top-[78px] border-t border-dashed border-[#e8ece5]" />
            <div className="absolute inset-x-0 top-[148px] border-t border-dashed border-[#e8ece5]" />
            <svg viewBox="0 0 700 200" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
              <defs>
                <linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#73976e" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#73976e" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={area} fill="url(#revenue-fill)" />
              <polyline points={line} fill="none" stroke="#5e825d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              {points.map((point) => (
                <circle key={point.day} cx={point.x} cy={point.y} r="4" fill="#fff" stroke="#5e825d" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
              ))}
            </svg>
          </div>
        </div>
        <div className="ml-11 mt-2 grid grid-cols-7 text-center text-[10px] font-medium text-[#929b8f]">
          {WEEKLY_REVENUE.map((point) => <span key={point.day}>{point.day}</span>)}
        </div>
      </div>
    </section>
  );
}

function OrderStatusSummary({ orders, onViewOrders }: { orders: AdminOrder[]; onViewOrders: () => void }) {
  const counts = [
    { status: "Processing", label: "Needs processing", color: "bg-[#d5a248]" },
    { status: "Packed", label: "Packed, ready to ship", color: "bg-[#7891d0]" },
    { status: "Shipped", label: "On the way", color: "bg-[#6c9e78]" },
    { status: "Delivered", label: "Delivered", color: "bg-[#9da89b]" },
  ] as const;

  return (
    <section className="rounded-2xl border border-[#e5e9e1] bg-white p-5 shadow-[0_2px_10px_rgba(31,49,34,0.025)] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#2a3b2d]">Order activity</p>
          <p className="mt-1 text-xs text-[#879083]">Latest order fulfilment</p>
        </div>
        <button onClick={onViewOrders} className="text-xs font-semibold text-[#4a7049] hover:text-[#b5582c]">
          View all
        </button>
      </div>
      <div className="mt-5 space-y-4">
        {counts.map((item) => {
          const count = orders.filter((order) => order.status === item.status).length;
          return (
            <div key={item.status}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                <span className="flex items-center gap-2 text-[#697565]">
                  <span className={`h-2 w-2 rounded-full ${item.color}`} />
                  {item.label}
                </span>
                <span className="font-semibold text-[#344532]">{count}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#f0f2ed]">
                <div className={`h-full rounded-full ${item.color}`} style={{ width: `${Math.max(8, (count / Math.max(orders.length, 1)) * 100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <button
        onClick={onViewOrders}
        className="mt-6 flex w-full items-center justify-between rounded-xl bg-[#f3f6f0] px-3.5 py-3 text-left transition-colors hover:bg-[#edf2e8]"
      >
        <span className="flex items-center gap-2 text-xs font-semibold text-[#456144]">
          <Clock3 size={15} />
          Review pending orders
        </span>
        <ChevronRight size={15} className="text-[#6c8069]" />
      </button>
    </section>
  );
}

function TopProducts() {
  const { products: allProducts } = useSite();
  const products = allProducts
    .slice()
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 4);

  return (
    <section className="rounded-2xl border border-[#e5e9e1] bg-white p-5 shadow-[0_2px_10px_rgba(31,49,34,0.025)] sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-[#2a3b2d]">Best sellers</p>
          <p className="mt-1 text-xs text-[#879083]">Top products this month</p>
        </div>
        <ShoppingBag size={17} className="text-[#76906e]" />
      </div>
      <div className="mt-4 divide-y divide-[#edf0eb]">
        {products.map((product, index) => (
          <div key={product.id} className="flex items-center gap-3 py-3 first:pt-1 last:pb-0">
            <span className="w-4 text-[11px] font-semibold text-[#9aa397]">0{index + 1}</span>
            <img src={product.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[#354634]">{product.name}</p>
              <p className="mt-0.5 text-[10px] text-[#899386]">{product.sold} orders</p>
            </div>
            <ArrowUpRight size={14} className="text-[#53845d]" />
          </div>
        ))}
        {products.length === 0 && (
          <p className="py-6 text-center text-xs text-[#899386]">No products yet.</p>
        )}
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const StatusIcon = status === "Delivered" ? CheckCircle2 : status === "Shipped" ? TrendingUp : status === "Packed" ? Package : Clock3;
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${STATUS_CLASSES[status]}`}>
      <StatusIcon size={12} />
      {status}
    </span>
  );
}

function OrdersTable({
  orders,
  onAdvance,
}: {
  orders: AdminOrder[];
  onAdvance: (order: AdminOrder) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[780px] border-collapse text-left">
        <thead>
          <tr className="border-b border-[#edf0eb] text-[10px] font-semibold uppercase tracking-[0.1em] text-[#929b8e]">
            <th className="px-5 py-3.5">Order</th>
            <th className="px-4 py-3.5">Customer</th>
            <th className="px-4 py-3.5">Date</th>
            <th className="px-4 py-3.5">Total</th>
            <th className="px-4 py-3.5">Payment</th>
            <th className="px-4 py-3.5">Status</th>
            <th className="px-5 py-3.5 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const next = NEXT_STATUS[order.status];
            return (
              <tr key={order.id} className="border-b border-[#f0f2ee] last:border-0 hover:bg-[#fafbf9]">
                <td className="px-5 py-4">
                  <span className="block text-xs font-bold text-[#354634]">{order.id}</span>
                  <span className="mt-1 block text-[10px] text-[#929b8e]">{order.itemCount} items</span>
                </td>
                <td className="px-4 py-4">
                  <span className="block whitespace-nowrap text-xs font-semibold text-[#354634]">{order.customer}</span>
                  <span className="mt-1 block text-[10px] text-[#929b8e]">{order.email}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-[11px] text-[#758073]">{order.placedAt}</td>
                <td className="whitespace-nowrap px-4 py-4 text-xs font-semibold text-[#354634]">{CURRENCY(order.total)}</td>
                <td className="px-4 py-4">
                  <span className={`block text-[11px] font-medium ${order.payment === "Paid" ? "text-[#527a57]" : "text-[#b5582c]"}`}>
                    {order.payment} • {order.paymentMethod}
                  </span>
                  <span className="mt-0.5 block text-[9px] text-[#929b8e]">Online</span>
                </td>
                <td className="px-4 py-4"><StatusBadge status={order.status} /></td>
                <td className="px-5 py-4 text-right">
                  {next ? (
                    <button
                      onClick={() => onAdvance(order)}
                      className="whitespace-nowrap rounded-lg border border-[#dfe7dc] px-2.5 py-1.5 text-[10px] font-semibold text-[#496b49] transition-colors hover:border-[#4a6b3d] hover:bg-[#eff4ed]"
                    >
                      {order.status === "Processing" ? "Pack order" : order.status === "Packed" ? "Ship order" : "Mark delivered"}
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#899386]">
                      <CheckCircle2 size={13} /> Complete
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
          {orders.length === 0 && (
            <tr>
              <td colSpan={7} className="px-5 py-12 text-center text-sm text-[#849080]">
                No orders match those filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function OrdersView({
  orders,
  onAdvance,
}: {
  orders: AdminOrder[];
  onAdvance: (order: AdminOrder) => void;
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "All statuses" || order.status === statusFilter;
      const matchesQuery = !normalizedQuery || [order.id, order.customer, order.email].some((value) => value.toLowerCase().includes(normalizedQuery));
      return matchesStatus && matchesQuery;
    });
  }, [orders, query, statusFilter]);

  return (
    <>
      <div className="mb-4 rounded-xl border border-[#dfe8dc] bg-[#eef4ec] px-4 py-3 text-[11px] font-medium text-[#456144]">
        All orders are prepaid online (UPI / Card / Netbanking). Cash on Delivery is disabled.
      </div>
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs text-[#818c7d]">Review, search and update your recent customer orders.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative block">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b9587]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search orders or customers"
              className="h-10 w-full rounded-lg border border-[#e1e7de] bg-white pl-9 pr-3 text-xs outline-none focus:border-[#7b9776] sm:w-56"
            />
          </label>
          <label className="relative block">
            <span className="sr-only">Filter by order status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-[#e1e7de] bg-white pl-3 pr-9 text-xs text-[#4e5b4d] outline-none focus:border-[#7b9776] sm:w-40"
            >
              {["All statuses", "Processing", "Packed", "Shipped", "Delivered"].map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#818c7d]" />
          </label>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-[#e5e9e1] bg-white shadow-[0_2px_10px_rgba(31,49,34,0.025)]">
        <div className="flex items-center justify-between gap-3 border-b border-[#edf0eb] px-5 py-4">
          <p className="text-sm font-semibold text-[#2a3b2d]">All orders <span className="ml-1 text-xs font-medium text-[#879083]">({filteredOrders.length})</span></p>
          <span className="inline-flex items-center gap-1.5 text-[10px] text-[#899386]"><ShieldCheck size={13} /> Demo records</span>
        </div>
        <OrdersTable orders={filteredOrders} onAdvance={onAdvance} />
      </div>
    </>
  );
}

function InventoryView() {
  const { products } = useSite();
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e5e9e1] bg-white shadow-[0_2px_10px_rgba(31,49,34,0.025)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0eb] px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-[#2a3b2d]">Stock overview</p>
          <p className="mt-1 text-xs text-[#879083]">Live inventory from your product catalogue</p>
        </div>
        <span className="rounded-lg bg-[#fff3dc] px-3 py-2 text-[11px] font-semibold text-[#93651f]">
          {products.filter((item) => item.stock < 20).length} items running low
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left">
          <thead>
            <tr className="border-b border-[#edf0eb] text-[10px] font-semibold uppercase tracking-[0.1em] text-[#929b8e]">
              <th className="px-5 py-3.5">Product</th>
              <th className="px-4 py-3.5">Category</th>
              <th className="px-4 py-3.5">Price</th>
              <th className="px-4 py-3.5">Available stock</th>
              <th className="px-5 py-3.5 text-right">Sold this month</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const lowStock = product.stock < 20;
              return (
                <tr key={product.id} className="border-b border-[#f0f2ee] last:border-0">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      <div>
                        <span className="block text-xs font-semibold text-[#354634]">{product.name}</span>
                        {!product.active && (
                          <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-wide text-[#9aa397]">
                            Hidden from shop
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-[#758073]">{product.category}</td>
                  <td className="px-4 py-3.5 text-xs font-semibold text-[#354634]">{CURRENCY(product.price)}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-2 text-xs font-semibold ${lowStock ? "text-[#b5582c]" : "text-[#547b58]"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${lowStock ? "bg-[#c3764b]" : "bg-[#6a9b6d]"}`} />
                      {product.stock} units{lowStock ? " · Restock soon" : ""}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-xs text-[#647260]">{product.sold}</td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-xs text-[#899386]">
                  No products in the catalogue yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminDashboard({
  onLogout,
  adminName = "Admin",
}: {
  onLogout: () => void;
  adminName?: string;
}) {
  const [view, setView] = useState<DashboardView>("overview");
  const [orders, setOrders] = useState(DEMO_ORDERS);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { settings } = useSite();

  const pageTitles: Record<DashboardView, string> = {
    overview: "Overview",
    orders: "Orders",
    inventory: "Inventory",
    catalogue: "Products",
    settings: "Store settings",
  };

  const updateOrder = (order: AdminOrder) => {
    const nextStatus = NEXT_STATUS[order.status];
    if (!nextStatus) return;
    setOrders((current) => current.map((entry) => entry.id === order.id ? { ...entry, status: nextStatus } : entry));
  };

  const handleNavigate = (nextView: DashboardView) => {
    setView(nextView);
    setMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f7f3] font-sans text-[#27382a] lg:flex">
      {mobileNavOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 z-30 bg-[#17251b]/45 lg:hidden"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col bg-[#263b28] text-[#f7f4e9] transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-6 pb-8 pt-7">
          <a href="/" className="flex items-center gap-3">
            <img
              src={settings.logo}
              alt={`${settings.brandName} logo`}
              className="h-10 w-10 rounded-full bg-[#efe9d8] object-cover ring-1 ring-white/20"
            />
            <span>
              <span className="block font-serif text-lg font-bold leading-tight">{settings.brandName}</span>
              <span className="mt-1 block text-[9px] uppercase tracking-[0.2em] text-[#e9c46a]/75">Store admin</span>
            </span>
          </a>
          <button className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 lg:hidden" onClick={() => setMobileNavOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>

        <div className="px-4">
          <p className="px-3 pb-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">Workspace</p>
          <nav className="space-y-1" aria-label="Admin navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const selected = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-medium transition-colors ${selected ? "bg-[#e9c46a] text-[#263b28]" : "text-white/70 hover:bg-white/[0.07] hover:text-white"}`}
                >
                  <Icon size={17} strokeWidth={1.9} />
                  <span className="flex-1">{item.label}</span>
                  {"badge" in item && <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${selected ? "bg-[#263b28]/10" : "bg-white/10 text-white/75"}`}>{item.badge}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-8 px-4">
          <p className="px-3 pb-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">Store</p>
          <a href="/" className="flex items-center gap-3 rounded-xl px-3 py-3 text-xs font-medium text-white/70 transition-colors hover:bg-white/[0.07] hover:text-white">
            <ShoppingBag size={17} strokeWidth={1.9} />
            View storefront
            <ArrowRight size={13} className="ml-auto" />
          </a>
        </div>

        <div className="mt-auto px-4 pb-5">
          <div className="mb-4 rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
            <div className="flex items-center gap-2 text-[10px] font-semibold text-[#e9c46a]">
              <ShieldCheck size={14} /> Admin workspace
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-white/45">Sample data only. Live sales are not connected.</p>
          </div>
          <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-xs font-medium text-white/65 transition-colors hover:bg-white/[0.07] hover:text-white">
            <LogOut size={17} strokeWidth={1.9} />
            Sign out
          </button>
          <div className="mt-2 flex items-center gap-3 border-t border-white/10 px-3 pt-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ddc587] font-serif text-sm font-bold text-[#263b28]">
              {adminName.trim().charAt(0).toUpperCase() || "A"}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[11px] font-semibold text-white">{adminName}</span>
              <span className="mt-0.5 block truncate text-[9px] text-white/45">Store administrator</span>
            </span>
            <Settings size={15} className="text-white/45" />
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-[70px] items-center justify-between border-b border-[#e6eae3] bg-[#f8f9f6]/95 px-4 backdrop-blur-md sm:px-7 lg:px-9">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileNavOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-lg text-[#526250] hover:bg-[#eaf0e7] lg:hidden" aria-label="Open menu"><Menu size={19} /></button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl font-semibold text-[#2c3d2e]">{pageTitles[view]}</h1>
                <span className="hidden rounded-full bg-[#f5ebcf] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[#8b6925] sm:inline-flex">Demo</span>
              </div>
              <p className="hidden text-[10px] text-[#8a9487] sm:block">Manage your organic store with care.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-1.5 rounded-lg border border-[#e4e9e1] bg-white px-3 py-2 text-[10px] font-medium text-[#687465] sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6c9e78]" />
              All systems normal
            </span>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#e4e9e1] bg-white text-[#61705f] hover:bg-[#f6f8f4]" aria-label="Notifications">
              <Bell size={16} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#b5582c] ring-2 ring-white" />
            </button>
            <a href="/" className="hidden items-center gap-1.5 rounded-lg bg-[#263b28] px-3 py-2 text-[10px] font-semibold text-white transition-colors hover:bg-[#38533a] sm:inline-flex">
              Visit store <ArrowUpRight size={13} />
            </a>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] px-4 pb-10 pt-6 sm:px-7 sm:pt-8 lg:px-9">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs text-[#829080]">
                {new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date())}
              </p>
              <h2 className="mt-1 font-serif text-2xl font-semibold text-[#2c3d2e] sm:text-[1.7rem]">
                {view === "overview"
                  ? `Welcome back, ${adminName}`
                  : view === "orders"
                    ? "Your orders"
                    : view === "inventory"
                      ? "Stock & inventory"
                      : view === "catalogue"
                        ? "Manage your products"
                        : "Make the website yours"}
              </h2>
            </div>
            {view === "overview" && (
              <button onClick={() => handleNavigate("orders")} className="inline-flex items-center gap-2 rounded-xl border border-[#dfe6dc] bg-white px-3.5 py-2.5 text-[11px] font-semibold text-[#49674a] shadow-sm transition-colors hover:bg-[#f4f7f2]">
                <ClipboardList size={15} />
                Review orders
                <ChevronRight size={14} />
              </button>
            )}
          </div>

          {view === "overview" && (
            <>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard icon={IndianRupee} label="Gross revenue" value="₹2,48,420" change="12.8%" note="vs last month" />
                <MetricCard icon={ShoppingBag} label="Orders placed" value="1,284" change="8.2%" note="vs last month" />
                <MetricCard icon={Users} label="Customers" value="946" change="5.4%" note="vs last month" />
                <MetricCard icon={TrendingUp} label="Average order value" value="₹1,936" change="2.1%" note="vs last month" />
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.9fr)]">
                <RevenueChart />
                <OrderStatusSummary orders={orders} onViewOrders={() => handleNavigate("orders")} />
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.9fr)]">
                <section className="overflow-hidden rounded-2xl border border-[#e5e9e1] bg-white shadow-[0_2px_10px_rgba(31,49,34,0.025)]">
                  <div className="flex items-center justify-between gap-3 border-b border-[#edf0eb] px-5 py-4 sm:px-6">
                    <div>
                      <p className="text-sm font-semibold text-[#2a3b2d]">Recent orders</p>
                      <p className="mt-1 text-[10px] text-[#879083]">A quick look at your latest activity</p>
                    </div>
                    <button onClick={() => handleNavigate("orders")} className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4a7049] hover:text-[#b5582c]">
                      All orders <ChevronRight size={14} />
                    </button>
                  </div>
                  <OrdersTable orders={orders.slice(0, 5)} onAdvance={updateOrder} />
                </section>
                <TopProducts />
              </div>
            </>
          )}

          {view === "orders" && <OrdersView orders={orders} onAdvance={updateOrder} />}
          {view === "inventory" && <InventoryView />}
          {view === "catalogue" && <AdminCatalogue />}
          {view === "settings" && <AdminSettings />}

          <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-[#e3e8e1] pt-4 text-[10px] text-[#929b8e]">
            <span>Matibari admin · Sample dashboard</span>
            <span className="inline-flex items-center gap-1.5"><CircleHelp size={13} /> Demo figures, not live store data</span>
          </footer>
        </main>
      </div>
    </div>
  );
}