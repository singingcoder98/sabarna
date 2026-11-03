/**
 * Admin auth service layer.
 *
 * DEMO MODE (current): OTP is generated and verified in the browser so the UI flow can be
 * previewed without a server. This is NOT security — anyone can read the code.
 *
 * PRODUCTION MODE (to wire up): replace the two functions below with real API calls.
 *
 *   POST /api/auth/admin/login      { email, password }        -> { challengeId, maskedDestination, expiresAt }
 *   POST /api/auth/admin/verify-otp { challengeId, code }       -> sets an httpOnly session cookie (JWT, role=admin)
 *   POST /api/auth/admin/resend-otp { challengeId }             -> { challengeId, expiresAt }
 *
 * The server must: hash the OTP (never store it raw), enforce a 5-10 min TTL and 5 attempt
 * limit per challenge, rate-limit per IP + per account, and send it through an OTP provider
 * (MSG91 / Twilio / Firebase Auth / Supabase Auth) over SMS or email. The dashboard API must
 * re-check `role === "admin"` on every request and read data from the database server-side.
 */

export type OtpChallenge = {
  challengeId: string;
  maskedDestination: string;
  expiresAt: number;
  /** Only present in demo mode so the preview can display the code. */
  demoOtp?: string;
};

const DEMO_MASKED_DESTINATION = "a•••n@matibari.in";
const DEMO_OTP_TTL_MS = 5 * 60 * 1000;

let demoCode: string | null = null;
let demoExpiry = 0;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function requestAdminOtp(): Promise<OtpChallenge> {
  await wait(650);
  demoCode = String(Math.floor(100000 + Math.random() * 900000));
  demoExpiry = Date.now() + DEMO_OTP_TTL_MS;
  return {
    challengeId: `demo-${Date.now()}`,
    maskedDestination: DEMO_MASKED_DESTINATION,
    expiresAt: demoExpiry,
    demoOtp: demoCode,
  };
}

export async function verifyAdminOtp(code: string): Promise<boolean> {
  await wait(700);
  if (!demoCode || Date.now() > demoExpiry) return false;
  return code === demoCode;
}

export function maskDestination(destination: string): string {
  const [name, domain] = destination.split("@");
  if (!domain) return destination;
  return `${name.slice(0, 1)}•••${name.slice(-1)}@${domain}`;
}
