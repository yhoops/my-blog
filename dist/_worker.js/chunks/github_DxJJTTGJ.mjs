globalThis.process ??= {}; globalThis.process.env ??= {};
const API = "https://api.github.com";
function headers(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "User-Agent": "atelier-cms",
    "X-GitHub-Api-Version": "2022-11-28"
  };
}
function toBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  const chunk = 32768;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}
function readGitHubEnv(env = {}) {
  const pe = typeof process !== "undefined" ? process.env : {};
  return {
    GITHUB_TOKEN: env.GITHUB_TOKEN ?? pe.GITHUB_TOKEN,
    GITHUB_REPO: env.GITHUB_REPO ?? pe.GITHUB_REPO,
    GITHUB_BRANCH: env.GITHUB_BRANCH ?? pe.GITHUB_BRANCH ?? "main"
  };
}
function isConfigured(env) {
  return Boolean(env.GITHUB_TOKEN && env.GITHUB_REPO);
}
async function getFileSha(env, path) {
  const branch = env.GITHUB_BRANCH || "main";
  const url = `${API}/repos/${env.GITHUB_REPO}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}?ref=${branch}`;
  const res = await fetch(url, { headers: headers(env.GITHUB_TOKEN) });
  if (res.status === 200) {
    const data = await res.json();
    return data.sha;
  }
  return null;
}
async function commitFile(env, path, content, message) {
  if (!isConfigured(env)) {
    return { ok: false, status: 500, message: "GitHub 未配置：请设置 GITHUB_TOKEN 与 GITHUB_REPO" };
  }
  const branch = env.GITHUB_BRANCH || "main";
  const sha = await getFileSha(env, path);
  const url = `${API}/repos/${env.GITHUB_REPO}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}`;
  const body = {
    message,
    content: toBase64(content),
    branch
  };
  if (sha) body.sha = sha;
  const res = await fetch(url, {
    method: "PUT",
    headers: headers(env.GITHUB_TOKEN),
    body: JSON.stringify(body)
  });
  if (res.ok) {
    const data = await res.json();
    return { ok: true, status: res.status, commitUrl: data.commit?.html_url };
  }
  const text = await res.text();
  return { ok: false, status: res.status, message: text };
}
async function deleteFile(env, path, message) {
  if (!isConfigured(env)) {
    return { ok: false, status: 500, message: "GitHub 未配置" };
  }
  const branch = env.GITHUB_BRANCH || "main";
  const sha = await getFileSha(env, path);
  if (!sha) return { ok: false, status: 404, message: "文件不存在" };
  const url = `${API}/repos/${env.GITHUB_REPO}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: headers(env.GITHUB_TOKEN),
    body: JSON.stringify({ message, sha, branch })
  });
  return { ok: res.ok, status: res.status, message: res.ok ? void 0 : await res.text() };
}

export { commitFile as c, deleteFile as d, isConfigured as i, readGitHubEnv as r };
