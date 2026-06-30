globalThis.process ??= {}; globalThis.process.env ??= {};
import { r as renderers } from './chunks/_@astro-renderers_Png_mWke.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_DAIidCbs.mjs';
import { manifest } from './manifest_Cqh3TXKe.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/about.astro.mjs');
const _page3 = () => import('./pages/api/auth/login.astro.mjs');
const _page4 = () => import('./pages/api/auth/logout.astro.mjs');
const _page5 = () => import('./pages/api/config.astro.mjs');
const _page6 = () => import('./pages/api/posts.astro.mjs');
const _page7 = () => import('./pages/rss.xml.astro.mjs');
const _page8 = () => import('./pages/studio.astro.mjs');
const _page9 = () => import('./pages/work.astro.mjs');
const _page10 = () => import('./pages/work/_---slug_.astro.mjs');
const _page11 = () => import('./pages/writing.astro.mjs');
const _page12 = () => import('./pages/writing/_---slug_.astro.mjs');
const _page13 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/.pnpm/astro@5.18.2_@types+node@24.10.4_jiti@2.7.0_lightningcss@1.32.0_rollup@4.62.2_typescript@5.7.3/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/about.astro", _page2],
    ["src/pages/api/auth/login.ts", _page3],
    ["src/pages/api/auth/logout.ts", _page4],
    ["src/pages/api/config.ts", _page5],
    ["src/pages/api/posts.ts", _page6],
    ["src/pages/rss.xml.ts", _page7],
    ["src/pages/studio/index.astro", _page8],
    ["src/pages/work/index.astro", _page9],
    ["src/pages/work/[...slug].astro", _page10],
    ["src/pages/writing/index.astro", _page11],
    ["src/pages/writing/[...slug].astro", _page12],
    ["src/pages/index.astro", _page13]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = undefined;
const _exports = createExports(_manifest);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
