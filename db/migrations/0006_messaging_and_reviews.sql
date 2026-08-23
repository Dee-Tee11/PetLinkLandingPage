-- Pet Lynk · 0006 — conversas e avaliações (ecrãs 06 e 11)

begin;

create table if not exists conversations (
  id           uuid primary key default gen_random_uuid(),
  booking_id   uuid not null unique references bookings(id) on delete cascade,
  tutor_id     uuid not null references users(id),
  caregiver_id uuid not null references caregivers(user_id),
  created_at   timestamptz not null default now()
);

create table if not exists messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id       uuid not null references users(id),
  body            text,
  photo_url       text,
  sent_at         timestamptz not null default now(),
  delivered_at    timestamptz,
  read_at         timestamptz,
  -- Uma mensagem tem de trazer texto ou foto.
  check (body is not null or photo_url is not null),
  check (read_at is null or delivered_at is not null)
);

create table if not exists reviews (
  id           uuid primary key default gen_random_uuid(),
  booking_id   uuid not null unique references bookings(id) on delete cascade,
  author_id    uuid not null references users(id),
  caregiver_id uuid not null references caregivers(user_id),
  rating       smallint not null check (rating between 1 and 5),
  body         text,
  created_at   timestamptz not null default now()
);

create table if not exists review_photos (
  id         uuid primary key default gen_random_uuid(),
  review_id  uuid not null references reviews(id) on delete cascade,
  photo_url  text not null,
  sort_order smallint not null default 0
);

-- A média e a contagem de avaliações do cuidador são derivadas: mantidas
-- aqui para a pesquisa não ter de agregar a cada consulta.
create or replace function refresh_caregiver_rating() returns trigger as $$
declare
  target uuid := coalesce(new.caregiver_id, old.caregiver_id);
begin
  update caregivers c
     set rating = sub.avg_rating,
         rating_count = sub.n
    from (
      select round(avg(rating)::numeric, 1) as avg_rating, count(*) as n
        from reviews
       where caregiver_id = target
    ) sub
   where c.user_id = target;
  return null;
end;
$$ language plpgsql;

create trigger reviews_refresh_rating
  after insert or update or delete on reviews
  for each row execute function refresh_caregiver_rating();

commit;
