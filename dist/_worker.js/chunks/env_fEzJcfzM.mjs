globalThis.process ??= {}; globalThis.process.env ??= {};
function getEnv(context) {
  const runtimeEnv = context.locals?.runtime?.env;
  if (runtimeEnv) return runtimeEnv;
  return typeof process !== "undefined" ? process.env : {};
}
function isSecure(context) {
  return new URL(context.request.url).protocol === "https:";
}

export { getEnv as g, isSecure as i };
