/*
  Shared stock renderer. Reads data/vehicles.json and fills any
  element with [data-stock-mount] on the page. Used identically
  by the homepage and every country page, so one JSON edit
  updates the whole site.

  Mount options:
    data-limit="4"      cap the number of cards shown (omit for all)
    data-include-sold    include vehicles with status "sold" (badged), default hides them
*/
(function () {
  function esc(str) {
    var d = document.createElement('div');
    d.textContent = str == null ? '' : String(str);
    return d.innerHTML;
  }

  function formatPrice(v) {
    if (v === null || v === undefined || v === '') return 'On Request';
    return '£' + Number(v).toLocaleString('en-GB');
  }

  function formatKm(v) {
    if (v === null || v === undefined || v === '') return null;
    return Number(v).toLocaleString('en-GB') + 'km';
  }

  function cardHTML(v) {
    var sold = v.status === 'sold';
    var specs = [v.category].filter(Boolean);
    var km = formatKm(v.km);
    if (km) specs.push(km);
    var specsHTML = specs.map(function (s, i) {
      return (i > 0 ? '<span>&middot;</span>' : '') + '<span>' + esc(s) + '</span>';
    }).join('');

    return (
      '<div class="stock-card' + (sold ? ' is-sold' : '') + '">' +
        '<div class="stock-thumb">' +
          '<img src="' + esc(v.photo) + '" alt="' + esc(v.make + ' ' + v.model) + '" loading="lazy">' +
          (sold ? '<span class="sold-ribbon">Sold</span>' : '') +
        '</div>' +
        '<div class="stock-body">' +
          '<span class="make">' + esc(v.make) + ' &middot; ' + esc(v.model) + '</span>' +
          '<h4>' + esc(v.year ? v.year + ' ' + v.category : v.category) + '</h4>' +
          (specsHTML ? '<div class="specs">' + specsHTML + '</div>' : '') +
          '<p class="desc">' + esc(v.description) + '</p>' +
          '<p class="price tnum">' + formatPrice(v.price) + '</p>' +
        '</div>' +
      '</div>'
    );
  }

  function render(mount, vehicles) {
    var includeSold = mount.hasAttribute('data-include-sold');
    var limit = parseInt(mount.getAttribute('data-limit'), 10);

    var list = vehicles
      .filter(function (v) { return includeSold || v.status !== 'sold'; })
      .sort(function (a, b) { return (b.dateAdded || '').localeCompare(a.dateAdded || ''); });

    if (!isNaN(limit)) list = list.slice(0, limit);

    if (!list.length) {
      mount.innerHTML = '<p style="color:var(--text-soft);font-size:14px;">No stock currently listed &mdash; message us on WhatsApp for what\'s arriving next.</p>';
      return;
    }
    mount.innerHTML = list.map(cardHTML).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var mounts = document.querySelectorAll('[data-stock-mount]');
    if (!mounts.length) return;

    fetch('data/vehicles.json', { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (vehicles) {
        mounts.forEach(function (m) { render(m, vehicles); });
      })
      .catch(function () {
        mounts.forEach(function (m) {
          m.innerHTML = '<p style="color:var(--text-soft);font-size:14px;">Stock listing is temporarily unavailable &mdash; message us on WhatsApp for current availability.</p>';
        });
      });
  });
})();
