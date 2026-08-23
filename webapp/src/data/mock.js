/**
 * Dados falsos do protótipo — a mesma história que o handoff conta:
 * a Bia (tutora), o Boris e a Flora, a Rita (cuidadora verificada em Espinho)
 * e um passeio de 12,00€ com taxa Pet Lynk de 1,20€.
 *
 * As fotografias são placeholders de conteúdo, não assets de produto.
 * Dinheiro sempre em cêntimos inteiros.
 */

const day = 86400000;
const at = (offsetDays, hours = 0, minutes = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};

export const FEE_RATE = 0.1;

export const session = {
  userId: 'u-bia',
  activeRole: 'tutor',
  roles: ['tutor', 'cuidador'],
};

export const users = {
  'u-bia': {
    id: 'u-bia',
    name: 'Bia',
    initial: 'B',
    email: 'bia@exemplo.pt',
    phone: '+351 912 345 678',
    city: 'Espinho',
    avatarTone: 'sage',
  },
  'u-rita': {
    id: 'u-rita',
    name: 'Rita',
    initial: 'R',
    email: 'rita@exemplo.pt',
    phone: '+351 933 221 100',
    city: 'Espinho',
    avatarTone: 'lavender',
  },
  'u-nuno': { id: 'u-nuno', name: 'Nuno', initial: 'N', city: 'Espinho', avatarTone: 'sand' },
  'u-carla': { id: 'u-carla', name: 'Carla', initial: 'C', city: 'Granja', avatarTone: 'sage' },
  'u-tomas': { id: 'u-tomas', name: 'Tomás', initial: 'T', city: 'Espinho', avatarTone: 'sand' },
};

export const pets = [
  {
    id: 'p-boris',
    ownerId: 'u-bia',
    name: 'Boris',
    species: 'Cão',
    breed: 'Golden Retriever',
    sex: 'macho',
    birthDate: '2022-03-12',
    photo: '/images/ImagesPets/pet1.jpeg',
    microchip: '620098765432101',
    vet: { name: 'Clínica do Mar', phone: '+351 227 310 220', city: 'Espinho' },
    weights: [
      { grams: 30800, measuredAt: at(-90) },
      { grams: 31200, measuredAt: at(-7) },
    ],
    allergies: ['Frango', 'Pólen de gramíneas'],
    vaccines: [
      { id: 'v-1', name: 'Antirrábica', givenOn: at(-353), nextDueOn: at(12), clinic: 'Clínica do Mar' },
      { id: 'v-2', name: 'Polivalente (DHPPi)', givenOn: at(-120), nextDueOn: at(245) },
      { id: 'v-3', name: 'Leptospirose', givenOn: at(-120), nextDueOn: at(245) },
      { id: 'v-4', name: 'Tosse do canil', givenOn: at(-200), nextDueOn: at(165) },
      { id: 'v-5', name: 'Leishmaniose', givenOn: at(-300), nextDueOn: at(65) },
    ],
    medications: [
      {
        id: 'm-1',
        name: 'Apoquel',
        dose: '16 mg',
        times: ['08:00', '20:00'],
        startsOn: at(-20),
        endsOn: at(10),
        note: 'Dermatite — com comida',
      },
    ],
    reports: [
      { id: 'r-1', name: 'Análises sanguíneas', date: at(-60) },
      { id: 'r-2', name: 'Raio-X anca', date: at(-180) },
      { id: 'r-3', name: 'Relatório de esterilização', date: at(-420) },
    ],
  },
  {
    id: 'p-flora',
    ownerId: 'u-bia',
    name: 'Flora',
    species: 'Gato',
    breed: 'Gato europeu',
    sex: 'fêmea',
    birthDate: '2024-06-02',
    photo: '/images/ImagesPets/pet2.jpeg',
    microchip: '620098765499887',
    vet: { name: 'Clínica do Mar', phone: '+351 227 310 220', city: 'Espinho' },
    weights: [{ grams: 4100, measuredAt: at(-30) }],
    allergies: [],
    vaccines: [
      { id: 'v-6', name: 'Trívalente felina', givenOn: at(-150), nextDueOn: at(215) },
      { id: 'v-7', name: 'Leucemia felina', givenOn: at(-150), nextDueOn: at(215) },
    ],
    medications: [],
    reports: [],
  },
];

/** Catálogo de serviços — o mesmo `code` que a base de dados usa. */
export const servicesCatalog = [
  { code: 'passeio', label: 'Passeio', icon: 'Footprints' },
  { code: 'banho', label: 'Banho', icon: 'Droplet' },
  { code: 'petsitting', label: 'Petsitting', icon: 'House' },
  { code: 'creche', label: 'Creche', icon: 'Sun' },
  { code: 'veterinario', label: 'Ida ao vet', icon: 'Stethoscope' },
];

export const caregivers = [
  {
    id: 'u-rita',
    name: 'Rita',
    initial: 'R',
    tone: 'lavender',
    verified: true,
    zone: 'Espinho',
    radiusKm: 8,
    bio: 'Cuido de cães há cinco anos, sobretudo de raças grandes. Passeios longos na marginal e relatório com fotos ao fim de cada serviço.',
    shortBio: 'Cuido de cães há cinco anos, sobretudo de raças grandes. Passeios longos na marginal.',
    rating: 4.9,
    ratingCount: 87,
    services: 132,
    responseRate: 98,
    responseTime: '20 min',
    years: 5,
    badges: ['Verificada', 'Primeiros socorros'],
    trust: [
      { label: 'Identidade confirmada', detail: 'Cartão de Cidadão validado' },
      { label: 'Registo criminal validado', detail: `Emitido em ${'01/02/2026'}` },
      { label: 'Curso de primeiros socorros', detail: 'Animais de companhia · 2024' },
      { label: '3 referências contactadas', detail: 'Tutores de serviços anteriores' },
    ],
    priceList: [
      { code: 'passeio', label: 'Passeio', duration: 60, priceCents: 1200 },
      { code: 'petsitting', label: 'Petsitting (dia)', duration: 480, priceCents: 2800 },
      { code: 'creche', label: 'Creche', duration: 240, priceCents: 1800 },
    ],
    availability: [1, 2, 3, 4, 5],
    autoAccept: false,
    reviews: [
      {
        id: 'rev-1',
        author: 'Nuno',
        service: 'Passeio',
        date: at(-9),
        rating: 5,
        body: 'A Rita mandou fotos a meio do passeio e trouxe o Tobias exausto e feliz. Marcou logo o seguinte.',
        photos: ['/images/ImagesPets/pet3.jpeg', '/images/ImagesPets/pet4.jpeg'],
        morePhotos: 4,
      },
    ],
  },
  {
    id: 'u-carla',
    name: 'Carla',
    initial: 'C',
    tone: 'sage',
    verified: true,
    zone: 'Granja',
    radiusKm: 6,
    bio: 'Petsitting em casa, com quintal fechado. Recebo no máximo dois cães ao mesmo tempo.',
    shortBio: 'Petsitting em casa, com quintal fechado. No máximo dois cães ao mesmo tempo.',
    rating: 4.8,
    ratingCount: 41,
    services: 64,
    responseRate: 95,
    responseTime: '1 h',
    years: 3,
    badges: ['Verificada'],
    trust: [],
    priceList: [
      { code: 'petsitting', label: 'Petsitting (dia)', duration: 480, priceCents: 2500 },
      { code: 'passeio', label: 'Passeio', duration: 45, priceCents: 1000 },
    ],
    availability: [0, 5, 6],
    reviews: [],
  },
  {
    id: 'u-tomas',
    name: 'Tomás',
    initial: 'T',
    tone: 'sand',
    verified: true,
    zone: 'Espinho',
    radiusKm: 10,
    bio: 'Banhos e tosquia ao domicílio, com material próprio. Também faço idas ao veterinário.',
    shortBio: 'Banhos e tosquia ao domicílio, com material próprio. Também faço idas ao vet.',
    rating: 4.7,
    ratingCount: 29,
    services: 38,
    responseRate: 91,
    responseTime: '2 h',
    years: 2,
    badges: ['Verificado', 'Primeiros socorros'],
    trust: [],
    priceList: [
      { code: 'banho', label: 'Banho', duration: 90, priceCents: 2200 },
      { code: 'veterinario', label: 'Ida ao vet', duration: 120, priceCents: 1500 },
    ],
    availability: [1, 3, 5],
    reviews: [],
  },
];

export const bookings = [
  {
    id: 'b-001',
    tutorId: 'u-bia',
    caregiverId: 'u-rita',
    petId: 'p-boris',
    service: 'passeio',
    serviceLabel: 'Passeio',
    scheduledAt: at(0, 17, 30),
    durationMinutes: 60,
    location: 'Espinho',
    tutorNote: 'O Boris puxa um bocado no início. Leva a trela comprida que fica no hall.',
    shareHealthRecord: true,
    priceCents: 1200,
    feeCents: 120,
    totalCents: 1320,
    status: 'a_decorrer',
    startedAt: at(0, 17, 32),
    reference: 'PL-4821',
    updates: [
      { id: 'up-3', kind: 'foto', text: 'Pausa na fonte 💧', photo: '/images/ImagesPets/pet3.jpeg', at: at(0, 17, 54) },
      { id: 'up-2', kind: 'checkin', text: 'Check-in — saímos de casa', at: at(0, 17, 32) },
      { id: 'up-1', kind: 'nota', text: 'Agendamento confirmado', at: at(0, 17, 20), by: 'Pet Lynk' },
    ],
    track: { distanceKm: 1.8, place: 'Parque de Espinho' },
  },
  {
    id: 'b-002',
    tutorId: 'u-bia',
    caregiverId: 'u-rita',
    petId: 'p-boris',
    service: 'petsitting',
    serviceLabel: 'Petsitting',
    scheduledAt: at(3, 9, 0),
    durationMinutes: 480,
    location: 'Espinho',
    tutorNote: 'Fim de semana fora. A ração está no armário da cozinha, duas doses por dia.',
    shareHealthRecord: true,
    priceCents: 2800,
    feeCents: 280,
    totalCents: 3080,
    status: 'pendente',
    respondBy: new Date(Date.now() + 4 * 3600000 + 12 * 60000).toISOString(),
    reference: 'PL-4822',
    updates: [],
  },
  {
    id: 'b-003',
    tutorId: 'u-bia',
    caregiverId: 'u-tomas',
    petId: 'p-boris',
    service: 'banho',
    serviceLabel: 'Banho',
    scheduledAt: at(6, 11, 0),
    durationMinutes: 90,
    location: 'Ao domicílio',
    shareHealthRecord: false,
    priceCents: 2200,
    feeCents: 220,
    totalCents: 2420,
    status: 'aceite',
    reference: 'PL-4823',
    updates: [],
  },
  {
    id: 'b-004',
    tutorId: 'u-bia',
    caregiverId: 'u-rita',
    petId: 'p-boris',
    service: 'passeio',
    serviceLabel: 'Passeio',
    scheduledAt: at(-7, 17, 30),
    durationMinutes: 60,
    location: 'Espinho',
    shareHealthRecord: true,
    priceCents: 1200,
    feeCents: 120,
    totalCents: 1320,
    status: 'concluido',
    reference: 'PL-4802',
    settledAt: at(-7, 18, 19),
    review: { rating: 5, body: 'Impecável como sempre.' },
    updates: [],
  },
  {
    id: 'b-005',
    tutorId: 'u-bia',
    caregiverId: 'u-carla',
    petId: 'p-flora',
    service: 'petsitting',
    serviceLabel: 'Petsitting',
    scheduledAt: at(-21, 9, 0),
    durationMinutes: 480,
    location: 'Granja',
    shareHealthRecord: false,
    priceCents: 2500,
    feeCents: 250,
    totalCents: 2750,
    status: 'concluido',
    reference: 'PL-4788',
    settledAt: at(-21, 17, 10),
    updates: [],
  },
];

export const conversations = [
  {
    id: 'c-001',
    bookingId: 'b-001',
    tutorId: 'u-bia',
    caregiverId: 'u-rita',
    presence: 'a passear o Boris agora',
    messages: [
      { id: 'msg-1', senderId: 'u-bia', body: 'Olá Rita! O Boris já comeu às 16h, portanto está pronto 🙂', at: at(0, 17, 10) },
      { id: 'msg-2', senderId: 'u-rita', body: 'Perfeito. Estou a chegar daqui a cinco minutos.', at: at(0, 17, 25) },
      { id: 'msg-3', senderId: 'u-rita', body: 'Saímos! Vamos pela marginal.', at: at(0, 17, 33) },
      { id: 'msg-4', senderId: 'u-rita', photo: '/images/ImagesPets/pet3.jpeg', body: 'Pausa na fonte 💧', at: at(0, 17, 54) },
      { id: 'msg-5', senderId: 'u-bia', body: 'Que lindo! Obrigada 🥰', at: at(0, 17, 56) },
    ],
  },
];

export const earnings = {
  balanceCents: 14840,
  ibanMasked: 'IBAN ···· 3092',
  payoutDay: 'sextas',
  lastRelease: { label: 'Passeio do Boris concluído', amountCents: 1200, at: at(-1, 18, 19) },
  feeRateLabel: '10% por serviço',
  receiptsIssued: 9,
  months: [
    {
      label: 'Julho',
      items: [
        { id: 'e-1', label: 'Passeio · Boris', date: at(-3), amountCents: 1200 },
        { id: 'e-2', label: 'Petsitting · Mia', date: at(-8), amountCents: 2800 },
        { id: 'e-3', label: 'Creche · Tobias', date: at(-12), amountCents: 1800 },
      ],
    },
  ],
};

/** Agenda de hoje do lado do cuidador (ecrã 15). */
export const caregiverSchedule = [
  { id: 's-1', time: '17:30', label: 'Passeio · Boris', place: 'Espinho' },
  { id: 's-2', time: '19:00', label: 'Creche · Tobias', place: 'Granja' },
];

export const caregiverStats = { weekCents: 14800, services: 9, rating: 4.9 };
