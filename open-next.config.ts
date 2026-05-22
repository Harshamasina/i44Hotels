import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// OpenNext → Cloudflare Workers adapter (CLAUDE.md §4).
// Default config is sufficient for Phase 0; caching/R2/KV can be added later.
export default defineCloudflareConfig();
