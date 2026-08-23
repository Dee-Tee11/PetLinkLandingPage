-- Pet Lynk · 0003 — animais e registo médico (ecrã 04)
-- O estado de cada vacina ("Em dia" / "Renovar 30/05") é DERIVADO de
-- next_due_on, nunca guardado — ver a vista reminders_v em 0008.

begin;

create table if not exists pets (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null references users(id) on delete cascade,
  name         text not null check (length(btrim(name)) > 0),
  species      text not null,               -- 'Cão', 'Gato', …
  breed        text,
  sex          pet_sex,
  birth_date   date check (birth_date <= current_date),
  photo_url    text,
  microchip    text unique,
  vet_name     text,
  vet_phone    text,
  vet_city     text,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger pets_set_updated_at
  before update on pets
  for each row execute function set_updated_at();

-- Série temporal: é daqui que sai o "31,2 kg +0,4" do ecrã 04.
create table if not exists pet_weights (
  id          uuid primary key default gen_random_uuid(),
  pet_id      uuid not null references pets(id) on delete cascade,
  weight_grams integer not null check (weight_grams > 0),
  measured_at timestamptz not null default now(),
  unique (pet_id, measured_at)
);

create table if not exists pet_allergies (
  id     uuid primary key default gen_random_uuid(),
  pet_id uuid not null references pets(id) on delete cascade,
  label  text not null,
  unique (pet_id, label)
);

create table if not exists vaccines (
  id           uuid primary key default gen_random_uuid(),
  pet_id       uuid not null references pets(id) on delete cascade,
  name         text not null,
  given_on     date not null,
  next_due_on  date not null check (next_due_on > given_on),
  clinic       text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger vaccines_set_updated_at
  before update on vaccines
  for each row execute function set_updated_at();

create table if not exists medications (
  id         uuid primary key default gen_random_uuid(),
  pet_id     uuid not null references pets(id) on delete cascade,
  name       text not null,
  dose       text not null,          -- '16 mg'
  times      time[] not null check (array_length(times, 1) > 0),
  starts_on  date not null,
  ends_on    date check (ends_on is null or ends_on >= starts_on),
  note       text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger medications_set_updated_at
  before update on medications
  for each row execute function set_updated_at();

-- Uma linha por dose planeada. given_at nulo = por dar; é o que alimenta
-- as caixas de verificação do ecrã 13.
create table if not exists medication_doses (
  id            uuid primary key default gen_random_uuid(),
  medication_id uuid not null references medications(id) on delete cascade,
  scheduled_at  timestamptz not null,
  given_at      timestamptz,
  given_by      uuid references users(id) on delete set null,
  unique (medication_id, scheduled_at)
);

create table if not exists medical_reports (
  id          uuid primary key default gen_random_uuid(),
  pet_id      uuid not null references pets(id) on delete cascade,
  file_url    text not null,
  file_name   text not null,
  uploaded_at timestamptz not null default now()
);

commit;
