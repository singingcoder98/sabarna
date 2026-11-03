import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "Are Matibari products certified organic?",
    a: "Yes. Every Matibari product is grown without synthetic pesticides or chemical fertilisers and is tested in independent labs before packing.",
  },
  {
    q: "Do you offer Cash on Delivery (COD)?",
    a: "No. We accept online payments only — UPI, credit/debit cards and net banking — for faster, safer, contactless delivery.",
  },
  {
    q: "How long does delivery take?",
    a: "Orders are dispatched within 24 hours and delivered across India in 2-4 working days. Shipping is free on orders above ₹999.",
  },
  {
    q: "How is the ghee made?",
    a: "Our A2 Bilona Desi Ghee is slow-cooked from cultured A2 cow milk using the traditional bilona (hand-churned) method, without any additives or preservatives.",
  },
  {
    q: "Is the honey raw and unprocessed?",
    a: "Yes. Our Raw Forest Honey is collected from wild forest hives and is never heated or filtered, so its natural enzymes and antioxidants stay intact.",
  },
  {
    q: "How can I place an order or ask a question?",
    a: "Add products to your basket and check out online, or tap the WhatsApp button on any page to chat with us directly for bulk orders and enquiries.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="bg-[#fbf6ea] py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-5 lg:px-10">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#b5582c]">
            <HelpCircle size={15} />
            Frequently Asked Questions
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-[#2f3e24] sm:text-4xl">
            Everything You Want to Know
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[#4c5a40]">
            Purity, delivery, payments — saaf jawab, bina ghuma-phiraye.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-2xl border border-[#2f3e24]/10 bg-white px-5 py-4 shadow-sm transition-shadow open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                <span className="text-sm font-semibold text-[#2f3e24] sm:text-base">
                  {faq.q}
                </span>
                <ChevronDown
                  size={18}
                  className="shrink-0 text-[#4a6b3d] transition-transform duration-300 group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 border-t border-[#2f3e24]/10 pt-3 text-sm leading-relaxed text-[#4c5a40]">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
