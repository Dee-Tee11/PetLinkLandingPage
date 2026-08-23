import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as mock from '../data/mock';
import { daysUntil } from '../lib/format';

const AppContext = createContext(null);

const FEE_RATE = mock.FEE_RATE;

/* No protótipo o total é calculado aqui para o ecrã ter o que mostrar.
   Em produção vem SEMPRE do servidor — nunca do cliente (handoff). */
function priceBooking(priceCents) {
  const feeCents = Math.round(priceCents * FEE_RATE);
  return { priceCents, feeCents, totalCents: priceCents + feeCents };
}

const emptyDraft = {
  petId: 'p-boris',
  caregiverId: null,
  service: 'passeio',
  date: '',
  time: '',
  note: '',
  shareHealthRecord: true,
};

export function AppProvider({ children }) {
  const [session, setSession] = useState(mock.session);
  const [pets, setPets] = useState(mock.pets);
  const [bookings, setBookings] = useState(mock.bookings);
  const [conversations, setConversations] = useState(mock.conversations);
  const [caregivers, setCaregivers] = useState(mock.caregivers);
  const [draft, setDraft] = useState(emptyDraft);
  const [lastBookingId, setLastBookingId] = useState(null);
  const [dosesGiven, setDosesGiven] = useState({ 'm-1|08:00': true });
  const [preferences, setPreferences] = useState({
    caregiverMode: true,
    reminders: true,
    servicePhotos: true,
    shareHealthRecord: false,
  });

  /* ── Selectores ──────────────────────────────────────────────────── */

  const getPet = useCallback((id) => pets.find((p) => p.id === id), [pets]);
  const getCaregiver = useCallback((id) => caregivers.find((c) => c.id === id), [caregivers]);
  const getBooking = useCallback((id) => bookings.find((b) => b.id === id), [bookings]);
  const getUser = useCallback((id) => mock.users[id], []);

  const activeBooking = useMemo(() => bookings.find((b) => b.status === 'a_decorrer'), [bookings]);
  const nextBooking = useMemo(
    () =>
      bookings
        .filter((b) => ['aceite', 'a_decorrer', 'pendente'].includes(b.status))
        .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))[0],
    [bookings],
  );

  /** Os lembretes são derivados de vacinas e medicação — não são uma tabela. */
  const reminders = useMemo(() => {
    const expiring = [];
    const doses = [];
    for (const pet of pets) {
      for (const v of pet.vaccines) {
        const days = daysUntil(v.nextDueOn);
        if (days <= 30) expiring.push({ ...v, petId: pet.id, petName: pet.name, days, clinic: v.clinic || pet.vet.name });
      }
      for (const m of pet.medications) {
        for (const time of m.times) {
          const key = `${m.id}|${time}`;
          doses.push({ key, medicationId: m.id, name: m.name, dose: m.dose, time, petName: pet.name, given: !!dosesGiven[key] });
        }
      }
    }
    expiring.sort((a, b) => a.days - b.days);
    doses.sort((a, b) => a.time.localeCompare(b.time));
    const upcoming = [];
    for (const pet of pets) {
      for (const v of pet.vaccines) {
        const days = daysUntil(v.nextDueOn);
        if (days > 30 && days <= 120) upcoming.push({ ...v, petName: pet.name, days });
      }
    }
    upcoming.sort((a, b) => a.days - b.days);
    return { expiring, doses, upcoming: upcoming.slice(0, 2) };
  }, [pets, dosesGiven]);

  /* ── Ações ───────────────────────────────────────────────────────── */

  const updateDraft = useCallback((patch) => setDraft((d) => ({ ...d, ...patch })), []);
  const resetDraft = useCallback((patch = {}) => setDraft({ ...emptyDraft, ...patch }), []);

  const draftPrice = useMemo(() => {
    const caregiver = caregivers.find((c) => c.id === draft.caregiverId);
    const item = caregiver?.priceList.find((s) => s.code === draft.service) ?? { priceCents: 1200, duration: 60 };
    return { ...priceBooking(item.priceCents), durationMinutes: item.duration };
  }, [caregivers, draft.caregiverId, draft.service]);

  const confirmBooking = useCallback(() => {
    const id = `b-${Math.random().toString(36).slice(2, 7)}`;
    const caregiver = caregivers.find((c) => c.id === draft.caregiverId);
    const item = caregiver?.priceList.find((s) => s.code === draft.service);
    const price = priceBooking(item?.priceCents ?? 1200);
    const scheduledAt = draft.date && draft.time ? new Date(`${draft.date}T${draft.time}`).toISOString() : new Date(Date.now() + 2 * 86400000).toISOString();

    const booking = {
      id,
      tutorId: session.userId,
      caregiverId: draft.caregiverId,
      petId: draft.petId,
      service: draft.service,
      serviceLabel: mock.servicesCatalog.find((s) => s.code === draft.service)?.label ?? 'Serviço',
      scheduledAt,
      durationMinutes: item?.duration ?? 60,
      location: caregiver?.zone ?? 'Espinho',
      tutorNote: draft.note,
      shareHealthRecord: draft.shareHealthRecord,
      ...price,
      status: 'aceite',
      reference: `PL-${4820 + bookings.length + 1}`,
      updates: [],
    };
    setBookings((bs) => [booking, ...bs]);
    setLastBookingId(id);
    return booking;
  }, [bookings.length, caregivers, draft, session.userId]);

  const sendMessage = useCallback(
    (conversationId, body) => {
      if (!body.trim()) return;
      setConversations((cs) =>
        cs.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { id: `msg-${Date.now()}`, senderId: session.userId, body: body.trim(), at: new Date().toISOString() },
                ],
              }
            : c,
        ),
      );
    },
    [session.userId],
  );

  const getConversationForBooking = useCallback(
    (bookingId) => conversations.find((c) => c.bookingId === bookingId) ?? conversations[0],
    [conversations],
  );

  const toggleDose = useCallback((key) => setDosesGiven((d) => ({ ...d, [key]: !d[key] })), []);

  const setPreference = useCallback((key, value) => setPreferences((p) => ({ ...p, [key]: value })), []);

  const setRole = useCallback((role) => setSession((s) => ({ ...s, activeRole: role })), []);

  const acceptRequest = useCallback((bookingId) => {
    setBookings((bs) =>
      bs.map((b) =>
        b.id === bookingId ? { ...b, status: 'a_decorrer', startedAt: new Date().toISOString() } : b,
      ),
    );
  }, []);

  const declineRequest = useCallback((bookingId) => {
    setBookings((bs) => bs.map((b) => (b.id === bookingId ? { ...b, status: 'recusado' } : b)));
  }, []);

  const finishService = useCallback((bookingId) => {
    setBookings((bs) =>
      bs.map((b) =>
        b.id === bookingId
          ? { ...b, status: 'concluido', endedAt: new Date().toISOString(), settledAt: new Date().toISOString() }
          : b,
      ),
    );
  }, []);

  const addBookingUpdate = useCallback((bookingId, update) => {
    setBookings((bs) =>
      bs.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              updates: [{ id: `up-${Date.now()}`, at: new Date().toISOString(), ...update }, ...b.updates],
            }
          : b,
      ),
    );
  }, []);

  const updateCaregiver = useCallback((id, patch) => {
    setCaregivers((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const addPet = useCallback((pet) => setPets((ps) => [...ps, pet]), []);

  const value = useMemo(
    () => ({
      session,
      setRole,
      pets,
      addPet,
      caregivers,
      bookings,
      conversations,
      earnings: mock.earnings,
      caregiverSchedule: mock.caregiverSchedule,
      caregiverStats: mock.caregiverStats,
      servicesCatalog: mock.servicesCatalog,
      preferences,
      setPreference,
      draft,
      draftPrice,
      updateDraft,
      resetDraft,
      confirmBooking,
      lastBookingId,
      reminders,
      dosesGiven,
      toggleDose,
      getPet,
      getCaregiver,
      getBooking,
      getUser,
      getConversationForBooking,
      activeBooking,
      nextBooking,
      sendMessage,
      acceptRequest,
      declineRequest,
      finishService,
      addBookingUpdate,
      updateCaregiver,
    }),
    [
      session, setRole, pets, addPet, caregivers, bookings, conversations, preferences, setPreference,
      draft, draftPrice, updateDraft, resetDraft, confirmBooking, lastBookingId, reminders, dosesGiven,
      toggleDose, getPet, getCaregiver, getBooking, getUser, getConversationForBooking, activeBooking,
      nextBooking, sendMessage, acceptRequest, declineRequest, finishService, addBookingUpdate, updateCaregiver,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp tem de ser usado dentro de <AppProvider>');
  return ctx;
}
