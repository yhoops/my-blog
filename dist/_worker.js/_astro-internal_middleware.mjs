globalThis.process ??= {}; globalThis.process.env ??= {};
import './chunks/astro-designed-error-pages_Cr3_DaMo.mjs';
import './chunks/astro/server_DWJG0Nth.mjs';
import { s as sequence } from './chunks/render-context_R-2tMOWg.mjs';

const onRequest$1 = (context, next) => {
  if (context.isPrerendered) {
    context.locals.runtime ??= {
      env: process.env
    };
  }
  return next();
};

const onRequest = sequence(
	onRequest$1,
	
	
);

export { onRequest };
