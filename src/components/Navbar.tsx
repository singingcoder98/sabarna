import { useEffect, useState } from "react";
import { Lock, Menu, Search, ShoppingBasket, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useSite } from "../context/SiteContext";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Shop", href: "#products" },
  { label: "Combos", href: "#combos" },
  { label: "Why Organic", href: "#why-us" },
  { label: "Our Process", href: "#process" },
  { label: "Reviews", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const { settings } = useSite();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full bg-[#fbf6ea]/95 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "py-2 shadow-lg" : "py-3 shadow-md"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 lg:px-10">
        <a href="#home" className="flex items-center gap-2.5">
          <img
            src={settings.logo}
            alt={`${settings.brandName} logo`}
            className="h-11 w-11 rounded-full bg-[#efe9d8] object-cover shadow-sm ring-1 ring-[#4a6b3d]/20"
          />
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-xl font-bold tracking-wide text-[#2f3e24]">
              {settings.brandName}
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#8a6d3b]">
              {settings.tagline}
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 xl:gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#39492e] transition-colors hover:text-[#b5582c]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <button
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#39492e]/20 text-[#39492e] transition-colors hover:bg-[#39492e]/10"
          >
            <Search size={17} />
          </button>
          <button
            onClick={openCart}
            aria-label="Open cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#39492e]/20 text-[#39492e] transition-colors hover:bg-[#39492e]/10"
          >
            <ShoppingBasket size={17} />
            {totalItems > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-[#b5582c] px-1 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>
          <a
            href="/#/admin"
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-[#39492e] transition-colors hover:bg-[#39492e]/10"
          >
            <Lock size={14} />
            Admin
          </a>
          <a
            href="#products"
            className="flex items-center gap-2 rounded-full bg-[#b5582c] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#b5582c]/30 transition-transform hover:scale-[1.03]"
          >
            Shop Now
          </a>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <button
            onClick={openCart}
            aria-label="Open cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#2f3e24]"
          >
            <ShoppingBasket size={21} />
            {totalItems > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#b5582c] px-1 text-[9px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#2f3e24]"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-5 mt-3 flex flex-col gap-1 rounded-2xl bg-[#fbf6ea] p-4 shadow-lg lg:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#39492e] hover:bg-[#39492e]/5"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/#/admin"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[#39492e] hover:bg-[#39492e]/5"
          >
            <Lock size={15} />
            Admin login
          </a>
          <a
            href="#products"
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 rounded-full bg-[#b5582c] px-5 py-3 text-sm font-semibold text-white"
          >
            <ShoppingBasket size={16} />
            Shop Now
          </a>
        </div>
      )}
    </header>
  );
}
