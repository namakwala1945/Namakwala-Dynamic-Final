"use client";

import { useEffect, useState } from "react";

interface VisitorData {
  total: number;
  today: number;
  month: number;
  year: number;
}

export default function VisitorCounter() {
  const [data, setData] = useState<VisitorData | null>(null);

  useEffect(() => {
    async function addAndFetch() {
      // First add visitor
      await fetch("/api/visitor", { method: "POST" });

      // Then get updated stats
      const res = await fetch("/api/visitor");
      const json = await res.json();
      setData(json);
    }
    addAndFetch();
  }, []);

  if (!data) {
    return null; // don’t render until ready
  }

  return (
    <div className="w-full bg-[#d2ab67] py-6 hidden">
      <div className="container mx-auto flex flex-wrap justify-center items-center gap-6 text-sm md:text-base font-medium text-center">
        <span className="px-4 py-2 bg-white shadow-md">
          <strong>Total Visitors:</strong> {data.total}
        </span>
        <span className="px-4 py-2 bg-white shadow-md">
          <strong>Today:</strong> {data.today}
        </span>
        <span className="px-4 py-2 bg-white shadow-md">
          <strong>This Month:</strong> {data.month}
        </span>
        <span className="px-4 py-2 bg-white shadow-md">
          <strong>This Year:</strong> {data.year}
        </span>
      </div>
    </div>
  );
}
