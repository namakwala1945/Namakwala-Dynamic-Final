"use client";

import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

interface BreadcrumbProps {
  mainCategory: string;   // Salt
  subCategory: string;    // Food Grade Salts
  productName: string;    // Triple Refined Free Flow Salt
}

export default function Breadcrumb({ mainCategory, subCategory, productName }: BreadcrumbProps) {
  return (
    <nav className="flex items-center text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
      <Link href="/" className="hover:text-blue-600">Home</Link>
      <FiChevronRight className="mx-2 text-gray-400" />

      <Link href={`/${mainCategory.toLowerCase()}`} className="hover:text-blue-600 capitalize">
        {mainCategory}
      </Link>
      <FiChevronRight className="mx-2 text-gray-400" />

      <Link
        href={`/${mainCategory.toLowerCase()}/${subCategory.toLowerCase().replace(/\s+/g, "-")}`}
        className="hover:text-blue-600 capitalize"
      >
        {subCategory}
      </Link>
      <FiChevronRight className="mx-2 text-gray-400" />

      <span className="text-gray-800 font-medium">{productName}</span>
    </nav>
  );
}
