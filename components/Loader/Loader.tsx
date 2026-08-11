"use client";
import React, { useEffect, useState } from "react";
import clsx from "clsx";

interface LoaderProps {
  show?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ show = true }) => {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    if (!show) {
      // wait for animation to finish THEN hide loader completely
      const timer = setTimeout(() => setHide(true), 600);
      return () => clearTimeout(timer);
    }
  }, [show]);

  // after animation completed → remove loader
  if (hide) return null;

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md transition-all duration-500 ease-out",
        show ? "opacity-100 bg-black/40" : "opacity-0 bg-black/0 scale-105"
      )}
    >
      <div
        className={clsx(
          "flex flex-col items-center p-6 rounded-xl backdrop-blur-lg shadow-xl transition-all duration-500",
          show ? "opacity-100 scale-100 bg-white/20" : "opacity-0 scale-105 bg-white/0"
        )}
      >
        {/* Logo */}
        <img
          src="/namakwala-white-logo.png"
          alt="Logo"
          className={clsx(
            "w-32 h-32 mb-4 transition-all duration-500",
            show ? "opacity-100 scale-100" : "opacity-0 scale-110"
          )}
        />

        {/* Loading text */}
        <p className="text-white text-lg font-semibold animate-pulse">
          Loading your experience...
        </p>

        {/* Shimmer line */}
        <div className="mt-4 w-40 h-1 bg-white/30 rounded-full overflow-hidden relative">
          <div className="absolute top-0 left-0 w-20 h-1 bg-white animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
