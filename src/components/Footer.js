"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaInstagram, FaArrowUp } from "react-icons/fa";

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleScrollTo = (e, href) => {
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      const navbarHeight = 80;
      const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="glass-panel border-x-0 border-b-0 rounded-none mt-20 relative bg-ieee-deep/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-16 h-12 overflow-hidden rounded-lg bg-white p-0.5 border border-ieee-blue/40 flex items-center justify-center">
                <Image
                  src="/logo.jpg"
                  alt="KARE IEEE Logo"
                  fill
                  sizes="64px"
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <h3 className="text-white font-bold text-base tracking-wider">
                  KARE IEEE
                </h3>
                <p className="text-[11px] text-ieee-accent font-semibold tracking-wider">
                  EDUCATION SOCIETY
                </p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Empowering students through innovation, technology, leadership, and professional excellence.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-base">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="#home"
                onClick={(e) => handleScrollTo(e, "#home")}
                className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
              >
                Home
              </a>
              <a
                href="#about"
                onClick={(e) => handleScrollTo(e, "#about")}
                className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
              >
                About
              </a>
              <a
                href="#process"
                onClick={(e) => handleScrollTo(e, "#process")}
                className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
              >
                Recruitment Process
              </a>
              <a
                href="#roles"
                onClick={(e) => handleScrollTo(e, "#roles")}
                className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
              >
                Roles
              </a>
              <a
                href="#apply"
                onClick={(e) => handleScrollTo(e, "#apply")}
                className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
              >
                Recruitment Completed
              </a>
              <a
                href="#contact"
                onClick={(e) => handleScrollTo(e, "#contact")}
                className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Connect Column */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-base">Follow Us</h4>
            <p className="text-slate-400 text-sm">
              Stay updated with our latest workshops, hackathons, and announcements.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/kare_ieee_eds_official?igsh=czBma2g5eXV4eWNj"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full glass-panel-hover flex items-center justify-center text-slate-300 hover:text-white hover:border-ieee-accent transition-all duration-300 border border-white/5"
                title="Follow us on Instagram"
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
          <p className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} KARE IEEE Education Society. All rights reserved.
          </p>
          <p className="flex items-center">
            Built with <span className="text-red-500 mx-1">❤️</span> by Web Team &mdash; KARE IEEE EDUCATION SOCIETY
          </p>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-40 p-3 rounded-full bg-ieee-blue hover:bg-ieee-light text-white shadow-lg transition-all duration-300 hover:-translate-y-1 ${
          showScrollTop
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Back to Top"
      >
        <FaArrowUp size={18} />
      </button>
    </footer>
  );
}
