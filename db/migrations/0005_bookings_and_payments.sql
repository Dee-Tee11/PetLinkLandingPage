-- Pet Lynk · 0005 — reservas, escrow, atualizações e rota GPS
-- (ecrãs 07–10, 16, 17)

begin;

create table if not exists bookings (
  id                  uuid primary key default gen_random_uuid(),
  tutor_id            uuid not null references users(id),
  caregiver_id        uuid not null references caregivers(user_id),
  pet_id              uuid not null references pets(id),
  service_code        text not null references services_catalog(code),
  scheduled_at        timestamptz not null,
  duration_minutes    integer not null check (duration_minutes > 0),
  location            text,
  tutor_note          text,
  share_health_record boolean not null default false,

  -- Dinheiro em cêntimos inteiros. total = price + fee, garantido por check.
  price_cents         integer not null check (price_cents >= 0),
  fee_cents           integer not null check (fee_cents >= 0),
  total_cents         integer not null check (total_cents >= 0),
  currency            char(3) not null default 'EUR',
  check (total_cents = price_cents + fee_cents),

  status              booking_status not null default 'pendente',
  -- Contagem decrescente do ecrã 16; a zero o pedido expira.
  respond_by          timestamptz,
  started_at          timestamptz,
  ended_at            timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  check (tutor_id <> caregiver_id),
  check (ended_at is null or started_at is null or ended_at >= started_at),
  -- Só um serviço a decorrer tem de ter hora de início.
  check (status <> 'a_decorrer' or started_at is not null)
);

create trigger bookings_set_updated_at
  before update on bookings
  for each row execute function set_updated_at();

-- A partilha do registo médico é uma permissão POR RESERVA, com fim quando o
-- serviço acaba. O toggle global do ecrã 14 é só o valor por omissão.
create table if not exists booking_health_access (
  booking_id uuid primary key references bookings(id) on delete cascade,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  check (revoked_at is null or revoked_at >= granted_at)
);

-- Escrow: autorizar na reserva, capturar/libertar ao concluir.
-- O MB WAY confirma na app do banco — daí o estado 'autorizado' antes de 'retido'.
create table if not exists payments (
  id            uuid primary key default gen_random_uuid(),
  booking_id    uuid not null unique references bookings(id) on delete restrict,
  method        payment_method not null,
  masked_ref    text,                         -- '···· 4218' ou '··· 678'
  status        payment_status not null default 'autorizado',
  amount_cents  integer not null check (amount_cents >= 0),
  fee_cents     integer not null check (fee_cents >= 0),
  currency      char(3) not null default 'EUR',
  provider_ref  text,                         -- referência do PSP
  authorized_at timestamptz,
  captured_at   timestamptz,
  released_at   timestamptz,
  refunded_at   timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  check (status <> 'libertado' or released_at is not null)
);

create trigger payments_set_updated_at
  before update on payments
  for each row execute function set_updated_at();

-- Cronologia do ecrã 10 e atualizações enviadas no ecrã 17.
create table if not exists booking_updates (
  id         uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  author_id  uuid references users(id) on delete set null,  -- nulo = Pet Lynk
  kind       update_kind not null,
  text       text,
  photo_url  text,
  created_at timestamptz not null default now()
);

-- Rota GPS do passeio. Substitui o SVG placeholder do ecrã 10.
create table if not exists booking_track_points (
  id          bigserial primary key,
  booking_id  uuid not null references bookings(id) on delete cascade,
  lat         double precision not null check (lat between -90 and 90),
  lng         double precision not null check (lng between -180 and 180),
  recorded_at timestamptz not null default now(),
  unique (booking_id, recorded_at)
);

commit;
