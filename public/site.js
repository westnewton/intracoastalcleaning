// Mobile menu
const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

// Quote form → Web3Forms (emails the lead to the inbox tied to the access key)
document.querySelectorAll('.quote-form').forEach((form) => {
  const status = form.querySelector('.form-status');
  const btn = form.querySelector('button[type="submit"]');
  const show = (cls, msg) => { status.className = 'form-status ' + cls; status.textContent = msg; };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const invalid = [...form.querySelectorAll('[required]')].find((el) => !el.value.trim() || !el.checkValidity());
    if (invalid) { show('err', 'Please add your first name and a valid email address so we can get back to you.'); invalid.focus(); return; }
    if (!form.access_key.value) { show('err', 'This form isn’t connected yet. Please email info@intracoastalcleaning.com and we’ll get right back to you.'); return; }

    const data = Object.fromEntries(new FormData(form));
    data.name = `${data.first_name} ${data.last_name}`.trim();
    data.replyto = data.email;
    data.page = location.pathname;
    btn.disabled = true; const label = btn.textContent; btn.textContent = 'Sending…';
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Send failed');
      form.reset();
      show('ok', 'Thanks! Your request is in. We’ll be in touch within 24 hours.');
      if (window.gtag) window.gtag('event', 'generate_lead', { form_location: location.pathname });
      if (window.va) window.va('event', { name: 'quote_request' });
    } catch (err) {
      show('err', 'Something went wrong sending your request. Please try again or email info@intracoastalcleaning.com.');
    } finally {
      btn.disabled = false; btn.textContent = label;
    }
  });
});
