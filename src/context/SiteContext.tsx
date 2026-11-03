import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  SEED_PRODUCTS,
  SEED_SETTINGS,
  type Product,
  type SiteSettings,
} from "../data/products";

const STORAGE_KEY = "matibari-site-v1";

type PersistedState = { settings: SiteSettings; products: Product[] };

type SiteContextType = {
  settings: SiteSettings;
  products: Product[];
  activeProducts: Product[];
  updateSettings: (patch: Partial<SiteSettings>) => void;
  saveProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  toggleProduct: (id: string) => void;
  resetStore: () => void;
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

function loadState(): PersistedState {
  if (typeof window === "undefined") {
    return { settings: SEED_SETTINGS, products: SEED_PRODUCTS };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { settings: SEED_SETTINGS, products: SEED_PRODUCTS };
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      settings: { ...SEED_SETTINGS, ...(parsed.settings ?? {}) },
      products:
        Array.isArray(parsed.products) && parsed.products.length > 0
          ? parsed.products
          : SEED_PRODUCTS,
    };
  } catch {
    return { settings: SEED_SETTINGS, products: SEED_PRODUCTS };
  }
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(loadState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage full or blocked — the site keeps working for this session
    }
  }, [state]);

  const value = useMemo<SiteContextType>(
    () => ({
      settings: state.settings,
      products: state.products,
      activeProducts: state.products.filter((product) => product.active),
      updateSettings: (patch) =>
        setState((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } })),
      saveProduct: (product) =>
        setState((prev) => {
          const exists = prev.products.some((entry) => entry.id === product.id);
          return {
            ...prev,
            products: exists
              ? prev.products.map((entry) => (entry.id === product.id ? product : entry))
              : [...prev.products, product],
          };
        }),
      deleteProduct: (id) =>
        setState((prev) => ({
          ...prev,
          products: prev.products.filter((entry) => entry.id !== id),
        })),
      toggleProduct: (id) =>
        setState((prev) => ({
          ...prev,
          products: prev.products.map((entry) =>
            entry.id === id ? { ...entry, active: !entry.active } : entry
          ),
        })),
      resetStore: () => setState({ settings: SEED_SETTINGS, products: SEED_PRODUCTS }),
    }),
    [state]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
