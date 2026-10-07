(function () {
  var btn = document.querySelector('.menu-btn'), nav = document.getElementById('nav');
  function setMenu(open) { nav.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); }
  btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); btn.focus(); } });

  var today = new Date().toISOString().slice(0, 10);
  document.querySelectorAll('input[type=date]').forEach(function (d) { d.min = today; });

  function setError(field, text) {
    var err = document.getElementById('e-' + field.name);
    if (err) err.textContent = text;
    field.setAttribute('aria-invalid', text ? 'true' : 'false');
    if (err) field.setAttribute('aria-describedby', err.id);
    return !text;
  }
  function check(f, rules) {
    var ok = true, first = null;
    rules.forEach(function (r) {
      var field = f.elements[r[0]], msg = r[1](field.value.trim());
      if (!setError(field, msg)) { ok = false; first = first || field; }
    });
    if (first) first.focus();
    return ok;
  }
  var req = function (label) { return function (v) { return v ? '' : label + ' is required.'; }; };
  var dates = function (f) { return function (v) {
    if (!v) return 'Check-out date is required.';
    return f.elements.in.value && v < f.elements.in.value ? 'Check-out cannot be before check-in.' : '';
  }; };
  var guests = function (v) { return v && Number(v) >= 1 && Number.isInteger(Number(v)) ? '' : 'Enter at least 1 guest.'; };

  function showMessage(form, text) {
    var m = form.querySelector('.msg'); m.textContent = text;
  }

  var av = document.getElementById('availForm');
  av.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = av.querySelector('.msg'); msg.textContent = '';
    var i = av.elements.in.value, o = av.elements.out.value, g = Number(av.elements.guests.value);
    if (!i || !o || !av.elements.room.value || !(g >= 1)) { msg.textContent = 'Please complete all fields to check availability.'; msg.style.color = '#9b2c2c'; return; }
    if (o < i) { msg.textContent = 'Check-out cannot be before check-in.'; msg.style.color = '#9b2c2c'; return; }
    msg.style.color = ''; showMessage(av, "Thanks! Your availability request has been received. We'll confirm the available options shortly.");
  });

  var form = document.getElementById('stayForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    showMessage(form, '');
    var ok = check(form, [
      ['name', req('Full name')],
      ['phone', function (v) { return /^\+?[\d\s-]{10,15}$/.test(v) ? '' : 'Enter a valid phone number.'; }],
      ['email', function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.'; }],
      ['guests', guests],
      ['in', req('Check-in date')],
      ['out', dates(form)],
      ['room', req('Room preference')]
    ]);
    if (ok) { showMessage(form, "Thank you! Your stay inquiry has been received. We'll contact you shortly to confirm availability."); form.reset(); }
  });

  document.querySelectorAll('[data-room]').forEach(function (a) {
    a.addEventListener('click', function () { form.elements.room.value = a.dataset.room; });
  });
})();
