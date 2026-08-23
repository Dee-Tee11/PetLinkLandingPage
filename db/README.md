# Base de dados — Pet Lynk

Esquema **Postgres puro** para a aplicação móvel. Nada específico do Supabase: não há
`auth.users` nem Row Level Security — as permissões ficam na API que vier a consumir isto.

Nesta fase são só ficheiros SQL. A webapp em [`../webapp/`](../webapp/) continua com dados
em memória (`src/data/mock.js`), que contam exatamente a mesma história que o `seed.sql`.

## Ficheiros

| Ficheiro | O que traz |
| --- | --- |
| `migrations/0001_extensions_and_enums.sql` | extensões, todos os tipos enum, `set_updated_at()` |
| `migrations/0002_users_and_roles.sql` | `users`, `user_roles` |
| `migrations/0003_pets_and_health.sql` | `pets`, pesos, alergias, vacinas, medicação, doses, relatórios |
| `migrations/0004_caregivers.sql` | `caregivers`, verificações, catálogo de serviços, preços, disponibilidade |
| `migrations/0005_bookings_and_payments.sql` | `bookings`, escrow em `payments`, atualizações, rota GPS |
| `migrations/0006_messaging_and_reviews.sql` | conversas, mensagens, avaliações, trigger da média |
| `migrations/0007_earnings.sql` | transferências, itens e recibos |
| `migrations/0008_views_and_indexes.sql` | índices e as vistas `reminders_v` e `caregiver_search_v` |
| `seed.sql` | Bia, Rita, Boris, Flora e o passeio de 12,00€ + 1,20€ |

Correr por ordem numérica. Cada ficheiro está num `begin/commit` e é seguro de repetir.

## Aplicar

```bash
# qualquer Postgres 14+ serve; ajusta a ligação
export PGURL="postgres://utilizador:senha@localhost:5432/petlynk"

for f in db/migrations/*.sql; do
  psql "$PGURL" -v ON_ERROR_STOP=1 -f "$f"
done
psql "$PGURL" -v ON_ERROR_STOP=1 -f db/seed.sql
```

Com Docker, se preferires um Postgres descartável:

```bash
docker run --rm -d --name petlynk-db -e POSTGRES_PASSWORD=dev -p 5433:5432 postgres:16
export PGURL="postgres://postgres:dev@localhost:5433/postgres"
```

> **Ainda não foi corrido contra um Postgres real** — foi escrito, não testado em execução.
> Os comandos de sanidade abaixo servem para essa primeira verificação.

## Consultas de sanidade

```sql
-- O passeio do Boris: 1200 + 120 = 1320 cêntimos, pagamento retido
select b.total_cents, b.price_cents, b.fee_cents, p.status
  from bookings b join payments p on p.booking_id = b.id
 where b.id = 'dddddddd-0000-0000-0000-000000000001';

-- Lembretes da Bia: a antirrábica a expirar + as doses de Apoquel
select kind, title, days_until, done
  from reminders_v
 where owner_id = '11111111-1111-1111-1111-111111111111'
 order by due_at;

-- A Rita na pesquisa, com os quatro selos e a média de avaliações
select name, rating, rating_count, fully_verified, badges
  from caregiver_search_v
 where caregiver_id = '22222222-2222-2222-2222-222222222222';

-- Cuidadores num raio de 10 km de Espinho (41.0075, -8.6412)
select name, zone,
       round((earth_distance(ll_to_earth(41.0075, -8.6412),
                             ll_to_earth(base_lat, base_lng)) / 1000)::numeric, 1) as km
  from caregiver_search_v
 where earth_box(ll_to_earth(41.0075, -8.6412), 10000) @> ll_to_earth(base_lat, base_lng)
 order by km;
```

## Decisões que o esquema impõe

- **Dinheiro em cêntimos inteiros.** `price_cents`, `fee_cents`, `total_cents`, com
  `check (total_cents = price_cents + fee_cents)`. Nunca vírgula flutuante, e o total
  calcula-se no servidor a partir de `caregiver_services` — nunca no cliente.
- **O escrow vive em `payments`.** `autorizado → retido → libertado`, com as respetivas
  datas. O MB WAY confirma na app do banco, daí o estado `autorizado` antes de `retido`.
- **A partilha do registo médico é por reserva.** `booking_health_access` tem `granted_at`
  e `revoked_at`; o toggle global do ecrã 14 é apenas o valor por omissão da app.
- **Os selos de verificação são estado do servidor.** `caregiver_verifications` nunca deve
  ser escrita pelo próprio cuidador — só por um processo interno de validação.
- **Estados derivados não se guardam.** "Em dia" / "Renovar 30/05" sai de
  `vaccines.next_due_on`; os lembretes do ecrã 13 são a vista `reminders_v`, não uma tabela.
- **Nada se apaga.** Reservas e pagamentos mudam de estado; o `on delete` em cascata só
  existe onde é inofensivo (fotos de uma avaliação, doses de uma medicação).

## Geografia

A pesquisa por raio usa `earthdistance` sobre `base_lat`/`base_lng`, com índice GiST. Chega
para a escala inicial. Se a geografia crescer — zonas em polígono, rotas GPS consultáveis,
distância por estrada — passar a **PostGIS** e converter as colunas para `geography(Point)`.
