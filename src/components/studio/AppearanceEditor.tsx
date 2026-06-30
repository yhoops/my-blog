import type { SiteConfig, ThemeConfig } from "../../lib/config-types";

const COLOR_LABELS: Record<keyof ThemeConfig["colors"], string> = {
  bg: "背景",
  surface: "次级背景",
  ink: "正文文字",
  muted: "次要文字",
  faint: "微弱文字",
  accent: "强调色",
  accentSoft: "强调色(浅)",
  line: "分割线",
};

const FONT_PRESETS = [
  { label: "Newsreader（衬线）", value: '"Newsreader", Georgia, serif' },
  { label: "Playfair Display（衬线）", value: '"Playfair Display", Georgia, serif' },
  { label: "Lora（衬线）", value: '"Lora", Georgia, serif' },
  { label: "Inter（无衬线）", value: '"Inter", system-ui, sans-serif' },
  { label: "Geist（无衬线）", value: '"Geist", system-ui, sans-serif' },
  { label: "系统默认", value: "system-ui, sans-serif" },
];

const EASE_PRESETS = [
  { label: "优雅缓出", value: "cubic-bezier(0.22, 1, 0.36, 1)" },
  { label: "标准", value: "ease" },
  { label: "线性", value: "linear" },
  { label: "回弹", value: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
];

export default function AppearanceEditor({
  config,
  onChange,
}: {
  config: SiteConfig;
  onChange: (c: SiteConfig) => void;
}) {
  const theme = config.theme;

  function setTheme(next: Partial<ThemeConfig>) {
    onChange({ ...config, theme: { ...theme, ...next } });
  }
  function setColor(key: keyof ThemeConfig["colors"], value: string) {
    setTheme({ colors: { ...theme.colors, [key]: value } });
  }
  function setType(key: keyof ThemeConfig["typography"], value: number) {
    setTheme({ typography: { ...theme.typography, [key]: value } });
  }
  function setAnim(key: keyof ThemeConfig["animation"], value: number | boolean | string) {
    setTheme({ animation: { ...theme.animation, [key]: value } as ThemeConfig["animation"] });
  }

  return (
    <>
      {/* Live preview */}
      <div className="panel">
        <h3>实时预览</h3>
        <div
          style={{
            background: theme.colors.bg,
            color: theme.colors.ink,
            borderRadius: theme.typography.radius,
            border: `1px solid ${theme.colors.line}`,
            padding: "1.75rem",
          }}
        >
          <div
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: `${theme.typography.baseSize * Math.pow(theme.typography.scale, 2)}px`,
              lineHeight: 1.15,
              marginBottom: "0.5rem",
            }}
          >
            克制是一种风格
          </div>
          <div
            style={{
              fontFamily: theme.fonts.body,
              fontSize: `${theme.typography.baseSize}px`,
              color: theme.colors.muted,
              maxWidth: `${theme.typography.measure}rem`,
              lineHeight: 1.6,
            }}
          >
            这是一段正文预览。调节右侧的配色、字体与字号，文字会即时反映你的设置。
            <a style={{ color: theme.colors.accent, marginLeft: 6 }}>这是一个强调链接</a>。
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <h3>配色</h3>
          {(Object.keys(COLOR_LABELS) as (keyof ThemeConfig["colors"])[]).map((key) => (
            <div className="row" key={key}>
              <span className="label">{COLOR_LABELS[key]}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="text"
                  className="input"
                  style={{ width: 96, fontFamily: "monospace", fontSize: "0.75rem" }}
                  value={theme.colors[key]}
                  onChange={(e) => setColor(key, e.target.value)}
                />
                <input
                  type="color"
                  value={normalizeHex(theme.colors[key])}
                  onChange={(e) => setColor(key, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="panel">
            <h3>字体</h3>
            <div className="field">
              <label>标题字体</label>
              <select
                className="select"
                value={theme.fonts.heading}
                onChange={(e) => setTheme({ fonts: { ...theme.fonts, heading: e.target.value } })}
              >
                {FONT_PRESETS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>正文字体</label>
              <select
                className="select"
                value={theme.fonts.body}
                onChange={(e) => setTheme({ fonts: { ...theme.fonts, body: e.target.value } })}
              >
                {FONT_PRESETS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <p className="hint">字体需在站点中已加载；预设列表内的字体均已内置。</p>
          </div>

          <div className="panel">
            <h3>排版</h3>
            <Range
              label="基础字号"
              value={theme.typography.baseSize}
              min={14}
              max={22}
              step={1}
              suffix="px"
              onChange={(v) => setType("baseSize", v)}
            />
            <Range
              label="字号比例"
              value={theme.typography.scale}
              min={1.1}
              max={1.5}
              step={0.01}
              onChange={(v) => setType("scale", v)}
            />
            <Range
              label="阅读宽度"
              value={theme.typography.measure}
              min={28}
              max={52}
              step={1}
              suffix="rem"
              onChange={(v) => setType("measure", v)}
            />
            <Range
              label="圆角"
              value={theme.typography.radius}
              min={0}
              max={24}
              step={1}
              suffix="px"
              onChange={(v) => setType("radius", v)}
            />
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>动画</h3>
        <div className="row">
          <span className="label">启用入场动画</span>
          <button
            className={`toggle ${theme.animation.enabled ? "on" : ""}`}
            onClick={() => setAnim("enabled", !theme.animation.enabled)}
            aria-label="切换动画"
          />
        </div>
        <Range
          label="时长"
          value={theme.animation.duration}
          min={150}
          max={1400}
          step={50}
          suffix="ms"
          onChange={(v) => setAnim("duration", v)}
        />
        <Range
          label="位移距离"
          value={theme.animation.distance}
          min={0}
          max={64}
          step={2}
          suffix="px"
          onChange={(v) => setAnim("distance", v)}
        />
        <div className="field" style={{ marginTop: "0.75rem" }}>
          <label>缓动曲线</label>
          <select
            className="select"
            value={theme.animation.ease}
            onChange={(e) => setAnim("ease", e.target.value)}
          >
            {EASE_PRESETS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}

function Range({
  label,
  value,
  min,
  max,
  step,
  suffix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="row">
      <span className="label" style={{ minWidth: 72 }}>
        {label}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <span className="range-val">
        {value}
        {suffix}
      </span>
    </div>
  );
}

// Coerce arbitrary CSS color to a hex the native color input accepts.
function normalizeHex(c: string): string {
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c)) return c;
  return "#000000";
}
