import { useEffect, useState, useCallback } from "react";
import type { SiteConfig } from "../../lib/config-types";
import ContentManager from "./ContentManager";
import AppearanceEditor from "./AppearanceEditor";
import LayoutBuilder from "./LayoutBuilder";
import ContentSettings from "./ContentSettings";

type Tab = "content" | "appearance" | "layout" | "settings";

export default function StudioApp({ githubConfigured }: { githubConfigured: boolean }) {
  const [tab, setTab] = useState<Tab>("content");
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((d: { ok: boolean; config?: SiteConfig }) => {
        if (d.ok && d.config) setConfig(d.config);
      });
  }, []);

  const update = useCallback((next: SiteConfig) => {
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
        body: JSON.stringify({ config }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
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

  const titles: Record<Tab, { h: string; s: string }> = {
    content: { h: "内容", s: "管理文章与作品，保存即提交到 GitHub" },
    appearance: { h: "外观", s: "配色、字体、字号与动画——全部可视化调节" },
    layout: { h: "布局", s: "拖拽排序首页区块，添加预设组件" },
    settings: { h: "站点设置", s: "标题、导航、个人信息与页脚" },
  };

  return (
    <div className="studio-shell">
      <aside className="studio-side">
        <div className="studio-brand">Atelier</div>
        <button
          className={`nav-item ${tab === "content" ? "active" : ""}`}
          onClick={() => setTab("content")}
        >
          内容
        </button>
        <button
          className={`nav-item ${tab === "appearance" ? "active" : ""}`}
          onClick={() => setTab("appearance")}
        >
          外观
        </button>
        <button
          className={`nav-item ${tab === "layout" ? "active" : ""}`}
          onClick={() => setTab("layout")}
        >
          布局
        </button>
        <button
          className={`nav-item ${tab === "settings" ? "active" : ""}`}
          onClick={() => setTab("settings")}
        >
          站点设置
        </button>
        <div style={{ flex: 1 }} />
        <a className="nav-item" href="/" target="_blank" rel="noreferrer">
          查看网站 ↗
        </a>
        <button className="nav-item" onClick={logout}>
          退出登录
        </button>
      </aside>

      <main className="studio-main">
        <div className="studio-head">
          <div>
            <h2>{titles[tab].h}</h2>
            <div className="sub">{titles[tab].s}</div>
          </div>
          {tab !== "content" && (
            <div className="toolbar">
              {dirty && <span className="hint">有未保存的更改</span>}
              <button
                className="btn btn-primary"
                style={{ width: "auto" }}
                onClick={saveConfig}
                disabled={saving || !dirty}
              >
                {saving ? <span className="spin" /> : "保存并发布"}
              </button>
            </div>
          )}
        </div>

        {!githubConfigured && (
          <div className="banner warn">
            尚未配置 GitHub（GITHUB_TOKEN / GITHUB_REPO）。你可以预览所有更改，但保存时无法提交到仓库。
          </div>
        )}
        {status && <div className={`banner ${status.kind === "ok" ? "ok" : "warn"}`}>{status.msg}</div>}

        {!config ? (
          <div className="hint">正在加载配置…</div>
        ) : (
          <>
            {tab === "content" && <ContentManager githubConfigured={githubConfigured} />}
            {tab === "appearance" && <AppearanceEditor config={config} onChange={update} />}
            {tab === "layout" && <LayoutBuilder config={config} onChange={update} />}
            {tab === "settings" && <ContentSettings config={config} onChange={update} />}
          </>
        )}
      </main>
    </div>
  );
}
