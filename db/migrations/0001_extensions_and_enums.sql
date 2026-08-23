-- Pet Lynk · 0001 — extensões, tipos e utilitários partilhados
-- Postgres puro (sem nada específico do Supabase). As permissões ficam na API.

begin;

create extension if not exists pgcrypto;   -- gen_random_uuid()
create extension if not exists citext;     -- emails sem distinção de maiúsculas
create extension if not exists cube;       -- dependência do earthdistance
create extension if not exists earthdistance; -- pesquisa por raio (ecrã 05)

-- ── Tipos ───────────────────────────────────────────────────────────────

do $$ begin
  create type role_type as enum ('tutor', 'cuidador');
exception when duplicate_object then null; end $$;

do $$ begin
  create type pet_sex as enum ('macho', 'femea');
exception when duplicate_object then null; end $$;

do $$ begin
  create type verification_kind as enum (
    'identidade',          -- Cartão de Cidadão
    'registo_criminal',
    'primeiros_socorros',
    'referencias'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type verification_status as enum ('pendente', 'a_validar', 'concluida', 'recusada');
exception when duplicate_object then null; end $$;

do $$ begin
  create type booking_status as enum (
    'pendente',    -- à espera da resposta do cuidador (ecrã 16)
    'aceite',
    'a_decorrer',
    'concluido',
    'recusado',
    'cancelado',
    'expirado'     -- a contagem decrescente chegou a zero
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_method as enum ('mbway', 'cartao', 'apple_pay');
exception when duplicate_object then null; end $$;

-- O escrow lê-se aqui: autorizar na reserva, libertar ao concluir.
do $$ begin
  create type payment_status as enum ('autorizado', 'retido', 'libertado', 'reembolsado', 'falhado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type update_kind as enum ('checkin', 'foto', 'nota', 'pagamento_retido', 'checkout');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payout_status as enum ('agendada', 'em_transito', 'paga', 'falhada');
exception when duplicate_object then null; end $$;

-- ── Utilitários ─────────────────────────────────────────────────────────

-- Todas as tabelas mutáveis carregam um trigger com esta função.
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

commit;
