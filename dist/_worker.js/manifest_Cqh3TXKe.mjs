globalThis.process ??= {}; globalThis.process.env ??= {};
import { t as decodeKey } from './chunks/astro/server_DWJG0Nth.mjs';
import './chunks/astro-designed-error-pages_Cr3_DaMo.mjs';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_BhVobUOa.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///vercel/share/v0-project/","cacheDir":"file:///vercel/share/v0-project/node_modules/.astro/","outDir":"file:///vercel/share/v0-project/dist/","srcDir":"file:///vercel/share/v0-project/src/","publicDir":"file:///vercel/share/v0-project/public/","buildClientDir":"file:///vercel/share/v0-project/dist/","buildServerDir":"file:///vercel/share/v0-project/dist/_worker.js/","adapterName":"@astrojs/cloudflare","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"404.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.CQPfS6Wq.css"}],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"about/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.CQPfS6Wq.css"}],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"rss.xml","links":[],"scripts":[],"styles":[],"routeData":{"route":"/rss.xml","isIndex":false,"type":"endpoint","pattern":"^\\/rss\\.xml\\/?$","segments":[[{"content":"rss.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rss.xml.ts","pathname":"/rss.xml","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"work/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.CQPfS6Wq.css"}],"routeData":{"route":"/work","isIndex":true,"type":"page","pattern":"^\\/work\\/?$","segments":[[{"content":"work","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/work/index.astro","pathname":"/work","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"writing/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.CQPfS6Wq.css"}],"routeData":{"route":"/writing","isIndex":true,"type":"page","pattern":"^\\/writing\\/?$","segments":[[{"content":"writing","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/writing/index.astro","pathname":"/writing","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.CQPfS6Wq.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.sJrt8mpm.js"}],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/.pnpm/astro@5.18.2_@types+node@24.10.4_jiti@2.7.0_lightningcss@1.32.0_rollup@4.62.2_typescript@5.7.3/node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.sJrt8mpm.js"}],"styles":[],"routeData":{"route":"/api/auth/login","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/login\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/login.ts","pathname":"/api/auth/login","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.sJrt8mpm.js"}],"styles":[],"routeData":{"route":"/api/auth/logout","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/logout\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"logout","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/logout.ts","pathname":"/api/auth/logout","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.sJrt8mpm.js"}],"styles":[],"routeData":{"route":"/api/config","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/config\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"config","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/config.ts","pathname":"/api/config","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.sJrt8mpm.js"}],"styles":[],"routeData":{"route":"/api/posts","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/posts\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"posts","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/posts.ts","pathname":"/api/posts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.sJrt8mpm.js"}],"styles":[{"type":"external","src":"/_astro/about.CQPfS6Wq.css"},{"type":"external","src":"/_astro/index.DNMqlEz8.css"}],"routeData":{"route":"/studio","isIndex":true,"type":"page","pattern":"^\\/studio\\/?$","segments":[[{"content":"studio","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/studio/index.astro","pathname":"/studio","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"https://example.pages.dev","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/vercel/share/v0-project/src/pages/studio/index.astro",{"propagation":"none","containsHead":true}],["/vercel/share/v0-project/src/pages/404.astro",{"propagation":"none","containsHead":true}],["/vercel/share/v0-project/src/pages/about.astro",{"propagation":"none","containsHead":true}],["/vercel/share/v0-project/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["/vercel/share/v0-project/src/pages/work/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["/vercel/share/v0-project/src/pages/work/index.astro",{"propagation":"in-tree","containsHead":true}],["/vercel/share/v0-project/src/pages/writing/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["/vercel/share/v0-project/src/pages/writing/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/vercel/share/v0-project/src/lib/posts.ts",{"propagation":"in-tree","containsHead":false}],["/vercel/share/v0-project/src/components/blocks/ProjectListBlock.astro",{"propagation":"in-tree","containsHead":false}],["/vercel/share/v0-project/src/components/BlockRenderer.astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["/vercel/share/v0-project/src/components/blocks/WritingListBlock.astro",{"propagation":"in-tree","containsHead":false}],["/vercel/share/v0-project/src/pages/rss.xml.ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/rss.xml@_@ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/work/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/work/index@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/writing/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/writing/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/vercel/share/v0-project/src/pages/api/posts.ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/api/posts@_@ts",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astro-page:node_modules/.pnpm/astro@5.18.2_@types+node@24.10.4_jiti@2.7.0_lightningcss@1.32.0_rollup@4.62.2_typescript@5.7.3/node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/api/auth/login@_@ts":"pages/api/auth/login.astro.mjs","\u0000@astro-page:src/pages/api/auth/logout@_@ts":"pages/api/auth/logout.astro.mjs","\u0000@astro-page:src/pages/api/config@_@ts":"pages/api/config.astro.mjs","\u0000@astro-page:src/pages/api/posts@_@ts":"pages/api/posts.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-page:src/pages/rss.xml@_@ts":"pages/rss.xml.astro.mjs","\u0000@astro-page:src/pages/studio/index@_@astro":"pages/studio.astro.mjs","\u0000@astro-page:src/pages/work/[...slug]@_@astro":"pages/work/_---slug_.astro.mjs","\u0000@astro-page:src/pages/work/index@_@astro":"pages/work.astro.mjs","\u0000@astro-page:src/pages/writing/[...slug]@_@astro":"pages/writing/_---slug_.astro.mjs","\u0000@astro-page:src/pages/writing/index@_@astro":"pages/writing.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"index.js","\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_Cqh3TXKe.mjs","/vercel/share/v0-project/node_modules/.pnpm/astro@5.18.2_@types+node@24.10.4_jiti@2.7.0_lightningcss@1.32.0_rollup@4.62.2_typescript@5.7.3/node_modules/astro/dist/assets/services/noop.js":"chunks/noop_1mqVRqHe.mjs","/vercel/share/v0-project/.astro/content-assets.mjs":"chunks/content-assets_XqCgPAV2.mjs","/vercel/share/v0-project/.astro/content-modules.mjs":"chunks/content-modules_Bvq7llv8.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_zvwzXuK4.mjs","/vercel/share/v0-project/node_modules/.pnpm/unstorage@1.17.5/node_modules/unstorage/drivers/cloudflare-kv-binding.mjs":"chunks/cloudflare-kv-binding_DMly_2Gl.mjs","/vercel/share/v0-project/src/components/studio/LoginForm.tsx":"_astro/LoginForm.CGy6q0Qx.js","/vercel/share/v0-project/src/components/studio/StudioApp.tsx":"_astro/StudioApp.kgVRf7PO.js","@astrojs/react/client.js":"_astro/client.YottfHSo.js","/vercel/share/v0-project/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts":"_astro/BaseLayout.astro_astro_type_script_index_0_lang.HvjGYeHb.js","astro:scripts/page.js":"_astro/page.sJrt8mpm.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/vercel/share/v0-project/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts","const n=new IntersectionObserver(t=>{for(const e of t)e.isIntersecting&&(e.target.classList.add(\"is-visible\"),n.unobserve(e.target))},{threshold:.12,rootMargin:\"0px 0px -8% 0px\"}),r=()=>{document.querySelectorAll(\".reveal\").forEach((t,e)=>{t.style.setProperty(\"--reveal-delay\",`${Math.min(e*60,360)}ms`),n.observe(t)})};document.readyState!==\"loading\"?r():document.addEventListener(\"DOMContentLoaded\",r);"]],"assets":["/_astro/about.CQPfS6Wq.css","/_astro/index.DNMqlEz8.css","/favicon.svg","/_astro/LoginForm.CGy6q0Qx.js","/_astro/StudioApp.kgVRf7PO.js","/_astro/client.YottfHSo.js","/_astro/index.DIFT5vaN.js","/_astro/index.DYrVU9rO.js","/_astro/jsx-runtime.D_zvdyIk.js","/_astro/page.sJrt8mpm.js","/_worker.js/_@astrojs-ssr-adapter.mjs","/_worker.js/_astro-internal_middleware.mjs","/_worker.js/index.js","/_worker.js/noop-entrypoint.mjs","/_worker.js/renderers.mjs","/_worker.js/_astro/about.CQPfS6Wq.css","/_worker.js/_astro/index.DNMqlEz8.css","/_worker.js/chunks/BaseLayout_DgLdzjDk.mjs","/_worker.js/chunks/_@astro-renderers_Png_mWke.mjs","/_worker.js/chunks/_@astrojs-ssr-adapter_DAIidCbs.mjs","/_worker.js/chunks/_astro_assets_CEgE2BDn.mjs","/_worker.js/chunks/_astro_content_BEtAUU1n.mjs","/_worker.js/chunks/_astro_data-layer-content_zvwzXuK4.mjs","/_worker.js/chunks/astro-designed-error-pages_Cr3_DaMo.mjs","/_worker.js/chunks/astro_5DHBei66.mjs","/_worker.js/chunks/auth_D6f9g80t.mjs","/_worker.js/chunks/cloudflare-kv-binding_DMly_2Gl.mjs","/_worker.js/chunks/config_xmRXBfZn.mjs","/_worker.js/chunks/consts_CBOg0Lc-.mjs","/_worker.js/chunks/content-assets_XqCgPAV2.mjs","/_worker.js/chunks/content-modules_Bvq7llv8.mjs","/_worker.js/chunks/env_fEzJcfzM.mjs","/_worker.js/chunks/github_DxJJTTGJ.mjs","/_worker.js/chunks/guard_DVoZBSCP.mjs","/_worker.js/chunks/noop-middleware_BhVobUOa.mjs","/_worker.js/chunks/noop_1mqVRqHe.mjs","/_worker.js/chunks/parse_F8JSOSev.mjs","/_worker.js/chunks/path_BgNISshD.mjs","/_worker.js/chunks/posts_C0g4reG_.mjs","/_worker.js/chunks/remote_CVXTZJrr.mjs","/_worker.js/chunks/render-context_R-2tMOWg.mjs","/_worker.js/chunks/site_BqgZ-lNU.mjs","/_worker.js/pages/404.astro.mjs","/_worker.js/pages/_image.astro.mjs","/_worker.js/pages/about.astro.mjs","/_worker.js/pages/index.astro.mjs","/_worker.js/pages/rss.xml.astro.mjs","/_worker.js/pages/studio.astro.mjs","/_worker.js/pages/work.astro.mjs","/_worker.js/pages/writing.astro.mjs","/_worker.js/chunks/astro/server_DWJG0Nth.mjs","/_worker.js/pages/api/config.astro.mjs","/_worker.js/pages/api/posts.astro.mjs","/_worker.js/pages/work/_---slug_.astro.mjs","/_worker.js/pages/writing/_---slug_.astro.mjs","/_worker.js/pages/api/auth/login.astro.mjs","/_worker.js/pages/api/auth/logout.astro.mjs","/_astro/page.sJrt8mpm.js","/404.html","/about/index.html","/rss.xml","/work/index.html","/writing/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"u5vIOXJXvqo5aRiWaf8Hmzo0VijpOmRCMSywWKnwBnQ=","sessionConfig":{"driver":"cloudflare-kv-binding","options":{"binding":"SESSION"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/cloudflare-kv-binding_DMly_2Gl.mjs');

export { manifest };
