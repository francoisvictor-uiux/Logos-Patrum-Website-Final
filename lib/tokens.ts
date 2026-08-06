/**
 * Canvas-side colour tokens.
 *
 * WebGL uniforms can't read CSS custom properties, so the palette steps the
 * dot-matrix shader needs are mirrored here from app/globals.css. Primitive
 * names and values must stay in lock-step with the @theme block — change a
 * step there, change it here.
 */
export const primary = {
  50: "#F5F7FD",
  100: "#E7EDFA",
  200: "#C9D6F4",
  300: "#A4BAEC",
  400: "#6F8FDD",
  500: "#21386E",
  600: "#1C315F",
  700: "#17294F",
  800: "#121F3D",
} as const;

/** The one true surface white (semantic --color-surface). */
export const surface = "#FFFFFF";

/** The hero / preloader dot field: primary 100 → 800, light to deep. */
export const heroShaderColors: string[] = [
  primary[100],
  primary[200],
  primary[300],
  primary[400],
  primary[500],
  primary[600],
  primary[700],
  primary[800],
];
