-- Pet Lynk · 0008 — vistas derivadas e índices

begin;

-- ── Índices ─────────────────────────────────────────────────────────────

create index if not exists pets_owner_idx              on pets (owner_id);
create index if not exists pet_weights_pet_idx         on pet_weights (pet_id, measured_at desc);
create index if not exists vaccines_pet_idx            on vaccines (pet_id);
create index if not exists vaccines_next_due_idx       on vaccines (next_due_on);
create index if not exists medications_pet_idx         on medications (pet_id);
create index if not exists medication_doses_pending_idx
  on medication_doses (scheduled_at) where given_at is null;

create index if not exists bookings_caregiver_idx      on bookings (caregiver_id, scheduled_at desc);
create index if not exists bookings_tutor_status_idx   on bookings (tutor_id, status);
create index if not exists bookings_pending_idx        on bookings (respond_by) where status = 'pendente';
create index if not exists booking_updates_idx         on booking_updates (booking_id, created_at desc);
create index if not exists booking_track_idx           on booking_track_points (booking_id, recorded_at);

create index if not exists messages_conversation_idx   on messages (conversation_id, sent_at desc);
create index if not exists reviews_caregiver_idx       on reviews (caregiver_id, created_at desc);
create index if not exists payouts_caregiver_idx       on payouts (caregiver_id, scheduled_for desc);

-- Pesquisa por raio do ecrã 05. earthdistance chega para a escala inicial;
-- se a pesquisa geográfica crescer (polígonos, rotas), passar a PostGIS.
create index if not exists caregivers_geo_idx
  on caregivers using gist (ll_to_earth(base_lat, base_lng))
  where base_lat is not null and base_lng is not null;

-- ── Vistas ──────────────────────────────────────────────────────────────

-- Os lembretes do ecrã 13 são DERIVADOS, não uma tabela: vacinas a expirar
-- nos próximos 30 dias, mais as doses de medicação ainda por dar.
create or replace view reminders_v as
  select
    p.owner_id,
    p.id                      as pet_id,
    p.name                    as pet_name,
    'vacina'::text            as kind,
    v.id                      as source_id,
    v.name                    as title,
    v.next_due_on::timestamptz as due_at,
    (v.next_due_on - current_date) as days_until,
    v.clinic                  as detail,
    null::boolean             as done
  from vaccines v
  join pets p on p.id = v.pet_id
  where v.next_due_on <= current_date + interval '30 days'

  union all

  select
    p.owner_id,
    p.id,
    p.name,
    'dose'::text,
    d.id,
    m.name || ' ' || m.dose,
    d.scheduled_at,
    (d.scheduled_at::date - current_date),
    m.note,
    (d.given_at is not null)
  from medication_doses d
  join medications m on m.id = d.medication_id
  join pets p        on p.id = m.pet_id
  where d.scheduled_at < now() + interval '7 days';

comment on view reminders_v is
  'Ecrã 13. Ordenar por due_at; days_until <= 0 é atraso.';

-- O que a lista de resultados do ecrã 05 precisa, numa linha por cuidador.
create or replace view caregiver_search_v as
  select
    c.user_id            as caregiver_id,
    u.name,
    u.city,
    c.zone,
    c.radius_km,
    c.base_lat,
    c.base_lng,
    c.bio,
    c.rating,
    c.rating_count,
    c.services_completed,
    c.response_rate,
    c.response_time_minutes,
    c.years_experience,
    c.is_available,
    -- Selo completo só quando as quatro verificações estão concluídas.
    (
      select count(*) = 4
        from caregiver_verifications cv
       where cv.caregiver_id = c.user_id and cv.status = 'concluida'
    )                    as fully_verified,
    (
      select array_agg(cv.kind order by cv.kind)
        from caregiver_verifications cv
       where cv.caregiver_id = c.user_id and cv.status = 'concluida'
    )                    as badges,
    (
      select jsonb_agg(
               jsonb_build_object(
                 'code', cs.service_code,
                 'label', sc.label,
                 'duration_minutes', cs.duration_minutes,
                 'price_cents', cs.price_cents
               ) order by sc.sort_order
             )
        from caregiver_services cs
        join services_catalog sc on sc.code = cs.service_code
       where cs.caregiver_id = c.user_id
    )                    as services
  from caregivers c
  join users u on u.id = c.user_id;

comment on view caregiver_search_v is
  'Ecrã 05. Filtrar por serviço com services @> e por distância com earth_box.';

commit;
