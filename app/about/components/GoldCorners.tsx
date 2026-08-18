export default function GoldCorners({
  size = "md",
}: {
  size?: "sm" | "md";
}) {
  const s = size === "sm" ? "w-6 h-6" : "w-8 h-8";

  return (
    <>
      <span
        className={`absolute ${
          size === "sm" ? "-top-2 -left-2" : "-top-3 -left-3"
        } ${s} border-t-2 border-l-2 border-[#d2ab67] z-10 pointer-events-none`}
      />
      <span
        className={`absolute ${
          size === "sm" ? "-top-2 -right-2" : "-top-3 -right-3"
        } ${s} border-t-2 border-r-2 border-[#d2ab67] z-10 pointer-events-none`}
      />
      <span
        className={`absolute ${
          size === "sm" ? "-bottom-2 -left-2" : "-bottom-3 -left-3"
        } ${s} border-b-2 border-l-2 border-[#d2ab67] z-10 pointer-events-none`}
      />
      <span
        className={`absolute ${
          size === "sm" ? "-bottom-2 -right-2" : "-bottom-3 -right-3"
        } ${s} border-b-2 border-r-2 border-[#d2ab67] z-10 pointer-events-none`}
      />
    </>
  );
}
