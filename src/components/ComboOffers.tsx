import { Plus, Sparkles, Star, Users } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useSite } from "../context/SiteContext";
import ProductImage from "./ProductImage";
import type { Product } from "../data/products";

function Savings({ product }: { product: Product }) {
  const saved = product.mrp > product.price ? product.mrp - product.price : 0;
  const percent = saved > 0 ? Math.round((saved / product.mrp) * 100) : 0;
  if (!saved) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#e9c46a] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#2c3d1c]">
      Save ₹{saved} · {percent}% off
    </span>
  );
}

function Includes({ product }: { product: Product }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {product.comboItems?.map((item) => (
        <li
          key={item.name}
          className="flex items-center gap-2 rounded-full border border-[#e9c46a]/30 bg-white/[0.07] py-1 pl-1 pr-3"
        >
          {item.image ? (
            <img src={item.image} alt="" className="h-7 w-7 rounded-full object-cover" />
          ) : (
            <ProductImage
              product={{ name: item.name, image: "", category: "combo" }}
              className="h-7 w-7 rounded-full"
            />
          )}
          <span className="text-[11px] font-medium text-[#f4edd8]">
            {item.name}
            {item.qty > 1 ? ` ×${item.qty}` : ""}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ComboCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  const { addItem } = useCart();

  return (
    <article
      className={`relative overflow-hidden rounded-3xl transition-transform duration-300 hover:-translate-y-1 ${
        featured
          ? "border-2 border-[#e9c46a] bg-gradient-to-br from-[#2e4322] via-[#24351b] to-[#1a2714] shadow-[0_25px_60px_-20px_rgba(233,196,106,0.45)] lg:col-span-2"
          : "border border-[#e9c46a]/25 bg-gradient-to-br from-[#26381d] to-[#1b2915] shadow-[0_18px_45px_-18px_rgba(0,0,0,0.5)]"
      }`}
    >
      {featured && (
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#e9c46a]/20 blur-3xl" />
      )}

      <div
        className={`relative grid gap-6 p-6 sm:p-8 ${
          featured ? "lg:grid-cols-[1.15fr_1fr] lg:items-center" : ""
        }`}
      >
        {/* Text side */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e9c46a] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#2c3d1c]">
              <Sparkles size={12} />
              Special Combo
            </span>
            {product.tag && (
              <span
                className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] ${
                  featured
                    ? "bg-[#b5582c] text-white"
                    : "border border-[#e9c46a]/40 text-[#e9c46a]"
                }`}
              >
                {product.tag}
              </span>
            )}
            {featured && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e9c46a]/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#e9c46a]">
                <Users size={12} />
                3 Products
              </span>
            )}
          </div>

          <h3
            className={`mt-4 font-serif font-bold leading-tight text-[#fdf8ec] ${
              featured ? "text-2xl sm:text-3xl lg:text-[2.15rem]" : "text-xl sm:text-2xl"
            }`}
          >
            {product.name}
          </h3>

          <p
            className={`mt-3 leading-relaxed text-[#f4edd8]/75 ${
              featured ? "text-sm sm:text-[15px]" : "text-sm"
            }`}
          >
            {product.description}
          </p>

          <div className="mt-5">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e9c46a]/80">
              What's inside
            </p>
            <Includes product={product} />
          </div>

          <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className={`font-serif font-bold text-[#fdf8ec] ${featured ? "text-4xl" : "text-2xl"}`}>
                  ₹{product.price}
                </span>
                {product.mrp > product.price && (
                  <span className="text-sm text-[#f4edd8]/50 line-through">₹{product.mrp}</span>
                )}
              </div>
              <p className="mt-1 text-[11px] text-[#f4edd8]/60">
                {product.unit} · inclusive of taxes
              </p>
            </div>
            <Savings product={product} />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => addItem(product)}
              className={`inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold shadow-lg transition-transform hover:scale-[1.04] ${
                featured
                  ? "bg-[#e9c46a] text-[#2c3d1c] shadow-[#e9c46a]/35"
                  : "bg-[#b5582c] text-white shadow-[#b5582c]/35"
              }`}
            >
              <Plus size={17} />
              {featured ? "Buy This Combo" : "Buy Combo"}
            </button>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-[#f4edd8]/60">
              <Star size={13} className="text-[#e9c46a]" fill="currentColor" />
              {product.rating} · {product.reviews} happy customers
            </span>
          </div>
        </div>

        {/* Image side */}
        <div className={featured ? "" : "mt-2"}>
          <div
            className={`grid gap-3 ${
              featured ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-3"
            }`}
          >
            {product.comboItems?.map((item, index) => (
              <div
                key={item.name}
                className={`relative overflow-hidden rounded-2xl border border-[#e9c46a]/25 ${
                  featured && index === 0 ? "col-span-2 sm:col-span-1" : ""
                }`}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    className={`w-full object-cover ${featured ? "h-32 sm:h-40" : "h-24 sm:h-28"}`}
                  />
                ) : (
                  <ProductImage
                    product={{ name: item.name, image: "", category: "combo" }}
                    className={`w-full ${featured ? "h-32 sm:h-40" : "h-24 sm:h-28"}`}
                  />
                )}
                <span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/45 px-2 py-0.5 text-[9px] font-semibold text-white backdrop-blur-sm">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-[10px] uppercase tracking-[0.16em] text-[#e9c46a]/70">
            Bundle &amp; save · one click, everything in your basket
          </p>
        </div>
      </div>
    </article>
  );
}

export default function ComboOffers() {
  const { activeProducts } = useSite();
  const combos = activeProducts.filter((product) => product.isCombo);
  const featured = combos.find((product) => product.featured);
  const rest = combos.filter((product) => !product.featured);

  if (combos.length === 0) return null;

  return (
    <section
      id="combos"
      className="relative overflow-hidden bg-[#1e2a14] py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-[#e9c46a]/[0.07] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#e9c46a]/35 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#e9c46a]">
            <Sparkles size={13} />
            Limited Period Bundles
          </span>
          <h2 className="mt-5 font-serif text-3xl font-bold leading-tight text-[#fdf8ec] sm:text-4xl lg:text-[2.75rem]">
            Special Combos — <span className="text-[#e9c46a]">More Goodness, More Value!</span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[#f4edd8]/70">
            Our best-loved organic favourites bundled together at a price that
            makes more sense — perfect for gifting, stocking up or tasting the
            full Matibari range.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {featured && <ComboCard product={featured} featured />}
          {rest.map((product) => (
            <ComboCard key={product.id} product={product} />
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-[#f4edd8]/55">
          Combo prices are managed from the admin dashboard · Free shipping on orders above ₹999
        </p>
      </div>
    </section>
  );
}
