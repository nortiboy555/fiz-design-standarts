/**
 * URL Validator with SSRF Protection
 *
 * APP_MODE env variable:
 * - "LOCAL" = no restrictions (for development)
 * - "PUBLIC" = block internal IPs (for production)
 */

const APP_MODE = process.env.APP_MODE || "PUBLIC"; // Default to secure

/**
 * Check if URL is safe to fetch (prevents SSRF attacks in PUBLIC mode)
 */
export function isValidExternalUrl(urlString: string): { valid: boolean; error?: string } {
  // In LOCAL mode, allow everything
  if (APP_MODE === "LOCAL") {
    try {
      new URL(urlString);
      return { valid: true };
    } catch {
      return { valid: false, error: "Invalid URL format" };
    }
  }

  // PUBLIC mode - apply SSRF protection
  try {
    const url = new URL(urlString);

    // Only allow http/https protocols
    if (!["http:", "https:"].includes(url.protocol)) {
      return { valid: false, error: "Only HTTP/HTTPS URLs are allowed" };
    }

    const hostname = url.hostname.toLowerCase();

    // Block internal/private IP patterns
    const blockedPatterns = [
      { pattern: /^localhost$/, reason: "localhost" },
      { pattern: /^127\./, reason: "loopback address" },
      { pattern: /^10\./, reason: "private network (10.x.x.x)" },
      { pattern: /^192\.168\./, reason: "private network (192.168.x.x)" },
      { pattern: /^172\.(1[6-9]|2[0-9]|3[01])\./, reason: "private network (172.16-31.x.x)" },
      { pattern: /^169\.254\./, reason: "link-local/AWS metadata" },
      { pattern: /^0\./, reason: "invalid address" },
      { pattern: /^\[::1\]$/, reason: "IPv6 localhost" },
      { pattern: /^\[fc/, reason: "IPv6 private" },
      { pattern: /^\[fd/, reason: "IPv6 private" },
      { pattern: /^\[fe80:/, reason: "IPv6 link-local" },
    ];

    for (const { pattern, reason } of blockedPatterns) {
      if (pattern.test(hostname)) {
        return { valid: false, error: `Blocked: ${reason}` };
      }
    }

    return { valid: true };
  } catch {
    return { valid: false, error: "Invalid URL format" };
  }
}

/**
 * Fetch URL with timeout and SSRF protection
 */
export async function safeFetch(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 10000
): Promise<Response> {
  // Validate URL first
  const validation = isValidExternalUrl(url);
  if (!validation.valid) {
    throw new Error(validation.error || "Invalid URL");
  }

  // Add timeout
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}
