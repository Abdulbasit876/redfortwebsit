import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { LucideIcon } from "./LucideIcon";

export function Navbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Monitor scroll height to trigger solid background transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route transition
  useEffect(() => {
    setIsMobileMenuOpen(false);
    // Scroll to top on page navigate
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Services", path: "/services" },
    { label: "Industries", path: "/industries" },
    { label: "Case Studies", path: "/case-studies" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" }
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-black/95 backdrop-blur-md py-4 border-b border-neutral-950 shadow-lg"
            : "bg-black/95 backdrop-blur-md py-4 border-b border-neutral-950 shadow-lg"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo - RedFort AI */}
          <Link to="/" className="flex items-center group">
            <img
              src="/assets/logos/logo.png"
              alt="RedFort AI Logo"
              className="h-10 w-auto object-contain group-hover:scale-[1.03] transition-transform duration-200"
              referrerPolicy="no-referrer"
            />
          </Link>

          {/* Desktop Navigation links */}
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-xs font-sans font-bold uppercase tracking-wider transition-colors duration-200 relative py-1.5 ${
                    isActive ? "text-red-600" : "text-white hover:text-red-600"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="navActiveLine"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Header Action Button */}
          <div className="hidden lg:flex items-center">
            <Link
              to="/contact"
              className="bg-red-600 hover:bg-red-700 text-white font-sans text-xs font-bold tracking-widest px-5 py-2.5 rounded transition-all duration-300 transform hover:-translate-y-0.5 shadow-md shadow-red-600/10"
            >
              JOIN OUR TEAM
            </Link>
          </div>

          {/* Mobile hamburger menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white hover:text-red-600 transition-colors duration-200 focus:outline-none p-1 shrink-0"
            aria-label="Toggle Menu"
          >
            <LucideIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
          </button>

        </div>
      </nav>

      {/* Mobile navigation sliding drawer panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-30 flex flex-col justify-center lg:hidden"
          >
            {/* Drawer Header with Logo (Duplicate close button removed) */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
                <img
                  src="/assets/logos/monogram.svg"
                  alt="RedFort AI Logo"
                  className="h-9 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </Link>
            </div>

            {/* Mobile menu list */}
            <div className="flex flex-col items-center space-y-6">
              {menuItems.map((item, idx) => {
                const isActive = location.pathname === item.path;
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      className={`text-xl font-sans font-bold tracking-wide ${
                        isActive ? "text-red-600" : "text-white hover:text-red-600"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: menuItems.length * 0.05 }}
                className="pt-6"
              >
                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-red-600 hover:bg-red-700 text-white font-sans text-xs font-bold tracking-widest px-8 py-3.5 rounded"
                >
                  JOIN OUR TEAM
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}