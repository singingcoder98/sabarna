import { useState } from "react";
import { Mail, Send } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="bg-[#b5582c] py-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-5 text-center lg:px-10">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white">
          <Mail size={24} />
        </span>
        <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
          Get 10% Off Your First Order
        </h2>
        <p className="max-w-md text-sm text-white/85">
          Join our newsletter for seasonal recipes, farm stories, and
          exclusive discounts on organic staples.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full rounded-full border-0 px-5 py-3.5 text-sm text-[#2f3e24] outline-none placeholder:text-[#2f3e24]/50 focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#2f3e24] px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
          >
            Subscribe
            <Send size={15} />
          </button>
        </form>
        {submitted && (
          <p className="text-sm font-medium text-white">
            Thank you for subscribing! Check your inbox for your discount code. 🌿
          </p>
        )}
      </div>
    </section>
  );
}
