import { useMemo, useState } from "react";
import { Plus, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useSite } from "../context/SiteContext";
import ProductImage from "./ProductImage";

export default function Products() {
  const { activeProducts } = useSite();
  const { addItem } = useCart();
  // Combos have their own premium section — regular shop stays individual products only.
  const shopProducts = useMemo(
    () => activeProducts.filter((product) => !product.isCombo),
    [activeProducts]
  );
  const categories = useMemo(() => {
    const names = shopProducts.map((product) => product.category);
    return ["All", ...Array.from(new Set(names))];
  }, [shopProducts]);
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? shopProducts
      : shopProducts.filter((product) => product.category === active);

  return (
    <section id="products" className="bg-[#f4edd8] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#b5582c]">
            Our Shop
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-[#2f3e24] sm:text-4xl lg:text-[2.6rem]">
            Wholesome Staples for Your Kitchen
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[#4c5a40]">
            Hand-picked, lab-tested and packed fresh — everything you need for
            a truly organic Indian pantry.
          </p>
        </div>

        {activeProducts.length > 0 ? (
          <>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                    active === cat
                      ? "bg-[#4a6b3d] text-white shadow-md"
                      : "bg-white text-[#39492e] hover:bg-[#4a6b3d]/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product) => (
                <article
                  key={product.id}
                  className="group relative overflow-hidden rounded-3xl bg-white shadow-sm transition-shadow hover:shadow-xl"
                >
                  {product.tag && (
                    <span className="absolute left-4 top-4 z-10 rounded-full bg-[#b5582c] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                      {product.tag}
                    </span>
                  )}
                  {product.stock <= 10 && (
                    <span className="absolute right-4 top-4 z-10 rounded-full bg-[#2f3e24] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#f4edd8]">
                      {product.stock <= 0 ? "Sold out" : "Few left"}
                    </span>
                  )}
                  <div className="aspect-[4/3] overflow-hidden">
                    <ProductImage
                      product={product}
                      className="h-full w-full transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1 text-[#e9c46a]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          fill={i < Math.round(product.rating) ? "currentColor" : "none"}
                          strokeWidth={1.5}
                        />
                      ))}
                      <span className="ml-1 text-xs text-[#4c5a40]/70">
                        ({product.reviews})
                      </span>
                    </div>
                    <h3 className="mt-2 font-serif text-base font-bold text-[#2f3e24]">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#4c5a40]/70">{product.unit}</p>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#4c5a40]/80">
                      {product.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-[#b5582c]">
                          ₹{product.price}
                        </span>
                        {product.mrp > product.price && (
                          <span className="text-xs text-[#4c5a40]/50 line-through">
                            ₹{product.mrp}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => addItem(product)}
                        disabled={product.stock <= 0}
                        aria-label={`Add ${product.name} to cart`}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4a6b3d] text-white shadow-md transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:bg-[#4c5a40]/30"
                      >
                        <Plus size={17} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-12 rounded-3xl border border-dashed border-[#2f3e24]/20 bg-white/60 px-6 py-16 text-center">
            <p className="font-serif text-xl font-bold text-[#2f3e24]">
              Fresh stock is on its way
            </p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[#4c5a40]">
              No products are live right now. Add them from the admin dashboard
              and they will appear here instantly.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
