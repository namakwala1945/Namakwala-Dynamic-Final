declare module "@strapi/blocks-react-renderer" {
  import * as React from "react";

  export interface StrapiBlock {
    type: string;
    children?: StrapiBlock[];
    text?: string;
    level?: number;
    format?: string;
    url?: string;
    image?: {
      url: string;
      alternativeText?: string;
    };
  }

  export interface BlocksRendererProps {
    content: StrapiBlock[];
    blocks?: {
      [key: string]: React.ComponentType<any>;
    };
  }

  export const BlocksRenderer: React.FC<BlocksRendererProps>;
}
