import { useRef, useState } from "react";
import {
  Boxes,
  CheckCircle2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useSite } from "../../context/SiteContext";
import type { Product } from "../../data/products";

const blank = (): Product => ({
  id: `product-${Date.now()}`,
  name: "",
  category: "New category",
  price: 0,
  mrp: 0,
  unit: "500g",
  rating: 5,
  reviews: 0,
  image: "/images/logo.png",
  tag: "",
  description: "",
  active: true,
  stock: 0,
  sold: 0,
});

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold text-[#455747]">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[10px] text-[#93a08f]">{hint}</span>}
    </label>
  );
}

const inputClass =
  "h-10 w-full rounded-lg border border-[#dfe6dc] bg-white px-3 text-xs text-[#2a3b2d] outline-none transition-colors placeholder:text-[#a3ada0] focus:border-[#6b8c68] focus:ring-2 focus:ring-[#6b8c68]/15";

export default function AdminCatalogue() {
  const { products, saveProduct, deleteProduct, toggleProduct, resetStore } = useSite();
  const [draft, setDraft] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const patch = (values: Partial<Product>) =>
    setDraft((prev) => (prev ? { ...prev, ...values } : prev));

  const handleImageFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => patch({ image: String(reader.result) });
    reader.readAsDataURL(file);
  };

  const save = () => {
    if (!draft) return;
    const clean: Product = {
      ...draft,
      name: draft.name.trim() || "Untitled product",
      price: Number(draft.price) || 0,
      mrp: Number(draft.mrp) || 0,
      stock: Number(draft.stock) || 0,
      sold: Number(draft.sold) || 0,
    };
    saveProduct(clean);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1800);
    setDraft(null);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(340px,1fr)]">
      <section className="overflow-hidden rounded-2xl border border-[#e5e9e1] bg-white shadow-[0_2px_10px_rgba(31,49,34,0.025)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0eb] px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-[#2a3b2d]">Products</p>
            <p className="mt-1 text-[11px] text-[#879083]">
              {products.filter((p) => p.active).length} live · {products.length} total
            </p>
          </div>
          <div className="flex items-center gap-2">
            {savedFlash && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#e9f5ed] px-2.5 py-1.5 text-[10px] font-semibold text-[#3f7b50]">
                <CheckCircle2 size={13} /> Saved
              </span>
            )}
            <button
              onClick={() => {
                setDraft(blank());
                setIsNew(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#4a6b3d] px-3.5 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-[#3c5a31]"
            >
              <Plus size={14} /> Add product
            </button>
          </div>
        </div>

        <div className="divide-y divide-[#f0f2ee]">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-3 px-5 py-3.5">
              <img
                src={product.image}
                alt=""
                className="h-11 w-11 shrink-0 rounded-lg border border-[#edf0eb] object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-[#354634]">
                  {product.name || "Untitled product"}
                </p>
                <p className="mt-0.5 text-[10px] text-[#929b8e]">
                  {product.category} · {product.unit} · {product.stock} in stock
                </p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-xs font-bold text-[#354634]">₹{product.price}</p>
                <p className="text-[10px] text-[#929b8e] line-through">₹{product.mrp}</p>
              </div>
              <button
                onClick={() => toggleProduct(product.id)}
                title={product.active ? "Hide from shop" : "Show in shop"}
                className={`flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[10px] font-semibold transition-colors ${
                  product.active
                    ? "bg-[#e9f5ed] text-[#3f7b50] hover:bg-[#dceee3]"
                    : "bg-[#f1f2ef] text-[#8b948a] hover:bg-[#e7e9e4]"
                }`}
              >
                {product.active ? <Eye size={12} /> : <EyeOff size={12} />}
                {product.active ? "Live" : "Hidden"}
              </button>
              <button
                onClick={() => {
                  setDraft({ ...product });
                  setIsNew(false);
                }}
                aria-label={`Edit ${product.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e8de] text-[#5d6f5b] transition-colors hover:bg-[#f2f6ef]"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
                    deleteProduct(product.id);
                    if (draft?.id === product.id) setDraft(null);
                  }
                }}
                aria-label={`Delete ${product.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#f0ddd6] text-[#b5582c] transition-colors hover:bg-[#fbf0ec]"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          {products.length === 0 && (
            <div className="px-5 py-14 text-center">
              <Boxes size={32} className="mx-auto text-[#c3ccbf]" />
              <p className="mt-3 text-sm font-semibold text-[#455747]">No products yet</p>
              <p className="mt-1 text-xs text-[#8c9789]">Add your first product to start selling.</p>
            </div>
          )}
        </div>
      </section>

      <aside className="rounded-2xl border border-[#e5e9e1] bg-white p-5 shadow-[0_2px_10px_rgba(31,49,34,0.025)]">
        {!draft ? (
          <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f4ee] text-[#7b8c78]">
              <Pencil size={20} />
            </span>
            <p className="mt-3 text-sm font-semibold text-[#455747]">Select a product</p>
            <p className="mt-1 max-w-[220px] text-xs leading-relaxed text-[#8c9789]">
              Edit a product from the list, or add a new one to open the editor here.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#2a3b2d]">
                  {isNew ? "New product" : "Edit product"}
                </p>
                <p className="mt-1 text-[11px] text-[#879083]">
                  Changes appear on the website instantly.
                </p>
              </div>
              <button
                onClick={() => setDraft(null)}
                aria-label="Close editor"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7a8777] hover:bg-[#f2f5f0]"
              >
                <X size={15} />
              </button>
            </div>

            <div className="mt-4 space-y-3.5">
              <div className="flex items-center gap-3">
                <img
                  src={draft.image}
                  alt=""
                  className="h-16 w-16 rounded-xl border border-[#e6ebe3] object-cover"
                />
                <div className="flex-1 space-y-2">
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#c7d3c3] text-[10px] font-semibold text-[#5d6f5b] hover:bg-[#f5f8f3]"
                  >
                    <Upload size={13} /> Upload image
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(event) => handleImageFile(event.target.files?.[0])}
                  />
                  <div className="flex h-9 items-center gap-1.5 rounded-lg border border-[#e2e8de] px-2">
                    <ImageIcon size={13} className="shrink-0 text-[#98a394]" />
                    <input
                      value={draft.image.startsWith("data:") ? "(uploaded image)" : draft.image}
                      onChange={(event) => patch({ image: event.target.value })}
                      placeholder="/images/product-x.jpg"
                      className="w-full bg-transparent text-[10px] text-[#5d6f5b] outline-none placeholder:text-[#a3ada0]"
                    />
                  </div>
                </div>
              </div>

              <Field label="Product name">
                <input className={inputClass} value={draft.name} onChange={(e) => patch({ name: e.target.value })} placeholder="e.g. Raw Forest Honey" />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Category">
                  <input className={inputClass} value={draft.category} onChange={(e) => patch({ category: e.target.value })} placeholder="Pickles" />
                </Field>
                <Field label="Pack size">
                  <input className={inputClass} value={draft.unit} onChange={(e) => patch({ unit: e.target.value })} placeholder="500g" />
                </Field>
                <Field label="Selling price (₹)">
                  <input type="number" min={0} className={inputClass} value={draft.price} onChange={(e) => patch({ price: Number(e.target.value) })} />
                </Field>
                <Field label="MRP (₹)">
                  <input type="number" min={0} className={inputClass} value={draft.mrp} onChange={(e) => patch({ mrp: Number(e.target.value) })} />
                </Field>
                <Field label="Stock">
                  <input type="number" min={0} className={inputClass} value={draft.stock} onChange={(e) => patch({ stock: Number(e.target.value) })} />
                </Field>
                <Field label="Badge (optional)">
                  <input className={inputClass} value={draft.tag} onChange={(e) => patch({ tag: e.target.value })} placeholder="Bestseller" />
                </Field>
              </div>

              <Field label="Description">
                <textarea
                  rows={3}
                  className={`${inputClass} h-auto py-2.5 leading-relaxed`}
                  value={draft.description}
                  onChange={(e) => patch({ description: e.target.value })}
                  placeholder="What makes this product special?"
                />
              </Field>

              <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-[#e2e8de] px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={draft.active}
                  onChange={(e) => patch({ active: e.target.checked })}
                  className="h-4 w-4 accent-[#4a6b3d]"
                />
                <span className="text-[11px] font-semibold text-[#455747]">
                  Show this product in the shop
                </span>
              </label>

              <div className="space-y-2 rounded-lg border border-[#e6d9b8] bg-[#fbf6e9] p-3">
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={Boolean(draft.isCombo)}
                    onChange={(e) =>
                      patch({
                        isCombo: e.target.checked,
                        comboItems: e.target.checked ? draft.comboItems ?? [] : undefined,
                      })
                    }
                    className="h-4 w-4 accent-[#b5582c]"
                  />
                  <span className="text-[11px] font-semibold text-[#7c6a41]">
                    Combo / bundle product (shows in "Special Combos")
                  </span>
                </label>

                {draft.isCombo && (
                  <div className="space-y-2">
                    <Field
                      label="Products inside the combo"
                      hint="Ek line me ek product: Naam | quantity  (jaise: Tok-Jhal Achar | 1)"
                    >
                      <textarea
                        rows={3}
                        className={`${inputClass} h-auto py-2.5 leading-relaxed`}
                        value={(draft.comboItems ?? [])
                          .map((item) => `${item.name} | ${item.qty}`)
                          .join("\n")}
                        onChange={(e) => {
                          const items = e.target.value
                            .split("\n")
                            .map((line) => line.trim())
                            .filter(Boolean)
                            .map((line) => {
                              const [name, qty] = line.split("|").map((part) => part.trim());
                              const match = products.find(
                                (entry) =>
                                  entry.name.toLowerCase() === (name ?? "").toLowerCase()
                              );
                              return {
                                name: name ?? "",
                                qty: Number(qty) > 0 ? Number(qty) : 1,
                                image: match?.image ?? "",
                              };
                            });
                          patch({ comboItems: items });
                        }}
                        placeholder={"Tok-Jhal Achar | 1\nBori | 1"}
                      />
                    </Field>
                    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-[#e2e8de] bg-white px-3 py-2">
                      <input
                        type="checkbox"
                        checked={Boolean(draft.featured)}
                        onChange={(e) => patch({ featured: e.target.checked })}
                        className="h-4 w-4 accent-[#b5582c]"
                      />
                      <span className="text-[11px] font-semibold text-[#455747]">
                        Featured combo — biggest, most eye-catching card
                      </span>
                    </label>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={save}
                  className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#4a6b3d] text-xs font-semibold text-white transition-colors hover:bg-[#3c5a31]"
                >
                  <Save size={14} /> {isNew ? "Add product" : "Save changes"}
                </button>
                <button
                  onClick={() => setDraft(null)}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-[#e2e8de] px-4 text-xs font-semibold text-[#66745f] hover:bg-[#f4f7f2]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 rounded-xl border border-[#e9c46a]/50 bg-[#f8f3e4] p-3.5">
          <p className="text-[10px] leading-relaxed text-[#7c6a41]">
            Catalogue is saved in this browser for the preview. To make edits
            visible to every visitor, connect the store to a database (see README).
          </p>
          <button
            onClick={() => {
              if (window.confirm("Reset brand, products and prices back to the demo defaults?")) {
                resetStore();
                setDraft(null);
              }
            }}
            className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#8a6d2f] hover:text-[#b5582c]"
          >
            <RotateCcw size={12} /> Reset to defaults
          </button>
        </div>
      </aside>
    </div>
  );
}
