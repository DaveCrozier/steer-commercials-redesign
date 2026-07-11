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

**Direct way:** edit `data/vehicles.json` in GitHub's web editor by hand. Each vehicle is one object with `make`, `model`, `category`, `year`, `km`, `price`, `description`, `photo` (path under `img/stock/`), `status` (`"available"` or `"sold"`), and `dateAdded`. Delete an entry to remove it from the site entirely; sold vehicles stay visible with a "Sold" ribbon until removed.

## Notes on country-specific content

Each destination page uses the vocabulary and facts relevant to that market rather than a single shared template:

- **Kenya, Tanzania, Uganda, Zambia & Zimbabwe** drive on the left — UK right-hand-drive stock matches as-is. Copy uses "lorry"/"lorries" alongside "truck," reflecting common East/Southern African usage.
- **Nigeria and Ghana** drive on the right — right-hand-drive imports are restricted by law in both countries (Nigeria since 1973, Ghana under the Customs, Excise and Preventive (Management) Act). Both pages flag this explicitly and describe LHD sourcing/conversion rather than claiming RHD compatibility. Nigeria's copy also reflects local terminology ("Tokunbo," "UK Direct," "Naija-used").

Import age limits and customs rules are hedged throughout ("confirm with your clearing agent") rather than stated as fixed facts, since these change and enforcement varies by port.
