import "server-only";
import { headers } from "next/headers";
import nodemailer, { type Transporter } from "nodemailer";

// Outgoing email over SMTP (Gmail, Outlook, Resend, Brevo, ...). Set up in
// .env; see docs/email-setup.md.

export const emailConfigured = () => !!(process.env.SMTP_HOST && process.env.MAIL_FROM);

const store = globalThis as { mailTransport?: Transporter };

const transport = () =>
  (store.mailTransport ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    // Port 465 talks TLS from the start; 587 upgrades with STARTTLS
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  }));

export const sendEmail = async (message: { to: string; subject: string; text: string }) => {
  if (!emailConfigured()) throw new Error("Email is not set up (SMTP_HOST and MAIL_FROM in .env).");
  await transport().sendMail({ from: process.env.MAIL_FROM, ...message });
};

// Hosts a link in an email may point at when APP_URL isn't set: this
// computer and the local network. Anything else could be a forged Host
// header trying to get reset links sent to someone else's site.
const LOCAL_HOST = /^(localhost|127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/;

// The address of this app for links in emails
export const appUrl = async () => {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/+$/, "");
  const h = await headers();
  const host = h.get("host") ?? "";
  if (!LOCAL_HOST.test(host)) return "http://localhost:3000";
  const proto = h.get("x-forwarded-proto") === "https" ? "https" : "http";
  return `${proto}://${host}`;
};

export const maskEmail = (email: string) => {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const shown = name.length <= 2 ? name[0] : name.slice(0, 2);
  return `${shown}${"•".repeat(Math.max(2, Math.min(6, name.length - shown.length)))}@${domain}`;
};
