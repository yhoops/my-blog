import { useState } from "react";

export default function LoginForm({ authConfigured }: { authConfigured: boolean }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
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

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <h1>工作室</h1>
        <p>请输入凭据以管理你的站点。</p>

        {!authConfigured && (
          <div className="banner warn">
            尚未配置认证环境变量（ADMIN_USERNAME / ADMIN_PASSWORD / AUTH_SECRET），登录将无法成功。
          </div>
        )}

        <div className="field">
          <label htmlFor="u">用户名</label>
          <input
            id="u"
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="p">密码</label>
          <input
            id="p"
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? <span className="spin" /> : "登录"}
        </button>
        {error && <div className="error-msg">{error}</div>}
      </form>
    </div>
  );
}
