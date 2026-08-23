-- Pet Lynk · 0002 — identidade e papéis
-- Uma conta pode ser tutor, cuidador ou os dois: é o interruptor
-- "Modo cuidador" do ecrã 14 que alterna o papel ativo.

begin;

create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  name          text        not null check (length(btrim(name)) > 0),
  email         citext      not null unique,
  -- Telemóvel PT: 9 dígitos começados por 9, guardado em formato E.164.
  phone         text        unique check (phone ~ '^\+351 9\d{8}$'),
  password_hash text        not null,
  city          text,
  avatar_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger users_set_updated_at
  before update on users
  for each row execute function set_updated_at();

create table if not exists user_roles (
  user_id  uuid      not null references users(id) on delete cascade,
  role     role_type not null,
  added_at timestamptz not null default now(),
  primary key (user_id, role)
);

comment on table user_roles is
  'Papéis disponíveis na conta. O papel ATIVO é estado de sessão, não de base de dados.';

commit;
