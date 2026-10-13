/* Runs in <head>, before first paint: restores the saved language and theme so the page
   never flashes the wrong one, and enables motion only when the visitor allows it.
   Kept as a file (not inline) so the CSP can stay at script-src 'self'. */
(function () {
  var d = document.documentElement;
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  if (get('portfolio-lang') === 'en') { d.lang = 'en'; d.setAttribute('data-lang', 'en'); }
  var theme = get('portfolio-theme');
  if (theme === 'dark' || theme === 'light') d.setAttribute('data-theme', theme);
  // .anim gates every scroll/typing effect: without it (no JS, reduced motion) all content is simply visible.
  if (window.matchMedia && !matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) d.classList.add('anim');
})();
