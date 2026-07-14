// Catalog + copy from the design workspace's ui_kits/web (mirrors the Figma;
// exact COP amounts are representative).
export type Cita = {
  id: number;
  name: string;
  tag: string;
  desc: string;
  price: number;
};

export const CITAS: Cita[] = [
  {
    id: 1,
    name: "Numerología Esencial",
    tag: "Autoconocimiento y Destino",
    desc: "Descubre lo que tu nombre completo revela sobre tu misión personal. Conecta con tus anhelos más profundos.",
    price: 150000,
  },
  {
    id: 2,
    name: "Numerología Avanzada",
    tag: "Caminos y Tránsitos del Alma",
    desc: "Descubre las habilidades únicas que trajiste al nacer. Conoce los eventos importantes que marcarán tu vida.",
    price: 161900,
  },
  {
    id: 3,
    name: "Numerología Profunda",
    tag: "Caminos de Evolución y Desafíos",
    desc: "Revelación detallada de las experiencias clave que marcan tu vida y las influencias de tu camino vital.",
    price: 189000,
  },
  {
    id: 4,
    name: "Numerología Especializada",
    tag: "Áreas Específicas de Vida",
    desc: "Análisis profundo enfocado: relaciones de pareja, familia, orientación profesional y más.",
    price: 210000,
  },
];

export const TIMES = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

export const COP = (n: number) => "COP " + n.toLocaleString("es-CO");

// Booking calendar facts (the kit's February 2025 scenario).
export const BOOKING_MONTH = new Date(2025, 1);
export const AVAILABLE_DAYS = [10, 12, 13, 14, 17, 19, 20, 21, 24, 26, 27];
export const AVAILABLE_DATES = AVAILABLE_DAYS.map((d) => new Date(2025, 1, d));

export type Step = "home" | "agenda" | "pago" | "confirm";

export type Booking = {
  modal: "presencial" | "virtual";
  date: Date | null;
  time: string | null;
};
