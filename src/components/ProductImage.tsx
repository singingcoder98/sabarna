import type { Product } from "../data/products";

/**
 * Product photo with a designed fallback tile.
 * Products without a photo (e.g. Bori) get a branded illustration instead of
 * a broken image — admins can upload a real photo any time from the dashboard.
 */
export default function ProductImage({
  product,
  className = "",
  alt,
}: {
  product: Pick<Product, "name" | "image" | "category">;
  className?: string;
  alt?: string;
}) {
  if (product.image) {
    return (
      <img
        src={product.image}
        alt={alt ?? `${product.name} — organic ${product.category.toLowerCase()} by Matibari`}
        loading="lazy"
        decoding="async"
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt ?? product.name}
      className={`flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#f7efdc] via-[#f0e3c6] to-[#e3cfa4] ${className}`}
    >
      <svg viewBox="0 0 120 120" className="h-2/3 w-2/3 opacity-90" aria-hidden="true">
        <circle cx="60" cy="62" r="34" fill="#fff" opacity="0.55" />
        <path
          d="M60 34c12 6 18 16 18 27 0 12-8 21-18 25-10-4-18-13-18-25 0-11 6-21 18-27z"
          fill="#7a9b5f"
          opacity="0.85"
        />
        <path d="M60 36v48" stroke="#3f5a2e" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M60 52c-6-2-10-6-12-11M60 66c6-2 10-6 12-11" stroke="#3f5a2e" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M34 92h52" stroke="#b5582c" strokeWidth="4" strokeLinecap="round" />
        <path d="M40 92c2 7 9 11 20 11s18-4 20-11" fill="#c76a3c" opacity="0.9" />
      </svg>
    </div>
  );
}
