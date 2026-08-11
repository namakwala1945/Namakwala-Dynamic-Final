"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    // Move cursor
    const moveCursor = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY });
    document.addEventListener("mousemove", moveCursor);

    // Handle hover on interactive elements
    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);

    const updateInteractiveElements = () => {
      const elements = document.querySelectorAll(
        "a, button, input, textarea, label, [data-cursor-pointer]"
      );
      elements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.cursor = "none"; // hide default
        htmlEl.addEventListener("mouseenter", handleMouseEnter);
        htmlEl.addEventListener("mouseleave", handleMouseLeave);
      });
      return elements;
    };

    // Initially set interactive elements
    let interactiveElements = updateInteractiveElements();

    // Observer to handle dynamically added elements
    const observer = new MutationObserver(() => {
      // Remove old listeners
      interactiveElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.removeEventListener("mouseenter", handleMouseEnter);
        htmlEl.removeEventListener("mouseleave", handleMouseLeave);
      });
      // Update to new set
      interactiveElements = updateInteractiveElements();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Hide default cursor globally
    document.body.style.cursor = "none";

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      interactiveElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.removeEventListener("mouseenter", handleMouseEnter);
        htmlEl.removeEventListener("mouseleave", handleMouseLeave);
        htmlEl.style.cursor = "";
      });
      observer.disconnect();
      document.body.style.cursor = "default";
    };
  }, []);

  return (
    <div
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
        transition:
          "width 0.15s ease, height 0.15s ease, border-width 0.15s ease, transform 0.1s ease",
      }}
      className={`fixed pointer-events-none z-[999] rounded-full border border-yellow-500
        ${hovered ? "w-10 h-10 border-4" : "w-6 h-6 border-2"}`}
    ></div>
  );
}
