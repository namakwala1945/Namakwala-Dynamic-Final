"use client";

import { useMemo } from "react";

export default function YearsOfExcellence() {
  // company founding year
  const foundedYear = 1945;

  // calculate difference dynamically
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return currentYear - foundedYear;
  }, [foundedYear]);

  return (
    <>
      {years}+
    </>
  );
}
