import type { SiteConfig, NavLink } from "../../lib/config-types";

export default function ContentSettings({
  config,
  onChange,
}: {
  config: SiteConfig;
  onChange: (c: SiteConfig) => void;
}) {
  function setMeta(key: keyof SiteConfig["meta"], value: string) {
    onChange({ ...config, meta: { ...config.meta, [key]: value } });
  }
  function setNav(nav: NavLink[]) {
    onChange({ ...config, nav });
  }
  function setSocial(social: { label: string; href: string }[]) {
    onChange({ ...config, social });
  }

  return (
    <>
      <div className="panel">
        <h3>站点信息</h3>
        <div className="field">
          <label>站点标题</label>
          <input className="input" value={config.meta.title} onChange={(e) => setMeta("title", e.target.value)} />
        </div>
        <div className="field">
          <label>站点描述</label>
          <input
            className="input"
            value={config.meta.description}
            onChange={(e) => setMeta("description", e.target.value)}
          />
        </div>
        <div className="grid-2">
          <div className="field">
            <label>作者</label>
            <input className="input" value={config.meta.author} onChange={(e) => setMeta("author", e.target.value)} />
          </div>
          <div className="field">
            <label>站点 URL</label>
            <input className="input" value={config.meta.url} onChange={(e) => setMeta("url", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>导航菜单</h3>
        <PairList
          items={config.nav}
          keyA="label"
          keyB="href"
          labelA="名称"
          labelB="链接"
          onChange={(items) => setNav(items as NavLink[])}
          empty={{ label: "新菜单", href: "/" }}
        />
      </div>

      <div className="panel">
        <h3>社交 / 页脚链接</h3>
        <PairList
          items={config.social}
          keyA="label"
          keyB="href"
          labelA="名称"
          labelB="链接"
          onChange={setSocial}
          empty={{ label: "链接", href: "https://" }}
        />
      </div>
    </>
  );
}

function PairList<T extends Record<string, string>>({
  items,
  keyA,
  keyB,
  labelA,
  labelB,
  onChange,
  empty,
}: {
  items: T[];
  keyA: keyof T;
  keyB: keyof T;
  labelA: string;
  labelB: string;
  onChange: (items: T[]) => void;
  empty: T;
}) {
  function update(i: number, key: keyof T, value: string) {
    const next = items.map((it, idx) => (idx === i ? { ...it, [key]: value } : it));
    onChange(next);
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...items, { ...empty }]);
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
          <input
            className="input"
            style={{ flex: "0 0 30%" }}
            placeholder={labelA}
            value={it[keyA] as string}
            onChange={(e) => update(i, keyA, e.target.value)}
          />
          <input
            className="input"
            placeholder={labelB}
            value={it[keyB] as string}
            onChange={(e) => update(i, keyB, e.target.value)}
          />
          <button className="btn" onClick={() => move(i, -1)} aria-label="上移">
            ↑
          </button>
          <button className="btn" onClick={() => move(i, 1)} aria-label="下移">
            ↓
          </button>
          <button className="btn btn-danger" onClick={() => remove(i)} aria-label="删除">
            ✕
          </button>
        </div>
      ))}
      <button className="btn" onClick={add} style={{ marginTop: "0.5rem" }}>
        + 添加
      </button>
    </>
  );
}
