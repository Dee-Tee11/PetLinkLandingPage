import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackButton, Button, Card, Field, Input } from '../../components/ui';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Telemóvel PT: 9 dígitos começados por 9 (handoff). */
const PHONE_RE = /^9\d{8}$/;

/** 02 · Criar conta */
export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [role, setRole] = useState('tutor');
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  function submit() {
    const next = {};
    if (!form.name.trim()) next.name = 'Diz-nos como te chamas.';
    if (!EMAIL_RE.test(form.email)) next.email = 'Verifica o correio eletrónico.';
    if (!PHONE_RE.test(form.phone.replace(/[\s+]|^351/g, ''))) next.phone = 'Telemóvel português a 9 dígitos, começado por 9.';
    setErrors(next);
    if (Object.keys(next).length === 0) navigate('/inicio');
  }

  return (
    <div className="screen wide-gutter" style={{ paddingTop: 8, paddingBottom: 40 }}>
      <div style={{ marginBottom: 20 }}>
        <BackButton to="/" />
      </div>

      <p className="t-section-label" style={{ letterSpacing: '0.18em', marginBottom: 10 }}>
        Criar conta
      </p>
      <h1 className="t-screen-title" style={{ fontSize: 28, marginBottom: 24 }}>
        Bem-vindo ao <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--moss)' }}>Pet Lynk</em>
      </h1>

      <div className="stack" style={{ gap: 14 }}>
        <Field label="Nome" error={errors.name}>
          <Input placeholder="O teu nome" value={form.name} onChange={set('name')} invalid={!!errors.name} autoComplete="name" />
        </Field>
        <Field label="Correio eletrónico" error={errors.email}>
          <Input
            type="email"
            inputMode="email"
            placeholder="nome@exemplo.pt"
            value={form.email}
            onChange={set('email')}
            invalid={!!errors.email}
            autoComplete="email"
          />
        </Field>
        <Field label="Telemóvel" error={errors.phone}>
          <Input
            type="tel"
            inputMode="tel"
            placeholder="+351 9XX XXX XXX"
            value={form.phone}
            onChange={set('phone')}
            invalid={!!errors.phone}
            autoComplete="tel"
          />
        </Field>

        <div className="stack" style={{ gap: 8 }}>
          <label style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-2)' }}>
            Quero usar como
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { key: 'tutor', title: 'Tutor', sub: 'Marco serviços' },
              { key: 'cuidador', title: 'Cuidador', sub: 'Presto serviços' },
            ].map((opt) => {
              const selected = role === opt.key;
              return (
                <Card
                  key={opt.key}
                  as="button"
                  type="button"
                  radius="sm"
                  variant={selected ? 'dark' : undefined}
                  className="pressable"
                  aria-pressed={selected}
                  onClick={() => setRole(opt.key)}
                  style={{ padding: '14px 12px', textAlign: 'center' }}
                >
                  <p className="display" style={{ fontSize: 15, margin: '0 0 2px' }}>
                    {opt.title}
                  </p>
                  <p style={{ fontSize: 11.5, margin: 0, opacity: selected ? 0.7 : 1, color: selected ? 'inherit' : 'var(--text-2)' }}>
                    {opt.sub}
                  </p>
                </Card>
              );
            })}
          </div>
          <p className="t-meta" style={{ marginTop: 2 }}>
            Podes ativar os dois mais tarde nas definições.
          </p>
        </div>
      </div>

      <Button block onClick={submit} style={{ marginTop: 22 }}>
        Criar conta
      </Button>
      <p className="t-meta" style={{ textAlign: 'center', marginTop: 12 }}>
        Ao continuar aceitas os termos e a política de privacidade.
      </p>
    </div>
  );
}
