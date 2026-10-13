(function () {
  var html = document.documentElement;
  var anim = html.classList.contains('anim');

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function visible(el) { return el.offsetParent !== null || getComputedStyle(el).position === 'fixed'; }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  /* ---------- language ---------- */
  var langBtn = document.getElementById('lang-toggle');
  function setLang(lang) {
    html.setAttribute('data-lang', lang);
    html.setAttribute('lang', lang);
    langBtn.textContent = lang === 'it' ? 'EN' : 'IT';
    langBtn.setAttribute('aria-label', lang === 'it' ? 'Switch to English' : 'Passa all’italiano');
  }
  setLang(store('portfolio-lang') === 'en' ? 'en' : 'it');
  langBtn.addEventListener('click', function () {
    var next = html.getAttribute('data-lang') === 'it' ? 'en' : 'it';
    setLang(next); store('portfolio-lang', next);
  });

  /* ---------- theme (no attribute = follow the system) ---------- */
  var themeBtn = document.getElementById('theme-toggle');
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function isDark() { var t = html.getAttribute('data-theme'); return t ? t === 'dark' : !!(mq && mq.matches); }
  function paint() { html.classList.toggle('is-dark', isDark()); }
  var savedTheme = store('portfolio-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') html.setAttribute('data-theme', savedTheme);
  paint();
  if (mq && mq.addEventListener) mq.addEventListener('change', paint);
  themeBtn.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    html.setAttribute('data-theme', next); store('portfolio-theme', next); paint();
  });

  /* ---------- copy e-mail ---------- */
  document.querySelectorAll('.term-copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var it = btn.querySelector('.lang-it'), en = btn.querySelector('.lang-en');
      function done() {
        btn.classList.add('done'); it.textContent = 'copiato'; en.textContent = 'copied';
        setTimeout(function () { btn.classList.remove('done'); it.textContent = 'copia'; en.textContent = 'copy'; }, 1800);
      }
      function fallback() {
        var a = btn.parentNode.querySelector('.term-addr');
        var r = document.createRange(); r.selectNodeContents(a);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
      else fallback();
    });
  });

  /* ---------- build meter = scroll progress ---------- */
  var fill = document.getElementById('build-fill'), pct = document.getElementById('build-pct'), line = document.getElementById('scroll-fill');
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      var max = document.documentElement.scrollHeight - innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 1;
      var w = (p * 100).toFixed(1) + '%';
      fill.style.width = w; line.style.width = w;
      pct.textContent = p >= 0.995 ? 'ok' : Math.round(p * 100) + '%';
      ticking = false;
    });
  }
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); onScroll();

  /* ---------- spinner in "Work in progress" ---------- */
  document.querySelectorAll('.spin').forEach(function (s) {
    var cells = s.querySelectorAll('i'), k = 0;
    cells[0].classList.add('on');
    if (!anim) return;
    setInterval(function () { cells.forEach(function (c, i) { c.classList.toggle('on', i === k % cells.length || i === (k + 1) % cells.length); }); k++; }, 220);
  });

  /* ---------- easter-egg terminal ---------- */
  var con = document.getElementById('console'), out = document.getElementById('console-out');
  var form = document.getElementById('console-form'), input = document.getElementById('console-in');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function L() { return html.getAttribute('data-lang') === 'en'; }
  function t(it, en) { return L() ? en : it; }
  function print(text, cls) { var d = document.createElement('div'); if (cls) d.className = cls; d.textContent = text; out.appendChild(d); out.scrollTop = out.scrollHeight; }
  function openCon() {
    if (!con.hidden) { input.focus(); return; }
    con.hidden = false;
    if (!out.childNodes.length) print(t('Benvenuto. Scrivi "help" per i comandi.', 'Welcome. Type "help" for commands.'), 'hl');
    input.focus();
  }
  function closeCon() { con.hidden = true; }
  document.getElementById('term-toggle').addEventListener('click', function () { con.hidden ? openCon() : closeCon(); });
  document.getElementById('console-close').addEventListener('click', closeCon);
  document.addEventListener('keydown', function (e) {
    var typingField = /INPUT|TEXTAREA/.test(document.activeElement && document.activeElement.tagName);
    if ((e.key === '~' || e.key === '`' || e.key === '\\') && !typingField) { e.preventDefault(); openCon(); }
    else if (e.key === 'Escape' && !con.hidden) closeCon();
  });

  function rain(ms) {
    if (reduce) return wait(0);
    var c = document.getElementById('rain'), x = c.getContext('2d');
    var cs = getComputedStyle(html), lime = cs.getPropertyValue('--lime').trim(), bg = cs.getPropertyValue('--band').trim();
    c.hidden = false; c.style.opacity = '1';
    var w = c.width = innerWidth, h = c.height = innerHeight, size = 16, cols = Math.ceil(w / size), drops = [];
    for (var i = 0; i < cols; i++) drops[i] = Math.random() * -40;
    var chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ01<>/{}=';
    var stop = performance.now() + ms;
    return new Promise(function (resolve) {
      (function frame(now) {
        x.fillStyle = bg; x.globalAlpha = 0.12; x.fillRect(0, 0, w, h); x.globalAlpha = 1;
        x.fillStyle = lime; x.font = size + 'px "JetBrains Mono", monospace';
        for (var i = 0; i < cols; i++) {
          x.fillText(chars[(Math.random() * chars.length) | 0], i * size, drops[i] * size);
          if (drops[i] * size > h && Math.random() > 0.975) drops[i] = 0;
          drops[i] += 1;
        }
        if (now < stop) requestAnimationFrame(frame);
        else { c.style.opacity = '0'; setTimeout(function () { c.hidden = true; resolve(); }, 600); }
      })(performance.now());
    });
  }
  function flicker() {
    if (reduce) return;
    var n = 0, id = setInterval(function () { document.body.style.filter = (n % 2 === 0) ? 'invert(1)' : ''; if (++n > 5) { clearInterval(id); document.body.style.filter = ''; } }, 90);
  }

  var cmds = {
    help: function () { print(t('comandi: whoami, ls, cat caffe.txt, matrix, sudo assumimi, hal, stacca, 42, fuori-orario, clear, exit', 'commands: whoami, ls, cat caffe.txt, matrix, sudo hire-me, hal, stacca, 42, off-hours, clear, exit')); },
    whoami: function () { print(t('marco weger. integration engineer. trasformo caffè in integrazioni.', 'marco weger. integration engineer. I turn coffee into integrations.')); },
    ls: function () { print(t('lavori/          (in compilazione)\nside-projects/   (vuota, per ora)\ncaffe.txt', 'projects/        (compiling)\nside-projects/   (empty, for now)\ncaffe.txt')); },
    'cat caffe.txt': function () { print(t('Offro io. hello@marcoweger.it', 'My treat. hello@marcoweger.it'), 'hl'); },
    matrix: async function () { print('Wake up, Neo...', 'hl'); await rain(3200); print(t('Segui il coniglio bianco: hello@marcoweger.it', 'Follow the white rabbit: hello@marcoweger.it')); },
    'sudo assumimi': function () { print('[sudo] password: ********'); print(t('Permesso concesso. Scrivi a hello@marcoweger.it', 'Permission granted. Write to hello@marcoweger.it'), 'hl'); },
    hal: function () { print(t('Mi dispiace, Dave. Temo di non poterlo fare.', 'I’m sorry, Dave. I’m afraid I can’t do that.')); },
    stacca: function () { flicker(); print('STACCA STACCA.', 'hl'); },
    '42': function () { print(t('La risposta c’è. È la domanda che va capita: per questo si comincia dall’audit.', 'The answer exists. It’s the question you need to understand: that’s why we start with an audit.')); },
    'rm -rf /': function () { print(t('Bel tentativo.', 'Nice try.')); },
    'fuori-orario': function () {
      print(t('Quando non collego sistemi:', 'When I\u2019m not wiring systems together:'), 'hl');
      [['Tambeer Fest', t('fondatore e presidente', 'founder and president'), 'tambeerfest'],
       ['USO Trescore', t('presidente', 'president'), 'uso_trescore'],
       ['Milan Club Barlafüs', t('vicepresidente', 'vice-president'), 'barlafuscrema']].forEach(function (r) {
        var d = document.createElement('div');
        d.textContent = (r[0] + '                    ').slice(0, 20) + (r[1] + '                         ').slice(0, 25);
        var a = document.createElement('a'); a.href = 'https://www.instagram.com/' + r[2] + '/'; a.target = '_blank'; a.rel = 'noopener';
        a.textContent = '@' + r[2]; d.appendChild(a); out.appendChild(d);
      });
      out.scrollTop = out.scrollHeight;
    },
    clear: function () { out.textContent = ''; },
    exit: function () { print('Hasta la vista, baby.', 'hl'); setTimeout(closeCon, 900); }
  };
  cmds['sudo hire-me'] = cmds['sudo assumimi']; cmds.aiuto = cmds.help; cmds['off-hours'] = cmds['fuori-orario']; cmds.hobby = cmds['fuori-orario']; cmds['cat coffee.txt'] = cmds['cat caffe.txt'];
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var raw = input.value.trim(); input.value = '';
    if (!raw) return;
    print('$ ' + raw, 'echo');
    var fn = cmds[raw.toLowerCase().replace(/\s+/g, ' ')];
    if (fn) fn(); else print(t('comando non trovato: ' + raw + '. Prova "help".', 'command not found: ' + raw + '. Try "help".'));
  });

  if (!anim) return;

  /* ---------- effects ---------- */
  var GLYPHS = '<>/\\{}[]=+*#$%_01';

  /* hero: rotating "trovo ..." word, typed and deleted like a shell */
  document.querySelectorAll('.rotator').forEach(function (el) {
    var words = el.getAttribute('data-words').split('|'), i = 0;
    async function loop() {
      for (;;) {
        await wait(2200);
        if (!visible(el)) { await wait(800); continue; }
        el.classList.add('typing');
        var cur = el.textContent;
        for (var n = cur.length; n >= 0; n--) { el.textContent = cur.slice(0, n); await wait(28); }
        i = (i + 1) % words.length;
        var next = words[i];
        for (var m = 1; m <= next.length; m++) { el.textContent = next.slice(0, m); await wait(45 + Math.random() * 30); }
        el.classList.remove('typing');
      }
    }
    setTimeout(loop, 3500);
  });

  function scramble(el, duration) {
    var target = el.getAttribute('data-text') || el.textContent;
    el.setAttribute('data-text', target);
    var start = performance.now();
    return new Promise(function (resolve) {
      function frame(now) {
        var t = Math.min(1, (now - start) / duration), fixed = Math.floor(target.length * t), out = '';
        for (var i = 0; i < target.length; i++) {
          var ch = target[i];
          out += (i < fixed || ch === ' ') ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        el.textContent = out;
        if (t < 1) requestAnimationFrame(frame); else { el.textContent = target; resolve(); }
      }
      requestAnimationFrame(frame);
    });
  }

  function type(el, speed) {
    var host = el.querySelector('mark') || el;
    var full = host.getAttribute('data-text') || host.textContent;
    host.setAttribute('data-text', full);
    host.textContent = '';
    el.classList.add('typing');
    var i = 0;
    return new Promise(function (resolve) {
      (function step() {
        i += 1;
        host.textContent = full.slice(0, i);
        if (i < full.length) setTimeout(step, speed + (Math.random() * speed * 0.6));
        else { el.classList.remove('typing'); resolve(); }
      })();
    });
  }

  async function runSeq(box) {
    box.classList.add('shown');
    var kids = Array.prototype.slice.call(box.children);
    for (var i = 0; i < kids.length; i++) {
      var k = kids[i];
      if (!visible(k)) { k.classList.add('shown'); continue; }
      k.classList.add('shown');
      if (k.classList.contains('type')) await type(k, k.classList.contains('cmd') ? 38 : 20);
      else {
        var sc = k.querySelector('.scramble-v');
        if (sc) await scramble(sc, 700); else await wait(110);
      }
    }
  }

  /* name decodes on load */
  document.querySelectorAll('.name .scramble').forEach(function (el) { scramble(el, 900); });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { io.unobserve(e.target); runSeq(e.target); }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('[data-seq]').forEach(function (b) { io.observe(b); });
})();
