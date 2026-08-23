import { useNavigate } from 'react-router-dom';
import Icon from './Icon';

const cx = (...parts) => parts.filter(Boolean).join(' ');

/* ── Superfícies ───────────────────────────────────────────────────── */

export function Card({ as: As = 'div', variant, radius, padding, className, ...rest }) {
  return <As className={cx('card', variant, radius, padding, className)} {...rest} />;
}

export function Rule({ style }) {
  return <div className="rule" style={style} />;
}

/* ── Botões ────────────────────────────────────────────────────────── */

export function Button({ variant = 'primary', block, className, children, ...rest }) {
  return (
    <button type="button" className={cx('btn', `btn-${variant}`, block && 'block', className)} {...rest}>
      {children}
    </button>
  );
}

export function IconButton({ icon, size = 19, small, dark, dot, label, className, ...rest }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cx('btn', 'btn-icon', small && 'sm', dark && 'dark', className)}
      {...rest}
    >
      <Icon name={icon} size={size} color={dark ? '#fdffe6' : 'var(--text)'} />
      {dot && <span className="btn-dot" />}
    </button>
  );
}

export function BackButton({ to, label = 'Voltar' }) {
  const navigate = useNavigate();
  return <IconButton icon="ArrowLeft" small label={label} onClick={() => navigate(to ?? -1)} />;
}

/* ── Pílulas, chips, pontos ────────────────────────────────────────── */

export function Pill({ tone = 'neutral', large, icon, className, children, ...rest }) {
  return (
    <span className={cx('pill', tone, large && 'lg', className)} {...rest}>
      {icon && <Icon name={icon} size={12} />}
      {children}
    </span>
  );
}

export function Dot({ color = 'var(--sage)', size = 7 }) {
  return <span className="dot" style={{ background: color, width: size, height: size }} />;
}

export function Chip({ active, className, ...rest }) {
  return <button type="button" className={cx('chip', active && 'active', className)} {...rest} />;
}

/* ── Identidade visual ─────────────────────────────────────────────── */

export function Avatar({ src, alt = '', initial, tone = 'sage', size = 44, style }) {
  return (
    <span
      className={cx('avatar', tone)}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.34), ...style }}
      aria-hidden={src ? undefined : true}
    >
      {src ? <img src={src} alt={alt} className="washed" /> : initial}
    </span>
  );
}

export function PetPhoto({ src, alt, radius = 16, height = 104, round, style }) {
  return (
    <img
      src={src}
      alt={alt}
      className="washed"
      style={{
        width: round ? height : '100%',
        height,
        borderRadius: round ? 999 : radius,
        flex: 'none',
        ...style,
      }}
    />
  );
}

/* ── Campos ────────────────────────────────────────────────────────── */

export function Field({ label, error, children }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      {children}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

export function Input({ invalid, className, ...rest }) {
  return <input className={cx('input', invalid && 'invalid', className)} {...rest} />;
}

export function Textarea({ className, ...rest }) {
  return <textarea className={cx('input', 'textarea', className)} {...rest} />;
}

export function Checkbox({ checked, onChange, children }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      className="checkbox"
      onClick={() => onChange(!checked)}
    >
      <span className={cx('checkbox-box', checked && 'checked')}>
        {checked && <Icon name="Check" size={13} color="#fdffe6" />}
      </span>
      <span className="t-secondary" style={{ color: 'var(--text)' }}>
        {children}
      </span>
    </button>
  );
}

export function Toggle({ on, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={cx('toggle', on && 'on')}
      onClick={() => onChange(!on)}
    >
      <span className="toggle-knob" />
    </button>
  );
}

/* ── Blocos de conteúdo ────────────────────────────────────────────── */

export function SectionLabel({ children, style }) {
  return (
    <p className="t-section-label" style={style}>
      {children}
    </p>
  );
}

export function Stats({ items }) {
  return (
    <div className="stats">
      {items.map((it) => (
        <Card key={it.label} radius="sm" padding="tight" style={{ padding: '12px 10px' }}>
          <p className="t-micro" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>
            {it.label}
          </p>
          <p className="stat-value">
            {it.value}
            {it.unit && <small> {it.unit}</small>}
          </p>
          {it.note && (
            <p className="t-micro" style={{ marginTop: 3, color: it.noteTone || 'var(--text-2)' }}>
              {it.note}
            </p>
          )}
        </Card>
      ))}
    </div>
  );
}

export function ListRow({ icon, iconColor = 'var(--text)', title, meta, right, onClick, chevron = true }) {
  const As = onClick ? 'button' : 'div';
  return (
    <As type={onClick ? 'button' : undefined} className="listrow pressable" onClick={onClick}>
      {icon && <Icon name={icon} size={17} color={iconColor} />}
      <span className="grow">
        <span className="t-list" style={{ display: 'block', fontWeight: 500 }}>
          {title}
        </span>
        {meta && (
          <span className="t-meta" style={{ display: 'block' }}>
            {meta}
          </span>
        )}
      </span>
      {right}
      {onClick && chevron && <Icon name="ChevronRight" size={17} color="var(--text-2)" />}
    </As>
  );
}

export function Empty({ icon = 'PawPrint', title, children, action }) {
  return (
    <div className="empty">
      <span className="empty-icon">
        <Icon name={icon} size={22} color="var(--moss-dark)" />
      </span>
      <p className="t-card-title" style={{ color: 'var(--text)' }}>
        {title}
      </p>
      {children && <p className="t-secondary">{children}</p>}
      {action}
    </div>
  );
}

export { cx };
