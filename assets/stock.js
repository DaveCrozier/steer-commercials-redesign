/*
  Shared stock renderer. Reads data/vehicles.json and fills any
  element with [data-stock-mount] on the page. Used identically
  by the homepage and every country page, so one JSON edit
  updates the whole site. Each card carries its own photo
  carousel driven by that vehicle's `photos` array.

  Mount options:
    data-limit="4"       cap the number of cards shown (omit for all)
    data-include-sold     include vehicles with status "sold" (badged), default hides them
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

  function specRow(v) {
    var parts = [];
    if (v.year) parts.push(v.year);
    var km = formatKm(v.km);
    if (km) parts.push(km);
    if (v.engineSize) parts.push(v.engineSize);
    if (v.axleConfig) parts.push(v.axleConfig);
    return parts;
  }

  function cardHTML(v) {
    var sold = v.status === 'sold';
    var photos = (v.photos && v.photos.length) ? v.photos : (v.photo ? [v.photo] : []);
    var specs = specRow(v);
    var specsHTML = specs.map(function (s, i) {
      return (i > 0 ? '<span>&middot;</span>' : '') + '<span>' + esc(s) + '</span>';
    }).join('');

    var dotsHTML = photos.length > 1
      ? '<div class="carousel-dots">' + photos.map(function (_, i) {
          return '<span class="dot' + (i === 0 ? ' active' : '') + '" data-idx="' + i + '"></span>';
        }).join('') + '</div>'
      : '';

    var arrowsHTML = photos.length > 1
      ? '<button type="button" class="carousel-arrow prev" aria-label="Previous photo">&#8249;</button>' +
        '<button type="button" class="carousel-arrow next" aria-label="Next photo">&#8250;</button>'
      : '';

    return (
      '<div class="stock-card' + (sold ? ' is-sold' : '') + '" data-vehicle-id="' + esc(v.id) + '">' +
        '<div class="stock-thumb" data-carousel data-index="0">' +
          photos.map(function (p, i) {
            return '<img src="' + esc(p) + '" alt="' + esc(v.make + ' ' + v.model) + '" loading="lazy" class="' + (i === 0 ? 'active' : '') + '" data-idx="' + i + '">';
          }).join('') +
          arrowsHTML +
          dotsHTML +
          (sold ? '<span class="sold-ribbon">Sold</span>' : '') +
        '</div>' +
        '<div class="stock-body">' +
          '<span class="make">' + esc(v.make) + ' &middot; ' + esc(v.model) + '</span>' +
          '<h4>' + esc(v.category) + '</h4>' +
          (specsHTML ? '<div class="specs">' + specsHTML + '</div>' : '') +
          '<p class="desc">' + esc(v.description) + '</p>' +
          '<p class="price tnum">' + formatPrice(v.price) + '</p>' +
        '</div>' +
      '</div>'
    );
  }

  function wireCarousels(mount) {
    mount.querySelectorAll('[data-carousel]').forEach(function (thumb) {
      var imgs = thumb.querySelectorAll('img');
      var dots = thumb.querySelectorAll('.dot');
      if (imgs.length < 2) return;

      function show(idx) {
        idx = (idx + imgs.length) % imgs.length;
        imgs.forEach(function (img) { img.classList.toggle('active', +img.getAttribute('data-idx') === idx); });
        dots.forEach(function (d) { d.classList.toggle('active', +d.getAttribute('data-idx') === idx); });
        thumb.setAttribute('data-index', idx);
      }

      var prev = thumb.querySelector('.carousel-arrow.prev');
      var next = thumb.querySelector('.carousel-arrow.next');
      if (prev) prev.addEventListener('click', function (e) { e.preventDefault(); show(+thumb.getAttribute('data-index') - 1); });
      if (next) next.addEventListener('click', function (e) { e.preventDefault(); show(+thumb.getAttribute('data-index') + 1); });
      dots.forEach(function (d) {
        d.addEventListener('click', function (e) { e.preventDefault(); show(+d.getAttribute('data-idx')); });
      });
    });
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
    wireCarousels(mount);
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
