const absolute = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });

/** Fecha absoluta: en un sitio estático una fecha relativa quedaría congelada al hacer el build. */
export const formatDate = (date: Date) => absolute.format(date).toLowerCase();

const long = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** Fecha en frase: "13 october 2026". */
export const formatLongDate = (date: Date) => long.format(date).toLowerCase();
