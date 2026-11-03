import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  TimerReset,
} from "lucide-react";
import { requestAdminOtp, verifyAdminOtp, type OtpChallenge } from "../../services/authService";
import { useSite } from "../../context/SiteContext";

/**
 * Admin accounts allowed to sign in.
 * To give access to more people later, just add one line per person here
 * (and in Supabase: insert into public.admin_users ...).
 */
const ADMINS = [
  {
    email: "saptarsree.b@skykingindia.com",
    password: "@Saptarsee1998",
    name: "Saptarsee",
  },
];
const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;
const MAX_ATTEMPTS = 5;

type Step = "credentials" | "otp";

export default function AdminLogin({
  onLogin,
}: {
  onLogin: (adminName: string) => void;
}) {
  const { settings } = useSite();
  const [step, setStep] = useState<Step>("credentials");
  const [adminName, setAdminName] = useState("Admin");

  // credentials step
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [credentialsError, setCredentialsError] = useState("");
  const [checking, setChecking] = useState(false);

  // otp step
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [challenge, setChallenge] = useState<OtpChallenge | null>(null);
  const [otpError, setOtpError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [sending, setSending] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [cooldown, setCooldown] = useState(0);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    if (step === "otp") inputsRef.current[0]?.focus();
  }, [step]);

  const sendOtp = async () => {
    setSending(true);
    setOtpError("");
    const nextChallenge = await requestAdminOtp();
    setChallenge(nextChallenge);
    setDigits(Array(OTP_LENGTH).fill(""));
    setCooldown(RESEND_SECONDS);
    setSending(false);
    inputsRef.current[0]?.focus();
  };

  const handleCredentials = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const enteredEmail = email.trim().toLowerCase();
    const admin = ADMINS.find(
      (entry) => entry.email === enteredEmail && entry.password === password
    );
    if (!admin) {
      setCredentialsError("Those details don't match an admin account.");
      return;
    }
    setCredentialsError("");
    setChecking(true);
    setAttemptsLeft(MAX_ATTEMPTS);
    setAdminName(admin.name);
    await sendOtp();
    setChecking(false);
    setStep("otp");
  };

  const setDigit = (index: number, value: string) => {
    const clean = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = clean;
      return next;
    });
  };

  const handleChange = (index: number, value: string) => {
    if (!value) {
      setDigit(index, "");
      return;
    }
    // spread across boxes when a code is typed/autofilled quickly
    const chars = value.replace(/\D/g, "");
    if (chars.length > 1) {
      setDigits((prev) => {
        const next = [...prev];
        chars.split("").slice(0, OTP_LENGTH - index).forEach((char, offset) => {
          next[index + offset] = char;
        });
        return next;
      });
      inputsRef.current[Math.min(index + chars.length, OTP_LENGTH - 1)]?.focus();
      return;
    }
    setDigit(index, chars);
    if (chars && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      event.preventDefault();
      inputsRef.current[index - 1]?.focus();
      setDigit(index - 1, "");
    }
    if (event.key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    setDigits((prev) => {
      const next = [...prev];
      pasted.split("").forEach((char, offset) => {
        next[offset] = char;
      });
      return next;
    });
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = digits.join("");
    if (code.length < OTP_LENGTH) {
      setOtpError("Please enter the complete 6-digit code.");
      return;
    }
    if (attemptsLeft <= 0) return;
    setVerifying(true);
    setOtpError("");
    const ok = await verifyAdminOtp(code);
    setVerifying(false);
    if (ok) {
      onLogin(adminName);
      return;
    }
    const left = attemptsLeft - 1;
    setAttemptsLeft(left);
    setOtpError(
      left > 0
        ? `That code isn't right. ${left} attempt${left === 1 ? "" : "s"} remaining.`
        : "Too many incorrect attempts. Please sign in again."
    );
    setDigits(Array(OTP_LENGTH).fill(""));
    inputsRef.current[0]?.focus();
    if (left <= 0) {
      window.setTimeout(() => {
        setStep("credentials");
        setPassword("");
        setAttemptsLeft(MAX_ATTEMPTS);
        setOtpError("");
      }, 1400);
    }
  };

  return (
    <main className="min-h-screen bg-[#fbf6ea] lg:grid lg:grid-cols-2">
      <section className="relative flex min-h-[240px] flex-col justify-between overflow-hidden bg-[#263b28] px-6 py-7 text-[#fbf6ea] sm:px-10 sm:py-10 lg:min-h-screen lg:px-14 lg:py-12">
        <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full border border-[#e9c46a]/15" />
        <div className="pointer-events-none absolute -right-8 top-24 h-72 w-72 rounded-full border border-[#e9c46a]/10" />
        <div className="pointer-events-none absolute -bottom-36 -left-24 h-96 w-96 rounded-full bg-[#e9c46a]/[0.06] blur-3xl" />

        <a href="/" className="relative z-10 inline-flex w-fit items-center gap-3">
          <img
            src={settings.logo}
            alt={`${settings.brandName} logo`}
            className="h-11 w-11 rounded-full bg-[#efe9d8] object-cover ring-1 ring-white/20"
          />
          <span>
            <span className="block font-serif text-xl font-bold leading-tight">{settings.brandName}</span>
            <span className="mt-0.5 block text-[10px] uppercase tracking-[0.23em] text-[#e9c46a]/80">
              Admin workspace
            </span>
          </span>
        </a>

        <div className="relative z-10 max-w-xl py-9 lg:py-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#f4edd8]/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#e9c46a]">
            <ShieldCheck size={14} />
            Two-step admin access
          </span>
          <h1 className="mt-5 max-w-lg font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Good food.<br />
            <span className="text-[#e9c46a]">Good business.</span>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-[#fbf6ea]/70 sm:text-base">
            Password plus a one-time code keeps your store data — orders, sales
            and customers — safe behind two locks.
          </p>
        </div>

        <p className="relative z-10 hidden text-xs text-[#fbf6ea]/45 lg:block">
          Handcrafted | Natural | Traditional
        </p>
      </section>

      <section className="flex min-h-[calc(100vh-240px)] items-center justify-center px-5 py-12 sm:px-10 lg:min-h-screen lg:px-14">
        <div className="w-full max-w-[420px]">
          <a
            href="/"
            className="mb-9 inline-flex items-center gap-2 text-xs font-semibold text-[#52604d] transition-colors hover:text-[#b5582c]"
          >
            <ArrowLeft size={15} />
            Back to store
          </a>

          {step === "credentials" && (
            <>
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b5582c]">Welcome back</p>
                <h2 className="mt-2 font-serif text-3xl font-bold text-[#263b28] sm:text-4xl">Admin sign in</h2>
                <p className="mt-2 text-sm text-[#65705f]">Step 1 of 2 · Enter your admin credentials.</p>
                <div className="mt-4 flex items-center gap-1.5">
                  <span className="h-1.5 w-14 rounded-full bg-[#4a6b3d]" />
                  <span className="h-1.5 w-14 rounded-full bg-[#263b28]/12" />
                </div>
              </div>

              <form onSubmit={handleCredentials} className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-[#344532]">Admin email</span>
                  <input
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@matibari.in"
                    className="h-12 w-full rounded-xl border border-[#263b28]/15 bg-white px-4 text-sm text-[#263b28] outline-none transition-shadow placeholder:text-[#263b28]/35 focus:border-[#4a6b3d] focus:ring-4 focus:ring-[#4a6b3d]/10"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-[#344532]">Password</span>
                  <span className="relative block">
                    <LockKeyhole size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#65705f]/70" />
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      className="h-12 w-full rounded-xl border border-[#263b28]/15 bg-white py-3 pl-11 pr-12 text-sm text-[#263b28] outline-none transition-shadow placeholder:text-[#263b28]/35 focus:border-[#4a6b3d] focus:ring-4 focus:ring-[#4a6b3d]/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#65705f] hover:bg-[#263b28]/5"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </span>
                </label>

                {credentialsError && (
                  <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700">
                    {credentialsError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={checking}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#b5582c] text-sm font-semibold text-white shadow-lg shadow-[#b5582c]/20 transition-all hover:-translate-y-0.5 hover:bg-[#9f4c25] disabled:opacity-70"
                >
                  {checking ? "Sending one-time code…" : "Continue with OTP"}
                  {!checking && <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />}
                </button>
              </form>

              <div className="mt-8 rounded-xl border border-[#e9c46a]/50 bg-[#f4edd8]/70 p-4">
                <p className="text-xs font-semibold text-[#344532]">Preview environment</p>
                <p className="mt-1 text-[11px] leading-relaxed text-[#65705f]">
                  Admin login: <b>{ADMINS[0].email}</b> / <b>{ADMINS[0].password}</b>. The OTP is
                  shown on-screen in preview. Connect a server + OTP provider before production use.
                </p>
              </div>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b5582c]">Step 2 of 2</p>
                <h2 className="mt-2 font-serif text-3xl font-bold text-[#263b28] sm:text-4xl">Verify your code</h2>
                <p className="mt-2 text-sm text-[#65705f]">
                  We sent a 6-digit one-time code to{" "}
                  <span className="font-semibold text-[#344532]">{challenge?.maskedDestination}</span>.
                </p>
                <div className="mt-4 flex items-center gap-1.5">
                  <span className="h-1.5 w-14 rounded-full bg-[#4a6b3d]" />
                  <span className="h-1.5 w-14 rounded-full bg-[#4a6b3d]" />
                </div>
              </div>

              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <div className="flex justify-between gap-2" onPaste={handlePaste}>
                    {digits.map((digit, index) => (
                      <input
                        key={index}
                        ref={(node) => {
                          inputsRef.current[index] = node;
                        }}
                        value={digit}
                        onChange={(event) => handleChange(index, event.target.value)}
                        onKeyDown={(event) => handleKeyDown(index, event)}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={OTP_LENGTH}
                        aria-label={`Digit ${index + 1}`}
                        className="h-14 w-full max-w-[54px] rounded-xl border border-[#263b28]/15 bg-white text-center text-xl font-bold text-[#263b28] outline-none transition-all focus:border-[#4a6b3d] focus:ring-4 focus:ring-[#4a6b3d]/10"
                      />
                    ))}
                  </div>

                  {otpError && (
                    <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700">
                      {otpError}
                    </p>
                  )}

                  {challenge?.demoOtp && (
                    <p className="mt-3 rounded-lg bg-[#f5ebcf] px-3 py-2.5 text-[11px] text-[#7c5b1f]">
                      <b>Preview mode:</b> your demo code is{" "}
                      <span className="font-mono text-sm font-bold tracking-[0.2em]">{challenge.demoOtp}</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={verifying || attemptsLeft <= 0}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#b5582c] text-sm font-semibold text-white shadow-lg shadow-[#b5582c]/20 transition-all hover:-translate-y-0.5 hover:bg-[#9f4c25] disabled:opacity-70"
                >
                  {verifying ? "Verifying…" : "Verify & open dashboard"}
                  {!verifying && <KeyRound size={16} />}
                </button>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("credentials");
                      setOtpError("");
                      setDigits(Array(OTP_LENGTH).fill(""));
                    }}
                    className="inline-flex items-center gap-1.5 font-semibold text-[#52604d] hover:text-[#b5582c]"
                  >
                    <ArrowLeft size={13} />
                    Use a different account
                  </button>

                  {cooldown > 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-[#65705f]">
                      <TimerReset size={13} />
                      Resend in {cooldown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={sendOtp}
                      disabled={sending}
                      className="inline-flex items-center gap-1.5 font-semibold text-[#4a6b3d] hover:text-[#b5582c] disabled:opacity-60"
                    >
                      <RefreshCw size={13} className={sending ? "animate-spin" : ""} />
                      {sending ? "Sending…" : "Resend code"}
                    </button>
                  )}
                </div>
              </form>

              <div className="mt-8 flex items-start gap-2.5 rounded-xl border border-[#e9c46a]/50 bg-[#f4edd8]/70 p-4">
                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#4a6b3d]" />
                <p className="text-[11px] leading-relaxed text-[#65705f]">
                  One-time codes expire in 5 minutes and lock after 5 wrong tries.
                  In production this code is delivered by SMS/email through your OTP
                  provider and verified on the server.
                </p>
              </div>
            </>
          )}

          <p className="mt-6 text-center text-[11px] text-[#65705f]/70">
            © {new Date().getFullYear()} Matibari
          </p>
        </div>
      </section>
    </main>
  );
}
