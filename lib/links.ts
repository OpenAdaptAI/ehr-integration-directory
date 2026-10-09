export const CANONICAL_ORIGIN = "https://ehrintegrationdirectory.com";
export const OPENADAPT_HOME_URL = "https://openadapt.ai";
export const OPENADAPT_PARTNERS_URL = "https://openadapt.ai/partners";

/** The directory's own explainer for teams without a usable write API. */
export const NO_WRITE_API_PATH = "/no-write-api";
export const CANADA_PATH = "/canada";

export function remainingScreenNote(subject: string): string {
  return `Public sources rarely settle whether a write works for your account. Do not infer that ${subject} can't do it; ask the vendor or the clinic first. If the only way in is the screen, a person usually types the data in by hand. Software can do that typing and read the saved record back before it reports the step as done.`;
}
