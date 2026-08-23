/**
 * Formatação PT-PT. Valores em euros com vírgula decimal e símbolo depois do
 * número (13,20€), datas DD/MM/AAAA, horas em 24h.
 * O dinheiro anda sempre em cêntimos inteiros — nunca em vírgula flutuante.
 */

export function formatEuro(cents, { decimals = 2 } = {}) {
  const value = (cents / 100).toFixed(decimals).replace('.', ',');
  return `${value}€`;
}

const pad = (n) => String(n).padStart(2, '0');

export function formatDate(value) {
  const d = new Date(value);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** Dia e mês, como nos cartões de agendamento: "19/05". */
export function formatDayMonth(value) {
  const d = new Date(value);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
}

export function formatTime(value) {
  const d = new Date(value);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
export const WEEKDAYS_SHORT = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

/** "Terça, 19/05 · 17:30" */
export function formatWhen(value) {
  const d = new Date(value);
  return `${WEEKDAYS[d.getDay()]}, ${formatDayMonth(d)} · ${formatTime(d)}`;
}

export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}min` : `${h}h`;
}

/** Cronómetro do serviço a decorrer: "22:14". */
export function formatStopwatch(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${pad(m)}:${pad(s)}`;
}

/** Contagem decrescente do pedido: "4h 12m". Abaixo de 1h fica terracota. */
export function formatCountdown(ms) {
  if (ms <= 0) return 'expirado';
  const totalMinutes = Math.floor(ms / 60000);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return h ? `${h}h ${pad(m)}m` : `${m}m`;
}

/** Peso guardado em gramas → "31,2 kg". */
export function formatWeight(grams) {
  return `${(grams / 1000).toFixed(1).replace('.', ',')}`;
}

export function ageInYears(birthDate) {
  const b = new Date(birthDate);
  const now = new Date();
  let years = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) years -= 1;
  return years;
}

export function daysUntil(value) {
  const target = new Date(value);
  const today = new Date();
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
}

/** Plural simples PT: 1 dia / 12 dias. */
export function plural(n, singular, pluralForm) {
  return `${n} ${n === 1 ? singular : pluralForm}`;
}
