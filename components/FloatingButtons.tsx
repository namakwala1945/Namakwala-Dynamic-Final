"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowUp, FaWhatsapp } from "react-icons/fa";

export default function FloatingButtons() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowScroll(window.scrollY > 300);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Your WhatsApp number (no +, no spaces)
  const whatsappNumber = "+919829039590";
  const whatsappMessage = 
                          `👋 Hi there! You’ve reached Namakwala Group, your destination for premium salts and minerals. What can we help you with today?`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}${
    whatsappMessage ? `?text=${encodeURIComponent(whatsappMessage)}` : ""
  }`;

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[91]">
      {/* WhatsApp Button */}
      <Link
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
        className="flex items-center justify-center rounded-full transition transform hover:-translate-y-0.5"
      >
        <Image
            src="/optimized/business-whatsapp-icon-large.webp"
            alt="WhatsApp Business"
            width={50}
            height={50}
            className=""
        /> 
      </Link>

      {/* Scroll-to-top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          title="Scroll to top"
          className="w-12 h-12 flex items-center justify-center rounded-full shadow-lg bg-[#d2ab67] hover:bg-[#946f41] text-white transition transform hover:-translate-y-0.5"
        >
          <FaArrowUp size={18} />
        </button>
      )}
    </div>
  );
}
