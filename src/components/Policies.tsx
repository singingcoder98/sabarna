import { useEffect, type MouseEvent } from "react";
import { ArrowLeft, PackageCheck, RefreshCw, ShieldCheck, Truck } from "lucide-react";

const SECTIONS = [
  {
    id: "shipping",
    icon: Truck,
    title: "Shipping Policy",
    points: [
      "Orders are dispatched within 24 working hours of successful payment.",
      "Delivery across India takes 2-4 working days, depending on your location.",
      "Shipping is FREE on all orders above ₹999. Below ₹999, a flat ₹79 applies.",
      "You will receive tracking details on email and WhatsApp once the order is shipped.",
      "We do not deliver outside India at the moment.",
    ],
  },
  {
    id: "refund",
    icon: RefreshCw,
    title: "Refund & Cancellation Policy",
    points: [
      "Orders can be cancelled within 12 hours of placement for a full refund.",
      "If your parcel arrives damaged, leaking or spoiled, share a photo within 48 hours of delivery and we will replace it free of cost.",
      "Refunds are processed to the original payment method within 5-7 working days.",
      "As these are food products, opened items cannot be returned for hygiene reasons.",
      "In case of a failed payment, any amount debited is auto-refunded by your bank within 3-5 working days.",
    ],
  },
  {
    id: "privacy",
    icon: ShieldCheck,
    title: "Privacy Policy",
    points: [
      "We collect only what is needed to deliver your order: name, email, phone number and delivery address.",
      "Payments are handled securely by our payment gateway (Razorpay). We never see or store your card or UPI details.",
      "We do not sell, rent or share your personal data with any third party for marketing.",
      "Cookies are used only to keep your basket and preferences working.",
      "To delete your data or ask a question, write to hello@matibari.in.",
    ],
  },
  {
    id: "terms",
    icon: PackageCheck,
    title: "Terms & Conditions",
    points: [
      "All products are 100% natural. Colour, texture and taste may vary slightly between harvest batches — that is a sign of real food, not a defect.",
      "Prices are inclusive of applicable taxes and may change without prior notice.",
      "Product images are for representation; actual packaging may vary.",
      "Cash on Delivery is not available. All orders are prepaid (UPI, cards, net banking).",
      "Any dispute is subject to the exclusive jurisdiction of courts at Indore, Madhya Pradesh.",
    ],
  },
];

export default function Policies() {
  // /#/policies#shipping jaise link se seedha us section par scroll
  useEffect(() => {
    const parts = window.location.hash.split("#");
    const target = parts[parts.length - 1];
    if (target && target !== "/policies") {
      window.setTimeout(() => {
        document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    }
  }, []);

  const scrollTo = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen bg-[#fbf6ea] px-5 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#52604d] transition-colors hover:text-[#b5582c]"
        >
          <ArrowLeft size={15} />
          Back to store
        </a>

        <header className="mt-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b5582c]">
            Matibari · Legal
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-[#2f3e24] sm:text-4xl">
            Store Policies
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#4c5a40]">
            Shipping, refunds, privacy aur terms — sab kuch saaf aur simple.
            Koi bhi sawaal ho to WhatsApp button dabao ya email karo.
          </p>
        </header>

        <div className="mt-6 flex flex-wrap gap-2">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(event) => scrollTo(event, section.id)}
              className="rounded-full border border-[#2f3e24]/15 bg-white px-4 py-2 text-xs font-semibold text-[#39492e] transition-colors hover:bg-[#4a6b3d] hover:text-white"
            >
              {section.title}
            </a>
          ))}
        </div>

        <div className="mt-10 space-y-8">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <section
                key={section.id}
                id={section.id}
                className="rounded-2xl border border-[#2f3e24]/10 bg-white p-6 shadow-sm"
              >
                <h2 className="flex items-center gap-2.5 font-serif text-xl font-bold text-[#2f3e24]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4a6b3d]/10 text-[#4a6b3d]">
                    <Icon size={18} />
                  </span>
                  {section.title}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {section.points.map((point) => (
                    <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-[#4c5a40]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b5582c]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <p className="mt-10 text-center text-xs text-[#4c5a40]/70">
          Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} ·
          Questions? hello@matibari.in
        </p>
      </div>
    </main>
  );
}
