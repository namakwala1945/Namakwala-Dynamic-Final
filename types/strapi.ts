export interface StrapiImage {
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
}

export interface StrapiMediaFormat {
  data?: {
    attributes: StrapiImage;
  };
}
