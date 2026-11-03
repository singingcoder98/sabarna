import { Handshake, Leaf, Recycle } from "lucide-react";

const POINTS = [
  {
    icon: Leaf,
    title: "100% Natural Farming",
    desc: "Every product is grown without synthetic pesticides or chemical fertilizers, the traditional Indian way.",
  },
  {
    icon: Handshake,
    title: "Fair to Farmers",
    desc: "We pay 20% above market price directly to over 5,000 small and marginal farming families.",
  },
  {
    icon: Recycle,
    title: "Sustainable Always",
    desc: "Compostable packaging and zero-waste processing keep our footprint as light as the soil we farm.",
  },
];

export default function About() {
  return (
    <section id="about" className="bg-[#fbf6ea] py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-2 lg:items-center lg:px-10">
        <div className="relative">
          <div className="absolute -left-4 -top-4 h-full w-full rounded-[2rem] border-2 border-[#e9c46a] lg:-left-6 lg:-top-6" />
          <img
            src="/images/about-farmer.jpg"
            alt="Indian organic farmers holding freshly harvested produce from Matibari partner farms"
            loading="lazy"
            decoding="async"
            className="relative z-10 h-[420px] w-full rounded-[2rem] object-cover shadow-xl lg:h-[520px]"
          />
          <div className="absolute -bottom-6 right-4 z-20 flex items-center gap-4 rounded-2xl bg-white px-6 py-4 shadow-xl lg:right-8">
            <span className="font-serif text-3xl font-bold text-[#b5582c]">18+</span>
            <span className="max-w-[110px] text-xs font-medium leading-tight text-[#39492e]">
              Years nurturing Indian soil
            </span>
          </div>
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#b5582c]">
            Our Roots
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-[#2f3e24] sm:text-4xl lg:text-[2.6rem]">
            A Family Farm That Grew Into a Movement
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-[#4c5a40]">
            Matibari began in 2006 in a small village in Madhya Pradesh,
            when our founder's grandmother refused to let chemical fertilizers
            touch her family's farmland. Today, that single commitment has
            grown into a cooperative of over 5,000 farming families across
            Madhya Pradesh, Himachal, Kerala and Punjab — all practicing
            certified organic agriculture passed down through generations.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-[#4c5a40]">
            We believe real food shouldn't need a warning label. That's why
            every grain, spice, and drop of oil we sell is traceable to the
            exact farm it came from.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {POINTS.map((p) => (
              <div key={p.title} className="rounded-2xl bg-white p-5 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4a6b3d]/10 text-[#4a6b3d]">
                  <p.icon size={19} />
                </span>
                <h3 className="mt-3 text-sm font-bold text-[#2f3e24]">{p.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#4c5a40]/80">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
