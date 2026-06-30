// Lightweight session auth using a signed cookie (HMAC-SHA256 via Web Crypto).
// Works on Cloudflare's edge runtime — no Node Buffer / crypto module needed.

export interface AuthEnv {
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD?: string;
  AUTH_SECRET?: string;
}

export const SESSION_COOKIE = "atelier_session";
const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days

export function readAuthEnv(env: Record<string, unknown> = {}): AuthEnv {
  const pe = typeof process !== "undefined" ? process.env : {};
  return {
    ADMIN_USERNAME: (env.ADMIN_USERNAME as string) ?? pe.ADMIN_USERNAME,
    ADMIN_PASSWORD: (env.ADMIN_PASSWORD as string) ?? pe.ADMIN_PASSWORD,
    AUTH_SECRET: (env.AUTH_SECRET as string) ?? pe.AUTH_SECRET,
  };
}

export function authConfigured(env: AuthEnv): boolean {
  return Boolean(env.ADMIN_USERNAME && env.ADMIN_PASSWORD && env.AUTH_SECRET);
}

function base64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64url(str: string): Uint8Array {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  const bin = atob(str);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function hmac(secret: string, data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return new Uint8Array(sig);
}

// Constant-time string comparison.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

export async function createSession(env: AuthEnv, username: string): Promise<string> {
  const payload = JSON.stringify({ u: username, exp: Math.floor(Date.now() / 1000) + SESSION_TTL });
  const payloadB64 = base64url(new TextEncoder().encode(payload));
  const sig = base64url(await hmac(env.AUTH_SECRET!, payloadB64));
  return `${payloadB64}.${sig}`;
}

export async function verifySession(env: AuthEnv, token?: string): Promise<boolean> {
  if (!token || !env.AUTH_SECRET) return false;
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return false;
  const expected = base64url(await hmac(env.AUTH_SECRET, payloadB64));
  if (!safeEqual(sig, expected)) return false;
  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64url(payloadB64))) as {
      exp: number;
    };
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export async function checkCredentials(
  env: AuthEnv,
  username: string,
  password: string,
): Promise<boolean> {
  if (!authConfigured(env)) return false;
  return safeEqual(username, env.ADMIN_USERNAME!) && safeEqual(password, env.ADMIN_PASSWORD!);
}

export function sessionCookieString(token: string, secure: boolean): string {
  const parts = [
    `${SESSION_COOKIE}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${SESSION_TTL}`,
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function clearCookieString(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
