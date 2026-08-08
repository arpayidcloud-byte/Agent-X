// mailer.ts — dependency-free email delivery.
//
// Uses the Resend REST API via global fetch (Node 18+) when RESEND_API_KEY is
// set — no npm dependency, mirroring the deliberate zero-dep style of oauth.ts.
// Without RESEND_API_KEY it falls back to "dev mode": the message is logged to
// the console and captured for tests. This keeps local dev and CI green while
// production can be enabled purely via env vars.
//
//   RESEND_API_KEY   — API key (https://resend.com)
//   MAIL_FROM        — sender address, default "AgentX <no-reply@id-tech.cloud>"

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/** Dev-mode capture hook — tests read sent messages without an SMTP server. */
const captured: MailMessage[] = [];

export function getCapturedMails(): MailMessage[] {
  return captured;
}

export function clearCapturedMails(): void {
  captured.length = 0;
}

export function isMailerConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendMail(msg: MailMessage): Promise<{ ok: boolean; mode: 'resend' | 'dev' }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    captured.push(msg);
    // eslint-disable-next-line no-console
    console.log(`[mailer:dev] to=${msg.to} subject="${msg.subject}"\n${msg.text}`);
    return { ok: true, mode: 'dev' };
  }
  const from = process.env.MAIL_FROM ?? 'AgentX <no-reply@id-tech.cloud>';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [msg.to],
      subject: msg.subject,
      text: msg.text,
      html: msg.html,
    }),
  });
  if (!res.ok) {
    throw new Error(`Email send failed: ${res.status}`);
  }
  return { ok: true, mode: 'resend' };
}
