# Steer Commercials

Website for [Steer Commercials Sales & Exports Ltd](https://www.steercommercials.com/) — a UK truck exporter based in Sheffield, serving customers across East, West and Southern Africa.

**Live site:** https://davecrozier.github.io/steer-commercials-redesign/

## Pages

- `index.html` — homepage
- `export-kenya.html`, `export-tanzania.html`, `export-uganda.html`, `export-zambia.html` — East/Southern Africa destinations (RHD stock, matches local traffic)
- `export-nigeria.html`, `export-ghana.html` — West Africa destinations (right-hand traffic; LHD sourcing/conversion required)
- `guide-roro-vs-container.html` — buyer's guide: RoRo vs container shipping
- `guide-european-vs-japanese-trucks.html` — buyer's guide: European vs Japanese trucks
- `admin.html` — stock manager (not linked publicly; bookmark the direct URL)

## Managing stock

Every page's "Latest Stock" / "Available Now" section pulls live from **`data/vehicles.json`** via `assets/stock.js` — there is one shared inventory list, not separate copies per page, so editing it once updates the whole site.

**Easiest way — the Stock Manager:** open `admin.html` directly (e.g. `https://davecrozier.github.io/steer-commercials-redesign/admin.html`). Add a vehicle, mark one sold, or delete one, then use the **Publish** panel at the bottom: copy the JSON, click **Open GitHub Editor**, paste over the existing file content, and commit. The live site updates within about a minute. Nothing saves until that last step — the admin page itself has no backend, so publishing always goes through GitHub, and only people with write access to this repo can actually change what's live.

**Direct way:** edit `data/vehicles.json` in GitHub's web editor by hand. Each vehicle is one object with:

| Field | Notes |
|---|---|
| `make`, `model`, `category` | `category` is one of Tractor Unit / Rigid / Tipper / Trailer / Miscellaneous |
| `year`, `km` | `km` can be `null` for trailers |
| `engineSize`, `transmission`, `axleConfig` | optional — leave `null` if not known, don't guess |
| `price` | `null` renders as "On Request" |
| `description` | free text |
| `photos` | array of paths under `img/stock/`, first one is the cover photo — each vehicle card carries a mini carousel through all of them |
| `status` | `"available"` or `"sold"` — sold vehicles stay visible with a "Sold" ribbon until you delete the entry |
| `dateAdded` | drives sort order, newest first |

Delete an entry to remove it from the site entirely.

**From a WhatsApp forward:** the Stock Manager's "Quick Parse from WhatsApp" box does simple text matching (year, mileage, price) on a pasted message and drops the rest into the description field — it's a typing shortcut, not real extraction, so always check what it picked before saving. See the note on further WhatsApp automation below.

## WhatsApp Business — options for further automation

The owner already runs stock updates through WhatsApp Business. A fully automated pipeline (new stock arrives in WhatsApp → AI reads the photo and message → listing appears on the site) is possible but needs infrastructure this static GitHub Pages site doesn't have on its own — a WhatsApp Business API connection, somewhere to receive that webhook, and an AI call to extract structured data from the photo and caption. Roughly, in order of effort:

1. **Manual-assisted (live today)** — forward stock messages to yourself, use the Quick Parse box above to speed up data entry.
2. **Semi-automated** — a small serverless function (e.g. Cloudflare Workers, Vercel) receives WhatsApp Business API messages, calls an AI vision model to draft the listing, and opens it as a pull request for a human to approve before it merges.
3. **Fully automated** — the same pipeline auto-commits without review. Fastest, but any misread price or spec goes live immediately.

Options 2 and 3 need a Meta WhatsApp Business API connection (or a provider like Twilio/360dialog) and a small hosting account — real ongoing setup and small running costs, not a one-time build. Worth doing once the manual workflow feels like the actual bottleneck, not before.

## Notes on country-specific content

Each destination page uses the vocabulary and facts relevant to that market rather than a single shared template:

- **Kenya, Tanzania, Uganda, Zambia & Zimbabwe** drive on the left — UK right-hand-drive stock matches as-is. Copy uses "lorry"/"lorries" alongside "truck," reflecting common East/Southern African usage.
- **Nigeria and Ghana** drive on the right — right-hand-drive imports are restricted by law in both countries (Nigeria since 1973, Ghana under the Customs, Excise and Preventive (Management) Act). Both pages flag this explicitly and describe LHD sourcing/conversion rather than claiming RHD compatibility. Nigeria's copy also reflects local terminology ("Tokunbo," "UK Direct," "Naija-used").

Import age limits and customs rules are hedged throughout ("confirm with your clearing agent") rather than stated as fixed facts, since these change and enforcement varies by port.
