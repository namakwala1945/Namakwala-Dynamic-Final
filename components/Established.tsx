"use client";

import { useMemo } from "react";

export default function CompanyAge() {
  const startYear = 1945;

  // useMemo so it only computes once on mount
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const years = currentYear - startYear;

  return (
       <span>{years} Year's.</span>
  );
}
