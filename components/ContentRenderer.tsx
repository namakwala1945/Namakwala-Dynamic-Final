"use client";
import React from "react";        // ✅ REQUIRED
import type { JSX } from "react"; // ✅ EXTRA FIX FOR JSX.IntrinsicElements
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
export default function ContentRenderer({ content }: { content: any }) {
  return (
    <BlocksRenderer
      content={content}
      blocks={{
        paragraph: ({ children }) => <p>{children}</p>,

        bold: ({ children }) => <strong>{children}</strong>,
        italic: ({ children }) => <em>{children}</em>,

        link: ({ url, children }) => (
          <a
            href={url}
            className="text-gradient font-extrabold underline hover:text-blue-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),

        list: ({ format, children }) =>
          format === "unordered" ? (
            <ul className="list-disc ml-5">{children}</ul>
          ) : (
            <ol className="list-decimal ml-5">{children}</ol>
          ),

        listItem: ({ children }) => <li>{children}</li>,

        heading: ({ level, children }) => {
          const Tag = `h${level}` as keyof JSX.IntrinsicElements; // ✅ now valid
          return <Tag className="font-bold mt-4 mb-2">{children}</Tag>;
        },

        image: ({ image }) => (
          <img
            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${image.url}`}
            alt={image.alternativeText || ""}
            className="my-4 rounded-lg"
          />
        ),
      }}
    />
  );
}
