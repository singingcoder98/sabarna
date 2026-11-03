import {
  Globe,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { useSite } from "../context/SiteContext";

export default function Footer() {
  const { settings } = useSite();
  return (
    <footer id="contact" className="bg-[#1e2a14] pt-16 text-[#f4edd8]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <div>
          <a href="#home" className="flex items-center gap-2.5">
            <img
              src={settings.logo}
              alt={`${settings.brandName} logo`}
              className="h-11 w-11 rounded-full bg-[#efe9d8] object-cover ring-1 ring-white/20"
            />
            <span className="font-serif text-xl font-bold">{settings.brandName}</span>
          </a>
          <p className="mt-4 text-sm leading-relaxed text-[#f4edd8]/70">
            Pure, pesticide-free Indian staples grown by 5,000+ farming
            families and delivered straight to your doorstep.
          </p>
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-white/5 p-3 text-[11px] leading-relaxed text-[#f4edd8]/75">
            <Lock size={14} className="mt-0.5 shrink-0 text-[#e9c46a]" />
            <span>
              <span className="font-semibold text-white">Online payment only.</span> Cash on
              Delivery is disabled. We accept UPI, cards &amp; netbanking.
            </span>
          </div>
          <div className="mt-5 flex gap-3">
            {[Globe, MessageCircle, Send, Mail].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social media link"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#e9c46a] hover:text-[#1e2a14]"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-serif text-base font-bold text-[#e9c46a]">Quick Links</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-[#f4edd8]/75">
            <li><a href="#about" className="hover:text-[#e9c46a]">About Us</a></li>
            <li><a href="#products" className="hover:text-[#e9c46a]">Shop Products</a></li>
            <li><a href="#why-us" className="hover:text-[#e9c46a]">Why Organic</a></li>
            <li><a href="#process" className="hover:text-[#e9c46a]">Our Process</a></li>
            <li><a href="#testimonials" className="hover:text-[#e9c46a]">Reviews</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-base font-bold text-[#e9c46a]">Categories</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-[#f4edd8]/75">
            <li><a href="#products" className="hover:text-[#e9c46a]">Spices &amp; Masalas</a></li>
            <li><a href="#products" className="hover:text-[#e9c46a]">Grains &amp; Rice</a></li>
            <li><a href="#products" className="hover:text-[#e9c46a]">Ghee &amp; Dairy</a></li>
            <li><a href="#products" className="hover:text-[#e9c46a]">Honey &amp; Sweeteners</a></li>
            <li><a href="#products" className="hover:text-[#e9c46a]">Cold-Pressed Oils</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-base font-bold text-[#e9c46a]">Get in Touch</h4>
          <ul className="mt-4 space-y-3 text-sm text-[#f4edd8]/75">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-[#e9c46a]" />
              <span>{settings.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={15} className="shrink-0 text-[#e9c46a]" />
              <span>{settings.phone}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <MessageCircle size={15} className="shrink-0 text-[#e9c46a]" />
              <a
                href={`https://wa.me/${(settings.whatsapp || "").replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#e9c46a]"
              >
                WhatsApp enquiry
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={15} className="shrink-0 text-[#e9c46a]" />
              <span>{settings.email}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 text-xs text-[#f4edd8]/60 sm:flex-row lg:px-10">
          <p>© {new Date().getFullYear()} {settings.brandName} Pvt. Ltd. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <a href="/#/policies#shipping" className="hover:text-[#e9c46a]">Shipping Policy</a>
            <a href="/#/policies#refund" className="hover:text-[#e9c46a]">Refund Policy</a>
            <a href="/#/policies#privacy" className="hover:text-[#e9c46a]">Privacy Policy</a>
            <a href="/#/policies#terms" className="hover:text-[#e9c46a]">Terms &amp; Conditions</a>
            <a href="/#/admin" className="hover:text-[#e9c46a]">Admin login</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
