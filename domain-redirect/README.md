# Old-domain forwarding

Worker: `grits-domain-forwarder`

Routes: `grits.online/*` and `www.grits.online/*`. Responds with HTTP 301 to `https://gritspace.cc`, preserving the path and query string. No database or secret bindings are used.

```sh
npx --yes --package=wrangler@4.160.1 wrangler deploy --config domain-redirect/wrangler.jsonc
```

DNS delegation must point to `felipe.ns.cloudflare.com` and `hope.ns.cloudflare.com`, and apex/www DNS records must be proxied. The Cloudflare zone is currently pending this registrar-level change. Existing email and other subdomain DNS records were checked against the Cloudflare nameserver and match.

The temporary workers.dev endpoint is enabled for readiness testing. Disable `workers_dev` after the live old-domain redirect has been verified. Do not delete the old Netlify DNS zone while delegation is still there.
