// Megosztás gomb: Web Share API, ha van (főleg mobil), különben link másolása.
// A vágólap API csak https-en működik, ezért van egy régi, textarea-alapú tartalék is.
(function () {
  const box = document.querySelector('.post-share');
  if (!box) return;
  const btn = box.querySelector('.post-share-btn');
  const status = box.querySelector('.post-share-status');
  box.hidden = false;

  function copyFallback(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }

  let timer;
  function done(msg) {
    status.textContent = msg;
    clearTimeout(timer);
    timer = setTimeout(() => { status.textContent = ''; }, 2500);
  }

  btn.addEventListener('click', async () => {
    const { title, url, copied } = btn.dataset;
    if (navigator.share) {
      try { await navigator.share({ title, url }); return; }
      catch (e) { if (e.name === 'AbortError') return; }   // a menü bezárása nem hiba
    }
    try {
      await navigator.clipboard.writeText(url);
      done(copied);
    } catch (e) {
      if (copyFallback(url)) done(copied);
      else window.prompt('', url);   // végső tartalék: a link kézzel másolható
    }
  });
})();
