-- Pet Lynk · 0004 — cuidadores, verificações, preços e disponibilidade
-- (ecrãs 06 e 19)

begin;

create table if not exists caregivers (
  user_id                 uuid primary key references users(id) on delete cascade,
  bio                     text,
  zone                    text not null,
  radius_km               numeric(5,1) not null default 10 check (radius_km > 0),
  base_lat                double precision check (base_lat between -90 and 90),
  base_lng                double precision check (base_lng between -180 and 180),
  -- Mantidos por trigger a partir de reviews (ver 0006) — nunca escritos à mão.
  rating                  numeric(2,1) check (rating between 1 and 5),
  rating_count            integer not null default 0 check (rating_count >= 0),
  services_completed      integer not null default 0 check (services_completed >= 0),
  response_rate           smallint check (response_rate between 0 and 100),
  response_time_minutes   integer check (response_time_minutes >= 0),
  years_experience        smallint check (years_experience >= 0),
  is_available            boolean not null default true,
  auto_accept             boolean not null default false,
  auto_accept_min_services smallint not null default 3 check (auto_accept_min_services >= 0),
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create trigger caregivers_set_updated_at
  before update on caregivers
  for each row execute function set_updated_at();

-- ATENÇÃO: os selos de verificação são estado do SERVIDOR. Nunca podem ser
-- escritos pelo próprio cuidador — só por um processo de validação interno.
create table if not exists caregiver_verifications (
  id           uuid primary key default gen_random_uuid(),
  caregiver_id uuid not null references caregivers(user_id) on delete cascade,
  kind         verification_kind not null,
  status       verification_status not null default 'pendente',
  detail       text,                  -- 'Cartão de Cidadão validado'
  verified_at  timestamptz,
  expires_at   timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (caregiver_id, kind),
  -- Só faz sentido ter data de validação quando está concluída.
  check (status <> 'concluida' or verified_at is not null)
);

create trigger caregiver_verifications_set_updated_at
  before update on caregiver_verifications
  for each row execute function set_updated_at();

-- Catálogo partilhado: o mesmo `code` que a webapp usa em data/mock.js.
create table if not exists services_catalog (
  code       text primary key,
  label      text not null,
  sort_order smallint not null default 0
);

insert into services_catalog (code, label, sort_order) values
  ('passeio',     'Passeio',     1),
  ('banho',       'Banho',       2),
  ('petsitting',  'Petsitting',  3),
  ('creche',      'Creche',      4),
  ('veterinario', 'Ida ao vet',  5)
on conflict (code) do nothing;

-- Preço FIXO por serviço e por cuidador. O total de uma reserva é sempre
-- calculado a partir daqui, no servidor — nunca no cliente.
create table if not exists caregiver_services (
  id               uuid primary key default gen_random_uuid(),
  caregiver_id     uuid not null references caregivers(user_id) on delete cascade,
  service_code     text not null references services_catalog(code),
  duration_minutes integer not null check (duration_minutes > 0),
  price_cents      integer not null check (price_cents >= 0),
  currency         char(3) not null default 'EUR',
  unique (caregiver_id, service_code)
);

-- As sete pílulas de dia da semana do ecrã 19. 0 = domingo (compatível com dow).
create table if not exists caregiver_availability (
  caregiver_id uuid not null references caregivers(user_id) on delete cascade,
  weekday      smallint not null check (weekday between 0 and 6),
  primary key (caregiver_id, weekday)
);

commit;
