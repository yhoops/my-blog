globalThis.process ??= {}; globalThis.process.env ??= {};
import { b as createAstro, c as createComponent, e as renderHead, f as renderSlot, a as renderTemplate, r as renderComponent } from '../chunks/astro/server_DWJG0Nth.mjs';
/* empty css                                 */
/* empty css                                 */
import { a as reactExports, b as requireReactDom, R as React } from '../chunks/_@astro-renderers_Png_mWke.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_Png_mWke.mjs';
import { g as getEnv } from '../chunks/env_fEzJcfzM.mjs';
import { r as readAuthEnv, S as SESSION_COOKIE, v as verifySession, a as authConfigured } from '../chunks/auth_D6f9g80t.mjs';
import { r as readGitHubEnv, i as isConfigured } from '../chunks/github_DxJJTTGJ.mjs';

const $$Astro$1 = createAstro("https://example.pages.dev");
const $$StudioLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$StudioLayout;
  const { title = "\u5DE5\u4F5C\u5BA4" } = Astro2.props;
  return renderTemplate`<html lang="zh-CN" class="bg-base"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><title>${title}</title>${renderHead()}</head> <body class="studio-body"> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/vercel/share/v0-project/src/layouts/StudioLayout.astro", void 0);

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production = {};

/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactJsxRuntime_production;

function requireReactJsxRuntime_production () {
	if (hasRequiredReactJsxRuntime_production) return reactJsxRuntime_production;
	hasRequiredReactJsxRuntime_production = 1;
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
	  REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	function jsxProd(type, config, maybeKey) {
	  var key = null;
	  void 0 !== maybeKey && (key = "" + maybeKey);
	  void 0 !== config.key && (key = "" + config.key);
	  if ("key" in config) {
	    maybeKey = {};
	    for (var propName in config)
	      "key" !== propName && (maybeKey[propName] = config[propName]);
	  } else maybeKey = config;
	  config = maybeKey.ref;
	  return {
	    $$typeof: REACT_ELEMENT_TYPE,
	    type: type,
	    key: key,
	    ref: void 0 !== config ? config : null,
	    props: maybeKey
	  };
	}
	reactJsxRuntime_production.Fragment = REACT_FRAGMENT_TYPE;
	reactJsxRuntime_production.jsx = jsxProd;
	reactJsxRuntime_production.jsxs = jsxProd;
	return reactJsxRuntime_production;
}

var hasRequiredJsxRuntime;

function requireJsxRuntime () {
	if (hasRequiredJsxRuntime) return jsxRuntime.exports;
	hasRequiredJsxRuntime = 1;
	{
	  jsxRuntime.exports = requireReactJsxRuntime_production();
	}
	return jsxRuntime.exports;
}

var jsxRuntimeExports = requireJsxRuntime();

function LoginForm({ authConfigured }) {
  const [username, setUsername] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.ok) {
        window.location.reload();
      } else {
        setError(data.error || "登录失败");
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "login-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "login-card", onSubmit: submit, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "工作室" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "请输入凭据以管理你的站点。" }),
    !authConfigured && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "banner warn", children: "尚未配置认证环境变量（ADMIN_USERNAME / ADMIN_PASSWORD / AUTH_SECRET），登录将无法成功。" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "u", children: "用户名" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          id: "u",
          className: "input",
          value: username,
          onChange: (e) => setUsername(e.target.value),
          autoComplete: "username",
          required: true
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "p", children: "密码" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          id: "p",
          className: "input",
          type: "password",
          value: password,
          onChange: (e) => setPassword(e.target.value),
          autoComplete: "current-password",
          required: true
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", type: "submit", disabled: loading, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "spin" }) : "登录" }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "error-msg", children: error })
  ] }) });
}

const EMPTY = {
  slug: "",
  title: "",
  description: "",
  date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
  kind: "writing",
  tags: [],
  draft: false,
  body: ""
};
function ContentManager({ githubConfigured }) {
  const [posts, setPosts] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [editing, setEditing] = reactExports.useState(null);
  async function load() {
    setLoading(true);
    const res = await fetch("/api/posts");
    const data = await res.json();
    if (data.ok && data.posts) {
      setPosts(
        data.posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""))
      );
    }
    setLoading(false);
  }
  reactExports.useEffect(() => {
    load();
  }, []);
  async function del(slug) {
    if (!confirm(`确定删除《${slug}》？此操作会从 GitHub 移除该文件。`)) return;
    const res = await fetch(`/api/posts?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
    const data = await res.json();
    if (data.ok) load();
    else alert(data.error || "删除失败");
  }
  const writing = posts.filter((p) => p.kind !== "project");
  const projects = posts.filter((p) => p.kind === "project");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "toolbar", style: { marginBottom: "1.25rem" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "btn btn-primary",
          style: { width: "auto" },
          onClick: () => setEditing({ ...EMPTY }),
          children: "+ 新建文章"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: load, children: "刷新" })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "hint", children: "正在加载…" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Section,
        {
          title: "随笔",
          items: writing,
          onEdit: (p) => setEditing({ ...EMPTY, ...p, body: p.body || "" }),
          onDelete: del
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Section,
        {
          title: "作品",
          items: projects,
          onEdit: (p) => setEditing({ ...EMPTY, ...p, body: p.body || "" }),
          onDelete: del
        }
      ),
      posts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "hint", children: "还没有内容，点击「新建文章」开始。" })
    ] }),
    editing && /* @__PURE__ */ jsxRuntimeExports.jsx(
      PostEditor,
      {
        post: editing,
        githubConfigured,
        onClose: () => setEditing(null),
        onSaved: () => {
          setEditing(null);
          load();
        }
      }
    )
  ] });
}
function Section({
  title,
  items,
  onEdit,
  onDelete
}) {
  if (items.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: title }),
    items.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "post-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          p.title,
          p.draft && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tag", children: "草稿" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "meta", children: [
          p.date,
          " · ",
          p.slug
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "toolbar", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: () => onEdit(p), children: "编辑" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-danger", onClick: () => onDelete(p.slug), children: "删除" })
      ] })
    ] }, p.slug))
  ] });
}
function PostEditor({
  post,
  githubConfigured,
  onClose,
  onSaved
}) {
  const [form, setForm] = reactExports.useState(post);
  const [saving, setSaving] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  async function save() {
    if (!form.title.trim()) {
      setError("标题不能为空");
      return;
    }
    setSaving(true);
    setError("");
    const res = await fetch("/api/posts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        tags: typeof form.tags === "string" ? form.tags.split(",").map((s) => s.trim()).filter(Boolean) : form.tags
      })
    });
    const data = await res.json();
    setSaving(false);
    if (data.ok) onSaved();
    else setError(data.error || "保存失败");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-overlay", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: post.slug ? "编辑文章" : "新建文章" }),
    !githubConfigured && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "banner warn", children: "未配置 GitHub，保存将失败。请先设置环境变量。" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "标题" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", value: form.title, onChange: (e) => set("title", e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "文件名 slug（留空自动生成）" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "input",
            value: form.slug,
            placeholder: "my-post",
            onChange: (e) => set("slug", e.target.value)
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "类型" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            className: "select",
            value: form.kind,
            onChange: (e) => set("kind", e.target.value),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "writing", children: "随笔" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "project", children: "作品" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "日期" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "input",
            type: "date",
            value: form.date,
            onChange: (e) => set("date", e.target.value)
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "摘要" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "input",
          value: form.description,
          onChange: (e) => set("description", e.target.value)
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "标签（逗号分隔）" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "input",
            value: Array.isArray(form.tags) ? form.tags.join(", ") : form.tags,
            onChange: (e) => set("tags", e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "封面图 URL（可选）" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", value: form.cover || "", onChange: (e) => set("cover", e.target.value) })
      ] })
    ] }),
    form.kind === "project" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "年份" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", value: form.year || "", onChange: (e) => set("year", e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "角色 / 外链 URL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", value: form.url || "", onChange: (e) => set("url", e.target.value) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "正文（Markdown）" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          className: "textarea",
          value: form.body,
          placeholder: "# 标题\n\n在这里用 Markdown 写作…",
          onChange: (e) => set("body", e.target.value)
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label", children: "设为草稿（不公开显示）" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: `toggle ${form.draft ? "on" : ""}`,
          onClick: () => set("draft", !form.draft),
          "aria-label": "草稿开关"
        }
      )
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "error-msg", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: onClose, children: "取消" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", style: { width: "auto" }, onClick: save, disabled: saving, children: saving ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "spin" }) : "保存并提交" })
    ] })
  ] }) });
}

const COLOR_LABELS = {
  bg: "背景",
  surface: "次级背景",
  ink: "正文文字",
  muted: "次要文字",
  faint: "微弱文字",
  accent: "强调色",
  accentSoft: "强调色(浅)",
  line: "分割线"
};
const FONT_PRESETS = [
  { label: "Newsreader（衬线）", value: '"Newsreader", Georgia, serif' },
  { label: "Playfair Display（衬线）", value: '"Playfair Display", Georgia, serif' },
  { label: "Lora（衬线）", value: '"Lora", Georgia, serif' },
  { label: "Inter（无衬线）", value: '"Inter", system-ui, sans-serif' },
  { label: "Geist（无衬线）", value: '"Geist", system-ui, sans-serif' },
  { label: "系统默认", value: "system-ui, sans-serif" }
];
const EASE_PRESETS = [
  { label: "优雅缓出", value: "cubic-bezier(0.22, 1, 0.36, 1)" },
  { label: "标准", value: "ease" },
  { label: "线性", value: "linear" },
  { label: "回弹", value: "cubic-bezier(0.34, 1.56, 0.64, 1)" }
];
function AppearanceEditor({
  config,
  onChange
}) {
  const theme = config.theme;
  function setTheme(next) {
    onChange({ ...config, theme: { ...theme, ...next } });
  }
  function setColor(key, value) {
    setTheme({ colors: { ...theme.colors, [key]: value } });
  }
  function setType(key, value) {
    setTheme({ typography: { ...theme.typography, [key]: value } });
  }
  function setAnim(key, value) {
    setTheme({ animation: { ...theme.animation, [key]: value } });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "实时预览" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: {
            background: theme.colors.bg,
            color: theme.colors.ink,
            borderRadius: theme.typography.radius,
            border: `1px solid ${theme.colors.line}`,
            padding: "1.75rem"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  fontFamily: theme.fonts.heading,
                  fontSize: `${theme.typography.baseSize * Math.pow(theme.typography.scale, 2)}px`,
                  lineHeight: 1.15,
                  marginBottom: "0.5rem"
                },
                children: "克制是一种风格"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  fontFamily: theme.fonts.body,
                  fontSize: `${theme.typography.baseSize}px`,
                  color: theme.colors.muted,
                  maxWidth: `${theme.typography.measure}rem`,
                  lineHeight: 1.6
                },
                children: [
                  "这是一段正文预览。调节右侧的配色、字体与字号，文字会即时反映你的设置。",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("a", { style: { color: theme.colors.accent, marginLeft: 6 }, children: "这是一个强调链接" }),
                  "。"
                ]
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "配色" }),
        Object.keys(COLOR_LABELS).map((key) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label", children: COLOR_LABELS[key] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                className: "input",
                style: { width: 96, fontFamily: "monospace", fontSize: "0.75rem" },
                value: theme.colors[key],
                onChange: (e) => setColor(key, e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "color",
                value: normalizeHex(theme.colors[key]),
                onChange: (e) => setColor(key, e.target.value)
              }
            )
          ] })
        ] }, key))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "字体" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "标题字体" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                className: "select",
                value: theme.fonts.heading,
                onChange: (e) => setTheme({ fonts: { ...theme.fonts, heading: e.target.value } }),
                children: FONT_PRESETS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: f.value, children: f.label }, f.value))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "正文字体" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                className: "select",
                value: theme.fonts.body,
                onChange: (e) => setTheme({ fonts: { ...theme.fonts, body: e.target.value } }),
                children: FONT_PRESETS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: f.value, children: f.label }, f.value))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "hint", children: "字体需在站点中已加载；预设列表内的字体均已内置。" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "排版" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Range,
            {
              label: "基础字号",
              value: theme.typography.baseSize,
              min: 14,
              max: 22,
              step: 1,
              suffix: "px",
              onChange: (v) => setType("baseSize", v)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Range,
            {
              label: "字号比例",
              value: theme.typography.scale,
              min: 1.1,
              max: 1.5,
              step: 0.01,
              onChange: (v) => setType("scale", v)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Range,
            {
              label: "阅读宽度",
              value: theme.typography.measure,
              min: 28,
              max: 52,
              step: 1,
              suffix: "rem",
              onChange: (v) => setType("measure", v)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Range,
            {
              label: "圆角",
              value: theme.typography.radius,
              min: 0,
              max: 24,
              step: 1,
              suffix: "px",
              onChange: (v) => setType("radius", v)
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "动画" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label", children: "启用入场动画" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `toggle ${theme.animation.enabled ? "on" : ""}`,
            onClick: () => setAnim("enabled", !theme.animation.enabled),
            "aria-label": "切换动画"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Range,
        {
          label: "时长",
          value: theme.animation.duration,
          min: 150,
          max: 1400,
          step: 50,
          suffix: "ms",
          onChange: (v) => setAnim("duration", v)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Range,
        {
          label: "位移距离",
          value: theme.animation.distance,
          min: 0,
          max: 64,
          step: 2,
          suffix: "px",
          onChange: (v) => setAnim("distance", v)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", style: { marginTop: "0.75rem" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "缓动曲线" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            className: "select",
            value: theme.animation.ease,
            onChange: (e) => setAnim("ease", e.target.value),
            children: EASE_PRESETS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p.value, children: p.label }, p.value))
          }
        )
      ] })
    ] })
  ] });
}
function Range({
  label,
  value,
  min,
  max,
  step,
  suffix = "",
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label", style: { minWidth: 72 }, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "range",
        min,
        max,
        step,
        value,
        onChange: (e) => onChange(parseFloat(e.target.value))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "range-val", children: [
      value,
      suffix
    ] })
  ] });
}
function normalizeHex(c) {
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c)) return c;
  return "#000000";
}

var reactDomExports = requireReactDom();

function useCombinedRefs() {
  for (var _len = arguments.length, refs = new Array(_len), _key = 0; _key < _len; _key++) {
    refs[_key] = arguments[_key];
  }

  return reactExports.useMemo(() => node => {
    refs.forEach(ref => ref(node));
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  refs);
}

// https://github.com/facebook/react/blob/master/packages/shared/ExecutionEnvironment.js
const canUseDOM = typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined';

function isWindow(element) {
  const elementString = Object.prototype.toString.call(element);
  return elementString === '[object Window]' || // In Electron context the Window object serializes to [object global]
  elementString === '[object global]';
}

function isNode(node) {
  return 'nodeType' in node;
}

function getWindow(target) {
  var _target$ownerDocument, _target$ownerDocument2;

  if (!target) {
    return window;
  }

  if (isWindow(target)) {
    return target;
  }

  if (!isNode(target)) {
    return window;
  }

  return (_target$ownerDocument = (_target$ownerDocument2 = target.ownerDocument) == null ? void 0 : _target$ownerDocument2.defaultView) != null ? _target$ownerDocument : window;
}

function isDocument(node) {
  const {
    Document
  } = getWindow(node);
  return node instanceof Document;
}

function isHTMLElement(node) {
  if (isWindow(node)) {
    return false;
  }

  return node instanceof getWindow(node).HTMLElement;
}

function isSVGElement(node) {
  return node instanceof getWindow(node).SVGElement;
}

function getOwnerDocument(target) {
  if (!target) {
    return document;
  }

  if (isWindow(target)) {
    return target.document;
  }

  if (!isNode(target)) {
    return document;
  }

  if (isDocument(target)) {
    return target;
  }

  if (isHTMLElement(target) || isSVGElement(target)) {
    return target.ownerDocument;
  }

  return document;
}

/**
 * A hook that resolves to useEffect on the server and useLayoutEffect on the client
 * @param callback {function} Callback function that is invoked when the dependencies of the hook change
 */

const useIsomorphicLayoutEffect = canUseDOM ? reactExports.useLayoutEffect : reactExports.useEffect;

function useEvent(handler) {
  const handlerRef = reactExports.useRef(handler);
  useIsomorphicLayoutEffect(() => {
    handlerRef.current = handler;
  });
  return reactExports.useCallback(function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return handlerRef.current == null ? void 0 : handlerRef.current(...args);
  }, []);
}

function useInterval() {
  const intervalRef = reactExports.useRef(null);
  const set = reactExports.useCallback((listener, duration) => {
    intervalRef.current = setInterval(listener, duration);
  }, []);
  const clear = reactExports.useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  return [set, clear];
}

function useLatestValue(value, dependencies) {
  if (dependencies === void 0) {
    dependencies = [value];
  }

  const valueRef = reactExports.useRef(value);
  useIsomorphicLayoutEffect(() => {
    if (valueRef.current !== value) {
      valueRef.current = value;
    }
  }, dependencies);
  return valueRef;
}

function useLazyMemo(callback, dependencies) {
  const valueRef = reactExports.useRef();
  return reactExports.useMemo(() => {
    const newValue = callback(valueRef.current);
    valueRef.current = newValue;
    return newValue;
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [...dependencies]);
}

function useNodeRef(onChange) {
  const onChangeHandler = useEvent(onChange);
  const node = reactExports.useRef(null);
  const setNodeRef = reactExports.useCallback(element => {
    if (element !== node.current) {
      onChangeHandler == null ? void 0 : onChangeHandler(element, node.current);
    }

    node.current = element;
  }, //eslint-disable-next-line
  []);
  return [node, setNodeRef];
}

function usePrevious(value) {
  const ref = reactExports.useRef();
  reactExports.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

let ids = {};
function useUniqueId(prefix, value) {
  return reactExports.useMemo(() => {
    if (value) {
      return value;
    }

    const id = ids[prefix] == null ? 0 : ids[prefix] + 1;
    ids[prefix] = id;
    return prefix + "-" + id;
  }, [prefix, value]);
}

function createAdjustmentFn(modifier) {
  return function (object) {
    for (var _len = arguments.length, adjustments = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      adjustments[_key - 1] = arguments[_key];
    }

    return adjustments.reduce((accumulator, adjustment) => {
      const entries = Object.entries(adjustment);

      for (const [key, valueAdjustment] of entries) {
        const value = accumulator[key];

        if (value != null) {
          accumulator[key] = value + modifier * valueAdjustment;
        }
      }

      return accumulator;
    }, { ...object
    });
  };
}

const add = /*#__PURE__*/createAdjustmentFn(1);
const subtract = /*#__PURE__*/createAdjustmentFn(-1);

function hasViewportRelativeCoordinates(event) {
  return 'clientX' in event && 'clientY' in event;
}

function isKeyboardEvent(event) {
  if (!event) {
    return false;
  }

  const {
    KeyboardEvent
  } = getWindow(event.target);
  return KeyboardEvent && event instanceof KeyboardEvent;
}

function isTouchEvent(event) {
  if (!event) {
    return false;
  }

  const {
    TouchEvent
  } = getWindow(event.target);
  return TouchEvent && event instanceof TouchEvent;
}

/**
 * Returns the normalized x and y coordinates for mouse and touch events.
 */

function getEventCoordinates(event) {
  if (isTouchEvent(event)) {
    if (event.touches && event.touches.length) {
      const {
        clientX: x,
        clientY: y
      } = event.touches[0];
      return {
        x,
        y
      };
    } else if (event.changedTouches && event.changedTouches.length) {
      const {
        clientX: x,
        clientY: y
      } = event.changedTouches[0];
      return {
        x,
        y
      };
    }
  }

  if (hasViewportRelativeCoordinates(event)) {
    return {
      x: event.clientX,
      y: event.clientY
    };
  }

  return null;
}

const CSS = /*#__PURE__*/Object.freeze({
  Translate: {
    toString(transform) {
      if (!transform) {
        return;
      }

      const {
        x,
        y
      } = transform;
      return "translate3d(" + (x ? Math.round(x) : 0) + "px, " + (y ? Math.round(y) : 0) + "px, 0)";
    }

  },
  Scale: {
    toString(transform) {
      if (!transform) {
        return;
      }

      const {
        scaleX,
        scaleY
      } = transform;
      return "scaleX(" + scaleX + ") scaleY(" + scaleY + ")";
    }

  },
  Transform: {
    toString(transform) {
      if (!transform) {
        return;
      }

      return [CSS.Translate.toString(transform), CSS.Scale.toString(transform)].join(' ');
    }

  },
  Transition: {
    toString(_ref) {
      let {
        property,
        duration,
        easing
      } = _ref;
      return property + " " + duration + "ms " + easing;
    }

  }
});

const SELECTOR = 'a,frame,iframe,input:not([type=hidden]):not(:disabled),select:not(:disabled),textarea:not(:disabled),button:not(:disabled),*[tabindex]';
function findFirstFocusableNode(element) {
  if (element.matches(SELECTOR)) {
    return element;
  }

  return element.querySelector(SELECTOR);
}

const hiddenStyles = {
  display: 'none'
};
function HiddenText(_ref) {
  let {
    id,
    value
  } = _ref;
  return React.createElement("div", {
    id: id,
    style: hiddenStyles
  }, value);
}

function LiveRegion(_ref) {
  let {
    id,
    announcement,
    ariaLiveType = "assertive"
  } = _ref;
  // Hide element visually but keep it readable by screen readers
  const visuallyHidden = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: 1,
    height: 1,
    margin: -1,
    border: 0,
    padding: 0,
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(100%)',
    whiteSpace: 'nowrap'
  };
  return React.createElement("div", {
    id: id,
    style: visuallyHidden,
    role: "status",
    "aria-live": ariaLiveType,
    "aria-atomic": true
  }, announcement);
}

function useAnnouncement() {
  const [announcement, setAnnouncement] = reactExports.useState('');
  const announce = reactExports.useCallback(value => {
    if (value != null) {
      setAnnouncement(value);
    }
  }, []);
  return {
    announce,
    announcement
  };
}

const DndMonitorContext = /*#__PURE__*/reactExports.createContext(null);

function useDndMonitor(listener) {
  const registerListener = reactExports.useContext(DndMonitorContext);
  reactExports.useEffect(() => {
    if (!registerListener) {
      throw new Error('useDndMonitor must be used within a children of <DndContext>');
    }

    const unsubscribe = registerListener(listener);
    return unsubscribe;
  }, [listener, registerListener]);
}

function useDndMonitorProvider() {
  const [listeners] = reactExports.useState(() => new Set());
  const registerListener = reactExports.useCallback(listener => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, [listeners]);
  const dispatch = reactExports.useCallback(_ref => {
    let {
      type,
      event
    } = _ref;
    listeners.forEach(listener => {
      var _listener$type;

      return (_listener$type = listener[type]) == null ? void 0 : _listener$type.call(listener, event);
    });
  }, [listeners]);
  return [dispatch, registerListener];
}

const defaultScreenReaderInstructions = {
  draggable: "\n    To pick up a draggable item, press the space bar.\n    While dragging, use the arrow keys to move the item.\n    Press space again to drop the item in its new position, or press escape to cancel.\n  "
};
const defaultAnnouncements = {
  onDragStart(_ref) {
    let {
      active
    } = _ref;
    return "Picked up draggable item " + active.id + ".";
  },

  onDragOver(_ref2) {
    let {
      active,
      over
    } = _ref2;

    if (over) {
      return "Draggable item " + active.id + " was moved over droppable area " + over.id + ".";
    }

    return "Draggable item " + active.id + " is no longer over a droppable area.";
  },

  onDragEnd(_ref3) {
    let {
      active,
      over
    } = _ref3;

    if (over) {
      return "Draggable item " + active.id + " was dropped over droppable area " + over.id;
    }

    return "Draggable item " + active.id + " was dropped.";
  },

  onDragCancel(_ref4) {
    let {
      active
    } = _ref4;
    return "Dragging was cancelled. Draggable item " + active.id + " was dropped.";
  }

};

function Accessibility(_ref) {
  let {
    announcements = defaultAnnouncements,
    container,
    hiddenTextDescribedById,
    screenReaderInstructions = defaultScreenReaderInstructions
  } = _ref;
  const {
    announce,
    announcement
  } = useAnnouncement();
  const liveRegionId = useUniqueId("DndLiveRegion");
  const [mounted, setMounted] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setMounted(true);
  }, []);
  useDndMonitor(reactExports.useMemo(() => ({
    onDragStart(_ref2) {
      let {
        active
      } = _ref2;
      announce(announcements.onDragStart({
        active
      }));
    },

    onDragMove(_ref3) {
      let {
        active,
        over
      } = _ref3;

      if (announcements.onDragMove) {
        announce(announcements.onDragMove({
          active,
          over
        }));
      }
    },

    onDragOver(_ref4) {
      let {
        active,
        over
      } = _ref4;
      announce(announcements.onDragOver({
        active,
        over
      }));
    },

    onDragEnd(_ref5) {
      let {
        active,
        over
      } = _ref5;
      announce(announcements.onDragEnd({
        active,
        over
      }));
    },

    onDragCancel(_ref6) {
      let {
        active,
        over
      } = _ref6;
      announce(announcements.onDragCancel({
        active,
        over
      }));
    }

  }), [announce, announcements]));

  if (!mounted) {
    return null;
  }

  const markup = React.createElement(React.Fragment, null, React.createElement(HiddenText, {
    id: hiddenTextDescribedById,
    value: screenReaderInstructions.draggable
  }), React.createElement(LiveRegion, {
    id: liveRegionId,
    announcement: announcement
  }));
  return container ? reactDomExports.createPortal(markup, container) : markup;
}

var Action;

(function (Action) {
  Action["DragStart"] = "dragStart";
  Action["DragMove"] = "dragMove";
  Action["DragEnd"] = "dragEnd";
  Action["DragCancel"] = "dragCancel";
  Action["DragOver"] = "dragOver";
  Action["RegisterDroppable"] = "registerDroppable";
  Action["SetDroppableDisabled"] = "setDroppableDisabled";
  Action["UnregisterDroppable"] = "unregisterDroppable";
})(Action || (Action = {}));

function noop() {}

function useSensor(sensor, options) {
  return reactExports.useMemo(() => ({
    sensor,
    options: options != null ? options : {}
  }), // eslint-disable-next-line react-hooks/exhaustive-deps
  [sensor, options]);
}

function useSensors() {
  for (var _len = arguments.length, sensors = new Array(_len), _key = 0; _key < _len; _key++) {
    sensors[_key] = arguments[_key];
  }

  return reactExports.useMemo(() => [...sensors].filter(sensor => sensor != null), // eslint-disable-next-line react-hooks/exhaustive-deps
  [...sensors]);
}

const defaultCoordinates = /*#__PURE__*/Object.freeze({
  x: 0,
  y: 0
});

/**
 * Returns the distance between two points
 */
function distanceBetween(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

/**
 * Sort collisions from smallest to greatest value
 */
function sortCollisionsAsc(_ref, _ref2) {
  let {
    data: {
      value: a
    }
  } = _ref;
  let {
    data: {
      value: b
    }
  } = _ref2;
  return a - b;
}
/**
 * Sort collisions from greatest to smallest value
 */

function sortCollisionsDesc(_ref3, _ref4) {
  let {
    data: {
      value: a
    }
  } = _ref3;
  let {
    data: {
      value: b
    }
  } = _ref4;
  return b - a;
}
function getFirstCollision(collisions, property) {
  if (!collisions || collisions.length === 0) {
    return null;
  }

  const [firstCollision] = collisions;
  return firstCollision[property] ;
}

/**
 * Returns the coordinates of the center of a given ClientRect
 */

function centerOfRectangle(rect, left, top) {
  if (left === void 0) {
    left = rect.left;
  }

  if (top === void 0) {
    top = rect.top;
  }

  return {
    x: left + rect.width * 0.5,
    y: top + rect.height * 0.5
  };
}
/**
 * Returns the closest rectangles from an array of rectangles to the center of a given
 * rectangle.
 */


const closestCenter = _ref => {
  let {
    collisionRect,
    droppableRects,
    droppableContainers
  } = _ref;
  const centerRect = centerOfRectangle(collisionRect, collisionRect.left, collisionRect.top);
  const collisions = [];

  for (const droppableContainer of droppableContainers) {
    const {
      id
    } = droppableContainer;
    const rect = droppableRects.get(id);

    if (rect) {
      const distBetween = distanceBetween(centerOfRectangle(rect), centerRect);
      collisions.push({
        id,
        data: {
          droppableContainer,
          value: distBetween
        }
      });
    }
  }

  return collisions.sort(sortCollisionsAsc);
};

/**
 * Returns the intersecting rectangle area between two rectangles
 */

function getIntersectionRatio(entry, target) {
  const top = Math.max(target.top, entry.top);
  const left = Math.max(target.left, entry.left);
  const right = Math.min(target.left + target.width, entry.left + entry.width);
  const bottom = Math.min(target.top + target.height, entry.top + entry.height);
  const width = right - left;
  const height = bottom - top;

  if (left < right && top < bottom) {
    const targetArea = target.width * target.height;
    const entryArea = entry.width * entry.height;
    const intersectionArea = width * height;
    const intersectionRatio = intersectionArea / (targetArea + entryArea - intersectionArea);
    return Number(intersectionRatio.toFixed(4));
  } // Rectangles do not overlap, or overlap has an area of zero (edge/corner overlap)


  return 0;
}
/**
 * Returns the rectangles that has the greatest intersection area with a given
 * rectangle in an array of rectangles.
 */

const rectIntersection = _ref => {
  let {
    collisionRect,
    droppableRects,
    droppableContainers
  } = _ref;
  const collisions = [];

  for (const droppableContainer of droppableContainers) {
    const {
      id
    } = droppableContainer;
    const rect = droppableRects.get(id);

    if (rect) {
      const intersectionRatio = getIntersectionRatio(rect, collisionRect);

      if (intersectionRatio > 0) {
        collisions.push({
          id,
          data: {
            droppableContainer,
            value: intersectionRatio
          }
        });
      }
    }
  }

  return collisions.sort(sortCollisionsDesc);
};

function adjustScale(transform, rect1, rect2) {
  return { ...transform,
    scaleX: rect1 && rect2 ? rect1.width / rect2.width : 1,
    scaleY: rect1 && rect2 ? rect1.height / rect2.height : 1
  };
}

function getRectDelta(rect1, rect2) {
  return rect1 && rect2 ? {
    x: rect1.left - rect2.left,
    y: rect1.top - rect2.top
  } : defaultCoordinates;
}

function createRectAdjustmentFn(modifier) {
  return function adjustClientRect(rect) {
    for (var _len = arguments.length, adjustments = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      adjustments[_key - 1] = arguments[_key];
    }

    return adjustments.reduce((acc, adjustment) => ({ ...acc,
      top: acc.top + modifier * adjustment.y,
      bottom: acc.bottom + modifier * adjustment.y,
      left: acc.left + modifier * adjustment.x,
      right: acc.right + modifier * adjustment.x
    }), { ...rect
    });
  };
}
const getAdjustedRect = /*#__PURE__*/createRectAdjustmentFn(1);

function parseTransform(transform) {
  if (transform.startsWith('matrix3d(')) {
    const transformArray = transform.slice(9, -1).split(/, /);
    return {
      x: +transformArray[12],
      y: +transformArray[13],
      scaleX: +transformArray[0],
      scaleY: +transformArray[5]
    };
  } else if (transform.startsWith('matrix(')) {
    const transformArray = transform.slice(7, -1).split(/, /);
    return {
      x: +transformArray[4],
      y: +transformArray[5],
      scaleX: +transformArray[0],
      scaleY: +transformArray[3]
    };
  }

  return null;
}

function inverseTransform(rect, transform, transformOrigin) {
  const parsedTransform = parseTransform(transform);

  if (!parsedTransform) {
    return rect;
  }

  const {
    scaleX,
    scaleY,
    x: translateX,
    y: translateY
  } = parsedTransform;
  const x = rect.left - translateX - (1 - scaleX) * parseFloat(transformOrigin);
  const y = rect.top - translateY - (1 - scaleY) * parseFloat(transformOrigin.slice(transformOrigin.indexOf(' ') + 1));
  const w = scaleX ? rect.width / scaleX : rect.width;
  const h = scaleY ? rect.height / scaleY : rect.height;
  return {
    width: w,
    height: h,
    top: y,
    right: x + w,
    bottom: y + h,
    left: x
  };
}

const defaultOptions = {
  ignoreTransform: false
};
/**
 * Returns the bounding client rect of an element relative to the viewport.
 */

function getClientRect(element, options) {
  if (options === void 0) {
    options = defaultOptions;
  }

  let rect = element.getBoundingClientRect();

  if (options.ignoreTransform) {
    const {
      transform,
      transformOrigin
    } = getWindow(element).getComputedStyle(element);

    if (transform) {
      rect = inverseTransform(rect, transform, transformOrigin);
    }
  }

  const {
    top,
    left,
    width,
    height,
    bottom,
    right
  } = rect;
  return {
    top,
    left,
    width,
    height,
    bottom,
    right
  };
}
/**
 * Returns the bounding client rect of an element relative to the viewport.
 *
 * @remarks
 * The ClientRect returned by this method does not take into account transforms
 * applied to the element it measures.
 *
 */

function getTransformAgnosticClientRect(element) {
  return getClientRect(element, {
    ignoreTransform: true
  });
}

function getWindowClientRect(element) {
  const width = element.innerWidth;
  const height = element.innerHeight;
  return {
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    width,
    height
  };
}

function isFixed(node, computedStyle) {
  if (computedStyle === void 0) {
    computedStyle = getWindow(node).getComputedStyle(node);
  }

  return computedStyle.position === 'fixed';
}

function isScrollable(element, computedStyle) {
  if (computedStyle === void 0) {
    computedStyle = getWindow(element).getComputedStyle(element);
  }

  const overflowRegex = /(auto|scroll|overlay)/;
  const properties = ['overflow', 'overflowX', 'overflowY'];
  return properties.some(property => {
    const value = computedStyle[property];
    return typeof value === 'string' ? overflowRegex.test(value) : false;
  });
}

function getScrollableAncestors(element, limit) {
  const scrollParents = [];

  function findScrollableAncestors(node) {
    if (limit != null && scrollParents.length >= limit) {
      return scrollParents;
    }

    if (!node) {
      return scrollParents;
    }

    if (isDocument(node) && node.scrollingElement != null && !scrollParents.includes(node.scrollingElement)) {
      scrollParents.push(node.scrollingElement);
      return scrollParents;
    }

    if (!isHTMLElement(node) || isSVGElement(node)) {
      return scrollParents;
    }

    if (scrollParents.includes(node)) {
      return scrollParents;
    }

    const computedStyle = getWindow(element).getComputedStyle(node);

    if (node !== element) {
      if (isScrollable(node, computedStyle)) {
        scrollParents.push(node);
      }
    }

    if (isFixed(node, computedStyle)) {
      return scrollParents;
    }

    return findScrollableAncestors(node.parentNode);
  }

  if (!element) {
    return scrollParents;
  }

  return findScrollableAncestors(element);
}
function getFirstScrollableAncestor(node) {
  const [firstScrollableAncestor] = getScrollableAncestors(node, 1);
  return firstScrollableAncestor != null ? firstScrollableAncestor : null;
}

function getScrollableElement(element) {
  if (!canUseDOM || !element) {
    return null;
  }

  if (isWindow(element)) {
    return element;
  }

  if (!isNode(element)) {
    return null;
  }

  if (isDocument(element) || element === getOwnerDocument(element).scrollingElement) {
    return window;
  }

  if (isHTMLElement(element)) {
    return element;
  }

  return null;
}

function getScrollXCoordinate(element) {
  if (isWindow(element)) {
    return element.scrollX;
  }

  return element.scrollLeft;
}
function getScrollYCoordinate(element) {
  if (isWindow(element)) {
    return element.scrollY;
  }

  return element.scrollTop;
}
function getScrollCoordinates(element) {
  return {
    x: getScrollXCoordinate(element),
    y: getScrollYCoordinate(element)
  };
}

var Direction;

(function (Direction) {
  Direction[Direction["Forward"] = 1] = "Forward";
  Direction[Direction["Backward"] = -1] = "Backward";
})(Direction || (Direction = {}));

function isDocumentScrollingElement(element) {
  if (!canUseDOM || !element) {
    return false;
  }

  return element === document.scrollingElement;
}

function getScrollPosition(scrollingContainer) {
  const minScroll = {
    x: 0,
    y: 0
  };
  const dimensions = isDocumentScrollingElement(scrollingContainer) ? {
    height: window.innerHeight,
    width: window.innerWidth
  } : {
    height: scrollingContainer.clientHeight,
    width: scrollingContainer.clientWidth
  };
  const maxScroll = {
    x: scrollingContainer.scrollWidth - dimensions.width,
    y: scrollingContainer.scrollHeight - dimensions.height
  };
  const isTop = scrollingContainer.scrollTop <= minScroll.y;
  const isLeft = scrollingContainer.scrollLeft <= minScroll.x;
  const isBottom = scrollingContainer.scrollTop >= maxScroll.y;
  const isRight = scrollingContainer.scrollLeft >= maxScroll.x;
  return {
    isTop,
    isLeft,
    isBottom,
    isRight,
    maxScroll,
    minScroll
  };
}

const defaultThreshold = {
  x: 0.2,
  y: 0.2
};
function getScrollDirectionAndSpeed(scrollContainer, scrollContainerRect, _ref, acceleration, thresholdPercentage) {
  let {
    top,
    left,
    right,
    bottom
  } = _ref;

  if (acceleration === void 0) {
    acceleration = 10;
  }

  if (thresholdPercentage === void 0) {
    thresholdPercentage = defaultThreshold;
  }

  const {
    isTop,
    isBottom,
    isLeft,
    isRight
  } = getScrollPosition(scrollContainer);
  const direction = {
    x: 0,
    y: 0
  };
  const speed = {
    x: 0,
    y: 0
  };
  const threshold = {
    height: scrollContainerRect.height * thresholdPercentage.y,
    width: scrollContainerRect.width * thresholdPercentage.x
  };

  if (!isTop && top <= scrollContainerRect.top + threshold.height) {
    // Scroll Up
    direction.y = Direction.Backward;
    speed.y = acceleration * Math.abs((scrollContainerRect.top + threshold.height - top) / threshold.height);
  } else if (!isBottom && bottom >= scrollContainerRect.bottom - threshold.height) {
    // Scroll Down
    direction.y = Direction.Forward;
    speed.y = acceleration * Math.abs((scrollContainerRect.bottom - threshold.height - bottom) / threshold.height);
  }

  if (!isRight && right >= scrollContainerRect.right - threshold.width) {
    // Scroll Right
    direction.x = Direction.Forward;
    speed.x = acceleration * Math.abs((scrollContainerRect.right - threshold.width - right) / threshold.width);
  } else if (!isLeft && left <= scrollContainerRect.left + threshold.width) {
    // Scroll Left
    direction.x = Direction.Backward;
    speed.x = acceleration * Math.abs((scrollContainerRect.left + threshold.width - left) / threshold.width);
  }

  return {
    direction,
    speed
  };
}

function getScrollElementRect(element) {
  if (element === document.scrollingElement) {
    const {
      innerWidth,
      innerHeight
    } = window;
    return {
      top: 0,
      left: 0,
      right: innerWidth,
      bottom: innerHeight,
      width: innerWidth,
      height: innerHeight
    };
  }

  const {
    top,
    left,
    right,
    bottom
  } = element.getBoundingClientRect();
  return {
    top,
    left,
    right,
    bottom,
    width: element.clientWidth,
    height: element.clientHeight
  };
}

function getScrollOffsets(scrollableAncestors) {
  return scrollableAncestors.reduce((acc, node) => {
    return add(acc, getScrollCoordinates(node));
  }, defaultCoordinates);
}
function getScrollXOffset(scrollableAncestors) {
  return scrollableAncestors.reduce((acc, node) => {
    return acc + getScrollXCoordinate(node);
  }, 0);
}
function getScrollYOffset(scrollableAncestors) {
  return scrollableAncestors.reduce((acc, node) => {
    return acc + getScrollYCoordinate(node);
  }, 0);
}

function scrollIntoViewIfNeeded(element, measure) {
  if (measure === void 0) {
    measure = getClientRect;
  }

  if (!element) {
    return;
  }

  const {
    top,
    left,
    bottom,
    right
  } = measure(element);
  const firstScrollableAncestor = getFirstScrollableAncestor(element);

  if (!firstScrollableAncestor) {
    return;
  }

  if (bottom <= 0 || right <= 0 || top >= window.innerHeight || left >= window.innerWidth) {
    element.scrollIntoView({
      block: 'center',
      inline: 'center'
    });
  }
}

const properties = [['x', ['left', 'right'], getScrollXOffset], ['y', ['top', 'bottom'], getScrollYOffset]];
class Rect {
  constructor(rect, element) {
    this.rect = void 0;
    this.width = void 0;
    this.height = void 0;
    this.top = void 0;
    this.bottom = void 0;
    this.right = void 0;
    this.left = void 0;
    const scrollableAncestors = getScrollableAncestors(element);
    const scrollOffsets = getScrollOffsets(scrollableAncestors);
    this.rect = { ...rect
    };
    this.width = rect.width;
    this.height = rect.height;

    for (const [axis, keys, getScrollOffset] of properties) {
      for (const key of keys) {
        Object.defineProperty(this, key, {
          get: () => {
            const currentOffsets = getScrollOffset(scrollableAncestors);
            const scrollOffsetsDeltla = scrollOffsets[axis] - currentOffsets;
            return this.rect[key] + scrollOffsetsDeltla;
          },
          enumerable: true
        });
      }
    }

    Object.defineProperty(this, 'rect', {
      enumerable: false
    });
  }

}

class Listeners {
  constructor(target) {
    this.target = void 0;
    this.listeners = [];

    this.removeAll = () => {
      this.listeners.forEach(listener => {
        var _this$target;

        return (_this$target = this.target) == null ? void 0 : _this$target.removeEventListener(...listener);
      });
    };

    this.target = target;
  }

  add(eventName, handler, options) {
    var _this$target2;

    (_this$target2 = this.target) == null ? void 0 : _this$target2.addEventListener(eventName, handler, options);
    this.listeners.push([eventName, handler, options]);
  }

}

function getEventListenerTarget(target) {
  // If the `event.target` element is removed from the document events will still be targeted
  // at it, and hence won't always bubble up to the window or document anymore.
  // If there is any risk of an element being removed while it is being dragged,
  // the best practice is to attach the event listeners directly to the target.
  // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
  const {
    EventTarget
  } = getWindow(target);
  return target instanceof EventTarget ? target : getOwnerDocument(target);
}

function hasExceededDistance(delta, measurement) {
  const dx = Math.abs(delta.x);
  const dy = Math.abs(delta.y);

  if (typeof measurement === 'number') {
    return Math.sqrt(dx ** 2 + dy ** 2) > measurement;
  }

  if ('x' in measurement && 'y' in measurement) {
    return dx > measurement.x && dy > measurement.y;
  }

  if ('x' in measurement) {
    return dx > measurement.x;
  }

  if ('y' in measurement) {
    return dy > measurement.y;
  }

  return false;
}

var EventName;

(function (EventName) {
  EventName["Click"] = "click";
  EventName["DragStart"] = "dragstart";
  EventName["Keydown"] = "keydown";
  EventName["ContextMenu"] = "contextmenu";
  EventName["Resize"] = "resize";
  EventName["SelectionChange"] = "selectionchange";
  EventName["VisibilityChange"] = "visibilitychange";
})(EventName || (EventName = {}));

function preventDefault(event) {
  event.preventDefault();
}
function stopPropagation(event) {
  event.stopPropagation();
}

var KeyboardCode;

(function (KeyboardCode) {
  KeyboardCode["Space"] = "Space";
  KeyboardCode["Down"] = "ArrowDown";
  KeyboardCode["Right"] = "ArrowRight";
  KeyboardCode["Left"] = "ArrowLeft";
  KeyboardCode["Up"] = "ArrowUp";
  KeyboardCode["Esc"] = "Escape";
  KeyboardCode["Enter"] = "Enter";
  KeyboardCode["Tab"] = "Tab";
})(KeyboardCode || (KeyboardCode = {}));

const defaultKeyboardCodes = {
  start: [KeyboardCode.Space, KeyboardCode.Enter],
  cancel: [KeyboardCode.Esc],
  end: [KeyboardCode.Space, KeyboardCode.Enter, KeyboardCode.Tab]
};
const defaultKeyboardCoordinateGetter = (event, _ref) => {
  let {
    currentCoordinates
  } = _ref;

  switch (event.code) {
    case KeyboardCode.Right:
      return { ...currentCoordinates,
        x: currentCoordinates.x + 25
      };

    case KeyboardCode.Left:
      return { ...currentCoordinates,
        x: currentCoordinates.x - 25
      };

    case KeyboardCode.Down:
      return { ...currentCoordinates,
        y: currentCoordinates.y + 25
      };

    case KeyboardCode.Up:
      return { ...currentCoordinates,
        y: currentCoordinates.y - 25
      };
  }

  return undefined;
};

class KeyboardSensor {
  constructor(props) {
    this.props = void 0;
    this.autoScrollEnabled = false;
    this.referenceCoordinates = void 0;
    this.listeners = void 0;
    this.windowListeners = void 0;
    this.props = props;
    const {
      event: {
        target
      }
    } = props;
    this.props = props;
    this.listeners = new Listeners(getOwnerDocument(target));
    this.windowListeners = new Listeners(getWindow(target));
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.attach();
  }

  attach() {
    this.handleStart();
    this.windowListeners.add(EventName.Resize, this.handleCancel);
    this.windowListeners.add(EventName.VisibilityChange, this.handleCancel);
    setTimeout(() => this.listeners.add(EventName.Keydown, this.handleKeyDown));
  }

  handleStart() {
    const {
      activeNode,
      onStart
    } = this.props;
    const node = activeNode.node.current;

    if (node) {
      scrollIntoViewIfNeeded(node);
    }

    onStart(defaultCoordinates);
  }

  handleKeyDown(event) {
    if (isKeyboardEvent(event)) {
      const {
        active,
        context,
        options
      } = this.props;
      const {
        keyboardCodes = defaultKeyboardCodes,
        coordinateGetter = defaultKeyboardCoordinateGetter,
        scrollBehavior = 'smooth'
      } = options;
      const {
        code
      } = event;

      if (keyboardCodes.end.includes(code)) {
        this.handleEnd(event);
        return;
      }

      if (keyboardCodes.cancel.includes(code)) {
        this.handleCancel(event);
        return;
      }

      const {
        collisionRect
      } = context.current;
      const currentCoordinates = collisionRect ? {
        x: collisionRect.left,
        y: collisionRect.top
      } : defaultCoordinates;

      if (!this.referenceCoordinates) {
        this.referenceCoordinates = currentCoordinates;
      }

      const newCoordinates = coordinateGetter(event, {
        active,
        context: context.current,
        currentCoordinates
      });

      if (newCoordinates) {
        const coordinatesDelta = subtract(newCoordinates, currentCoordinates);
        const scrollDelta = {
          x: 0,
          y: 0
        };
        const {
          scrollableAncestors
        } = context.current;

        for (const scrollContainer of scrollableAncestors) {
          const direction = event.code;
          const {
            isTop,
            isRight,
            isLeft,
            isBottom,
            maxScroll,
            minScroll
          } = getScrollPosition(scrollContainer);
          const scrollElementRect = getScrollElementRect(scrollContainer);
          const clampedCoordinates = {
            x: Math.min(direction === KeyboardCode.Right ? scrollElementRect.right - scrollElementRect.width / 2 : scrollElementRect.right, Math.max(direction === KeyboardCode.Right ? scrollElementRect.left : scrollElementRect.left + scrollElementRect.width / 2, newCoordinates.x)),
            y: Math.min(direction === KeyboardCode.Down ? scrollElementRect.bottom - scrollElementRect.height / 2 : scrollElementRect.bottom, Math.max(direction === KeyboardCode.Down ? scrollElementRect.top : scrollElementRect.top + scrollElementRect.height / 2, newCoordinates.y))
          };
          const canScrollX = direction === KeyboardCode.Right && !isRight || direction === KeyboardCode.Left && !isLeft;
          const canScrollY = direction === KeyboardCode.Down && !isBottom || direction === KeyboardCode.Up && !isTop;

          if (canScrollX && clampedCoordinates.x !== newCoordinates.x) {
            const newScrollCoordinates = scrollContainer.scrollLeft + coordinatesDelta.x;
            const canScrollToNewCoordinates = direction === KeyboardCode.Right && newScrollCoordinates <= maxScroll.x || direction === KeyboardCode.Left && newScrollCoordinates >= minScroll.x;

            if (canScrollToNewCoordinates && !coordinatesDelta.y) {
              // We don't need to update coordinates, the scroll adjustment alone will trigger
              // logic to auto-detect the new container we are over
              scrollContainer.scrollTo({
                left: newScrollCoordinates,
                behavior: scrollBehavior
              });
              return;
            }

            if (canScrollToNewCoordinates) {
              scrollDelta.x = scrollContainer.scrollLeft - newScrollCoordinates;
            } else {
              scrollDelta.x = direction === KeyboardCode.Right ? scrollContainer.scrollLeft - maxScroll.x : scrollContainer.scrollLeft - minScroll.x;
            }

            if (scrollDelta.x) {
              scrollContainer.scrollBy({
                left: -scrollDelta.x,
                behavior: scrollBehavior
              });
            }

            break;
          } else if (canScrollY && clampedCoordinates.y !== newCoordinates.y) {
            const newScrollCoordinates = scrollContainer.scrollTop + coordinatesDelta.y;
            const canScrollToNewCoordinates = direction === KeyboardCode.Down && newScrollCoordinates <= maxScroll.y || direction === KeyboardCode.Up && newScrollCoordinates >= minScroll.y;

            if (canScrollToNewCoordinates && !coordinatesDelta.x) {
              // We don't need to update coordinates, the scroll adjustment alone will trigger
              // logic to auto-detect the new container we are over
              scrollContainer.scrollTo({
                top: newScrollCoordinates,
                behavior: scrollBehavior
              });
              return;
            }

            if (canScrollToNewCoordinates) {
              scrollDelta.y = scrollContainer.scrollTop - newScrollCoordinates;
            } else {
              scrollDelta.y = direction === KeyboardCode.Down ? scrollContainer.scrollTop - maxScroll.y : scrollContainer.scrollTop - minScroll.y;
            }

            if (scrollDelta.y) {
              scrollContainer.scrollBy({
                top: -scrollDelta.y,
                behavior: scrollBehavior
              });
            }

            break;
          }
        }

        this.handleMove(event, add(subtract(newCoordinates, this.referenceCoordinates), scrollDelta));
      }
    }
  }

  handleMove(event, coordinates) {
    const {
      onMove
    } = this.props;
    event.preventDefault();
    onMove(coordinates);
  }

  handleEnd(event) {
    const {
      onEnd
    } = this.props;
    event.preventDefault();
    this.detach();
    onEnd();
  }

  handleCancel(event) {
    const {
      onCancel
    } = this.props;
    event.preventDefault();
    this.detach();
    onCancel();
  }

  detach() {
    this.listeners.removeAll();
    this.windowListeners.removeAll();
  }

}
KeyboardSensor.activators = [{
  eventName: 'onKeyDown',
  handler: (event, _ref, _ref2) => {
    let {
      keyboardCodes = defaultKeyboardCodes,
      onActivation
    } = _ref;
    let {
      active
    } = _ref2;
    const {
      code
    } = event.nativeEvent;

    if (keyboardCodes.start.includes(code)) {
      const activator = active.activatorNode.current;

      if (activator && event.target !== activator) {
        return false;
      }

      event.preventDefault();
      onActivation == null ? void 0 : onActivation({
        event: event.nativeEvent
      });
      return true;
    }

    return false;
  }
}];

function isDistanceConstraint(constraint) {
  return Boolean(constraint && 'distance' in constraint);
}

function isDelayConstraint(constraint) {
  return Boolean(constraint && 'delay' in constraint);
}

class AbstractPointerSensor {
  constructor(props, events, listenerTarget) {
    var _getEventCoordinates;

    if (listenerTarget === void 0) {
      listenerTarget = getEventListenerTarget(props.event.target);
    }

    this.props = void 0;
    this.events = void 0;
    this.autoScrollEnabled = true;
    this.document = void 0;
    this.activated = false;
    this.initialCoordinates = void 0;
    this.timeoutId = null;
    this.listeners = void 0;
    this.documentListeners = void 0;
    this.windowListeners = void 0;
    this.props = props;
    this.events = events;
    const {
      event
    } = props;
    const {
      target
    } = event;
    this.props = props;
    this.events = events;
    this.document = getOwnerDocument(target);
    this.documentListeners = new Listeners(this.document);
    this.listeners = new Listeners(listenerTarget);
    this.windowListeners = new Listeners(getWindow(target));
    this.initialCoordinates = (_getEventCoordinates = getEventCoordinates(event)) != null ? _getEventCoordinates : defaultCoordinates;
    this.handleStart = this.handleStart.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.removeTextSelection = this.removeTextSelection.bind(this);
    this.attach();
  }

  attach() {
    const {
      events,
      props: {
        options: {
          activationConstraint,
          bypassActivationConstraint
        }
      }
    } = this;
    this.listeners.add(events.move.name, this.handleMove, {
      passive: false
    });
    this.listeners.add(events.end.name, this.handleEnd);

    if (events.cancel) {
      this.listeners.add(events.cancel.name, this.handleCancel);
    }

    this.windowListeners.add(EventName.Resize, this.handleCancel);
    this.windowListeners.add(EventName.DragStart, preventDefault);
    this.windowListeners.add(EventName.VisibilityChange, this.handleCancel);
    this.windowListeners.add(EventName.ContextMenu, preventDefault);
    this.documentListeners.add(EventName.Keydown, this.handleKeydown);

    if (activationConstraint) {
      if (bypassActivationConstraint != null && bypassActivationConstraint({
        event: this.props.event,
        activeNode: this.props.activeNode,
        options: this.props.options
      })) {
        return this.handleStart();
      }

      if (isDelayConstraint(activationConstraint)) {
        this.timeoutId = setTimeout(this.handleStart, activationConstraint.delay);
        this.handlePending(activationConstraint);
        return;
      }

      if (isDistanceConstraint(activationConstraint)) {
        this.handlePending(activationConstraint);
        return;
      }
    }

    this.handleStart();
  }

  detach() {
    this.listeners.removeAll();
    this.windowListeners.removeAll(); // Wait until the next event loop before removing document listeners
    // This is necessary because we listen for `click` and `selection` events on the document

    setTimeout(this.documentListeners.removeAll, 50);

    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  handlePending(constraint, offset) {
    const {
      active,
      onPending
    } = this.props;
    onPending(active, constraint, this.initialCoordinates, offset);
  }

  handleStart() {
    const {
      initialCoordinates
    } = this;
    const {
      onStart
    } = this.props;

    if (initialCoordinates) {
      this.activated = true; // Stop propagation of click events once activation constraints are met

      this.documentListeners.add(EventName.Click, stopPropagation, {
        capture: true
      }); // Remove any text selection from the document

      this.removeTextSelection(); // Prevent further text selection while dragging

      this.documentListeners.add(EventName.SelectionChange, this.removeTextSelection);
      onStart(initialCoordinates);
    }
  }

  handleMove(event) {
    var _getEventCoordinates2;

    const {
      activated,
      initialCoordinates,
      props
    } = this;
    const {
      onMove,
      options: {
        activationConstraint
      }
    } = props;

    if (!initialCoordinates) {
      return;
    }

    const coordinates = (_getEventCoordinates2 = getEventCoordinates(event)) != null ? _getEventCoordinates2 : defaultCoordinates;
    const delta = subtract(initialCoordinates, coordinates); // Constraint validation

    if (!activated && activationConstraint) {
      if (isDistanceConstraint(activationConstraint)) {
        if (activationConstraint.tolerance != null && hasExceededDistance(delta, activationConstraint.tolerance)) {
          return this.handleCancel();
        }

        if (hasExceededDistance(delta, activationConstraint.distance)) {
          return this.handleStart();
        }
      }

      if (isDelayConstraint(activationConstraint)) {
        if (hasExceededDistance(delta, activationConstraint.tolerance)) {
          return this.handleCancel();
        }
      }

      this.handlePending(activationConstraint, delta);
      return;
    }

    if (event.cancelable) {
      event.preventDefault();
    }

    onMove(coordinates);
  }

  handleEnd() {
    const {
      onAbort,
      onEnd
    } = this.props;
    this.detach();

    if (!this.activated) {
      onAbort(this.props.active);
    }

    onEnd();
  }

  handleCancel() {
    const {
      onAbort,
      onCancel
    } = this.props;
    this.detach();

    if (!this.activated) {
      onAbort(this.props.active);
    }

    onCancel();
  }

  handleKeydown(event) {
    if (event.code === KeyboardCode.Esc) {
      this.handleCancel();
    }
  }

  removeTextSelection() {
    var _this$document$getSel;

    (_this$document$getSel = this.document.getSelection()) == null ? void 0 : _this$document$getSel.removeAllRanges();
  }

}

const events = {
  cancel: {
    name: 'pointercancel'
  },
  move: {
    name: 'pointermove'
  },
  end: {
    name: 'pointerup'
  }
};
class PointerSensor extends AbstractPointerSensor {
  constructor(props) {
    const {
      event
    } = props; // Pointer events stop firing if the target is unmounted while dragging
    // Therefore we attach listeners to the owner document instead

    const listenerTarget = getOwnerDocument(event.target);
    super(props, events, listenerTarget);
  }

}
PointerSensor.activators = [{
  eventName: 'onPointerDown',
  handler: (_ref, _ref2) => {
    let {
      nativeEvent: event
    } = _ref;
    let {
      onActivation
    } = _ref2;

    if (!event.isPrimary || event.button !== 0) {
      return false;
    }

    onActivation == null ? void 0 : onActivation({
      event
    });
    return true;
  }
}];

const events$1 = {
  move: {
    name: 'mousemove'
  },
  end: {
    name: 'mouseup'
  }
};
var MouseButton;

(function (MouseButton) {
  MouseButton[MouseButton["RightClick"] = 2] = "RightClick";
})(MouseButton || (MouseButton = {}));

class MouseSensor extends AbstractPointerSensor {
  constructor(props) {
    super(props, events$1, getOwnerDocument(props.event.target));
  }

}
MouseSensor.activators = [{
  eventName: 'onMouseDown',
  handler: (_ref, _ref2) => {
    let {
      nativeEvent: event
    } = _ref;
    let {
      onActivation
    } = _ref2;

    if (event.button === MouseButton.RightClick) {
      return false;
    }

    onActivation == null ? void 0 : onActivation({
      event
    });
    return true;
  }
}];

const events$2 = {
  cancel: {
    name: 'touchcancel'
  },
  move: {
    name: 'touchmove'
  },
  end: {
    name: 'touchend'
  }
};
class TouchSensor extends AbstractPointerSensor {
  constructor(props) {
    super(props, events$2);
  }

  static setup() {
    // Adding a non-capture and non-passive `touchmove` listener in order
    // to force `event.preventDefault()` calls to work in dynamically added
    // touchmove event handlers. This is required for iOS Safari.
    window.addEventListener(events$2.move.name, noop, {
      capture: false,
      passive: false
    });
    return function teardown() {
      window.removeEventListener(events$2.move.name, noop);
    }; // We create a new handler because the teardown function of another sensor
    // could remove our event listener if we use a referentially equal listener.

    function noop() {}
  }

}
TouchSensor.activators = [{
  eventName: 'onTouchStart',
  handler: (_ref, _ref2) => {
    let {
      nativeEvent: event
    } = _ref;
    let {
      onActivation
    } = _ref2;
    const {
      touches
    } = event;

    if (touches.length > 1) {
      return false;
    }

    onActivation == null ? void 0 : onActivation({
      event
    });
    return true;
  }
}];

var AutoScrollActivator;

(function (AutoScrollActivator) {
  AutoScrollActivator[AutoScrollActivator["Pointer"] = 0] = "Pointer";
  AutoScrollActivator[AutoScrollActivator["DraggableRect"] = 1] = "DraggableRect";
})(AutoScrollActivator || (AutoScrollActivator = {}));

var TraversalOrder;

(function (TraversalOrder) {
  TraversalOrder[TraversalOrder["TreeOrder"] = 0] = "TreeOrder";
  TraversalOrder[TraversalOrder["ReversedTreeOrder"] = 1] = "ReversedTreeOrder";
})(TraversalOrder || (TraversalOrder = {}));

function useAutoScroller(_ref) {
  let {
    acceleration,
    activator = AutoScrollActivator.Pointer,
    canScroll,
    draggingRect,
    enabled,
    interval = 5,
    order = TraversalOrder.TreeOrder,
    pointerCoordinates,
    scrollableAncestors,
    scrollableAncestorRects,
    delta,
    threshold
  } = _ref;
  const scrollIntent = useScrollIntent({
    delta,
    disabled: !enabled
  });
  const [setAutoScrollInterval, clearAutoScrollInterval] = useInterval();
  const scrollSpeed = reactExports.useRef({
    x: 0,
    y: 0
  });
  const scrollDirection = reactExports.useRef({
    x: 0,
    y: 0
  });
  const rect = reactExports.useMemo(() => {
    switch (activator) {
      case AutoScrollActivator.Pointer:
        return pointerCoordinates ? {
          top: pointerCoordinates.y,
          bottom: pointerCoordinates.y,
          left: pointerCoordinates.x,
          right: pointerCoordinates.x
        } : null;

      case AutoScrollActivator.DraggableRect:
        return draggingRect;
    }
  }, [activator, draggingRect, pointerCoordinates]);
  const scrollContainerRef = reactExports.useRef(null);
  const autoScroll = reactExports.useCallback(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    const scrollLeft = scrollSpeed.current.x * scrollDirection.current.x;
    const scrollTop = scrollSpeed.current.y * scrollDirection.current.y;
    scrollContainer.scrollBy(scrollLeft, scrollTop);
  }, []);
  const sortedScrollableAncestors = reactExports.useMemo(() => order === TraversalOrder.TreeOrder ? [...scrollableAncestors].reverse() : scrollableAncestors, [order, scrollableAncestors]);
  reactExports.useEffect(() => {
    if (!enabled || !scrollableAncestors.length || !rect) {
      clearAutoScrollInterval();
      return;
    }

    for (const scrollContainer of sortedScrollableAncestors) {
      if ((canScroll == null ? void 0 : canScroll(scrollContainer)) === false) {
        continue;
      }

      const index = scrollableAncestors.indexOf(scrollContainer);
      const scrollContainerRect = scrollableAncestorRects[index];

      if (!scrollContainerRect) {
        continue;
      }

      const {
        direction,
        speed
      } = getScrollDirectionAndSpeed(scrollContainer, scrollContainerRect, rect, acceleration, threshold);

      for (const axis of ['x', 'y']) {
        if (!scrollIntent[axis][direction[axis]]) {
          speed[axis] = 0;
          direction[axis] = 0;
        }
      }

      if (speed.x > 0 || speed.y > 0) {
        clearAutoScrollInterval();
        scrollContainerRef.current = scrollContainer;
        setAutoScrollInterval(autoScroll, interval);
        scrollSpeed.current = speed;
        scrollDirection.current = direction;
        return;
      }
    }

    scrollSpeed.current = {
      x: 0,
      y: 0
    };
    scrollDirection.current = {
      x: 0,
      y: 0
    };
    clearAutoScrollInterval();
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [acceleration, autoScroll, canScroll, clearAutoScrollInterval, enabled, interval, // eslint-disable-next-line react-hooks/exhaustive-deps
  JSON.stringify(rect), // eslint-disable-next-line react-hooks/exhaustive-deps
  JSON.stringify(scrollIntent), setAutoScrollInterval, scrollableAncestors, sortedScrollableAncestors, scrollableAncestorRects, // eslint-disable-next-line react-hooks/exhaustive-deps
  JSON.stringify(threshold)]);
}
const defaultScrollIntent = {
  x: {
    [Direction.Backward]: false,
    [Direction.Forward]: false
  },
  y: {
    [Direction.Backward]: false,
    [Direction.Forward]: false
  }
};

function useScrollIntent(_ref2) {
  let {
    delta,
    disabled
  } = _ref2;
  const previousDelta = usePrevious(delta);
  return useLazyMemo(previousIntent => {
    if (disabled || !previousDelta || !previousIntent) {
      // Reset scroll intent tracking when auto-scrolling is disabled
      return defaultScrollIntent;
    }

    const direction = {
      x: Math.sign(delta.x - previousDelta.x),
      y: Math.sign(delta.y - previousDelta.y)
    }; // Keep track of the user intent to scroll in each direction for both axis

    return {
      x: {
        [Direction.Backward]: previousIntent.x[Direction.Backward] || direction.x === -1,
        [Direction.Forward]: previousIntent.x[Direction.Forward] || direction.x === 1
      },
      y: {
        [Direction.Backward]: previousIntent.y[Direction.Backward] || direction.y === -1,
        [Direction.Forward]: previousIntent.y[Direction.Forward] || direction.y === 1
      }
    };
  }, [disabled, delta, previousDelta]);
}

function useCachedNode(draggableNodes, id) {
  const draggableNode = id != null ? draggableNodes.get(id) : undefined;
  const node = draggableNode ? draggableNode.node.current : null;
  return useLazyMemo(cachedNode => {
    var _ref;

    if (id == null) {
      return null;
    } // In some cases, the draggable node can unmount while dragging
    // This is the case for virtualized lists. In those situations,
    // we fall back to the last known value for that node.


    return (_ref = node != null ? node : cachedNode) != null ? _ref : null;
  }, [node, id]);
}

function useCombineActivators(sensors, getSyntheticHandler) {
  return reactExports.useMemo(() => sensors.reduce((accumulator, sensor) => {
    const {
      sensor: Sensor
    } = sensor;
    const sensorActivators = Sensor.activators.map(activator => ({
      eventName: activator.eventName,
      handler: getSyntheticHandler(activator.handler, sensor)
    }));
    return [...accumulator, ...sensorActivators];
  }, []), [sensors, getSyntheticHandler]);
}

var MeasuringStrategy;

(function (MeasuringStrategy) {
  MeasuringStrategy[MeasuringStrategy["Always"] = 0] = "Always";
  MeasuringStrategy[MeasuringStrategy["BeforeDragging"] = 1] = "BeforeDragging";
  MeasuringStrategy[MeasuringStrategy["WhileDragging"] = 2] = "WhileDragging";
})(MeasuringStrategy || (MeasuringStrategy = {}));

var MeasuringFrequency;

(function (MeasuringFrequency) {
  MeasuringFrequency["Optimized"] = "optimized";
})(MeasuringFrequency || (MeasuringFrequency = {}));

const defaultValue = /*#__PURE__*/new Map();
function useDroppableMeasuring(containers, _ref) {
  let {
    dragging,
    dependencies,
    config
  } = _ref;
  const [queue, setQueue] = reactExports.useState(null);
  const {
    frequency,
    measure,
    strategy
  } = config;
  const containersRef = reactExports.useRef(containers);
  const disabled = isDisabled();
  const disabledRef = useLatestValue(disabled);
  const measureDroppableContainers = reactExports.useCallback(function (ids) {
    if (ids === void 0) {
      ids = [];
    }

    if (disabledRef.current) {
      return;
    }

    setQueue(value => {
      if (value === null) {
        return ids;
      }

      return value.concat(ids.filter(id => !value.includes(id)));
    });
  }, [disabledRef]);
  const timeoutId = reactExports.useRef(null);
  const droppableRects = useLazyMemo(previousValue => {
    if (disabled && !dragging) {
      return defaultValue;
    }

    if (!previousValue || previousValue === defaultValue || containersRef.current !== containers || queue != null) {
      const map = new Map();

      for (let container of containers) {
        if (!container) {
          continue;
        }

        if (queue && queue.length > 0 && !queue.includes(container.id) && container.rect.current) {
          // This container does not need to be re-measured
          map.set(container.id, container.rect.current);
          continue;
        }

        const node = container.node.current;
        const rect = node ? new Rect(measure(node), node) : null;
        container.rect.current = rect;

        if (rect) {
          map.set(container.id, rect);
        }
      }

      return map;
    }

    return previousValue;
  }, [containers, queue, dragging, disabled, measure]);
  reactExports.useEffect(() => {
    containersRef.current = containers;
  }, [containers]);
  reactExports.useEffect(() => {
    if (disabled) {
      return;
    }

    measureDroppableContainers();
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [dragging, disabled]);
  reactExports.useEffect(() => {
    if (queue && queue.length > 0) {
      setQueue(null);
    }
  }, //eslint-disable-next-line react-hooks/exhaustive-deps
  [JSON.stringify(queue)]);
  reactExports.useEffect(() => {
    if (disabled || typeof frequency !== 'number' || timeoutId.current !== null) {
      return;
    }

    timeoutId.current = setTimeout(() => {
      measureDroppableContainers();
      timeoutId.current = null;
    }, frequency);
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [frequency, disabled, measureDroppableContainers, ...dependencies]);
  return {
    droppableRects,
    measureDroppableContainers,
    measuringScheduled: queue != null
  };

  function isDisabled() {
    switch (strategy) {
      case MeasuringStrategy.Always:
        return false;

      case MeasuringStrategy.BeforeDragging:
        return dragging;

      default:
        return !dragging;
    }
  }
}

function useInitialValue(value, computeFn) {
  return useLazyMemo(previousValue => {
    if (!value) {
      return null;
    }

    if (previousValue) {
      return previousValue;
    }

    return typeof computeFn === 'function' ? computeFn(value) : value;
  }, [computeFn, value]);
}

function useInitialRect(node, measure) {
  return useInitialValue(node, measure);
}

/**
 * Returns a new MutationObserver instance.
 * If `MutationObserver` is undefined in the execution environment, returns `undefined`.
 */

function useMutationObserver(_ref) {
  let {
    callback,
    disabled
  } = _ref;
  const handleMutations = useEvent(callback);
  const mutationObserver = reactExports.useMemo(() => {
    if (disabled || typeof window === 'undefined' || typeof window.MutationObserver === 'undefined') {
      return undefined;
    }

    const {
      MutationObserver
    } = window;
    return new MutationObserver(handleMutations);
  }, [handleMutations, disabled]);
  reactExports.useEffect(() => {
    return () => mutationObserver == null ? void 0 : mutationObserver.disconnect();
  }, [mutationObserver]);
  return mutationObserver;
}

/**
 * Returns a new ResizeObserver instance bound to the `onResize` callback.
 * If `ResizeObserver` is undefined in the execution environment, returns `undefined`.
 */

function useResizeObserver(_ref) {
  let {
    callback,
    disabled
  } = _ref;
  const handleResize = useEvent(callback);
  const resizeObserver = reactExports.useMemo(() => {
    if (disabled || typeof window === 'undefined' || typeof window.ResizeObserver === 'undefined') {
      return undefined;
    }

    const {
      ResizeObserver
    } = window;
    return new ResizeObserver(handleResize);
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [disabled]);
  reactExports.useEffect(() => {
    return () => resizeObserver == null ? void 0 : resizeObserver.disconnect();
  }, [resizeObserver]);
  return resizeObserver;
}

function defaultMeasure(element) {
  return new Rect(getClientRect(element), element);
}

function useRect(element, measure, fallbackRect) {
  if (measure === void 0) {
    measure = defaultMeasure;
  }

  const [rect, setRect] = reactExports.useState(null);

  function measureRect() {
    setRect(currentRect => {
      if (!element) {
        return null;
      }

      if (element.isConnected === false) {
        var _ref;

        // Fall back to last rect we measured if the element is
        // no longer connected to the DOM.
        return (_ref = currentRect != null ? currentRect : fallbackRect) != null ? _ref : null;
      }

      const newRect = measure(element);

      if (JSON.stringify(currentRect) === JSON.stringify(newRect)) {
        return currentRect;
      }

      return newRect;
    });
  }

  const mutationObserver = useMutationObserver({
    callback(records) {
      if (!element) {
        return;
      }

      for (const record of records) {
        const {
          type,
          target
        } = record;

        if (type === 'childList' && target instanceof HTMLElement && target.contains(element)) {
          measureRect();
          break;
        }
      }
    }

  });
  const resizeObserver = useResizeObserver({
    callback: measureRect
  });
  useIsomorphicLayoutEffect(() => {
    measureRect();

    if (element) {
      resizeObserver == null ? void 0 : resizeObserver.observe(element);
      mutationObserver == null ? void 0 : mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    } else {
      resizeObserver == null ? void 0 : resizeObserver.disconnect();
      mutationObserver == null ? void 0 : mutationObserver.disconnect();
    }
  }, [element]);
  return rect;
}

function useRectDelta(rect) {
  const initialRect = useInitialValue(rect);
  return getRectDelta(rect, initialRect);
}

const defaultValue$1 = [];
function useScrollableAncestors(node) {
  const previousNode = reactExports.useRef(node);
  const ancestors = useLazyMemo(previousValue => {
    if (!node) {
      return defaultValue$1;
    }

    if (previousValue && previousValue !== defaultValue$1 && node && previousNode.current && node.parentNode === previousNode.current.parentNode) {
      return previousValue;
    }

    return getScrollableAncestors(node);
  }, [node]);
  reactExports.useEffect(() => {
    previousNode.current = node;
  }, [node]);
  return ancestors;
}

function useScrollOffsets(elements) {
  const [scrollCoordinates, setScrollCoordinates] = reactExports.useState(null);
  const prevElements = reactExports.useRef(elements); // To-do: Throttle the handleScroll callback

  const handleScroll = reactExports.useCallback(event => {
    const scrollingElement = getScrollableElement(event.target);

    if (!scrollingElement) {
      return;
    }

    setScrollCoordinates(scrollCoordinates => {
      if (!scrollCoordinates) {
        return null;
      }

      scrollCoordinates.set(scrollingElement, getScrollCoordinates(scrollingElement));
      return new Map(scrollCoordinates);
    });
  }, []);
  reactExports.useEffect(() => {
    const previousElements = prevElements.current;

    if (elements !== previousElements) {
      cleanup(previousElements);
      const entries = elements.map(element => {
        const scrollableElement = getScrollableElement(element);

        if (scrollableElement) {
          scrollableElement.addEventListener('scroll', handleScroll, {
            passive: true
          });
          return [scrollableElement, getScrollCoordinates(scrollableElement)];
        }

        return null;
      }).filter(entry => entry != null);
      setScrollCoordinates(entries.length ? new Map(entries) : null);
      prevElements.current = elements;
    }

    return () => {
      cleanup(elements);
      cleanup(previousElements);
    };

    function cleanup(elements) {
      elements.forEach(element => {
        const scrollableElement = getScrollableElement(element);
        scrollableElement == null ? void 0 : scrollableElement.removeEventListener('scroll', handleScroll);
      });
    }
  }, [handleScroll, elements]);
  return reactExports.useMemo(() => {
    if (elements.length) {
      return scrollCoordinates ? Array.from(scrollCoordinates.values()).reduce((acc, coordinates) => add(acc, coordinates), defaultCoordinates) : getScrollOffsets(elements);
    }

    return defaultCoordinates;
  }, [elements, scrollCoordinates]);
}

function useScrollOffsetsDelta(scrollOffsets, dependencies) {
  if (dependencies === void 0) {
    dependencies = [];
  }

  const initialScrollOffsets = reactExports.useRef(null);
  reactExports.useEffect(() => {
    initialScrollOffsets.current = null;
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  dependencies);
  reactExports.useEffect(() => {
    const hasScrollOffsets = scrollOffsets !== defaultCoordinates;

    if (hasScrollOffsets && !initialScrollOffsets.current) {
      initialScrollOffsets.current = scrollOffsets;
    }

    if (!hasScrollOffsets && initialScrollOffsets.current) {
      initialScrollOffsets.current = null;
    }
  }, [scrollOffsets]);
  return initialScrollOffsets.current ? subtract(scrollOffsets, initialScrollOffsets.current) : defaultCoordinates;
}

function useSensorSetup(sensors) {
  reactExports.useEffect(() => {
    if (!canUseDOM) {
      return;
    }

    const teardownFns = sensors.map(_ref => {
      let {
        sensor
      } = _ref;
      return sensor.setup == null ? void 0 : sensor.setup();
    });
    return () => {
      for (const teardown of teardownFns) {
        teardown == null ? void 0 : teardown();
      }
    };
  }, // TO-DO: Sensors length could theoretically change which would not be a valid dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  sensors.map(_ref2 => {
    let {
      sensor
    } = _ref2;
    return sensor;
  }));
}

function useSyntheticListeners(listeners, id) {
  return reactExports.useMemo(() => {
    return listeners.reduce((acc, _ref) => {
      let {
        eventName,
        handler
      } = _ref;

      acc[eventName] = event => {
        handler(event, id);
      };

      return acc;
    }, {});
  }, [listeners, id]);
}

function useWindowRect(element) {
  return reactExports.useMemo(() => element ? getWindowClientRect(element) : null, [element]);
}

const defaultValue$2 = [];
function useRects(elements, measure) {
  if (measure === void 0) {
    measure = getClientRect;
  }

  const [firstElement] = elements;
  const windowRect = useWindowRect(firstElement ? getWindow(firstElement) : null);
  const [rects, setRects] = reactExports.useState(defaultValue$2);

  function measureRects() {
    setRects(() => {
      if (!elements.length) {
        return defaultValue$2;
      }

      return elements.map(element => isDocumentScrollingElement(element) ? windowRect : new Rect(measure(element), element));
    });
  }

  const resizeObserver = useResizeObserver({
    callback: measureRects
  });
  useIsomorphicLayoutEffect(() => {
    resizeObserver == null ? void 0 : resizeObserver.disconnect();
    measureRects();
    elements.forEach(element => resizeObserver == null ? void 0 : resizeObserver.observe(element));
  }, [elements]);
  return rects;
}

function getMeasurableNode(node) {
  if (!node) {
    return null;
  }

  if (node.children.length > 1) {
    return node;
  }

  const firstChild = node.children[0];
  return isHTMLElement(firstChild) ? firstChild : node;
}

function useDragOverlayMeasuring(_ref) {
  let {
    measure
  } = _ref;
  const [rect, setRect] = reactExports.useState(null);
  const handleResize = reactExports.useCallback(entries => {
    for (const {
      target
    } of entries) {
      if (isHTMLElement(target)) {
        setRect(rect => {
          const newRect = measure(target);
          return rect ? { ...rect,
            width: newRect.width,
            height: newRect.height
          } : newRect;
        });
        break;
      }
    }
  }, [measure]);
  const resizeObserver = useResizeObserver({
    callback: handleResize
  });
  const handleNodeChange = reactExports.useCallback(element => {
    const node = getMeasurableNode(element);
    resizeObserver == null ? void 0 : resizeObserver.disconnect();

    if (node) {
      resizeObserver == null ? void 0 : resizeObserver.observe(node);
    }

    setRect(node ? measure(node) : null);
  }, [measure, resizeObserver]);
  const [nodeRef, setRef] = useNodeRef(handleNodeChange);
  return reactExports.useMemo(() => ({
    nodeRef,
    rect,
    setRef
  }), [rect, nodeRef, setRef]);
}

const defaultSensors = [{
  sensor: PointerSensor,
  options: {}
}, {
  sensor: KeyboardSensor,
  options: {}
}];
const defaultData = {
  current: {}
};
const defaultMeasuringConfiguration = {
  draggable: {
    measure: getTransformAgnosticClientRect
  },
  droppable: {
    measure: getTransformAgnosticClientRect,
    strategy: MeasuringStrategy.WhileDragging,
    frequency: MeasuringFrequency.Optimized
  },
  dragOverlay: {
    measure: getClientRect
  }
};

class DroppableContainersMap extends Map {
  get(id) {
    var _super$get;

    return id != null ? (_super$get = super.get(id)) != null ? _super$get : undefined : undefined;
  }

  toArray() {
    return Array.from(this.values());
  }

  getEnabled() {
    return this.toArray().filter(_ref => {
      let {
        disabled
      } = _ref;
      return !disabled;
    });
  }

  getNodeFor(id) {
    var _this$get$node$curren, _this$get;

    return (_this$get$node$curren = (_this$get = this.get(id)) == null ? void 0 : _this$get.node.current) != null ? _this$get$node$curren : undefined;
  }

}

const defaultPublicContext = {
  activatorEvent: null,
  active: null,
  activeNode: null,
  activeNodeRect: null,
  collisions: null,
  containerNodeRect: null,
  draggableNodes: /*#__PURE__*/new Map(),
  droppableRects: /*#__PURE__*/new Map(),
  droppableContainers: /*#__PURE__*/new DroppableContainersMap(),
  over: null,
  dragOverlay: {
    nodeRef: {
      current: null
    },
    rect: null,
    setRef: noop
  },
  scrollableAncestors: [],
  scrollableAncestorRects: [],
  measuringConfiguration: defaultMeasuringConfiguration,
  measureDroppableContainers: noop,
  windowRect: null,
  measuringScheduled: false
};
const defaultInternalContext = {
  activatorEvent: null,
  activators: [],
  active: null,
  activeNodeRect: null,
  ariaDescribedById: {
    draggable: ''
  },
  dispatch: noop,
  draggableNodes: /*#__PURE__*/new Map(),
  over: null,
  measureDroppableContainers: noop
};
const InternalContext = /*#__PURE__*/reactExports.createContext(defaultInternalContext);
const PublicContext = /*#__PURE__*/reactExports.createContext(defaultPublicContext);

function getInitialState() {
  return {
    draggable: {
      active: null,
      initialCoordinates: {
        x: 0,
        y: 0
      },
      nodes: new Map(),
      translate: {
        x: 0,
        y: 0
      }
    },
    droppable: {
      containers: new DroppableContainersMap()
    }
  };
}
function reducer(state, action) {
  switch (action.type) {
    case Action.DragStart:
      return { ...state,
        draggable: { ...state.draggable,
          initialCoordinates: action.initialCoordinates,
          active: action.active
        }
      };

    case Action.DragMove:
      if (state.draggable.active == null) {
        return state;
      }

      return { ...state,
        draggable: { ...state.draggable,
          translate: {
            x: action.coordinates.x - state.draggable.initialCoordinates.x,
            y: action.coordinates.y - state.draggable.initialCoordinates.y
          }
        }
      };

    case Action.DragEnd:
    case Action.DragCancel:
      return { ...state,
        draggable: { ...state.draggable,
          active: null,
          initialCoordinates: {
            x: 0,
            y: 0
          },
          translate: {
            x: 0,
            y: 0
          }
        }
      };

    case Action.RegisterDroppable:
      {
        const {
          element
        } = action;
        const {
          id
        } = element;
        const containers = new DroppableContainersMap(state.droppable.containers);
        containers.set(id, element);
        return { ...state,
          droppable: { ...state.droppable,
            containers
          }
        };
      }

    case Action.SetDroppableDisabled:
      {
        const {
          id,
          key,
          disabled
        } = action;
        const element = state.droppable.containers.get(id);

        if (!element || key !== element.key) {
          return state;
        }

        const containers = new DroppableContainersMap(state.droppable.containers);
        containers.set(id, { ...element,
          disabled
        });
        return { ...state,
          droppable: { ...state.droppable,
            containers
          }
        };
      }

    case Action.UnregisterDroppable:
      {
        const {
          id,
          key
        } = action;
        const element = state.droppable.containers.get(id);

        if (!element || key !== element.key) {
          return state;
        }

        const containers = new DroppableContainersMap(state.droppable.containers);
        containers.delete(id);
        return { ...state,
          droppable: { ...state.droppable,
            containers
          }
        };
      }

    default:
      {
        return state;
      }
  }
}

function RestoreFocus(_ref) {
  let {
    disabled
  } = _ref;
  const {
    active,
    activatorEvent,
    draggableNodes
  } = reactExports.useContext(InternalContext);
  const previousActivatorEvent = usePrevious(activatorEvent);
  const previousActiveId = usePrevious(active == null ? void 0 : active.id); // Restore keyboard focus on the activator node

  reactExports.useEffect(() => {
    if (disabled) {
      return;
    }

    if (!activatorEvent && previousActivatorEvent && previousActiveId != null) {
      if (!isKeyboardEvent(previousActivatorEvent)) {
        return;
      }

      if (document.activeElement === previousActivatorEvent.target) {
        // No need to restore focus
        return;
      }

      const draggableNode = draggableNodes.get(previousActiveId);

      if (!draggableNode) {
        return;
      }

      const {
        activatorNode,
        node
      } = draggableNode;

      if (!activatorNode.current && !node.current) {
        return;
      }

      requestAnimationFrame(() => {
        for (const element of [activatorNode.current, node.current]) {
          if (!element) {
            continue;
          }

          const focusableNode = findFirstFocusableNode(element);

          if (focusableNode) {
            focusableNode.focus();
            break;
          }
        }
      });
    }
  }, [activatorEvent, disabled, draggableNodes, previousActiveId, previousActivatorEvent]);
  return null;
}

function applyModifiers(modifiers, _ref) {
  let {
    transform,
    ...args
  } = _ref;
  return modifiers != null && modifiers.length ? modifiers.reduce((accumulator, modifier) => {
    return modifier({
      transform: accumulator,
      ...args
    });
  }, transform) : transform;
}

function useMeasuringConfiguration(config) {
  return reactExports.useMemo(() => ({
    draggable: { ...defaultMeasuringConfiguration.draggable,
      ...(config == null ? void 0 : config.draggable)
    },
    droppable: { ...defaultMeasuringConfiguration.droppable,
      ...(config == null ? void 0 : config.droppable)
    },
    dragOverlay: { ...defaultMeasuringConfiguration.dragOverlay,
      ...(config == null ? void 0 : config.dragOverlay)
    }
  }), // eslint-disable-next-line react-hooks/exhaustive-deps
  [config == null ? void 0 : config.draggable, config == null ? void 0 : config.droppable, config == null ? void 0 : config.dragOverlay]);
}

function useLayoutShiftScrollCompensation(_ref) {
  let {
    activeNode,
    measure,
    initialRect,
    config = true
  } = _ref;
  const initialized = reactExports.useRef(false);
  const {
    x,
    y
  } = typeof config === 'boolean' ? {
    x: config,
    y: config
  } : config;
  useIsomorphicLayoutEffect(() => {
    const disabled = !x && !y;

    if (disabled || !activeNode) {
      initialized.current = false;
      return;
    }

    if (initialized.current || !initialRect) {
      // Return early if layout shift scroll compensation was already attempted
      // or if there is no initialRect to compare to.
      return;
    } // Get the most up to date node ref for the active draggable


    const node = activeNode == null ? void 0 : activeNode.node.current;

    if (!node || node.isConnected === false) {
      // Return early if there is no attached node ref or if the node is
      // disconnected from the document.
      return;
    }

    const rect = measure(node);
    const rectDelta = getRectDelta(rect, initialRect);

    if (!x) {
      rectDelta.x = 0;
    }

    if (!y) {
      rectDelta.y = 0;
    } // Only perform layout shift scroll compensation once


    initialized.current = true;

    if (Math.abs(rectDelta.x) > 0 || Math.abs(rectDelta.y) > 0) {
      const firstScrollableAncestor = getFirstScrollableAncestor(node);

      if (firstScrollableAncestor) {
        firstScrollableAncestor.scrollBy({
          top: rectDelta.y,
          left: rectDelta.x
        });
      }
    }
  }, [activeNode, x, y, initialRect, measure]);
}

const ActiveDraggableContext = /*#__PURE__*/reactExports.createContext({ ...defaultCoordinates,
  scaleX: 1,
  scaleY: 1
});
var Status;

(function (Status) {
  Status[Status["Uninitialized"] = 0] = "Uninitialized";
  Status[Status["Initializing"] = 1] = "Initializing";
  Status[Status["Initialized"] = 2] = "Initialized";
})(Status || (Status = {}));

const DndContext = /*#__PURE__*/reactExports.memo(function DndContext(_ref) {
  var _sensorContext$curren, _dragOverlay$nodeRef$, _dragOverlay$rect, _over$rect;

  let {
    id,
    accessibility,
    autoScroll = true,
    children,
    sensors = defaultSensors,
    collisionDetection = rectIntersection,
    measuring,
    modifiers,
    ...props
  } = _ref;
  const store = reactExports.useReducer(reducer, undefined, getInitialState);
  const [state, dispatch] = store;
  const [dispatchMonitorEvent, registerMonitorListener] = useDndMonitorProvider();
  const [status, setStatus] = reactExports.useState(Status.Uninitialized);
  const isInitialized = status === Status.Initialized;
  const {
    draggable: {
      active: activeId,
      nodes: draggableNodes,
      translate
    },
    droppable: {
      containers: droppableContainers
    }
  } = state;
  const node = activeId != null ? draggableNodes.get(activeId) : null;
  const activeRects = reactExports.useRef({
    initial: null,
    translated: null
  });
  const active = reactExports.useMemo(() => {
    var _node$data;

    return activeId != null ? {
      id: activeId,
      // It's possible for the active node to unmount while dragging
      data: (_node$data = node == null ? void 0 : node.data) != null ? _node$data : defaultData,
      rect: activeRects
    } : null;
  }, [activeId, node]);
  const activeRef = reactExports.useRef(null);
  const [activeSensor, setActiveSensor] = reactExports.useState(null);
  const [activatorEvent, setActivatorEvent] = reactExports.useState(null);
  const latestProps = useLatestValue(props, Object.values(props));
  const draggableDescribedById = useUniqueId("DndDescribedBy", id);
  const enabledDroppableContainers = reactExports.useMemo(() => droppableContainers.getEnabled(), [droppableContainers]);
  const measuringConfiguration = useMeasuringConfiguration(measuring);
  const {
    droppableRects,
    measureDroppableContainers,
    measuringScheduled
  } = useDroppableMeasuring(enabledDroppableContainers, {
    dragging: isInitialized,
    dependencies: [translate.x, translate.y],
    config: measuringConfiguration.droppable
  });
  const activeNode = useCachedNode(draggableNodes, activeId);
  const activationCoordinates = reactExports.useMemo(() => activatorEvent ? getEventCoordinates(activatorEvent) : null, [activatorEvent]);
  const autoScrollOptions = getAutoScrollerOptions();
  const initialActiveNodeRect = useInitialRect(activeNode, measuringConfiguration.draggable.measure);
  useLayoutShiftScrollCompensation({
    activeNode: activeId != null ? draggableNodes.get(activeId) : null,
    config: autoScrollOptions.layoutShiftCompensation,
    initialRect: initialActiveNodeRect,
    measure: measuringConfiguration.draggable.measure
  });
  const activeNodeRect = useRect(activeNode, measuringConfiguration.draggable.measure, initialActiveNodeRect);
  const containerNodeRect = useRect(activeNode ? activeNode.parentElement : null);
  const sensorContext = reactExports.useRef({
    activatorEvent: null,
    active: null,
    activeNode,
    collisionRect: null,
    collisions: null,
    droppableRects,
    draggableNodes,
    draggingNode: null,
    draggingNodeRect: null,
    droppableContainers,
    over: null,
    scrollableAncestors: [],
    scrollAdjustedTranslate: null
  });
  const overNode = droppableContainers.getNodeFor((_sensorContext$curren = sensorContext.current.over) == null ? void 0 : _sensorContext$curren.id);
  const dragOverlay = useDragOverlayMeasuring({
    measure: measuringConfiguration.dragOverlay.measure
  }); // Use the rect of the drag overlay if it is mounted

  const draggingNode = (_dragOverlay$nodeRef$ = dragOverlay.nodeRef.current) != null ? _dragOverlay$nodeRef$ : activeNode;
  const draggingNodeRect = isInitialized ? (_dragOverlay$rect = dragOverlay.rect) != null ? _dragOverlay$rect : activeNodeRect : null;
  const usesDragOverlay = Boolean(dragOverlay.nodeRef.current && dragOverlay.rect); // The delta between the previous and new position of the draggable node
  // is only relevant when there is no drag overlay

  const nodeRectDelta = useRectDelta(usesDragOverlay ? null : activeNodeRect); // Get the window rect of the dragging node

  const windowRect = useWindowRect(draggingNode ? getWindow(draggingNode) : null); // Get scrollable ancestors of the dragging node

  const scrollableAncestors = useScrollableAncestors(isInitialized ? overNode != null ? overNode : activeNode : null);
  const scrollableAncestorRects = useRects(scrollableAncestors); // Apply modifiers

  const modifiedTranslate = applyModifiers(modifiers, {
    transform: {
      x: translate.x - nodeRectDelta.x,
      y: translate.y - nodeRectDelta.y,
      scaleX: 1,
      scaleY: 1
    },
    activatorEvent,
    active,
    activeNodeRect,
    containerNodeRect,
    draggingNodeRect,
    over: sensorContext.current.over,
    overlayNodeRect: dragOverlay.rect,
    scrollableAncestors,
    scrollableAncestorRects,
    windowRect
  });
  const pointerCoordinates = activationCoordinates ? add(activationCoordinates, translate) : null;
  const scrollOffsets = useScrollOffsets(scrollableAncestors); // Represents the scroll delta since dragging was initiated

  const scrollAdjustment = useScrollOffsetsDelta(scrollOffsets); // Represents the scroll delta since the last time the active node rect was measured

  const activeNodeScrollDelta = useScrollOffsetsDelta(scrollOffsets, [activeNodeRect]);
  const scrollAdjustedTranslate = add(modifiedTranslate, scrollAdjustment);
  const collisionRect = draggingNodeRect ? getAdjustedRect(draggingNodeRect, modifiedTranslate) : null;
  const collisions = active && collisionRect ? collisionDetection({
    active,
    collisionRect,
    droppableRects,
    droppableContainers: enabledDroppableContainers,
    pointerCoordinates
  }) : null;
  const overId = getFirstCollision(collisions, 'id');
  const [over, setOver] = reactExports.useState(null); // When there is no drag overlay used, we need to account for the
  // window scroll delta

  const appliedTranslate = usesDragOverlay ? modifiedTranslate : add(modifiedTranslate, activeNodeScrollDelta);
  const transform = adjustScale(appliedTranslate, (_over$rect = over == null ? void 0 : over.rect) != null ? _over$rect : null, activeNodeRect);
  const activeSensorRef = reactExports.useRef(null);
  const instantiateSensor = reactExports.useCallback((event, _ref2) => {
    let {
      sensor: Sensor,
      options
    } = _ref2;

    if (activeRef.current == null) {
      return;
    }

    const activeNode = draggableNodes.get(activeRef.current);

    if (!activeNode) {
      return;
    }

    const activatorEvent = event.nativeEvent;
    const sensorInstance = new Sensor({
      active: activeRef.current,
      activeNode,
      event: activatorEvent,
      options,
      // Sensors need to be instantiated with refs for arguments that change over time
      // otherwise they are frozen in time with the stale arguments
      context: sensorContext,

      onAbort(id) {
        const draggableNode = draggableNodes.get(id);

        if (!draggableNode) {
          return;
        }

        const {
          onDragAbort
        } = latestProps.current;
        const event = {
          id
        };
        onDragAbort == null ? void 0 : onDragAbort(event);
        dispatchMonitorEvent({
          type: 'onDragAbort',
          event
        });
      },

      onPending(id, constraint, initialCoordinates, offset) {
        const draggableNode = draggableNodes.get(id);

        if (!draggableNode) {
          return;
        }

        const {
          onDragPending
        } = latestProps.current;
        const event = {
          id,
          constraint,
          initialCoordinates,
          offset
        };
        onDragPending == null ? void 0 : onDragPending(event);
        dispatchMonitorEvent({
          type: 'onDragPending',
          event
        });
      },

      onStart(initialCoordinates) {
        const id = activeRef.current;

        if (id == null) {
          return;
        }

        const draggableNode = draggableNodes.get(id);

        if (!draggableNode) {
          return;
        }

        const {
          onDragStart
        } = latestProps.current;
        const event = {
          activatorEvent,
          active: {
            id,
            data: draggableNode.data,
            rect: activeRects
          }
        };
        reactDomExports.unstable_batchedUpdates(() => {
          onDragStart == null ? void 0 : onDragStart(event);
          setStatus(Status.Initializing);
          dispatch({
            type: Action.DragStart,
            initialCoordinates,
            active: id
          });
          dispatchMonitorEvent({
            type: 'onDragStart',
            event
          });
          setActiveSensor(activeSensorRef.current);
          setActivatorEvent(activatorEvent);
        });
      },

      onMove(coordinates) {
        dispatch({
          type: Action.DragMove,
          coordinates
        });
      },

      onEnd: createHandler(Action.DragEnd),
      onCancel: createHandler(Action.DragCancel)
    });
    activeSensorRef.current = sensorInstance;

    function createHandler(type) {
      return async function handler() {
        const {
          active,
          collisions,
          over,
          scrollAdjustedTranslate
        } = sensorContext.current;
        let event = null;

        if (active && scrollAdjustedTranslate) {
          const {
            cancelDrop
          } = latestProps.current;
          event = {
            activatorEvent,
            active: active,
            collisions,
            delta: scrollAdjustedTranslate,
            over
          };

          if (type === Action.DragEnd && typeof cancelDrop === 'function') {
            const shouldCancel = await Promise.resolve(cancelDrop(event));

            if (shouldCancel) {
              type = Action.DragCancel;
            }
          }
        }

        activeRef.current = null;
        reactDomExports.unstable_batchedUpdates(() => {
          dispatch({
            type
          });
          setStatus(Status.Uninitialized);
          setOver(null);
          setActiveSensor(null);
          setActivatorEvent(null);
          activeSensorRef.current = null;
          const eventName = type === Action.DragEnd ? 'onDragEnd' : 'onDragCancel';

          if (event) {
            const handler = latestProps.current[eventName];
            handler == null ? void 0 : handler(event);
            dispatchMonitorEvent({
              type: eventName,
              event
            });
          }
        });
      };
    }
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [draggableNodes]);
  const bindActivatorToSensorInstantiator = reactExports.useCallback((handler, sensor) => {
    return (event, active) => {
      const nativeEvent = event.nativeEvent;
      const activeDraggableNode = draggableNodes.get(active);

      if ( // Another sensor is already instantiating
      activeRef.current !== null || // No active draggable
      !activeDraggableNode || // Event has already been captured
      nativeEvent.dndKit || nativeEvent.defaultPrevented) {
        return;
      }

      const activationContext = {
        active: activeDraggableNode
      };
      const shouldActivate = handler(event, sensor.options, activationContext);

      if (shouldActivate === true) {
        nativeEvent.dndKit = {
          capturedBy: sensor.sensor
        };
        activeRef.current = active;
        instantiateSensor(event, sensor);
      }
    };
  }, [draggableNodes, instantiateSensor]);
  const activators = useCombineActivators(sensors, bindActivatorToSensorInstantiator);
  useSensorSetup(sensors);
  useIsomorphicLayoutEffect(() => {
    if (activeNodeRect && status === Status.Initializing) {
      setStatus(Status.Initialized);
    }
  }, [activeNodeRect, status]);
  reactExports.useEffect(() => {
    const {
      onDragMove
    } = latestProps.current;
    const {
      active,
      activatorEvent,
      collisions,
      over
    } = sensorContext.current;

    if (!active || !activatorEvent) {
      return;
    }

    const event = {
      active,
      activatorEvent,
      collisions,
      delta: {
        x: scrollAdjustedTranslate.x,
        y: scrollAdjustedTranslate.y
      },
      over
    };
    reactDomExports.unstable_batchedUpdates(() => {
      onDragMove == null ? void 0 : onDragMove(event);
      dispatchMonitorEvent({
        type: 'onDragMove',
        event
      });
    });
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [scrollAdjustedTranslate.x, scrollAdjustedTranslate.y]);
  reactExports.useEffect(() => {
    const {
      active,
      activatorEvent,
      collisions,
      droppableContainers,
      scrollAdjustedTranslate
    } = sensorContext.current;

    if (!active || activeRef.current == null || !activatorEvent || !scrollAdjustedTranslate) {
      return;
    }

    const {
      onDragOver
    } = latestProps.current;
    const overContainer = droppableContainers.get(overId);
    const over = overContainer && overContainer.rect.current ? {
      id: overContainer.id,
      rect: overContainer.rect.current,
      data: overContainer.data,
      disabled: overContainer.disabled
    } : null;
    const event = {
      active,
      activatorEvent,
      collisions,
      delta: {
        x: scrollAdjustedTranslate.x,
        y: scrollAdjustedTranslate.y
      },
      over
    };
    reactDomExports.unstable_batchedUpdates(() => {
      setOver(over);
      onDragOver == null ? void 0 : onDragOver(event);
      dispatchMonitorEvent({
        type: 'onDragOver',
        event
      });
    });
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [overId]);
  useIsomorphicLayoutEffect(() => {
    sensorContext.current = {
      activatorEvent,
      active,
      activeNode,
      collisionRect,
      collisions,
      droppableRects,
      draggableNodes,
      draggingNode,
      draggingNodeRect,
      droppableContainers,
      over,
      scrollableAncestors,
      scrollAdjustedTranslate
    };
    activeRects.current = {
      initial: draggingNodeRect,
      translated: collisionRect
    };
  }, [active, activeNode, collisions, collisionRect, draggableNodes, draggingNode, draggingNodeRect, droppableRects, droppableContainers, over, scrollableAncestors, scrollAdjustedTranslate]);
  useAutoScroller({ ...autoScrollOptions,
    delta: translate,
    draggingRect: collisionRect,
    pointerCoordinates,
    scrollableAncestors,
    scrollableAncestorRects
  });
  const publicContext = reactExports.useMemo(() => {
    const context = {
      active,
      activeNode,
      activeNodeRect,
      activatorEvent,
      collisions,
      containerNodeRect,
      dragOverlay,
      draggableNodes,
      droppableContainers,
      droppableRects,
      over,
      measureDroppableContainers,
      scrollableAncestors,
      scrollableAncestorRects,
      measuringConfiguration,
      measuringScheduled,
      windowRect
    };
    return context;
  }, [active, activeNode, activeNodeRect, activatorEvent, collisions, containerNodeRect, dragOverlay, draggableNodes, droppableContainers, droppableRects, over, measureDroppableContainers, scrollableAncestors, scrollableAncestorRects, measuringConfiguration, measuringScheduled, windowRect]);
  const internalContext = reactExports.useMemo(() => {
    const context = {
      activatorEvent,
      activators,
      active,
      activeNodeRect,
      ariaDescribedById: {
        draggable: draggableDescribedById
      },
      dispatch,
      draggableNodes,
      over,
      measureDroppableContainers
    };
    return context;
  }, [activatorEvent, activators, active, activeNodeRect, dispatch, draggableDescribedById, draggableNodes, over, measureDroppableContainers]);
  return React.createElement(DndMonitorContext.Provider, {
    value: registerMonitorListener
  }, React.createElement(InternalContext.Provider, {
    value: internalContext
  }, React.createElement(PublicContext.Provider, {
    value: publicContext
  }, React.createElement(ActiveDraggableContext.Provider, {
    value: transform
  }, children)), React.createElement(RestoreFocus, {
    disabled: (accessibility == null ? void 0 : accessibility.restoreFocus) === false
  })), React.createElement(Accessibility, { ...accessibility,
    hiddenTextDescribedById: draggableDescribedById
  }));

  function getAutoScrollerOptions() {
    const activeSensorDisablesAutoscroll = (activeSensor == null ? void 0 : activeSensor.autoScrollEnabled) === false;
    const autoScrollGloballyDisabled = typeof autoScroll === 'object' ? autoScroll.enabled === false : autoScroll === false;
    const enabled = isInitialized && !activeSensorDisablesAutoscroll && !autoScrollGloballyDisabled;

    if (typeof autoScroll === 'object') {
      return { ...autoScroll,
        enabled
      };
    }

    return {
      enabled
    };
  }
});

const NullContext = /*#__PURE__*/reactExports.createContext(null);
const defaultRole = 'button';
const ID_PREFIX$1 = 'Draggable';
function useDraggable(_ref) {
  let {
    id,
    data,
    disabled = false,
    attributes
  } = _ref;
  const key = useUniqueId(ID_PREFIX$1);
  const {
    activators,
    activatorEvent,
    active,
    activeNodeRect,
    ariaDescribedById,
    draggableNodes,
    over
  } = reactExports.useContext(InternalContext);
  const {
    role = defaultRole,
    roleDescription = 'draggable',
    tabIndex = 0
  } = attributes != null ? attributes : {};
  const isDragging = (active == null ? void 0 : active.id) === id;
  const transform = reactExports.useContext(isDragging ? ActiveDraggableContext : NullContext);
  const [node, setNodeRef] = useNodeRef();
  const [activatorNode, setActivatorNodeRef] = useNodeRef();
  const listeners = useSyntheticListeners(activators, id);
  const dataRef = useLatestValue(data);
  useIsomorphicLayoutEffect(() => {
    draggableNodes.set(id, {
      id,
      key,
      node,
      activatorNode,
      data: dataRef
    });
    return () => {
      const node = draggableNodes.get(id);

      if (node && node.key === key) {
        draggableNodes.delete(id);
      }
    };
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [draggableNodes, id]);
  const memoizedAttributes = reactExports.useMemo(() => ({
    role,
    tabIndex,
    'aria-disabled': disabled,
    'aria-pressed': isDragging && role === defaultRole ? true : undefined,
    'aria-roledescription': roleDescription,
    'aria-describedby': ariaDescribedById.draggable
  }), [disabled, role, tabIndex, isDragging, roleDescription, ariaDescribedById.draggable]);
  return {
    active,
    activatorEvent,
    activeNodeRect,
    attributes: memoizedAttributes,
    isDragging,
    listeners: disabled ? undefined : listeners,
    node,
    over,
    setNodeRef,
    setActivatorNodeRef,
    transform
  };
}

function useDndContext() {
  return reactExports.useContext(PublicContext);
}

const ID_PREFIX$1$1 = 'Droppable';
const defaultResizeObserverConfig = {
  timeout: 25
};
function useDroppable(_ref) {
  let {
    data,
    disabled = false,
    id,
    resizeObserverConfig
  } = _ref;
  const key = useUniqueId(ID_PREFIX$1$1);
  const {
    active,
    dispatch,
    over,
    measureDroppableContainers
  } = reactExports.useContext(InternalContext);
  const previous = reactExports.useRef({
    disabled
  });
  const resizeObserverConnected = reactExports.useRef(false);
  const rect = reactExports.useRef(null);
  const callbackId = reactExports.useRef(null);
  const {
    disabled: resizeObserverDisabled,
    updateMeasurementsFor,
    timeout: resizeObserverTimeout
  } = { ...defaultResizeObserverConfig,
    ...resizeObserverConfig
  };
  const ids = useLatestValue(updateMeasurementsFor != null ? updateMeasurementsFor : id);
  const handleResize = reactExports.useCallback(() => {
    if (!resizeObserverConnected.current) {
      // ResizeObserver invokes the `handleResize` callback as soon as `observe` is called,
      // assuming the element is rendered and displayed.
      resizeObserverConnected.current = true;
      return;
    }

    if (callbackId.current != null) {
      clearTimeout(callbackId.current);
    }

    callbackId.current = setTimeout(() => {
      measureDroppableContainers(Array.isArray(ids.current) ? ids.current : [ids.current]);
      callbackId.current = null;
    }, resizeObserverTimeout);
  }, //eslint-disable-next-line react-hooks/exhaustive-deps
  [resizeObserverTimeout]);
  const resizeObserver = useResizeObserver({
    callback: handleResize,
    disabled: resizeObserverDisabled || !active
  });
  const handleNodeChange = reactExports.useCallback((newElement, previousElement) => {
    if (!resizeObserver) {
      return;
    }

    if (previousElement) {
      resizeObserver.unobserve(previousElement);
      resizeObserverConnected.current = false;
    }

    if (newElement) {
      resizeObserver.observe(newElement);
    }
  }, [resizeObserver]);
  const [nodeRef, setNodeRef] = useNodeRef(handleNodeChange);
  const dataRef = useLatestValue(data);
  reactExports.useEffect(() => {
    if (!resizeObserver || !nodeRef.current) {
      return;
    }

    resizeObserver.disconnect();
    resizeObserverConnected.current = false;
    resizeObserver.observe(nodeRef.current);
  }, [nodeRef, resizeObserver]);
  reactExports.useEffect(() => {
    dispatch({
      type: Action.RegisterDroppable,
      element: {
        id,
        key,
        disabled,
        node: nodeRef,
        rect,
        data: dataRef
      }
    });
    return () => dispatch({
      type: Action.UnregisterDroppable,
      key,
      id
    });
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [id]);
  reactExports.useEffect(() => {
    if (disabled !== previous.current.disabled) {
      dispatch({
        type: Action.SetDroppableDisabled,
        id,
        key,
        disabled
      });
      previous.current.disabled = disabled;
    }
  }, [id, key, disabled, dispatch]);
  return {
    active,
    rect,
    isOver: (over == null ? void 0 : over.id) === id,
    node: nodeRef,
    over,
    setNodeRef
  };
}

/**
 * Move an array item to a different position. Returns a new array with the item moved to the new position.
 */
function arrayMove(array, from, to) {
  const newArray = array.slice();
  newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0]);
  return newArray;
}

function getSortedRects(items, rects) {
  return items.reduce((accumulator, id, index) => {
    const rect = rects.get(id);

    if (rect) {
      accumulator[index] = rect;
    }

    return accumulator;
  }, Array(items.length));
}

function isValidIndex(index) {
  return index !== null && index >= 0;
}

function itemsEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

function normalizeDisabled(disabled) {
  if (typeof disabled === 'boolean') {
    return {
      draggable: disabled,
      droppable: disabled
    };
  }

  return disabled;
}

const rectSortingStrategy = _ref => {
  let {
    rects,
    activeIndex,
    overIndex,
    index
  } = _ref;
  const newRects = arrayMove(rects, overIndex, activeIndex);
  const oldRect = rects[index];
  const newRect = newRects[index];

  if (!newRect || !oldRect) {
    return null;
  }

  return {
    x: newRect.left - oldRect.left,
    y: newRect.top - oldRect.top,
    scaleX: newRect.width / oldRect.width,
    scaleY: newRect.height / oldRect.height
  };
};

// To-do: We should be calculating scale transformation
const defaultScale$1 = {
  scaleX: 1,
  scaleY: 1
};
const verticalListSortingStrategy = _ref => {
  var _rects$activeIndex;

  let {
    activeIndex,
    activeNodeRect: fallbackActiveRect,
    index,
    rects,
    overIndex
  } = _ref;
  const activeNodeRect = (_rects$activeIndex = rects[activeIndex]) != null ? _rects$activeIndex : fallbackActiveRect;

  if (!activeNodeRect) {
    return null;
  }

  if (index === activeIndex) {
    const overIndexRect = rects[overIndex];

    if (!overIndexRect) {
      return null;
    }

    return {
      x: 0,
      y: activeIndex < overIndex ? overIndexRect.top + overIndexRect.height - (activeNodeRect.top + activeNodeRect.height) : overIndexRect.top - activeNodeRect.top,
      ...defaultScale$1
    };
  }

  const itemGap = getItemGap$1(rects, index, activeIndex);

  if (index > activeIndex && index <= overIndex) {
    return {
      x: 0,
      y: -activeNodeRect.height - itemGap,
      ...defaultScale$1
    };
  }

  if (index < activeIndex && index >= overIndex) {
    return {
      x: 0,
      y: activeNodeRect.height + itemGap,
      ...defaultScale$1
    };
  }

  return {
    x: 0,
    y: 0,
    ...defaultScale$1
  };
};

function getItemGap$1(clientRects, index, activeIndex) {
  const currentRect = clientRects[index];
  const previousRect = clientRects[index - 1];
  const nextRect = clientRects[index + 1];

  if (!currentRect) {
    return 0;
  }

  if (activeIndex < index) {
    return previousRect ? currentRect.top - (previousRect.top + previousRect.height) : nextRect ? nextRect.top - (currentRect.top + currentRect.height) : 0;
  }

  return nextRect ? nextRect.top - (currentRect.top + currentRect.height) : previousRect ? currentRect.top - (previousRect.top + previousRect.height) : 0;
}

const ID_PREFIX = 'Sortable';
const Context = /*#__PURE__*/React.createContext({
  activeIndex: -1,
  containerId: ID_PREFIX,
  disableTransforms: false,
  items: [],
  overIndex: -1,
  useDragOverlay: false,
  sortedRects: [],
  strategy: rectSortingStrategy,
  disabled: {
    draggable: false,
    droppable: false
  }
});
function SortableContext(_ref) {
  let {
    children,
    id,
    items: userDefinedItems,
    strategy = rectSortingStrategy,
    disabled: disabledProp = false
  } = _ref;
  const {
    active,
    dragOverlay,
    droppableRects,
    over,
    measureDroppableContainers
  } = useDndContext();
  const containerId = useUniqueId(ID_PREFIX, id);
  const useDragOverlay = Boolean(dragOverlay.rect !== null);
  const items = reactExports.useMemo(() => userDefinedItems.map(item => typeof item === 'object' && 'id' in item ? item.id : item), [userDefinedItems]);
  const isDragging = active != null;
  const activeIndex = active ? items.indexOf(active.id) : -1;
  const overIndex = over ? items.indexOf(over.id) : -1;
  const previousItemsRef = reactExports.useRef(items);
  const itemsHaveChanged = !itemsEqual(items, previousItemsRef.current);
  const disableTransforms = overIndex !== -1 && activeIndex === -1 || itemsHaveChanged;
  const disabled = normalizeDisabled(disabledProp);
  useIsomorphicLayoutEffect(() => {
    if (itemsHaveChanged && isDragging) {
      measureDroppableContainers(items);
    }
  }, [itemsHaveChanged, items, isDragging, measureDroppableContainers]);
  reactExports.useEffect(() => {
    previousItemsRef.current = items;
  }, [items]);
  const contextValue = reactExports.useMemo(() => ({
    activeIndex,
    containerId,
    disabled,
    disableTransforms,
    items,
    overIndex,
    useDragOverlay,
    sortedRects: getSortedRects(items, droppableRects),
    strategy
  }), // eslint-disable-next-line react-hooks/exhaustive-deps
  [activeIndex, containerId, disabled.draggable, disabled.droppable, disableTransforms, items, overIndex, droppableRects, useDragOverlay, strategy]);
  return React.createElement(Context.Provider, {
    value: contextValue
  }, children);
}

const defaultNewIndexGetter = _ref => {
  let {
    id,
    items,
    activeIndex,
    overIndex
  } = _ref;
  return arrayMove(items, activeIndex, overIndex).indexOf(id);
};
const defaultAnimateLayoutChanges = _ref2 => {
  let {
    containerId,
    isSorting,
    wasDragging,
    index,
    items,
    newIndex,
    previousItems,
    previousContainerId,
    transition
  } = _ref2;

  if (!transition || !wasDragging) {
    return false;
  }

  if (previousItems !== items && index === newIndex) {
    return false;
  }

  if (isSorting) {
    return true;
  }

  return newIndex !== index && containerId === previousContainerId;
};
const defaultTransition = {
  duration: 200,
  easing: 'ease'
};
const transitionProperty = 'transform';
const disabledTransition = /*#__PURE__*/CSS.Transition.toString({
  property: transitionProperty,
  duration: 0,
  easing: 'linear'
});
const defaultAttributes = {
  roleDescription: 'sortable'
};

/*
 * When the index of an item changes while sorting,
 * we need to temporarily disable the transforms
 */

function useDerivedTransform(_ref) {
  let {
    disabled,
    index,
    node,
    rect
  } = _ref;
  const [derivedTransform, setDerivedtransform] = reactExports.useState(null);
  const previousIndex = reactExports.useRef(index);
  useIsomorphicLayoutEffect(() => {
    if (!disabled && index !== previousIndex.current && node.current) {
      const initial = rect.current;

      if (initial) {
        const current = getClientRect(node.current, {
          ignoreTransform: true
        });
        const delta = {
          x: initial.left - current.left,
          y: initial.top - current.top,
          scaleX: initial.width / current.width,
          scaleY: initial.height / current.height
        };

        if (delta.x || delta.y) {
          setDerivedtransform(delta);
        }
      }
    }

    if (index !== previousIndex.current) {
      previousIndex.current = index;
    }
  }, [disabled, index, node, rect]);
  reactExports.useEffect(() => {
    if (derivedTransform) {
      setDerivedtransform(null);
    }
  }, [derivedTransform]);
  return derivedTransform;
}

function useSortable(_ref) {
  let {
    animateLayoutChanges = defaultAnimateLayoutChanges,
    attributes: userDefinedAttributes,
    disabled: localDisabled,
    data: customData,
    getNewIndex = defaultNewIndexGetter,
    id,
    strategy: localStrategy,
    resizeObserverConfig,
    transition = defaultTransition
  } = _ref;
  const {
    items,
    containerId,
    activeIndex,
    disabled: globalDisabled,
    disableTransforms,
    sortedRects,
    overIndex,
    useDragOverlay,
    strategy: globalStrategy
  } = reactExports.useContext(Context);
  const disabled = normalizeLocalDisabled(localDisabled, globalDisabled);
  const index = items.indexOf(id);
  const data = reactExports.useMemo(() => ({
    sortable: {
      containerId,
      index,
      items
    },
    ...customData
  }), [containerId, customData, index, items]);
  const itemsAfterCurrentSortable = reactExports.useMemo(() => items.slice(items.indexOf(id)), [items, id]);
  const {
    rect,
    node,
    isOver,
    setNodeRef: setDroppableNodeRef
  } = useDroppable({
    id,
    data,
    disabled: disabled.droppable,
    resizeObserverConfig: {
      updateMeasurementsFor: itemsAfterCurrentSortable,
      ...resizeObserverConfig
    }
  });
  const {
    active,
    activatorEvent,
    activeNodeRect,
    attributes,
    setNodeRef: setDraggableNodeRef,
    listeners,
    isDragging,
    over,
    setActivatorNodeRef,
    transform
  } = useDraggable({
    id,
    data,
    attributes: { ...defaultAttributes,
      ...userDefinedAttributes
    },
    disabled: disabled.draggable
  });
  const setNodeRef = useCombinedRefs(setDroppableNodeRef, setDraggableNodeRef);
  const isSorting = Boolean(active);
  const displaceItem = isSorting && !disableTransforms && isValidIndex(activeIndex) && isValidIndex(overIndex);
  const shouldDisplaceDragSource = !useDragOverlay && isDragging;
  const dragSourceDisplacement = shouldDisplaceDragSource && displaceItem ? transform : null;
  const strategy = localStrategy != null ? localStrategy : globalStrategy;
  const finalTransform = displaceItem ? dragSourceDisplacement != null ? dragSourceDisplacement : strategy({
    rects: sortedRects,
    activeNodeRect,
    activeIndex,
    overIndex,
    index
  }) : null;
  const newIndex = isValidIndex(activeIndex) && isValidIndex(overIndex) ? getNewIndex({
    id,
    items,
    activeIndex,
    overIndex
  }) : index;
  const activeId = active == null ? void 0 : active.id;
  const previous = reactExports.useRef({
    activeId,
    items,
    newIndex,
    containerId
  });
  const itemsHaveChanged = items !== previous.current.items;
  const shouldAnimateLayoutChanges = animateLayoutChanges({
    active,
    containerId,
    isDragging,
    isSorting,
    id,
    index,
    items,
    newIndex: previous.current.newIndex,
    previousItems: previous.current.items,
    previousContainerId: previous.current.containerId,
    transition,
    wasDragging: previous.current.activeId != null
  });
  const derivedTransform = useDerivedTransform({
    disabled: !shouldAnimateLayoutChanges,
    index,
    node,
    rect
  });
  reactExports.useEffect(() => {
    if (isSorting && previous.current.newIndex !== newIndex) {
      previous.current.newIndex = newIndex;
    }

    if (containerId !== previous.current.containerId) {
      previous.current.containerId = containerId;
    }

    if (items !== previous.current.items) {
      previous.current.items = items;
    }
  }, [isSorting, newIndex, containerId, items]);
  reactExports.useEffect(() => {
    if (activeId === previous.current.activeId) {
      return;
    }

    if (activeId != null && previous.current.activeId == null) {
      previous.current.activeId = activeId;
      return;
    }

    const timeoutId = setTimeout(() => {
      previous.current.activeId = activeId;
    }, 50);
    return () => clearTimeout(timeoutId);
  }, [activeId]);
  return {
    active,
    activeIndex,
    attributes,
    data,
    rect,
    index,
    newIndex,
    items,
    isOver,
    isSorting,
    isDragging,
    listeners,
    node,
    overIndex,
    over,
    setNodeRef,
    setActivatorNodeRef,
    setDroppableNodeRef,
    setDraggableNodeRef,
    transform: derivedTransform != null ? derivedTransform : finalTransform,
    transition: getTransition()
  };

  function getTransition() {
    if ( // Temporarily disable transitions for a single frame to set up derived transforms
    derivedTransform || // Or to prevent items jumping to back to their "new" position when items change
    itemsHaveChanged && previous.current.newIndex === index) {
      return disabledTransition;
    }

    if (shouldDisplaceDragSource && !isKeyboardEvent(activatorEvent) || !transition) {
      return undefined;
    }

    if (isSorting || shouldAnimateLayoutChanges) {
      return CSS.Transition.toString({ ...transition,
        property: transitionProperty
      });
    }

    return undefined;
  }
}

function normalizeLocalDisabled(localDisabled, globalDisabled) {
  var _localDisabled$dragga, _localDisabled$droppa;

  if (typeof localDisabled === 'boolean') {
    return {
      draggable: localDisabled,
      // Backwards compatibility
      droppable: false
    };
  }

  return {
    draggable: (_localDisabled$dragga = localDisabled == null ? void 0 : localDisabled.draggable) != null ? _localDisabled$dragga : globalDisabled.draggable,
    droppable: (_localDisabled$droppa = localDisabled == null ? void 0 : localDisabled.droppable) != null ? _localDisabled$droppa : globalDisabled.droppable
  };
}

[KeyboardCode.Down, KeyboardCode.Right, KeyboardCode.Up, KeyboardCode.Left];

const BLOCK_META = {
  hero: { name: "主视觉", desc: "姓名、标签与简介" },
  intro: { name: "引言", desc: "一段开场文字" },
  writingList: { name: "随笔列表", desc: "最新文章" },
  projectList: { name: "作品列表", desc: "精选作品" },
  richText: { name: "富文本", desc: "自由排版的段落" },
  linkList: { name: "链接列表", desc: "外部链接集合" },
  spacer: { name: "间隔", desc: "纵向留白" }
};
const DEFAULT_PROPS = {
  hero: { name: "你的名字", tagline: "一句话标签", intro: "简短的自我介绍。" },
  intro: { text: "一段引言。" },
  writingList: { heading: "随笔", limit: 5, showDescription: true },
  projectList: { heading: "作品", limit: 4 },
  richText: { heading: "", body: "在这里写点什么。" },
  linkList: { heading: "在别处", items: [{ label: "GitHub", href: "https://github.com", note: "" }] },
  spacer: { size: 48 }
};
let idCounter = 0;
function newId(prefix = "blk") {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}
function LayoutBuilder({
  config,
  onChange
}) {
  const [editing, setEditing] = reactExports.useState(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  function setBlocks(blocks) {
    onChange({ ...config, blocks });
  }
  function onDragEnd(e) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = config.blocks.findIndex((b) => b.id === active.id);
    const newIndex = config.blocks.findIndex((b) => b.id === over.id);
    setBlocks(arrayMove(config.blocks, oldIndex, newIndex));
  }
  function toggle(id) {
    setBlocks(config.blocks.map((b) => b.id === id ? { ...b, visible: !b.visible } : b));
  }
  function remove(id) {
    setBlocks(config.blocks.filter((b) => b.id !== id));
  }
  function addBlock(type) {
    const block = {
      id: newId(),
      type,
      visible: true,
      props: structuredClone(DEFAULT_PROPS[type])
    };
    setBlocks([...config.blocks, block]);
    setEditing(block);
  }
  function addFromPreset(preset) {
    const block = {
      id: newId(),
      type: preset.baseType,
      visible: true,
      props: structuredClone(preset.defaultProps)
    };
    setBlocks([...config.blocks, block]);
  }
  function saveBlock(updated) {
    setBlocks(config.blocks.map((b) => b.id === updated.id ? updated : b));
    setEditing(null);
  }
  function saveAsPreset(block) {
    const name = prompt("为这个预设组件命名：");
    if (!name) return;
    const preset = {
      id: newId("preset"),
      name,
      baseType: block.type,
      defaultProps: structuredClone(block.props)
    };
    onChange({ ...config, presets: [...config.presets || [], preset] });
  }
  function removePreset(id) {
    onChange({ ...config, presets: (config.presets || []).filter((p) => p.id !== id) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "首页区块（拖拽排序）" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DndContext, { sensors, collisionDetection: closestCenter, onDragEnd, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        SortableContext,
        {
          items: config.blocks.map((b) => b.id),
          strategy: verticalListSortingStrategy,
          children: config.blocks.map((block) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            SortableBlock,
            {
              block,
              onToggle: () => toggle(block.id),
              onEdit: () => setEditing(block),
              onRemove: () => remove(block.id),
              onSavePreset: () => saveAsPreset(block)
            },
            block.id
          ))
        }
      ) }),
      config.blocks.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "hint", children: "还没有区块，从下方添加。" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "添加区块" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: "0.5rem" }, children: Object.keys(BLOCK_META).map((type) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn", onClick: () => addBlock(type), children: [
        "+ ",
        BLOCK_META[type].name
      ] }, type)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "我的预设组件" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "hint", style: { marginTop: 0, marginBottom: "0.75rem" }, children: "在任一区块上点击「存为预设」，即可保存配置好的组件，随时复用。" }),
      (config.presets || []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "hint", children: "暂无预设。" }) : (config.presets || []).map((preset) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "block-item", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "b-title", children: preset.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "b-type", children: BLOCK_META[preset.baseType].name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: () => addFromPreset(preset), children: "插入" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-danger", onClick: () => removePreset(preset.id), children: "删除" })
      ] }, preset.id))
    ] }),
    editing && /* @__PURE__ */ jsxRuntimeExports.jsx(BlockEditor, { block: editing, onClose: () => setEditing(null), onSave: saveBlock })
  ] });
}
function SortableBlock({
  block,
  onToggle,
  onEdit,
  onRemove,
  onSavePreset
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "block-item", ref: setNodeRef, style, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "handle", ...attributes, ...listeners, children: "⠿" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "b-title", style: { opacity: block.visible ? 1 : 0.45 }, children: BLOCK_META[block.type].name }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "b-type", children: BLOCK_META[block.type].desc }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: onEdit, children: "编辑" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: onSavePreset, children: "存为预设" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: `toggle ${block.visible ? "on" : ""}`,
        onClick: onToggle,
        "aria-label": "显示/隐藏"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-danger", onClick: onRemove, children: "✕" })
  ] });
}
function BlockEditor({
  block,
  onClose,
  onSave
}) {
  const [props, setProps] = reactExports.useState(structuredClone(block.props));
  function set(key, value) {
    setProps((p) => ({ ...p, [key]: value }));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-overlay", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
      "编辑「",
      BLOCK_META[block.type].name,
      "」"
    ] }),
    Object.entries(props).map(([key, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: key }),
      typeof value === "boolean" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: `toggle ${value ? "on" : ""}`,
          onClick: () => set(key, !value),
          "aria-label": key
        }
      ) : typeof value === "number" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "number",
          className: "input",
          value,
          onChange: (e) => set(key, parseFloat(e.target.value))
        }
      ) : Array.isArray(value) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          className: "textarea",
          style: { minHeight: 120 },
          value: JSON.stringify(value, null, 2),
          onChange: (e) => {
            try {
              set(key, JSON.parse(e.target.value));
            } catch {
            }
          }
        }
      ) : key === "intro" || key === "body" || key === "text" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          className: "textarea",
          style: { minHeight: 90 },
          value,
          onChange: (e) => set(key, e.target.value)
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "input",
          value,
          onChange: (e) => set(key, e.target.value)
        }
      )
    ] }, key)),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: onClose, children: "取消" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", style: { width: "auto" }, onClick: () => onSave({ ...block, props }), children: "完成" })
    ] })
  ] }) });
}

function ContentSettings({
  config,
  onChange
}) {
  function setMeta(key, value) {
    onChange({ ...config, meta: { ...config.meta, [key]: value } });
  }
  function setNav(nav) {
    onChange({ ...config, nav });
  }
  function setSocial(social) {
    onChange({ ...config, social });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "站点信息" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "站点标题" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", value: config.meta.title, onChange: (e) => setMeta("title", e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "站点描述" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "input",
            value: config.meta.description,
            onChange: (e) => setMeta("description", e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "作者" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", value: config.meta.author, onChange: (e) => setMeta("author", e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "站点 URL" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", value: config.meta.url, onChange: (e) => setMeta("url", e.target.value) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "导航菜单" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PairList,
        {
          items: config.nav,
          keyA: "label",
          keyB: "href",
          labelA: "名称",
          labelB: "链接",
          onChange: (items) => setNav(items),
          empty: { label: "新菜单", href: "/" }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "社交 / 页脚链接" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PairList,
        {
          items: config.social,
          keyA: "label",
          keyB: "href",
          labelA: "名称",
          labelB: "链接",
          onChange: setSocial,
          empty: { label: "链接", href: "https://" }
        }
      )
    ] })
  ] });
}
function PairList({
  items,
  keyA,
  keyB,
  labelA,
  labelB,
  onChange,
  empty
}) {
  function update(i, key, value) {
    const next = items.map((it, idx) => idx === i ? { ...it, [key]: value } : it);
    onChange(next);
  }
  function remove(i) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...items, { ...empty }]);
  }
  function move(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    items.map((it, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "input",
          style: { flex: "0 0 30%" },
          placeholder: labelA,
          value: it[keyA],
          onChange: (e) => update(i, keyA, e.target.value)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "input",
          placeholder: labelB,
          value: it[keyB],
          onChange: (e) => update(i, keyB, e.target.value)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: () => move(i, -1), "aria-label": "上移", children: "↑" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: () => move(i, 1), "aria-label": "下移", children: "↓" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-danger", onClick: () => remove(i), "aria-label": "删除", children: "✕" })
    ] }, i)),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: add, style: { marginTop: "0.5rem" }, children: "+ 添加" })
  ] });
}

function StudioApp({ githubConfigured }) {
  const [tab, setTab] = reactExports.useState("content");
  const [config, setConfig] = reactExports.useState(null);
  const [dirty, setDirty] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  const [status, setStatus] = reactExports.useState(null);
  reactExports.useEffect(() => {
    fetch("/api/config").then((r) => r.json()).then((d) => {
      if (d.ok && d.config) setConfig(d.config);
    });
  }, []);
  const update = reactExports.useCallback((next) => {
    setConfig(next);
    setDirty(true);
    setStatus(null);
  }, []);
  async function saveConfig() {
    if (!config) return;
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config })
      });
      const data = await res.json();
      if (data.ok) {
        setDirty(false);
        setStatus({ kind: "ok", msg: "已提交到 GitHub，Cloudflare 将自动重新部署。" });
      } else {
        setStatus({ kind: "err", msg: data.error || "保存失败" });
      }
    } catch {
      setStatus({ kind: "err", msg: "网络错误" });
    } finally {
      setSaving(false);
    }
  }
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }
  const titles = {
    content: { h: "内容", s: "管理文章与作品，保存即提交到 GitHub" },
    appearance: { h: "外观", s: "配色、字体、字号与动画——全部可视化调节" },
    layout: { h: "布局", s: "拖拽排序首页区块，添加预设组件" },
    settings: { h: "站点设置", s: "标题、导航、个人信息与页脚" }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "studio-shell", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "studio-side", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "studio-brand", children: "Atelier" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: `nav-item ${tab === "content" ? "active" : ""}`,
          onClick: () => setTab("content"),
          children: "内容"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: `nav-item ${tab === "appearance" ? "active" : ""}`,
          onClick: () => setTab("appearance"),
          children: "外观"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: `nav-item ${tab === "layout" ? "active" : ""}`,
          onClick: () => setTab("layout"),
          children: "布局"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: `nav-item ${tab === "settings" ? "active" : ""}`,
          onClick: () => setTab("settings"),
          children: "站点设置"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "nav-item", href: "/", target: "_blank", rel: "noreferrer", children: "查看网站 ↗" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "nav-item", onClick: logout, children: "退出登录" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "studio-main", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "studio-head", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: titles[tab].h }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sub", children: titles[tab].s })
        ] }),
        tab !== "content" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "toolbar", children: [
          dirty && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hint", children: "有未保存的更改" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "btn btn-primary",
              style: { width: "auto" },
              onClick: saveConfig,
              disabled: saving || !dirty,
              children: saving ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "spin" }) : "保存并发布"
            }
          )
        ] })
      ] }),
      !githubConfigured && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "banner warn", children: "尚未配置 GitHub（GITHUB_TOKEN / GITHUB_REPO）。你可以预览所有更改，但保存时无法提交到仓库。" }),
      status && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `banner ${status.kind === "ok" ? "ok" : "warn"}`, children: status.msg }),
      !config ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hint", children: "正在加载配置…" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        tab === "content" && /* @__PURE__ */ jsxRuntimeExports.jsx(ContentManager, { githubConfigured }),
        tab === "appearance" && /* @__PURE__ */ jsxRuntimeExports.jsx(AppearanceEditor, { config, onChange: update }),
        tab === "layout" && /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutBuilder, { config, onChange: update }),
        tab === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsx(ContentSettings, { config, onChange: update })
      ] })
    ] })
  ] });
}

const $$Astro = createAstro("https://example.pages.dev");
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const env = getEnv(Astro2);
  const authEnv = readAuthEnv(env);
  const ghEnv = readGitHubEnv(env);
  const token = Astro2.cookies.get(SESSION_COOKIE)?.value;
  const loggedIn = await verifySession(authEnv, token);
  const flags = {
    authConfigured: authConfigured(authEnv),
    githubConfigured: isConfigured(ghEnv)
  };
  return renderTemplate`${renderComponent($$result, "StudioLayout", $$StudioLayout, { "title": loggedIn ? "\u5DE5\u4F5C\u5BA4" : "\u767B\u5F55" }, { "default": async ($$result2) => renderTemplate`${loggedIn ? renderTemplate`${renderComponent($$result2, "StudioApp", StudioApp, { "client:load": true, "githubConfigured": flags.githubConfigured, "client:component-hydration": "load", "client:component-path": "/vercel/share/v0-project/src/components/studio/StudioApp.tsx", "client:component-export": "default" })}` : renderTemplate`${renderComponent($$result2, "LoginForm", LoginForm, { "client:load": true, "authConfigured": flags.authConfigured, "client:component-hydration": "load", "client:component-path": "/vercel/share/v0-project/src/components/studio/LoginForm.tsx", "client:component-export": "default" })}`}` })}`;
}, "/vercel/share/v0-project/src/pages/studio/index.astro", void 0);

const $$file = "/vercel/share/v0-project/src/pages/studio/index.astro";
const $$url = "/studio";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
