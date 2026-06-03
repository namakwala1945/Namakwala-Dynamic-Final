const countryLanguageMap: Record<
  string,
  string
> = {
  germany: "de-DE",
  france: "fr-FR",
  italy: "it-IT",
  spain: "es-ES",
  qatar: "ar-QA",
  "saudi-arabia": "ar-SA",
  uae: "ar-AE",
  europe: "en",
  usa: "en-US",
  canada: "en-CA",
  australia: "en-AU",
  india: "en-IN",
};

export function getHreflang(
  countrySlug: string
): string {

  return (
    countryLanguageMap[
      countrySlug?.toLowerCase()
    ] || "en"
  );
}