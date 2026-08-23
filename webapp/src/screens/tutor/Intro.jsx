import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui';

/** 01 · Onboarding */
export default function Intro() {
  const navigate = useNavigate();

  return (
    <div className="screen full-height" style={{ justifyContent: 'flex-end', textAlign: 'center', padding: '0 32px 56px' }}>
      <img
        src="/images/logo/logo.svg"
        alt="Pet Lynk"
        style={{ width: 96, height: 96, objectFit: 'contain', margin: '0 auto 28px', opacity: 0.9 }}
      />
      <h1 className="t-onboarding" style={{ marginBottom: 14 }}>
        Pet Lynk —<br />o lugar para{' '}
        <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--moss)' }}>almas gémeas</em> patudas
      </h1>
      <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--text-2)', marginBottom: 36 }}>
        Cuidadores verificados, pagamentos seguros e o registo médico do teu patudo — tudo num só lugar.
      </p>
      <Button block onClick={() => navigate('/registo')} style={{ marginBottom: 14 }}>
        Começar
      </Button>
      <Button variant="ghost" block onClick={() => navigate('/inicio')}>
        Já tenho conta
      </Button>
    </div>
  );
}
