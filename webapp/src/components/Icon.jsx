/**
 * Todos os ícones do handoff são Lucide a stroke-width 2.75.
 * Importados um a um de propósito: `import * as lucide` arrasta o pacote
 * inteiro para o bundle (+800 kB), o que numa app de telemóvel não passa.
 * Ícone novo num ecrã → acrescentar aqui.
 */
import {
  AlignLeft,
  ArrowLeft,
  ArrowRight,
  Bell,
  Calendar,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  CreditCard,
  Droplet,
  FileText,
  Footprints,
  Heart,
  House,
  LoaderCircle,
  MapPin,
  MessageCircle,
  PawPrint,
  Pill,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Stethoscope,
  Sun,
  TriangleAlert,
  User,
} from 'lucide-react';

const ICONS = {
  AlignLeft,
  ArrowLeft,
  ArrowRight,
  Bell,
  Calendar,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  CreditCard,
  Droplet,
  FileText,
  Footprints,
  Heart,
  House,
  LoaderCircle,
  MapPin,
  MessageCircle,
  PawPrint,
  Pill,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Stethoscope,
  Sun,
  TriangleAlert,
  User,
};

export default function Icon({ name, size = 19, color = 'currentColor', ...rest }) {
  const Cmp = ICONS[name];
  if (!Cmp) {
    if (import.meta.env.DEV) console.warn(`Icon: "${name}" não está no mapa de ícones (components/Icon.jsx)`);
    return null;
  }
  return <Cmp size={size} color={color} strokeWidth={2.75} absoluteStrokeWidth {...rest} />;
}

/** Exceção do handoff: o glifo Apple Pay é um path próprio, não Lucide. */
export function ApplePayGlyph({ size = 34 }) {
  return (
    <svg width={size} height={size * 0.42} viewBox="0 0 48 20" fill="currentColor" aria-hidden="true">
      <path d="M8.6 2.7c.55-.68.92-1.6.82-2.53-.79.04-1.76.53-2.33 1.2-.51.59-.96 1.54-.84 2.44.89.07 1.79-.45 2.35-1.11ZM9.41 4c-1.29-.08-2.39.73-3 .73-.62 0-1.56-.69-2.57-.67-1.32.02-2.54.77-3.22 1.95-1.38 2.39-.36 5.93.98 7.87.66.96 1.44 2.03 2.47 1.99.99-.04 1.36-.64 2.56-.64 1.19 0 1.53.64 2.57.62 1.07-.02 1.74-.97 2.39-1.94.75-1.11 1.06-2.18 1.08-2.24-.02-.02-2.08-.8-2.1-3.16-.02-1.97 1.61-2.92 1.68-2.97-.92-1.36-2.35-1.51-2.85-1.55Z" />
      <path d="M20.9 1.6c2.78 0 4.71 1.92 4.71 4.7 0 2.8-1.97 4.72-4.78 4.72h-3.08v4.89h-2.23V1.6h5.38Zm-3.15 7.55h2.55c1.93 0 3.03-1.04 3.03-2.84 0-1.8-1.1-2.83-3.02-2.83h-2.56v5.67ZM26.19 12.95c0-1.83 1.4-2.95 3.89-3.09l2.86-.17v-.8c0-1.17-.79-1.87-2.1-1.87-1.25 0-2.02.6-2.21 1.53h-2.03c.12-1.89 1.73-3.28 4.32-3.28 2.54 0 4.16 1.34 4.16 3.44v7.2h-2.06v-1.72h-.05c-.61 1.16-1.93 1.9-3.3 1.9-2.05 0-3.48-1.27-3.48-3.14Zm6.75-.95v-.82l-2.57.16c-1.28.09-2 .65-2 1.55 0 .92.75 1.52 1.9 1.52 1.5 0 2.67-1.03 2.67-2.41ZM36.98 19.8v-1.74c.16.04.51.04.69.04.99 0 1.53-.42 1.86-1.5l.19-.62-3.77-10.45h2.33l2.63 8.47h.04l2.63-8.47h2.27l-3.91 10.98c-.89 2.53-1.92 3.35-4.09 3.35-.18 0-.72-.02-.87-.06Z" />
    </svg>
  );
}
