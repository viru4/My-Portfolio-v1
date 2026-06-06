export const normalizeEmail = (email) => {
  if (!email || typeof email !== 'string') return '';
  return email.trim().replace(/^mailto:/i, '');
};

export const buildMailtoUrl = (email, subject = 'Hello from your portfolio') => {
  const address = normalizeEmail(email);
  if (!address) return '';
  const params = new URLSearchParams({ subject });
  return `mailto:${address}?${params.toString()}`;
};

export const buildGmailUrl = (email) => {
  const address = normalizeEmail(email);
  if (!address) return '';
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: address,
    su: 'Hello from your portfolio'
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
};

export const openEmailClient = async (email) => {
  const address = normalizeEmail(email);
  if (!address) return { ok: false, message: 'No email address configured.' };

  let copied = false;
  try {
    await navigator.clipboard.writeText(address);
    copied = true;
  } catch {
    // Clipboard may be blocked in some browsers
  }

  // Gmail compose works in the browser without a local mail app (common on Windows)
  const gmailWindow = window.open(buildGmailUrl(address), '_blank', 'noopener,noreferrer');

  if (!gmailWindow) {
    // Pop-up blocked — fall back to native mailto in the same tab
    window.location.href = buildMailtoUrl(address);
    return {
      ok: true,
      message: copied
        ? `${address} copied! Allow pop-ups for Gmail, or use your mail app.`
        : 'Opening your mail app...'
    };
  }

  return {
    ok: true,
    message: copied
      ? `${address} copied! Gmail opened in a new tab.`
      : 'Gmail compose opened in a new tab.'
  };
};
