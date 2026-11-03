import { useEffect } from "react";
import { SiteProvider, useSite } from "./context/SiteContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import About from "./components/About";
import Products from "./components/Products";
import ComboOffers from "./components/ComboOffers";
import WhyUs from "./components/WhyUs";
import Process from "./components/Process";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import WhatsAppButton from "./components/WhatsAppButton";
import Policies from "./components/Policies";
import AdminPortal from "./components/admin/AdminPortal";

/** Keeps the browser tab title and favicon in sync with the brand settings. */
function DocumentMeta() {
  const { settings } = useSite();

  useEffect(() => {
    document.title = `${settings.brandName} | Pure Indian Organic Foods — Online Payment Only`;
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.type = "image/png";
    link.href = settings.logo;
  }, [settings.brandName, settings.logo]);

  return null;
}

function Storefront() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-[#fbf6ea] font-sans">
        <Navbar />
        <Hero />
        <TrustBar />
        <About />
        <Products />
        <ComboOffers />
        <WhyUs />
        <Process />
        <Testimonials />
        <FAQ />
        <Newsletter />
        <Footer />
        <CartDrawer />
        <WhatsAppButton />
      </div>
    </CartProvider>
  );
}

export default function App() {
  const adminPath = window.location.pathname.replace(/\/+$/, "") === "/admin";
  const adminHash = window.location.hash === "#/admin";
  const policiesHash = window.location.hash.startsWith("#/policies");

  return (
    <SiteProvider>
      <DocumentMeta />
      {adminPath || adminHash ? (
        <AdminPortal />
      ) : policiesHash ? (
        <Policies />
      ) : (
        <Storefront />
      )}
    </SiteProvider>
  );
}
