export const BASE_PATH =
  process.env.BASE_PATH ??
  (process.env.NODE_ENV === "production"
  ? "/IP-34_appRecord-PrikhodjkoRoman-FIOT-2026"
  : "");
