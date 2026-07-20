import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { companyInfo } from "../data/company";
import { services } from "../data/services";
import { LucideIcon } from "./LucideIcon";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    console.log("Newsletter registration requested for email:", email);
    setSubscribed(true);
    e.currentTarget.reset();
    setTimeout(() => {
      setSubscribed(false);
    }, 5000);
  };

  return (
    <footer className="bg-black text-white pt-20 pb-8 border-t border-neutral-900 relative overflow-hidden">
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-full max-w-7xl h-48 bg-red-600/[0.01] blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Upper footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-neutral-900">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center group">
              <img
                src="/assets/logos/logo.png"
                alt="RedFort AI Logo"
                className="h-10 w-auto object-contain group-hover:scale-[1.02] transition-transform duration-200"
                referrerPolicy="no-referrer"
              />
            </Link>
            
            <p className="text-neutral-500 text-sm leading-relaxed max-w-sm font-sans">
              {companyInfo.description}
            </p>

            {/* Social media connections */}
            <div className="flex items-center space-x-4">
              <a
                href={companyInfo.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-red-600 hover:border-red-600/30 flex items-center justify-center transition-all duration-300"
                aria-label="LinkedIn"
              >
                <LucideIcon name="Linkedin" className="w-4 h-4" />
              </a>
              <a
                href={companyInfo.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-red-600 hover:border-red-600/30 flex items-center justify-center transition-all duration-300"
                aria-label="Twitter"
              >
                <LucideIcon name="Twitter" className="w-4 h-4" />
              </a>
              <a
                href={companyInfo.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-red-600 hover:border-red-600/30 flex items-center justify-center transition-all duration-300"
                aria-label="GitHub"
              >
                <LucideIcon name="Github" className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-sans uppercase tracking-[0.2em] text-red-600 font-bold">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm font-body">
              <li>
                <Link to="/" className="text-neutral-400 hover:text-red-600 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-neutral-400 hover:text-red-600 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-neutral-400 hover:text-red-600 transition-colors duration-200">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/industries" className="text-neutral-400 hover:text-red-600 transition-colors duration-200">
                  Industries
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="text-neutral-400 hover:text-red-600 transition-colors duration-200">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-neutral-400 hover:text-red-600 transition-colors duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-neutral-400 hover:text-red-600 transition-colors duration-200">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-neutral-400 hover:text-red-600 transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services Shortlist */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-sans uppercase tracking-[0.2em] text-red-600 font-bold">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm font-body">
              {services.slice(0, 5).map((srv) => (
                <li key={srv.id}>
                  <Link
                    to="/services"
                    className="text-neutral-400 hover:text-red-600 transition-colors duration-200"
                  >
                    {srv.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-sans uppercase tracking-[0.2em] text-red-600 font-bold">
              Newsletter
            </h4>
            <p className="text-neutral-500 text-xs leading-relaxed font-body">
              Subscribe to receive weekly publications on enterprise AI systems and React engineering.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-2 font-body">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your email"
                  className="w-full bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 px-4 py-3 rounded text-xs focus:outline-none focus:border-red-600 transition-colors duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 bg-red-600 hover:bg-red-700 text-white px-3.5 rounded transition-colors duration-200 flex items-center justify-center cursor-pointer"
                  aria-label="Subscribe"
                >
                  <LucideIcon name="Send" className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-red-600 mt-2 font-body">
                  ✓ Successfully subscribed to insights.
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Lower footer */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs font-body text-neutral-600">
          <div className="flex flex-col space-y-1">
            <div>
              © {currentYear} RedFort AI. All Rights Reserved.
            </div>
            <div className="text-neutral-500 font-mono text-[10px]">
              Offices: Wah Cantt, Pakistan • Islamabad, Pakistan
            </div>
          </div>
          
          <div className="flex space-x-6">
            <span className="hover:text-red-600 cursor-pointer">Security Protocol</span>
            <span className="hover:text-red-600 cursor-pointer">Privacy Charter</span>
            <span className="hover:text-red-600 cursor-pointer">Service Terms</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
