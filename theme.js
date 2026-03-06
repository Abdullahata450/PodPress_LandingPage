/* PodPress — Theme Toggle (light / dark)
   Immediately applies saved theme to <html> to prevent flash.
   Attaches button listener after DOM is ready.
   --------------------------------------------------------- */
(function () {
  var KEY = 'podpress-theme';
  var root = document.documentElement;

  /* ── Apply saved preference immediately ── */
  if (localStorage.getItem(KEY) === 'dark') {
    root.setAttribute('data-theme', 'dark');
  }

  /* ── Helpers ── */
  function isDark() {
    return root.getAttribute('data-theme') === 'dark';
  }

  var SUN_ICON =
    '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<circle cx="12" cy="12" r="5"/>' +
    '<line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>' +
    '<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>' +
    '<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>' +
    '<line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>' +
    '<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>' +
    '<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';

  var MOON_ICON =
    '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function updateLogos(dark) {
    document.querySelectorAll('img[data-logo]').forEach(function (img) {
      img.src = dark ? 'logo-light.png' : 'logo-dark.png';
    });
  }

  function updateBtn(btn, dark) {
    var label = dark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    var icon  = dark ? SUN_ICON : MOON_ICON;
    /* Wide buttons (mobile menu) show icon + label */
    if (btn.dataset.themeLabel === 'full') {
      btn.innerHTML = icon + '<span style="margin-left:8px">' + label + '</span>';
    } else {
      btn.innerHTML = icon;
    }
    btn.setAttribute('aria-label', label);
    btn.title = label;
  }

  function applyTheme(dark) {
    /* Smooth transition class */
    root.classList.add('theme-transitioning');
    setTimeout(function () { root.classList.remove('theme-transitioning'); }, 350);

    if (dark) {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem(KEY, 'dark');
    } else {
      root.removeAttribute('data-theme');
      localStorage.setItem(KEY, 'light');
    }

    /* Update every toggle button on the page (desktop + mobile) */
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      updateBtn(btn, dark);
    });
    updateLogos(dark);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var dark = isDark();

    /* Initialise all buttons */
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      updateBtn(btn, dark);
      btn.addEventListener('click', function () {
        applyTheme(!isDark());
      });
    });

    updateLogos(dark);
  });
})();
