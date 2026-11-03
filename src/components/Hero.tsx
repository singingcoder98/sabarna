import { ArrowRight, PlayCircle, ShieldCheck, Sprout, Truck } from "lucide-react";
import { useSite } from "../context/SiteContext";

export default function Hero() {
  const { settings } = useSite();
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-24"
    >
      <div className="absolute inset-0">
        <img
          src="/images/hero-farm.jpg"
          alt="Organic farm in India at sunrise"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e2a14]/90 via-[#1e2a14]/60 to-[#1e2a14]/20" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-5 py-16 lg:grid-cols-2 lg:px-10">
        <div className="max-w-xl text-[#f6f1e2]">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#e9c46a]/40 bg-[#e9c46a]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#e9c46a]">
            {settings.heroKicker}
          </span>

          <h1 className="mt-6 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {settings.heroTitle1}
            <span className="block text-[#e9c46a]">{settings.heroTitle2}</span>
          </h1>

          <p className="mt-5 text-base leading-relaxed text-[#f6f1e2]/85 sm:text-lg">
            {settings.heroText}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#products"
              className="group flex items-center gap-2 rounded-full bg-[#b5582c] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#b5582c]/30 transition-transform hover:scale-[1.03]"
            >
              Explore Products
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#about"
              className="flex items-center gap-2 rounded-full border border-[#f6f1e2]/40 px-7 py-3.5 text-sm font-semibold text-[#f6f1e2] backdrop-blur-sm transition-colors hover:bg-[#f6f1e2]/10"
            >
              <PlayCircle size={18} />
              Our Story
            </a>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 border-t border-[#f6f1e2]/20 pt-6">
            <div className="flex items-center gap-2">
              <Sprout size={20} className="text-[#e9c46a]" />
              <div>
                <p className="text-lg font-bold leading-none">5,000+</p>
                <p className="text-[11px] text-[#f6f1e2]/70">Partner Farmers</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-[#e9c46a]" />
              <div>
                <p className="text-lg font-bold leading-none">100%</p>
                <p className="text-[11px] text-[#f6f1e2]/70">FSSAI &amp; India Organic</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Truck size={20} className="text-[#e9c46a]" />
              <div>
                <p className="text-lg font-bold leading-none">Pan India</p>
                <p className="text-[11px] text-[#f6f1e2]/70">Doorstep Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
