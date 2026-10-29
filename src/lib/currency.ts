export type Locale = "en" | "my";

/**
 * Converts Western digits to Myanmar Unicode numerals
 */
export function toMyanmarDigits(input: number | string): string {
  const myanmarDigits = ["၀", "၁", "၂", "၃", "၄", "၅", "၆", "၇", "၈", "၉"];
  return input
    .toString()
    .replace(/[0-9]/g, (digit) => myanmarDigits[parseInt(digit, 10)]);
}

export interface FormatCurrencyOptions {
  useMyanmarNumerals?: boolean;
  compact?: boolean;
}

/**
 * Formats a monetary amount into Myanmar Kyat (MMK).
 * e.g.
 * - In English: "120,000 MMK"
 * - In Myanmar: "120,000 ကျပ်"
 */
export function formatMMK(
  amount: number,
  locale: Locale = "en",
  options?: FormatCurrencyOptions
): string {
  const rounded = Math.round(amount || 0);
  const formattedNumber = rounded.toLocaleString("en-US");

  if (locale === "my") {
    if (options?.useMyanmarNumerals) {
      return `${toMyanmarDigits(formattedNumber)} ကျပ်`;
    }
    return `${formattedNumber} ကျပ်`;
  }

  return `${formattedNumber} MMK`;
}
