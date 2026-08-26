import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar } from '../../components/ui';
import Icon from '../../components/Icon';
import { useApp } from '../../state/AppState';
import { formatTime } from '../../lib/format';

/** 11 · Conversa — sem barra de separadores */
export default function Chat() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { getConversationForBooking, getCaregiver, sendMessage, session, getBooking } = useApp();
  const conversation = getConversationForBooking(bookingId);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);
  const typingTimer = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [conversation?.messages.length, typing]);

  useEffect(() => () => window.clearTimeout(typingTimer.current), []);

  if (!conversation) {
    navigate('/inicio', { replace: true });
    return null;
  }

  const caregiver = getCaregiver(conversation.caregiverId);
  const booking = getBooking(conversation.bookingId);
  const online = booking?.status === 'a_decorrer';

  function send() {
    if (!text.trim()) return;
    sendMessage(conversation.id, text);
    setText('');
    // Indicador de escrita da outra parte, com 400ms de debounce (handoff).
    window.clearTimeout(typingTimer.current);
    typingTimer.current = window.setTimeout(() => {
      setTyping(true);
      typingTimer.current = window.setTimeout(() => setTyping(false), 2600);
    }, 400);
  }

  return (
    <div className="stack chat-root" style={{ height: '100%' }}>
      {/* Cabeçalho */}
      <div
        className="row"
        style={{ gap: 12, padding: '4px var(--gutter) 14px', borderBottom: '0.5px solid var(--rule)' }}
      >
        <button
          type="button"
          aria-label="Voltar"
          onClick={() => navigate(booking ? `/acompanhar/${booking.id}` : '/inicio')}
          style={{ width: 32, height: 40, display: 'flex', alignItems: 'center' }}
        >
          <Icon name="ArrowLeft" size={19} />
        </button>
        <Avatar initial={caregiver.initial} tone={caregiver.tone} size={40} />
        <div className="grow">
          <div className="row" style={{ gap: 5 }}>
            <p style={{ fontSize: 14.5, fontWeight: 500, margin: 0 }}>{caregiver.name}</p>
            {caregiver.verified && <Icon name="ShieldCheck" size={13} color="var(--moss-dark)" />}
          </div>
          <p style={{ fontSize: 11.5, color: online ? 'var(--moss)' : 'var(--text-2)', margin: 0 }}>
            {online ? conversation.presence : 'Responde normalmente em ' + caregiver.responseTime}
          </p>
        </div>
      </div>

      {/* Mensagens */}
      <div className="stack grow" style={{ overflowY: 'auto', padding: '18px var(--gutter)', gap: 12 }}>
        <p className="t-meta" style={{ textAlign: 'center', fontSize: 11 }}>
          Hoje
        </p>

        {conversation.messages.map((m) => {
          const mine = m.senderId === session.userId;
          return (
            <div
              key={m.id}
              style={{
                alignSelf: mine ? 'flex-end' : 'flex-start',
                maxWidth: '78%',
                background: mine ? 'var(--text)' : 'var(--card-strong)',
                color: mine ? 'var(--app-bg)' : 'var(--text)',
                border: mine ? 'none' : '0.5px solid var(--border-card)',
                borderRadius: mine ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                padding: '12px 15px',
              }}
            >
              {m.body && (
                <p style={{ fontSize: 13.5, lineHeight: 1.5, margin: m.photo ? '0 0 9px' : 0 }}>{m.body}</p>
              )}
              {m.photo && (
                <img src={m.photo} alt="Foto do serviço" className="washed" style={{ width: '100%', height: 126, borderRadius: 14 }} />
              )}
              <p
                style={{
                  fontSize: 10.5,
                  margin: '5px 0 0',
                  color: mine ? 'inherit' : 'var(--text-3)',
                  opacity: mine ? 0.55 : 1,
                }}
              >
                {formatTime(m.at)}
              </p>
            </div>
          );
        })}

        {typing && (
          <div
            className="row"
            style={{
              alignSelf: 'flex-start',
              gap: 5,
              background: 'var(--card-strong)',
              border: '0.5px solid var(--border-card)',
              borderRadius: 20,
              padding: '13px 16px',
            }}
            aria-label={`${caregiver.name} está a escrever`}
          >
            <span className="dot" style={{ width: 6, height: 6, background: '#9a9a8c' }} />
            <span className="dot" style={{ width: 6, height: 6, background: '#c2c2b4' }} />
            <span className="dot" style={{ width: 6, height: 6, background: '#dcdcd0' }} />
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Composição */}
      <div
        className="row"
        style={{ gap: 10, padding: '12px var(--gutter) 16px', borderTop: '0.5px solid var(--rule)', flex: 'none' }}
      >
        <input
          className="input grow"
          style={{ minHeight: 46, fontSize: 13.5 }}
          placeholder="Escreve uma mensagem…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          aria-label="Mensagem"
        />
        <button
          type="button"
          aria-label="Enviar"
          onClick={send}
          disabled={!text.trim()}
          style={{
            width: 46,
            height: 46,
            borderRadius: 999,
            background: 'var(--text)',
            display: 'grid',
            placeItems: 'center',
            flex: 'none',
            opacity: text.trim() ? 1 : 0.45,
          }}
        >
          <Icon name="ArrowRight" size={18} color="#fdffe6" />
        </button>
      </div>
    </div>
  );
}
