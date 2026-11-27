/* Runs in <head>, before first paint: restores the saved language and theme so the page
   never flashes the wrong one, and enables motion only when the visitor allows it.
   Kept as a file (not inline) so the CSP can stay at script-src 'self'. */
(function () {
  var d = document.documentElement;
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  if (get('portfolio-lang') === 'en') { d.lang = 'en'; d.setAttribute('data-lang', 'en'); }
  var theme = get('portfolio-theme');
  if (theme === 'dark' || theme === 'light') d.setAttribute('data-theme', theme);
  // R-001: environment band outside prod only. Static site, so the environment comes from the host name.
  var h = location.hostname;
  var env = (h === 'localhost' || h === '127.0.0.1' || /(^|\.)dev\.marcoweger\.it$/.test(h)) ? 'dev'
    : (/(^|\.)test\.marcoweger\.it$/.test(h) || /^test\./.test(h)) ? 'test' : '';
  if (env) d.setAttribute('data-env', env);
  // .anim gates every scroll/typing effect: without it (no JS, reduced motion) all content is simply visible.
  if (window.matchMedia && !matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) d.classList.add('anim');
})();
