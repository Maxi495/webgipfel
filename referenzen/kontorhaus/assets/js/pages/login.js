/* Kontorhaus – Login (Attrappe). Konzeptprojekt: es gibt keinen echten Login, nichts wird gesendet. */
(function () {
  var form = document.querySelector('[data-login]');
  if (!form) return;
  var note = form.querySelector('[data-note]'), noteText = form.querySelector('[data-note-text]');
  var CONCEPT = '<b>Hier geht\'s nur zur Probe rein.</b>Kontorhaus ist ein Konzeptprojekt der Webgipfel Medienagentur – es gibt keinen echten Login, und deine Eingaben bleiben in deinem Browser. Lust auf mehr? <a href="kontakt.html#testen">Schau dir den Test an</a>.';

  function show(html) {
    note.classList.remove('is-on');
    void note.offsetWidth;
    noteText.innerHTML = html;
    note.classList.add('is-on');
  }
  function check(el, ok) {
    var f = el.closest('.field');
    f.classList.toggle('is-error', !ok);
    el.setAttribute('aria-invalid', ok ? 'false' : 'true');
    return ok;
  }
  var mail = form.elements.email, pw = form.elements.password;
  var mailOk = function () { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail.value.trim()); };
  mail.addEventListener('input', function () { if (mail.closest('.field').classList.contains('is-error')) check(mail, mailOk()); });
  pw.addEventListener('input', function () { if (pw.closest('.field').classList.contains('is-error')) check(pw, !!pw.value); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var a = check(mail, mailOk()), b = check(pw, !!pw.value);
    if (!a || !b) {
      form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
      (a ? pw : mail).focus();
      return;
    }
    var btn = form.querySelector('[type="submit"]');
    btn.disabled = true; btn.textContent = 'Einen Moment …';
    setTimeout(function () {
      btn.disabled = false; btn.textContent = 'Anmelden';
      pw.value = '';
      show(CONCEPT);
    }, 700);
  });

  form.querySelector('[data-pw-toggle]').addEventListener('click', function () {
    var on = pw.type === 'password';
    pw.type = on ? 'text' : 'password';
    this.textContent = on ? 'Verbergen' : 'Zeigen';
    this.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  form.querySelector('[data-forgot]').addEventListener('click', function () {
    show('<b>Passwort vergessen? Kein Drama.</b>Im echten Leben käme jetzt ein Link per Mail. Hier ist alles nur Konzept – ruf zur Not Leon an: 089 99998 300.');
  });
  Array.prototype.forEach.call(form.querySelectorAll('[data-social]'), function (b) {
    b.addEventListener('click', function () {
      show('<b>Mit ' + b.getAttribute('data-social') + ' anmelden ist hier nur Attrappe.</b>Kontorhaus ist ein Konzeptprojekt – es wird keine Verbindung zu ' + b.getAttribute('data-social') + ' aufgebaut.');
    });
  });
})();
