const STEPS = [
  {
    num: "01",
    title: "Grown Naturally",
    desc: "Our partner farmers cultivate crops using traditional organic methods — no synthetic chemicals, ever.",
  },
  {
    num: "02",
    title: "Harvested with Care",
    desc: "Crops are hand-harvested at peak ripeness to lock in maximum flavour and nutrition.",
  },
  {
    num: "03",
    title: "Tested & Certified",
    desc: "Every batch passes through independent labs for purity before it earns the Matibari seal.",
  },
  {
    num: "04",
    title: "Packed Fresh, Delivered Fast",
    desc: "Milled and packed in small batches in eco-friendly packaging, shipped straight to your door.",
  },
];

export default function Process() {
  return (
    <section id="process" className="bg-[#fbf6ea] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#b5582c]">
            Our Process
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-[#2f3e24] sm:text-4xl lg:text-[2.6rem]">
            From Farmland to Your Dining Table
          </h2>
        </div>

        <div className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-[#2f3e24]/15 lg:block" />
          {STEPS.map((step) => (
            <div key={step.num} className="relative text-center">
              <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#4a6b3d] bg-[#fbf6ea] font-serif text-xl font-bold text-[#4a6b3d]">
                {step.num}
              </div>
              <h3 className="mt-5 font-serif text-lg font-bold text-[#2f3e24]">
                {step.title}
              </h3>
              <p className="mx-auto mt-2 max-w-[220px] text-sm leading-relaxed text-[#4c5a40]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
