-- Pet Lynk · 0007 — ganhos, transferências e recibos (ecrã 18)

begin;

-- Transferência automática às sextas para o IBAN do cuidador.
create table if not exists payouts (
  id            uuid primary key default gen_random_uuid(),
  caregiver_id  uuid not null references caregivers(user_id) on delete cascade,
  amount_cents  integer not null check (amount_cents > 0),
  currency      char(3) not null default 'EUR',
  iban_masked   text not null,               -- 'IBAN ···· 3092'
  status        payout_status not null default 'agendada',
  scheduled_for date not null,
  paid_at       timestamptz,
  provider_ref  text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  check (status <> 'paga' or paid_at is not null)
);

create trigger payouts_set_updated_at
  before update on payouts
  for each row execute function set_updated_at();

-- Que serviços entraram em cada transferência.
create table if not exists payout_items (
  payout_id  uuid not null references payouts(id) on delete cascade,
  booking_id uuid not null references bookings(id),
  amount_cents integer not null check (amount_cents >= 0),
  primary key (payout_id, booking_id)
);

create table if not exists receipts (
  id         uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references bookings(id) on delete restrict,
  number     text not null unique,          -- 'PL-4821'
  issued_at  timestamptz not null default now(),
  pdf_url    text
);

commit;
