# CloudMigrate.in

Marketing site and sales tooling for CloudMigrate — a multi-cloud practice covering **Sales, Assessment, Migration, Delivery & Managed Services, Security Assessment and POCs** across **AWS, Microsoft Azure, Google Cloud, JioCloud and OCI**.

It includes the **Azure Partner Funding Advisor** (`/clouds/azure/sales`), which tells Azure sellers which Microsoft FY27 partner programmes fund a deal, and 44 downloadable templates (migration handbooks, checklists, workbooks, runbooks, POC charters).

Built with Next.js 16 (App Router, statically generated), React 19 and TypeScript. No database, no backend, no third-party services.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. `npm run build` validates the incentive data, then builds the production site.

## Deploy to Vercel with your domain

1. Push this folder to a GitHub repository.
2. In Vercel → **Add New → Project**, import the repository. The Next.js preset is detected automatically; no settings need changing.
3. **Protect the Funding Advisor (recommended).** In Project → Settings → Environment Variables add `ADVISOR_PASSWORD` (and optionally `ADVISOR_USER`). Visitors to `/clouds/azure/sales` then get a browser login prompt. The incentive terms it summarises are marked *Microsoft Confidential — shared subject to partner agreements*; keep them behind a password unless you have confirmed you may publish them.
4. Project → Settings → Domains → add `cloudmigrate.in` and `www.cloudmigrate.in`, then create the DNS records Vercel shows at your registrar (an `A` record for the apex, a `CNAME` for `www`).
5. Every push to `main` redeploys automatically.

## Project map

| Path | What it holds |
| --- | --- |
| `src/content/site.ts` | Brand, contact email, cloud and service metadata |
| `src/content/clouds/*.ts` | The write-up for every cloud × service page |
| `src/data/incentives/*.json` | FY27 Microsoft programme data used by the advisor |
| `src/data/catalog/azure-services.json` | 190 Azure services, tagged to the incentive workloads they count toward |
| `src/lib/advisor/*.ts` | Eligibility and payout engines (Azure ACR; seat-based Modern Work / Security / BizApps) |
| `src/components/advisor/*` | Funding Advisor UI |
| `scripts/artefacts/` | Python generator for the downloadable templates |
| `public/downloads/<cloud>/` | Generated `.xlsx` / `.docx` templates |
| `public/logos/` | Vendor logos (from the CC0 SVG Logos collection; Jio mark drawn locally) |
| `src/proxy.ts` | Optional password gate for the advisor |

## Updating when Microsoft publishes a new incentives guide

The advisor reads everything from `src/data/incentives/*.json`, so a new guide edition means editing data, not code — unless Microsoft adds a new *kind* of programme.

1. Extract the new PDF to page-indexed text (the output folder is git-ignored):

   ```bash
   pip install pymupdf
   python3 scripts/extract-guide-text.py "path/to/new-guide.pdf" --toc
   python3 scripts/extract-guide-text.py "path/to/new-guide.pdf" scripts/.guide-text/cpi.txt
   ```

2. For each programme in `azure.json` and `modern-work.json`, compare sizes, payouts, partner eligibility, customer criteria, POE and page numbers (`source.pages`) with the new text. Add or retire programmes as needed.
3. Update `meta.json`: edition, investment term, `lastReviewed`, and any conflicts between the documents under `discrepancies`.
4. `npm run validate:data` then `npm run build`. The validator catches unknown credentials, missing market payouts, out-of-order bands and broken links between programmes.
5. Commit and push — Vercel redeploys.

If you use Claude Code, open this folder and say *"update the funding advisor from these new guides"* with the PDFs attached; `CLAUDE.md` tells it how.

## Regenerating the templates

```bash
python3 -m venv .venv
.venv/bin/pip install -r scripts/artefacts/requirements.txt
.venv/bin/python scripts/artefacts/build.py
```

Per-cloud tooling lives in `scripts/artefacts/profiles.py`; the template content lives in `build.py`. The script also rewrites `src/data/artefacts.json`, which the site uses to list downloads.

## Notes

- The contact form opens the visitor's email client addressed to `hello@cloudmigrate.in` (set in `src/content/site.ts`); nothing is stored on the site.
- Advisor inputs are remembered per browser (localStorage) for convenience only.
- Vendor names and logos identify the platforms the practice works with; they remain trademarks of their owners.
