const ITEMS = [
  "100% Certified Organic",
  "No Pesticides. No Chemicals.",
  "FSSAI Approved",
  "India Organic Certified",
  "Direct from Farmers",
  "Free Shipping Above ₹999",
  "Online Payment Only • No COD",
  "Secure UPI • Cards • Netbanking",
  "Plastic-Free Packaging",
];

export default function TrustBar() {
  const loop = [...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden bg-[#2f3e24] py-3">
      <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-10">
        {loop.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.15em] text-[#f4edd8]/90"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#e9c46a]" />
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
