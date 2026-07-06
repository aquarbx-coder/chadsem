"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollUp() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      onClick={scrollUp}
      className={`fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-chad-card border border-chad-green/30 flex items-center justify-center hover:bg-chad-green/10 hover:border-chad-green/60 transition-all cursor-pointer shadow-lg ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      style={{ transition: "opacity 0.3s ease, transform 0.3s ease, background 0.2s ease, border-color 0.2s ease" }}
      aria-label="Scroll to top"
    >
      <svg className="w-4 h-4 text-chad-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}
