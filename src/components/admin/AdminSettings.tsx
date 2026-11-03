import { useRef, useState } from "react";
import { CheckCircle2, Image as ImageIcon, RotateCcw, Save, Upload } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import { SEED_SETTINGS, type SiteSettings } from "../../data/products";

const inputClass =
  "h-10 w-full rounded-lg border border-[#dfe6dc] bg-white px-3 text-xs text-[#2a3b2d] outline-none transition-colors placeholder:text-[#a3ada0] focus:border-[#6b8c68] focus:ring-2 focus:ring-[#6b8c68]/15";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold text-[#455747]">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[10px] text-[#93a08f]">{hint}</span>}
    </label>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#e5e9e1] bg-white p-5 shadow-[0_2px_10px_rgba(31,49,34,0.025)] sm:p-6">
      <p className="text-sm font-semibold text-[#2a3b2d]">{title}</p>
      <p className="mt-1 text-[11px] text-[#879083]">{subtitle}</p>
      <div className="mt-4 space-y-3.5">{children}</div>
    </section>
  );
}

export default function AdminSettings() {
  const { settings, updateSettings, resetStore } = useSite();
  const [flash, setFlash] = useState(false);
  const logoFileRef = useRef<HTMLInputElement | null>(null);

  const patch = (values: Partial<SiteSettings>) => updateSettings(values);

  const handleLogoFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => patch({ logo: String(reader.result) });
    reader.readAsDataURL(file);
  };

  const confirmFlash = () => {
    setFlash(true);
    window.setTimeout(() => setFlash(false), 1800);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-[#818c7d]">
          Every field saves instantly and updates the live website.
        </p>
        <div className="flex items-center gap-2">
          {flash && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#e9f5ed] px-2.5 py-1.5 text-[10px] font-semibold text-[#3f7b50]">
              <CheckCircle2 size={13} /> Saved
            </span>
          )}
          <button
            onClick={() => {
              if (window.confirm("Reset brand and product data back to the demo defaults?")) {
                resetStore();
                confirmFlash();
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#e2e8de] bg-white px-3 py-2 text-[11px] font-semibold text-[#66745f] hover:bg-[#f4f7f2]"
          >
            <RotateCcw size={13} /> Reset to defaults
          </button>
          <button
            onClick={confirmFlash}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#4a6b3d] px-3.5 py-2 text-[11px] font-semibold text-white hover:bg-[#3c5a31]"
          >
            <Save size={13} /> Save
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Brand identity" subtitle="Name, logo and tagline shown across the website.">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#e6ebe3] bg-[#f6f4ea]">
              <img src={settings.logo} alt="Brand logo preview" className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 space-y-2">
              <button
                onClick={() => logoFileRef.current?.click()}
                className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#c7d3c3] text-[10px] font-semibold text-[#5d6f5b] hover:bg-[#f5f8f3]"
              >
                <Upload size={13} /> Upload new logo
              </button>
              <input
                ref={logoFileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(event) => handleLogoFile(event.target.files?.[0])}
              />
              <div className="flex h-9 items-center gap-1.5 rounded-lg border border-[#e2e8de] px-2">
                <ImageIcon size={13} className="shrink-0 text-[#98a394]" />
                <input
                  value={settings.logo.startsWith("data:") ? "(uploaded image)" : settings.logo}
                  onChange={(event) => patch({ logo: event.target.value })}
                  placeholder="/images/logo.png"
                  className="w-full bg-transparent text-[10px] text-[#5d6f5b] outline-none placeholder:text-[#a3ada0]"
                />
              </div>
            </div>
          </div>

          <Field label="Brand name">
            <input className={inputClass} value={settings.brandName} onChange={(e) => patch({ brandName: e.target.value })} />
          </Field>
          <Field label="Tagline" hint="Shown under the brand name in the header.">
            <input className={inputClass} value={settings.tagline} onChange={(e) => patch({ tagline: e.target.value })} />
          </Field>
        </Card>

        <Card title="Hero banner" subtitle="The first block visitors see on the homepage.">
          <Field label="Top label">
            <input className={inputClass} value={settings.heroKicker} onChange={(e) => patch({ heroKicker: e.target.value })} />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Headline (line 1)">
              <input className={inputClass} value={settings.heroTitle1} onChange={(e) => patch({ heroTitle1: e.target.value })} />
            </Field>
            <Field label="Headline (line 2, highlighted)">
              <input className={inputClass} value={settings.heroTitle2} onChange={(e) => patch({ heroTitle2: e.target.value })} />
            </Field>
          </div>
          <Field label="Intro text">
            <textarea
              rows={4}
              className={`${inputClass} h-auto py-2.5 leading-relaxed`}
              value={settings.heroText}
              onChange={(e) => patch({ heroText: e.target.value })}
            />
          </Field>
        </Card>

        <Card title="Contact details" subtitle="Shown in the footer and on the contact section.">
          <Field label="Email">
            <input className={inputClass} value={settings.email} onChange={(e) => patch({ email: e.target.value })} />
          </Field>
          <Field label="Phone">
            <input className={inputClass} value={settings.phone} onChange={(e) => patch({ phone: e.target.value })} />
          </Field>
          <Field
            label="WhatsApp number (for the chat button)"
            hint="Country code ke saath, sirf digits. India ke liye 91 + 10 digit number."
          >
            <input
              className={inputClass}
              value={settings.whatsapp}
              onChange={(e) => patch({ whatsapp: e.target.value.replace(/[^0-9]/g, "") })}
              placeholder="919876543210"
            />
          </Field>
          <Field label="Address">
            <textarea
              rows={3}
              className={`${inputClass} h-auto py-2.5 leading-relaxed`}
              value={settings.address}
              onChange={(e) => patch({ address: e.target.value })}
            />
          </Field>
        </Card>

        <Card title="How this works" subtitle="Making your edits reach every visitor.">
          <div className="space-y-2.5 text-[11px] leading-relaxed text-[#66745f]">
            <p className="rounded-lg bg-[#f4f7f2] p-3">
              <b className="text-[#3c5140]">Right now (preview):</b> your changes are saved in
              this browser (localStorage). Great for trying things out — but each visitor sees
              their own copy.
            </p>
            <p className="rounded-lg bg-[#f8f3e4] p-3">
              <b className="text-[#7c6a41]">For everyone (production):</b> connect these same
              screens to a database through the API in <code className="font-mono">src/services</code>.
              Supabase or Firebase is the fastest route — the UI then reads and writes your
              live catalogue, prices, logo and name.
            </p>
            <p className="rounded-lg bg-[#eef4ec] p-3">
              <b className="text-[#3c5140]">Sample dashboard figures:</b> orders and revenue are
              still demo numbers and will be replaced when your store backend is connected.
            </p>
          </div>
          <button
            onClick={confirmFlash}
            className="flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-[#4a6b3d] text-xs font-semibold text-white hover:bg-[#3c5a31]"
          >
            <Save size={14} /> Save all changes
          </button>
          <p className="text-center text-[10px] text-[#93a08f]">
            Defaults: {SEED_SETTINGS.brandName} · {SEED_SETTINGS.tagline}
          </p>
        </Card>
      </div>
    </div>
  );
}
