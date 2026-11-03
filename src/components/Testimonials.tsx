import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

const REVIEWS = [
  {
    name: "Ananya Rao",
    city: "Bengaluru, Karnataka",
    text: "The turmeric and ghee taste like what my grandmother used to make in our village. You can genuinely tell the difference from store-bought brands.",
    rating: 5,
  },
  {
    name: "Rohit Malhotra",
    city: "New Delhi",
    text: "Switched our entire kitchen to Matibari six months ago. Their rice and spice box have become a staple — consistent quality every single order.",
    rating: 5,
  },
  {
    name: "Priya Nair",
    city: "Kochi, Kerala",
    text: "Love that they share the farmer's story on every pack. Knowing where my food comes from makes such a difference. The honey is pure gold.",
    rating: 5,
  },
  {
    name: "Suresh Iyer",
    city: "Pune, Maharashtra",
    text: "Fast delivery, plastic-free packaging, and the taste is unbeatable. My family's health has genuinely improved since we made the switch.",
    rating: 4,
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % REVIEWS.length), 6000);
    return () => clearInterval(t);
  }, []);

  const prev = () => setIndex((i) => (i - 1 + REVIEWS.length) % REVIEWS.length);
  const next = () => setIndex((i) => (i + 1) % REVIEWS.length);

  const review = REVIEWS[index];

  return (
    <section id="testimonials" className="bg-[#f4edd8] py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-5 text-center lg:px-10">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#b5582c]">
          Customer Love
        </span>
        <h2 className="mt-3 font-serif text-3xl font-bold text-[#2f3e24] sm:text-4xl">
          Stories From Our Kitchens
        </h2>

        <div className="relative mt-12 rounded-3xl bg-white p-8 shadow-lg sm:p-12">
          <Quote className="mx-auto text-[#e9c46a]" size={32} fill="currentColor" />
          <p className="mt-5 text-lg font-medium leading-relaxed text-[#2f3e24] sm:text-xl">
            "{review.text}"
          </p>
          <div className="mt-6 flex items-center justify-center gap-1 text-[#e9c46a]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < review.rating ? "currentColor" : "none"}
                strokeWidth={1.5}
              />
            ))}
          </div>
          <p className="mt-4 font-serif text-base font-bold text-[#2f3e24]">
            {review.name}
          </p>
          <p className="text-xs text-[#4c5a40]/70">{review.city}</p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              aria-label="Previous review"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2f3e24]/15 text-[#2f3e24] transition-colors hover:bg-[#2f3e24]/5"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to review ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-6 bg-[#b5582c]" : "w-2 bg-[#2f3e24]/20"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              aria-label="Next review"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2f3e24]/15 text-[#2f3e24] transition-colors hover:bg-[#2f3e24]/5"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
