globalThis.process ??= {}; globalThis.process.env ??= {};
import { d as clearCookieString } from '../../../chunks/auth_D6f9g80t.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_Png_mWke.mjs';

const prerender = false;
async function POST(_context) {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": clearCookieString()
    }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
