# Deploying I44 Hotels to Cloudflare

A step-by-step guide to put the site live on Cloudflare, point it at
`i44hotels.com`, see updated layout/components after each change, and make the
contact form deliver email through Resend.

This project deploys as a **Cloudflare Worker** using the OpenNext adapter
(`@opennextjs/cloudflare`). The worker is named `i44hotels` (see
[wrangler.jsonc](./wrangler.jsonc)). There is no separate booking engine; the
only server feature that needs configuration is the contact/inquiry form.

---

## 0. Prerequisites

- Node.js 20+ and npm installed.
- This repo cloned locally, with `npm install` run once.
- A Cloudflare account with `i44hotels.com` added as a zone (its nameservers
  already point to Cloudflare). You said this is done.
- A free Resend account (https://resend.com) for the contact form email.
- Optional: a Cloudflare Turnstile widget (free) to block form spam.

---

## 1. Deploy the site to Cloudflare

### 1.1 Install dependencies

    npm install

### 1.2 Sign in to Cloudflare from the CLI (first time only)

    npx wrangler login

This opens a browser to authorize Wrangler with your Cloudflare account.

### 1.3 (Optional) Preview the real Cloudflare build locally

    npm run preview

This builds with OpenNext and serves the worker on the Cloudflare runtime
locally (typically http://localhost:8787). It catches runtime issues that the
plain dev server does not. For fast everyday iteration use `npm run dev`
instead (standard Next.js dev server at http://localhost:3000).

### 1.4 Deploy

    npm run deploy

This runs `opennextjs-cloudflare build && opennextjs-cloudflare deploy`, uploads
the `i44hotels` worker, and prints a `https://i44hotels.<your-subdomain>.workers.dev`
URL. Open that URL to confirm the site is live.

### 1.5 Connect your custom domain

In the dashboard: **Workers & Pages -> `i44hotels` -> Settings -> Domains &
Routes -> Add -> Custom Domain**, then add both:

- `i44hotels.com`
- `www.i44hotels.com`

Cloudflare creates the proxied DNS records for you automatically and issues the
SSL certificate (usually ready within a couple of minutes). You do **not** add
A/AAAA records by hand for a Worker.

### 1.6 Redirect www to the apex

The canonical URL is `https://i44hotels.com` (no www). Create a redirect so the
two do not split traffic:

**Rules -> Redirect Rules -> Create rule:**

- If: hostname equals `www.i44hotels.com`
- Then: 301 redirect to `https://i44hotels.com/${http.request.uri.path}`

---

## 2. Environment variables and secrets

The contact form and anti-spam checks are driven entirely by environment
variables (documented in [.env.example](./.env.example)). Nothing is hard-coded.

### Build-time vs runtime (important)

- **`NEXT_PUBLIC_*` values are baked in at BUILD time.** They must be present
  when you run `npm run deploy` (i.e. in your local `.env.local`, or in your CI
  build environment). Setting them only as a Worker secret will NOT work.
- **All other values are read at RUNTIME by the worker.** They must be set as
  Worker Variables/Secrets in production, and in `.dev.vars` for local preview.

### The variables

| Variable | Read at | Purpose |
|----------|---------|---------|
| `RESEND_API_KEY` | runtime | Resend API key that sends the email |
| `INQUIRY_FROM_EMAIL` | runtime | Verified sender, e.g. `I44 Hotels <inquiries@send.i44hotels.com>` |
| `INQUIRY_TO_EMAIL` | runtime | Where contact messages are delivered (your inbox) |
| `FORM_SECRET` | runtime | Random string used to sign the form anti-bot token |
| `TURNSTILE_SECRET_KEY` | runtime | Turnstile secret (optional; skipped if unset) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | build | Turnstile public site key (optional) |

Generate a `FORM_SECRET` with:

    openssl rand -hex 32

### 2.1 Local files

- `.env.local` - used by `npm run dev`, and supplies `NEXT_PUBLIC_*` at build
  time for `npm run deploy`. Copy [.env.example](./.env.example) and fill it in.
- `.dev.vars` - used by `npm run preview` (the Cloudflare runtime locally). Put
  the runtime variables here.

Both files are gitignored. Never commit real keys.

### 2.2 Production secrets

Pick either method.

**Dashboard:** Workers & Pages -> `i44hotels` -> Settings -> Variables and
Secrets -> add each one. Use the **Secret** type for keys (not plain text).

**CLI** (secrets persist across deploys):

    npx wrangler secret put RESEND_API_KEY
    npx wrangler secret put INQUIRY_FROM_EMAIL
    npx wrangler secret put INQUIRY_TO_EMAIL
    npx wrangler secret put FORM_SECRET
    npx wrangler secret put TURNSTILE_SECRET_KEY

Remember: `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is build-time, so it belongs in
`.env.local` (or the CI build env), not in Worker secrets.

> Heads-up: the form is built so that if Resend is not configured, it still
> shows "message sent" but delivers nothing (a dev convenience). So in
> production you must set `RESEND_API_KEY`, `INQUIRY_FROM_EMAIL`, and
> `INQUIRY_TO_EMAIL` or no mail is sent.

---

## 3. Resend setup (sending the contact form)

### 3.1 Create an API key

Resend dashboard -> API Keys -> Create. Copy it into `RESEND_API_KEY`.

### 3.2 Add and verify the sending domain

Resend -> Domains -> Add Domain -> enter **`send.i44hotels.com`**.

Use a subdomain (`send.`) rather than the bare root. This keeps Resend's SPF
record separate from Cloudflare Email Routing's SPF (section 4, Option B), so
the two never collide.

Resend then shows the exact DNS records to add. In Cloudflare go to **DNS ->
Records** and add each one, all set to **DNS only (grey cloud, not proxied)**.
They look like this (copy the real values from Resend, do not retype these):

| Name | Type | Value (example) | Proxy |
|------|------|-----------------|-------|
| `send` | MX | `feedback-smtp.us-east-1.amazonses.com` (priority 10) | DNS only |
| `send` | TXT | `v=spf1 include:amazonses.com ~all` | DNS only |
| `resend._domainkey.send` | TXT | `p=MIGfMA0...` (long DKIM key) | DNS only |
| `_dmarc` | TXT | `v=DMARC1; p=none;` (optional, recommended) | DNS only |

Click **Verify** in Resend. Once it goes green, set:

    INQUIRY_FROM_EMAIL = "I44 Hotels <inquiries@send.i44hotels.com>"

---

## 4. Where contact messages land (email redirect)

`INQUIRY_TO_EMAIL` decides the recipient. Choose one option.

### Option A - send straight to an existing inbox (simplest)

Set `INQUIRY_TO_EMAIL` to any inbox you already read (Gmail, Outlook, a business
mailbox). Nothing else to configure. This is the fastest path.

    INQUIRY_TO_EMAIL = "youraddress@gmail.com"

### Option B - use a `@i44hotels.com` address and forward it

If you want messages to go to, say, `frontdesk@i44hotels.com` and land in your
real inbox, enable **Cloudflare Email Routing**:

1. Dashboard -> your domain -> **Email -> Email Routing -> Enable**. Cloudflare
   automatically adds the required MX and SPF records for you:

   | Name | Type | Value |
   |------|------|-------|
   | `i44hotels.com` | MX | `route1.mx.cloudflare.net`, `route2.mx.cloudflare.net`, `route3.mx.cloudflare.net` |
   | `i44hotels.com` | TXT | `v=spf1 include:_spf.mx.cloudflare.net ~all` |

2. Add and verify a **destination address** (your real inbox) via the
   confirmation email Cloudflare sends.
3. Create a route: `frontdesk@i44hotels.com` -> forward to your inbox.
4. Set `INQUIRY_TO_EMAIL = "frontdesk@i44hotels.com"`.

Note: Email Routing handles **receiving** mail at your domain. It is separate
from Resend, which **sends** the form. They coexist fine because Resend lives on
the `send.` subdomain.

---

## 5. Turnstile (optional anti-spam)

The form works without this; the bot check is simply skipped when unset. To
enable it:

1. Dashboard -> **Turnstile -> Add widget** for `i44hotels.com`.
2. Copy the **Site key** into `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (in `.env.local`,
   because it is build-time).
3. Copy the **Secret key** into `TURNSTILE_SECRET_KEY` (Worker secret).
4. Rebuild and redeploy so the site key is baked in: `npm run deploy`.

---

## 6. Seeing updated layout/components after you change code

### Option A - deploy manually from your machine

After any change:

    npm run deploy

Then refresh `https://i44hotels.com`. OpenNext fingerprints static assets, so a
new build serves fresh files; if you still see something stale, hard-refresh
the browser.

### Option B - auto-deploy on git push (recommended for ongoing work)

Connect the GitHub repo so Cloudflare builds and deploys on every push:

1. Dashboard -> Workers & Pages -> **Create -> Workers -> Connect to Git** and
   select this repository.
2. Set the commands:
   - Build command: `npx opennextjs-cloudflare build`
   - Deploy command: `npx opennextjs-cloudflare deploy`
3. Add the same environment variables and secrets from section 2 in the
   project's settings (both the build environment, for `NEXT_PUBLIC_*`, and the
   runtime secrets).

Now every push to `main` triggers a build, and the live site updates in a
couple of minutes. Use a feature branch or `npm run preview` to check changes
before they reach production.

---

## 7. DNS records at a glance

| Purpose | Name | Type | Value | Proxy | Who adds it |
|---------|------|------|-------|-------|-------------|
| App (apex) | `i44hotels.com` | managed | the `i44hotels` Worker | Proxied | Auto (Add Custom Domain) |
| App (www) | `www` | managed | the `i44hotels` Worker | Proxied | Auto (Add Custom Domain) |
| Form sending | `send` | MX | from Resend | DNS only | You |
| Form sending | `send` | TXT (SPF) | from Resend | DNS only | You |
| Form sending | `resend._domainkey.send` | TXT (DKIM) | from Resend | DNS only | You |
| Form sending | `_dmarc` | TXT (DMARC, optional) | `v=DMARC1; p=none;` | DNS only | You |
| Receiving (Option B) | `i44hotels.com` | MX x3 | Cloudflare Email Routing | DNS only | Auto (Enable Email Routing) |
| Receiving (Option B) | `i44hotels.com` | TXT (SPF) | Cloudflare Email Routing | DNS only | Auto (Enable Email Routing) |

All email records must be **DNS only (grey cloud)**. Only the app records are
proxied (orange cloud).

---

## 8. Troubleshooting

- **Form says "sent" but no email arrives.** Runtime env vars are missing. Set
  `RESEND_API_KEY`, `INQUIRY_FROM_EMAIL`, and `INQUIRY_TO_EMAIL` as Worker
  secrets, then redeploy.
- **Emails go to spam or bounce.** The sending domain is not verified in Resend,
  a DNS record is proxied (must be grey cloud), or DKIM has not propagated yet.
  Re-check the records and click Verify again.
- **SPF conflict.** You can only have one SPF (`v=spf1 ...`) record per name.
  This is why Resend uses the `send.` subdomain and Email Routing uses the root.
  Do not put two SPF records on the same hostname.
- **Site will not load right after adding the domain.** SSL can take a few
  minutes to issue. Wait, then retry.
- **Changes are not visible.** Redeploy (`npm run deploy`), or confirm the Git
  build succeeded, then hard-refresh the browser.
- **`NEXT_PUBLIC_*` value is empty in production.** It was not present at build
  time. Put it in `.env.local` (local deploy) or the CI build environment, then
  rebuild.
