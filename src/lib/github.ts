// GitHub Contents API helper — commits files (posts, config) directly to the repo.
// On Cloudflare Pages, env vars come from `locals.runtime.env`. We accept an env object.

export interface GitHubEnv {
  GITHUB_TOKEN?: string;
  GITHUB_REPO?: string; // "owner/name"
  GITHUB_BRANCH?: string; // defaults to "main"
}

export interface GitHubResult {
  ok: boolean;
  status: number;
  message?: string;
  commitUrl?: string;
}

const API = "https://api.github.com";

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "User-Agent": "atelier-cms",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

// Base64 encode UTF-8 safely (works in Workers/edge runtime, no Buffer).
function toBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export function readGitHubEnv(env: Record<string, unknown> = {}): GitHubEnv {
  // Support both Cloudflare runtime env and process.env (dev).
  const pe = typeof process !== "undefined" ? process.env : {};
  return {
    GITHUB_TOKEN: (env.GITHUB_TOKEN as string) ?? pe.GITHUB_TOKEN,
    GITHUB_REPO: (env.GITHUB_REPO as string) ?? pe.GITHUB_REPO,
    GITHUB_BRANCH: (env.GITHUB_BRANCH as string) ?? pe.GITHUB_BRANCH ?? "main",
  };
}

export function isConfigured(env: GitHubEnv): boolean {
  return Boolean(env.GITHUB_TOKEN && env.GITHUB_REPO);
}

// Get the current SHA of a file (needed to update existing files), or null if new.
async function getFileSha(env: GitHubEnv, path: string): Promise<string | null> {
  const branch = env.GITHUB_BRANCH || "main";
  const url = `${API}/repos/${env.GITHUB_REPO}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}?ref=${branch}`;
  const res = await fetch(url, { headers: headers(env.GITHUB_TOKEN!) });
  if (res.status === 200) {
    const data = (await res.json()) as { sha: string };
    return data.sha;
  }
  return null;
}

export async function commitFile(
  env: GitHubEnv,
  path: string,
  content: string,
  message: string,
): Promise<GitHubResult> {
  if (!isConfigured(env)) {
    return { ok: false, status: 500, message: "GitHub 未配置：请设置 GITHUB_TOKEN 与 GITHUB_REPO" };
  }
  const branch = env.GITHUB_BRANCH || "main";
  const sha = await getFileSha(env, path);
  const url = `${API}/repos/${env.GITHUB_REPO}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}`;
  const body: Record<string, unknown> = {
    message,
    content: toBase64(content),
    branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: headers(env.GITHUB_TOKEN!),
    body: JSON.stringify(body),
  });

  if (res.ok) {
    const data = (await res.json()) as { commit?: { html_url?: string } };
    return { ok: true, status: res.status, commitUrl: data.commit?.html_url };
  }
  const text = await res.text();
  return { ok: false, status: res.status, message: text };
}

export async function deleteFile(
  env: GitHubEnv,
  path: string,
  message: string,
): Promise<GitHubResult> {
  if (!isConfigured(env)) {
    return { ok: false, status: 500, message: "GitHub 未配置" };
  }
  const branch = env.GITHUB_BRANCH || "main";
  const sha = await getFileSha(env, path);
  if (!sha) return { ok: false, status: 404, message: "文件不存在" };
  const url = `${API}/repos/${env.GITHUB_REPO}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: headers(env.GITHUB_TOKEN!),
    body: JSON.stringify({ message, sha, branch }),
  });
  return { ok: res.ok, status: res.status, message: res.ok ? undefined : await res.text() };
}
