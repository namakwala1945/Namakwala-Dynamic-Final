"use client";
import { useEffect } from "react";

export default function ContentProtector() {
  useEffect(() => {
    // Disable text selection
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";

    // Disable drag
    const blockDrag = (e: DragEvent) => e.preventDefault();
    document.addEventListener("dragstart", blockDrag);

    // Disable right-click
    const disableRightClick = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);

    // Disable important key shortcuts
    const disableKeys = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (
        // Ctrl combinations
        (e.ctrlKey && ["c", "x", "v", "s", "p", "u", "a"].includes(key)) ||
        // Ctrl + Shift combinations
        (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) ||
        // F12
        key === "f12"
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener("keydown", disableKeys);

    return () => {
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";

      document.removeEventListener("dragstart", blockDrag);
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("keydown", disableKeys);
    };
  }, []);

  return null;
}
