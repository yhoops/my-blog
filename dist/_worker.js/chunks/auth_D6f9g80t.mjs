globalThis.process ??= {}; globalThis.process.env ??= {};
const SESSION_COOKIE = "atelier_session";
const SESSION_TTL = 60 * 60 * 24 * 7;
function readAuthEnv(env = {}) {
  const pe = typeof process !== "undefined" ? process.env : {};
  return {
    ADMIN_USERNAME: env.ADMIN_USERNAME ?? pe.ADMIN_USERNAME,
    ADMIN_PASSWORD: env.ADMIN_PASSWORD ?? pe.ADMIN_PASSWORD,
    AUTH_SECRET: env.AUTH_SECRET ?? pe.AUTH_SECRET
  };
}
function authConfigured(env) {
  return Boolean(env.ADMIN_USERNAME && env.ADMIN_PASSWORD && env.AUTH_SECRET);
}
function base64url(bytes) {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromBase64url(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  const bin = atob(str);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
async function hmac(secret, data) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return new Uint8Array(sig);
}
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}
async function createSession(env, username) {
  const payload = JSON.stringify({ u: username, exp: Math.floor(Date.now() / 1e3) + SESSION_TTL });
  const payloadB64 = base64url(new TextEncoder().encode(payload));
  const sig = base64url(await hmac(env.AUTH_SECRET, payloadB64));
  return `${payloadB64}.${sig}`;
}
async function verifySession(env, token) {
  if (!token || !env.AUTH_SECRET) return false;
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return false;
  const expected = base64url(await hmac(env.AUTH_SECRET, payloadB64));
  if (!safeEqual(sig, expected)) return false;
  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64url(payloadB64)));
    return payload.exp > Math.floor(Date.now() / 1e3);
  } catch {
    return false;
  }
}
async function checkCredentials(env, username, password) {
  if (!authConfigured(env)) return false;
  return safeEqual(username, env.ADMIN_USERNAME) && safeEqual(password, env.ADMIN_PASSWORD);
}
function sessionCookieString(token, secure) {
  const parts = [
    `${SESSION_COOKIE}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${SESSION_TTL}`
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}
function clearCookieString() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export { SESSION_COOKIE as S, authConfigured as a, createSession as b, checkCredentials as c, clearCookieString as d, readAuthEnv as r, sessionCookieString as s, verifySession as v };
