import { BadgeCheck, Leaf, Lock, PackageCheck } from "lucide-react";

const FEATURES = [
  {
    icon: Leaf,
    title: "Soil to Shelf, Traced",
    desc: "Scan any pack to see exactly which farm and village grew your food.",
  },
  {
    icon: BadgeCheck,
    title: "Triple Certified",
    desc: "India Organic, FSSAI and USDA Organic certified across our entire range.",
  },
  {
    icon: PackageCheck,
    title: "Small-Batch Freshness",
    desc: "We mill, pack and dispatch in small batches — never warehoused for months.",
  },
  {
    icon: Lock,
    title: "Secure Online Payments",
    desc: "Pay safely with UPI, cards or netbanking. Cash on Delivery is disabled.",
  },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="relative overflow-hidden bg-[#2f3e24] py-20 text-[#f4edd8] lg:py-28">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#e9c46a]/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#b5582c]/10 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#e9c46a]">
            Why Matibari
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl lg:text-[2.6rem]">
            Why Thousands Trust Our Pantry
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[#f4edd8]/75">
            We don't just sell organic food — we obsess over every step
            between the farm and your kitchen shelf.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f4edd8]/10">
                <f.icon size={26} className="text-[#e9c46a]" />
              </span>
              <h3 className="mt-5 font-serif text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#f4edd8]/70">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
