-- Pet Lynk · seed — os mesmos dados que o protótipo mostra.
-- A Bia (tutora), a Rita (cuidadora verificada em Espinho), o Boris e a Flora,
-- e um passeio de 12,00€ com taxa Pet Lynk de 1,20€ (total 13,20€).
--
-- Idempotente: correr duas vezes não duplica nada.

begin;

-- ── Utilizadores ────────────────────────────────────────────────────────

insert into users (id, name, email, phone, password_hash, city) values
  ('11111111-1111-1111-1111-111111111111', 'Bia',   'bia@exemplo.pt',   '+351 912345678', 'seed-nao-usar', 'Espinho'),
  ('22222222-2222-2222-2222-222222222222', 'Rita',  'rita@exemplo.pt',  '+351 933221100', 'seed-nao-usar', 'Espinho'),
  ('33333333-3333-3333-3333-333333333333', 'Carla', 'carla@exemplo.pt', '+351 936010203', 'seed-nao-usar', 'Granja'),
  ('44444444-4444-4444-4444-444444444444', 'Tomás', 'tomas@exemplo.pt', '+351 939887766', 'seed-nao-usar', 'Espinho')
on conflict (id) do nothing;

insert into user_roles (user_id, role) values
  ('11111111-1111-1111-1111-111111111111', 'tutor'),
  ('11111111-1111-1111-1111-111111111111', 'cuidador'),  -- a Bia tem os dois papéis
  ('22222222-2222-2222-2222-222222222222', 'cuidador'),
  ('33333333-3333-3333-3333-333333333333', 'cuidador'),
  ('44444444-4444-4444-4444-444444444444', 'cuidador')
on conflict do nothing;

-- ── Animais e registo médico ────────────────────────────────────────────

insert into pets (id, owner_id, name, species, breed, sex, birth_date, photo_url, microchip, vet_name, vet_phone, vet_city) values
  ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'Boris', 'Cão', 'Golden Retriever', 'macho', date '2022-03-12',
   '/images/pets/pet1.jpeg', '620098765432101', 'Clínica do Mar', '+351 227310220', 'Espinho'),
  ('aaaaaaaa-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
   'Flora', 'Gato', 'Gato europeu', 'femea', date '2024-06-02',
   '/images/pets/pet2.jpeg', '620098765499887', 'Clínica do Mar', '+351 227310220', 'Espinho')
on conflict (id) do nothing;

insert into pet_weights (pet_id, weight_grams, measured_at) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 30800, now() - interval '90 days'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 31200, now() - interval '7 days'),
  ('aaaaaaaa-0000-0000-0000-000000000002',  4100, now() - interval '30 days')
on conflict do nothing;

insert into pet_allergies (pet_id, label) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Frango'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Pólen de gramíneas')
on conflict do nothing;

-- A antirrábica do Boris expira em 12 dias — é o aviso terracota dos ecrãs 03 e 13.
insert into vaccines (id, pet_id, name, given_on, next_due_on, clinic) values
  ('bbbbbbbb-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001',
   'Antirrábica', current_date - 353, current_date + 12, 'Clínica do Mar'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001',
   'Polivalente (DHPPi)', current_date - 120, current_date + 245, 'Clínica do Mar'),
  ('bbbbbbbb-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000001',
   'Leptospirose', current_date - 120, current_date + 245, 'Clínica do Mar'),
  ('bbbbbbbb-0000-0000-0000-000000000004', 'aaaaaaaa-0000-0000-0000-000000000001',
   'Tosse do canil', current_date - 200, current_date + 165, 'Clínica do Mar'),
  ('bbbbbbbb-0000-0000-0000-000000000005', 'aaaaaaaa-0000-0000-0000-000000000001',
   'Leishmaniose', current_date - 300, current_date + 65, 'Clínica do Mar'),
  ('bbbbbbbb-0000-0000-0000-000000000006', 'aaaaaaaa-0000-0000-0000-000000000002',
   'Trivalente felina', current_date - 150, current_date + 215, 'Clínica do Mar'),
  ('bbbbbbbb-0000-0000-0000-000000000007', 'aaaaaaaa-0000-0000-0000-000000000002',
   'Leucemia felina', current_date - 150, current_date + 215, 'Clínica do Mar')
on conflict (id) do nothing;

insert into medications (id, pet_id, name, dose, times, starts_on, ends_on, note) values
  ('cccccccc-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001',
   'Apoquel', '16 mg', array['08:00'::time, '20:00'::time],
   current_date - 20, current_date + 10, 'Dermatite — com comida')
on conflict (id) do nothing;

-- As duas doses de hoje: a das 08:00 já dada, a das 20:00 a seguir (ecrã 13).
insert into medication_doses (medication_id, scheduled_at, given_at, given_by) values
  ('cccccccc-0000-0000-0000-000000000001', current_date + time '08:00',
   current_date + time '08:04', '11111111-1111-1111-1111-111111111111'),
  ('cccccccc-0000-0000-0000-000000000001', current_date + time '20:00', null, null),
  ('cccccccc-0000-0000-0000-000000000001', current_date + 1 + time '08:00', null, null),
  ('cccccccc-0000-0000-0000-000000000001', current_date + 1 + time '20:00', null, null)
on conflict do nothing;

insert into medical_reports (pet_id, file_url, file_name, uploaded_at) values
  ('aaaaaaaa-0000-0000-0000-000000000001', '/reports/analises.pdf',   'Análises sanguíneas',       now() - interval '60 days'),
  ('aaaaaaaa-0000-0000-0000-000000000001', '/reports/raiox.pdf',      'Raio-X anca',               now() - interval '180 days'),
  ('aaaaaaaa-0000-0000-0000-000000000001', '/reports/esteril.pdf',    'Relatório de esterilização', now() - interval '420 days')
on conflict do nothing;

-- ── Cuidadores ──────────────────────────────────────────────────────────

insert into caregivers (user_id, bio, zone, radius_km, base_lat, base_lng, response_rate,
                        response_time_minutes, years_experience, services_completed, is_available, auto_accept) values
  ('22222222-2222-2222-2222-222222222222',
   'Cuido de cães há cinco anos, sobretudo de raças grandes. Passeios longos na marginal e relatório com fotos ao fim de cada serviço.',
   'Espinho', 8, 41.0075, -8.6412, 98, 20, 5, 132, true, false),
  ('33333333-3333-3333-3333-333333333333',
   'Petsitting em casa, com quintal fechado. Recebo no máximo dois cães ao mesmo tempo.',
   'Granja', 6, 41.0500, -8.6500, 95, 60, 3, 64, true, false),
  ('44444444-4444-4444-4444-444444444444',
   'Banhos e tosquia ao domicílio, com material próprio. Também faço idas ao veterinário.',
   'Espinho', 10, 41.0080, -8.6390, 91, 120, 2, 38, true, false)
on conflict (user_id) do nothing;

-- Os quatro selos da Rita — estado do servidor, nunca escritos pelo cuidador.
insert into caregiver_verifications (caregiver_id, kind, status, detail, verified_at) values
  ('22222222-2222-2222-2222-222222222222', 'identidade',         'concluida', 'Cartão de Cidadão validado',        now() - interval '400 days'),
  ('22222222-2222-2222-2222-222222222222', 'registo_criminal',   'concluida', 'Emitido em 01/02/2026',             now() - interval '200 days'),
  ('22222222-2222-2222-2222-222222222222', 'primeiros_socorros', 'concluida', 'Animais de companhia · 2024',       now() - interval '600 days'),
  ('22222222-2222-2222-2222-222222222222', 'referencias',        'concluida', 'Tutores de serviços anteriores',    now() - interval '300 days'),
  ('33333333-3333-3333-3333-333333333333', 'identidade',         'concluida', 'Cartão de Cidadão validado',        now() - interval '150 days'),
  ('33333333-3333-3333-3333-333333333333', 'registo_criminal',   'a_validar', null,                                null),
  -- O Tomás tem o certificado por enviar: é o cartão terracota do ecrã 19.
  ('44444444-4444-4444-4444-444444444444', 'identidade',         'concluida', 'Cartão de Cidadão validado',        now() - interval '90 days'),
  ('44444444-4444-4444-4444-444444444444', 'primeiros_socorros', 'pendente',  null,                                null)
on conflict (caregiver_id, kind) do nothing;

insert into caregiver_services (caregiver_id, service_code, duration_minutes, price_cents) values
  ('22222222-2222-2222-2222-222222222222', 'passeio',     60,  1200),
  ('22222222-2222-2222-2222-222222222222', 'petsitting', 480,  2800),
  ('22222222-2222-2222-2222-222222222222', 'creche',     240,  1800),
  ('33333333-3333-3333-3333-333333333333', 'petsitting', 480,  2500),
  ('33333333-3333-3333-3333-333333333333', 'passeio',     45,  1000),
  ('44444444-4444-4444-4444-444444444444', 'banho',       90,  2200),
  ('44444444-4444-4444-4444-444444444444', 'veterinario',120,  1500)
on conflict (caregiver_id, service_code) do nothing;

insert into caregiver_availability (caregiver_id, weekday) values
  ('22222222-2222-2222-2222-222222222222', 1),
  ('22222222-2222-2222-2222-222222222222', 2),
  ('22222222-2222-2222-2222-222222222222', 3),
  ('22222222-2222-2222-2222-222222222222', 4),
  ('22222222-2222-2222-2222-222222222222', 5),
  ('33333333-3333-3333-3333-333333333333', 0),
  ('33333333-3333-3333-3333-333333333333', 5),
  ('33333333-3333-3333-3333-333333333333', 6),
  ('44444444-4444-4444-4444-444444444444', 1),
  ('44444444-4444-4444-4444-444444444444', 3),
  ('44444444-4444-4444-4444-444444444444', 5)
on conflict do nothing;

-- ── Reservas ────────────────────────────────────────────────────────────

-- b-001: o passeio a decorrer. 12,00€ + 1,20€ de taxa = 13,20€.
insert into bookings (id, tutor_id, caregiver_id, pet_id, service_code, scheduled_at,
                      duration_minutes, location, tutor_note, share_health_record,
                      price_cents, fee_cents, total_cents, status, started_at) values
  ('dddddddd-0000-0000-0000-000000000001',
   '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222',
   'aaaaaaaa-0000-0000-0000-000000000001', 'passeio', current_date + time '17:30',
   60, 'Espinho',
   'O Boris puxa um bocado no início. Leva a trela comprida que fica no hall.',
   true, 1200, 120, 1320, 'a_decorrer', current_date + time '17:32'),

  -- b-002: o pedido por responder do ecrã 16, com contagem decrescente.
  ('dddddddd-0000-0000-0000-000000000002',
   '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222',
   'aaaaaaaa-0000-0000-0000-000000000001', 'petsitting', current_date + 3 + time '09:00',
   480, 'Espinho',
   'Fim de semana fora. A ração está no armário da cozinha, duas doses por dia.',
   true, 2800, 280, 3080, 'pendente', null),

  ('dddddddd-0000-0000-0000-000000000003',
   '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444',
   'aaaaaaaa-0000-0000-0000-000000000001', 'banho', current_date + 6 + time '11:00',
   90, 'Ao domicílio', null, false, 2200, 220, 2420, 'aceite', null),

  ('dddddddd-0000-0000-0000-000000000004',
   '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222',
   'aaaaaaaa-0000-0000-0000-000000000001', 'passeio', current_date - 7 + time '17:30',
   60, 'Espinho', null, true, 1200, 120, 1320, 'concluido', current_date - 7 + time '17:31'),

  ('dddddddd-0000-0000-0000-000000000005',
   '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333',
   'aaaaaaaa-0000-0000-0000-000000000002', 'petsitting', current_date - 21 + time '09:00',
   480, 'Granja', null, false, 2500, 250, 2750, 'concluido', current_date - 21 + time '09:05')
on conflict (id) do nothing;

update bookings
   set respond_by = now() + interval '4 hours 12 minutes'
 where id = 'dddddddd-0000-0000-0000-000000000002' and respond_by is null;

update bookings
   set ended_at = started_at + (duration_minutes || ' minutes')::interval
 where status = 'concluido' and ended_at is null;

-- A partilha do registo médico acaba quando o serviço acaba.
insert into booking_health_access (booking_id, granted_at, revoked_at) values
  ('dddddddd-0000-0000-0000-000000000001', current_date + time '17:20', null),
  ('dddddddd-0000-0000-0000-000000000002', now(), null),
  ('dddddddd-0000-0000-0000-000000000004', current_date - 7 + time '17:20', current_date - 7 + time '18:31')
on conflict (booking_id) do nothing;

-- ── Pagamentos (escrow) ─────────────────────────────────────────────────

insert into payments (booking_id, method, masked_ref, status, amount_cents, fee_cents,
                      authorized_at, captured_at, released_at) values
  ('dddddddd-0000-0000-0000-000000000001', 'mbway',  '··· 678',   'retido',
   1200, 120, current_date + time '17:20', current_date + time '17:20', null),
  ('dddddddd-0000-0000-0000-000000000002', 'mbway',  '··· 678',   'autorizado',
   2800, 280, now(), null, null),
  ('dddddddd-0000-0000-0000-000000000003', 'cartao', '···· 4218', 'retido',
   2200, 220, now() - interval '1 day', now() - interval '1 day', null),
  ('dddddddd-0000-0000-0000-000000000004', 'mbway',  '··· 678',   'libertado',
   1200, 120, current_date - 7 + time '17:20', current_date - 7 + time '17:20', current_date - 7 + time '18:19'),
  ('dddddddd-0000-0000-0000-000000000005', 'cartao', '···· 4218', 'libertado',
   2500, 250, current_date - 21 + time '08:50', current_date - 21 + time '08:50', current_date - 21 + time '17:10')
on conflict (booking_id) do nothing;

insert into receipts (booking_id, number, issued_at) values
  ('dddddddd-0000-0000-0000-000000000001', 'PL-4821', current_date + time '17:20'),
  ('dddddddd-0000-0000-0000-000000000004', 'PL-4802', current_date - 7 + time '17:20'),
  ('dddddddd-0000-0000-0000-000000000005', 'PL-4788', current_date - 21 + time '08:50')
on conflict (booking_id) do nothing;

-- ── Cronologia do passeio a decorrer (ecrã 10) ──────────────────────────

insert into booking_updates (booking_id, author_id, kind, text, photo_url, created_at) values
  ('dddddddd-0000-0000-0000-000000000001', null,
   'pagamento_retido', 'Pagamento retido · 13,20€', null, current_date + time '17:20'),
  ('dddddddd-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222',
   'checkin', 'Check-in — saímos de casa', null, current_date + time '17:32'),
  ('dddddddd-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222',
   'foto', 'Pausa na fonte 💧', '/images/pets/pet3.jpeg', current_date + time '17:54')
on conflict do nothing;

insert into booking_track_points (booking_id, lat, lng, recorded_at) values
  ('dddddddd-0000-0000-0000-000000000001', 41.0075, -8.6412, current_date + time '17:32'),
  ('dddddddd-0000-0000-0000-000000000001', 41.0081, -8.6428, current_date + time '17:40'),
  ('dddddddd-0000-0000-0000-000000000001', 41.0094, -8.6441, current_date + time '17:48'),
  ('dddddddd-0000-0000-0000-000000000001', 41.0102, -8.6455, current_date + time '17:54')
on conflict do nothing;

-- ── Conversa ────────────────────────────────────────────────────────────

insert into conversations (id, booking_id, tutor_id, caregiver_id) values
  ('eeeeeeee-0000-0000-0000-000000000001', 'dddddddd-0000-0000-0000-000000000001',
   '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222')
on conflict (booking_id) do nothing;

insert into messages (conversation_id, sender_id, body, photo_url, sent_at, delivered_at, read_at) values
  ('eeeeeeee-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'Olá Rita! O Boris já comeu às 16h, portanto está pronto 🙂', null,
   current_date + time '17:10', current_date + time '17:10', current_date + time '17:12'),
  ('eeeeeeee-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222',
   'Perfeito. Estou a chegar daqui a cinco minutos.', null,
   current_date + time '17:25', current_date + time '17:25', current_date + time '17:26'),
  ('eeeeeeee-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222',
   'Saímos! Vamos pela marginal.', null,
   current_date + time '17:33', current_date + time '17:33', null),
  ('eeeeeeee-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222',
   'Pausa na fonte 💧', '/images/pets/pet3.jpeg',
   current_date + time '17:54', current_date + time '17:54', null)
on conflict do nothing;

-- ── Avaliações ──────────────────────────────────────────────────────────
-- O trigger de 0006 atualiza rating e rating_count da Rita a partir daqui.

insert into reviews (id, booking_id, author_id, caregiver_id, rating, body, created_at) values
  ('ffffffff-0000-0000-0000-000000000001', 'dddddddd-0000-0000-0000-000000000004',
   '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222',
   5, 'A Rita mandou fotos a meio do passeio e trouxe o Boris exausto e feliz.',
   current_date - 6)
on conflict (booking_id) do nothing;

insert into review_photos (review_id, photo_url, sort_order) values
  ('ffffffff-0000-0000-0000-000000000001', '/images/pets/pet3.jpeg', 1),
  ('ffffffff-0000-0000-0000-000000000001', '/images/pets/pet4.jpeg', 2)
on conflict do nothing;

-- ── Ganhos (ecrã 18) ────────────────────────────────────────────────────

insert into payouts (id, caregiver_id, amount_cents, iban_masked, status, scheduled_for, paid_at) values
  ('99999999-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222',
   14840, 'IBAN ···· 3092', 'agendada',
   -- próxima sexta-feira
   current_date + ((5 - extract(dow from current_date)::int + 7) % 7), null)
on conflict (id) do nothing;

insert into payout_items (payout_id, booking_id, amount_cents) values
  ('99999999-0000-0000-0000-000000000001', 'dddddddd-0000-0000-0000-000000000004', 1200)
on conflict do nothing;

commit;
