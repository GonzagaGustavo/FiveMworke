export type PackageManager = "npm" | "pnpm" | "yarn";

export function getPackageManager(): PackageManager {
  const userAgent = process.env.npm_config_user_agent;

  if (userAgent) {
    if (userAgent.startsWith("yarn")) {
      return "yarn";
    } else if (userAgent.startsWith("pnpm")) {
      return "pnpm";
    } else {
      return "npm";
    }
  } else {
    return "npm";
  }
}
