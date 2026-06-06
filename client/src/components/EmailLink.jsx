import { useState } from 'react';
import { normalizeEmail, openEmailClient } from '../utils/email';

const EmailLink = ({ email, className, children, title, style, variant = 'button' }) => {
  const [feedback, setFeedback] = useState('');
  const address = normalizeEmail(email);

  if (!address) return null;

  const handleClick = async (e) => {
    e.preventDefault();
    const result = await openEmailClient(address);
    if (result.message) {
      setFeedback(result.message);
      window.setTimeout(() => setFeedback(''), 4000);
    }
  };

  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: variant === 'button' ? 'center' : 'flex-start', gap: '8px' }}>
      <a
        href={`mailto:${address}`}
        className={className}
        style={style}
        title={title || `Email ${address}`}
        aria-label={`Send email to ${address}`}
        onClick={handleClick}
      >
        {children}
      </a>
      {feedback && (
        <span
          role="status"
          style={{
            fontSize: '0.8rem',
            color: '#a78bfa',
            maxWidth: variant === 'button' ? '320px' : '240px',
            textAlign: 'center',
            lineHeight: 1.4
          }}
        >
          {feedback}
        </span>
      )}
    </span>
  );
};

export default EmailLink;
