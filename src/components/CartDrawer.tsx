import { useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  CheckCircle2,
  CreditCard,
  Landmark,
  Loader2,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Trash2,
  X,
} from "lucide-react";
import { useCart } from "../context/CartContext";

type PayMethod = "upi" | "card" | "netbanking";

const PAY_OPTIONS: { id: PayMethod; label: string; sub: string; icon: typeof Smartphone }[] = [
  { id: "upi", label: "UPI", sub: "GPay • PhonePe • Paytm", icon: Smartphone },
  { id: "card", label: "Credit / Debit Card", sub: "Visa • RuPay • Mastercard", icon: CreditCard },
  { id: "netbanking", label: "Netbanking", sub: "All major Indian banks", icon: Landmark },
];

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeItem, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<"cart" | "payment" | "success">("cart");
  const [method, setMethod] = useState<PayMethod>("upi");
  const [paying, setPaying] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [upiId, setUpiId] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const closeAll = () => {
    closeCart();
    setTimeout(() => {
      setStep("cart");
      setPaying(false);
    }, 300);
  };

  const handlePay = () => {
    if (paying) return;
    setPaying(true);
    setTimeout(() => {
      const id = `MB-${Math.floor(10000 + Math.random() * 89999)}`;
      setOrderId(id);
      setPaying(false);
      setStep("success");
      clearCart();
    }, 1600);
  };

  const methodLabel = PAY_OPTIONS.find((o) => o.id === method)?.label ?? "Online";

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeAll}
      />
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-sm flex-col bg-[#fbf6ea] shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2f3e24]/10 px-6 py-5">
          <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-[#2f3e24]">
            {step === "payment" ? (
              <button onClick={() => setStep("cart")} aria-label="Back to cart" className="mr-1 flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#2f3e24]/10">
                <ArrowLeft size={17} />
              </button>
            ) : (
              <ShoppingBag size={19} />
            )}
            {step === "cart" ? "Your Basket" : step === "payment" ? "Online Payment" : "Order Confirmed"}
          </h3>
          <button
            onClick={closeAll}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#2f3e24]/10"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Online-only strip */}
        {step !== "success" && (
          <div className="flex items-center gap-2 bg-[#2f3e24] px-6 py-2.5 text-[11px] font-medium text-[#f4edd8]">
            <Lock size={12} className="shrink-0 text-[#e9c46a]" />
            <span>100% Online Payment Only • Cash on Delivery not available</span>
          </div>
        )}

        {step === "cart" && (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-[#4c5a40]">
                  <ShoppingBag size={40} className="mb-3 opacity-30" />
                  <p className="text-sm">Your basket is empty.</p>
                  <p className="text-xs text-[#4c5a40]/60">Add some organic goodness!</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map(({ product, qty }) => (
                    <li key={product.id} className="flex gap-3 rounded-xl bg-white p-3 shadow-sm">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold leading-tight text-[#2f3e24]">
                              {product.name}
                            </p>
                            {product.comboItems && product.comboItems.length > 0 && (
                              <p className="mt-1 text-[10px] leading-relaxed text-[#4c5a40]/75">
                                Includes:{" "}
                                {product.comboItems
                                  .map((item) => `${item.qty}× ${item.name}`)
                                  .join(" · ")}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(product.id)}
                            className="text-[#4c5a40]/50 hover:text-[#b5582c]"
                            aria-label="Remove item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-full border border-[#2f3e24]/15 px-1.5 py-0.5">
                            <button
                              onClick={() => updateQty(product.id, qty - 1)}
                              className="flex h-5 w-5 items-center justify-center text-[#2f3e24]"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-4 text-center text-xs font-semibold">{qty}</span>
                            <button
                              onClick={() => updateQty(product.id, qty + 1)}
                              className="flex h-5 w-5 items-center justify-center text-[#2f3e24]"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="text-sm font-bold text-[#b5582c]">
                            ₹{product.price * qty}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-[#2f3e24]/10 px-6 py-5">
                <div className="mb-1 flex items-center justify-between text-sm font-semibold text-[#2f3e24]">
                  <span>Subtotal</span>
                  <span className="text-lg font-bold text-[#b5582c]">₹{totalPrice}</span>
                </div>
                <p className="mb-4 flex items-center gap-1.5 text-[11px] text-[#4c5a40]/70">
                  <ShieldCheck size={13} className="text-[#4a6b3d]" />
                  Secure UPI • Cards • Netbanking accepted
                </p>
                <button
                  onClick={() => setStep("payment")}
                  className="w-full rounded-full bg-[#b5582c] py-3.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02]"
                >
                  Proceed to Online Payment
                </button>
                <p className="mt-2 text-center text-[11px] text-[#4c5a40]/60">
                  Free shipping on orders above ₹999 • No COD
                </p>
              </div>
            )}
          </>
        )}

        {step === "payment" && (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#4c5a40]/60">Amount payable</p>
                <p className="mt-1 text-2xl font-bold text-[#2f3e24]">₹{totalPrice}</p>
                <p className="mt-1 text-[11px] text-[#4c5a40]/60">{items.length} item(s) • Prepaid order</p>
              </div>

              <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-[#2f3e24]">
                Choose payment method
              </p>
              <div className="space-y-2.5">
                {PAY_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const active = method === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setMethod(opt.id)}
                      className={`flex w-full items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-colors ${
                        active ? "border-[#4a6b3d] bg-white shadow-sm" : "border-transparent bg-white/60 hover:bg-white"
                      }`}
                    >
                      <span className={`flex h-10 w-10 items-center justify-center rounded-full ${active ? "bg-[#4a6b3d] text-white" : "bg-[#4a6b3d]/10 text-[#4a6b3d]"}`}>
                        <Icon size={18} />
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-semibold text-[#2f3e24]">{opt.label}</span>
                        <span className="block text-[11px] text-[#4c5a40]/60">{opt.sub}</span>
                      </span>
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${active ? "border-[#4a6b3d]" : "border-[#2f3e24]/20"}`}>
                        {active && <span className="h-2.5 w-2.5 rounded-full bg-[#4a6b3d]" />}
                      </span>
                    </button>
                  );
                })}

                {/* Disabled COD */}
                <div className="relative flex w-full cursor-not-allowed items-center gap-3 rounded-xl border-2 border-dashed border-[#2f3e24]/15 bg-[#2f3e24]/[.03] p-3.5 opacity-70">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2f3e24]/10 text-[#4c5a40]/50">
                    <Banknote size={18} />
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center gap-2 text-sm font-semibold text-[#4c5a40]/60">
                      Cash on Delivery
                      <span className="rounded-full bg-[#2f3e24]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#4c5a40]/60">
                        Disabled
                      </span>
                    </span>
                    <span className="block text-[11px] text-[#4c5a40]/50">Not available • Online payment only</span>
                  </span>
                  <Lock size={15} className="text-[#4c5a40]/40" />
                </div>
              </div>

              {/* Method-specific fields */}
              <div className="mt-4 rounded-xl bg-white p-4 shadow-sm">
                {method === "upi" && (
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#2f3e24]">Your UPI ID</label>
                    <input
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. name@okhdfcbank"
                      className="w-full rounded-lg border border-[#2f3e24]/15 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a6b3d]"
                    />
                    <p className="mt-2 text-[11px] text-[#4c5a40]/60">A collect request will be sent to your UPI app.</p>
                  </div>
                )}
                {method === "card" && (
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-[#2f3e24]">Card number</label>
                      <input
                        value={cardNum}
                        onChange={(e) => setCardNum(e.target.value.replace(/[^0-9]/g, "").slice(0, 16))}
                        placeholder="1234 5678 9012 3456"
                        inputMode="numeric"
                        className="w-full rounded-lg border border-[#2f3e24]/15 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a6b3d]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-[#2f3e24]">Expiry</label>
                        <input
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full rounded-lg border border-[#2f3e24]/15 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a6b3d]"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-[#2f3e24]">CVV</label>
                        <input
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, "").slice(0, 3))}
                          placeholder="•••"
                          type="password"
                          inputMode="numeric"
                          className="w-full rounded-lg border border-[#2f3e24]/15 px-3.5 py-2.5 text-sm outline-none focus:border-[#4a6b3d]"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {method === "netbanking" && (
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#2f3e24]">Select your bank</label>
                    <select className="w-full rounded-lg border border-[#2f3e24]/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#4a6b3d]">
                      <option>HDFC Bank</option>
                      <option>State Bank of India</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra</option>
                      <option>Punjab National Bank</option>
                    </select>
                    <p className="mt-2 text-[11px] text-[#4c5a40]/60">You’ll be redirected to your bank’s secure page.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-[#2f3e24]/10 px-6 py-5">
              <button
                onClick={handlePay}
                disabled={paying}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#4a6b3d] py-3.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02] disabled:opacity-70"
              >
                {paying ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Processing payment…
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    Pay ₹{totalPrice} Securely
                  </>
                )}
              </button>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[11px] text-[#4c5a40]/60">
                <BadgeCheck size={13} className="text-[#4a6b3d]" />
                256-bit encrypted • Powered by secure gateway
              </p>
            </div>
          </>
        )}

        {step === "success" && (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#4a6b3d]/10 text-[#4a6b3d]">
              <CheckCircle2 size={32} />
            </span>
            <h4 className="mt-4 font-serif text-xl font-bold text-[#2f3e24]">Payment Successful!</h4>
            <p className="mt-2 text-sm leading-relaxed text-[#4c5a40]">
              Order <span className="font-bold text-[#2f3e24]">{orderId}</span> is confirmed.
              <br />
              Paid via {methodLabel}.
            </p>
            <div className="mt-4 w-full rounded-xl bg-white p-3.5 text-[11px] leading-relaxed text-[#4c5a40]/70 shadow-sm">
              A receipt has been sent to your email. Our farm team will pack and ship your order within 24 hours.
            </div>
            <button
              onClick={closeAll}
              className="mt-6 w-full rounded-full bg-[#b5582c] py-3.5 text-sm font-bold text-white shadow-md"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
