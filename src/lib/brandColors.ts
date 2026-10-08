export const serviceColors = {
  receive: { hex: "#2F5BFF", from: "#2F5BFF", to: "#5C6EFF" },
  ship: { hex: "#2FE0C3", from: "#2FE0C3", to: "#28C7F5" },
  quote: { hex: "#28C7F5", from: "#2FE0C3", to: "#28C7F5" },
  exchange: { hex: "#7A4DFF", from: "#7A4DFF", to: "#3A3F9F" },
  returns: { hex: "#5C6EFF", from: "#2F5BFF", to: "#5C6EFF" },
  track: { hex: "#EF4444", from: "#FF512F", to: "#F09819" },
  reroute: { hex: "#F97316", from: "#FF512F", to: "#F09819" },
  marketplace: { hex: "#3A3F9F", from: "#7A4DFF", to: "#3A3F9F" },
} as const;

export type ServiceName = keyof typeof serviceColors;
