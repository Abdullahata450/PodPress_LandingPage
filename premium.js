/* PodPress — Premium Interactions
   Custom cursor, scroll-reveal, magnetic buttons, smooth section reveals.
   Self-contained: injects its own CSS + DOM elements.
   ------------------------------------------------------------------- */
(function () {
  'use strict';

  var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  /* ================================================================
     1. INJECT STYLES
     ================================================================ */
  var css = [
    /* ── Custom Cursor ── */
    '.pp-cursor-dot, .pp-cursor-ring {',
    '  position: fixed; top: 0; left: 0;',
    '  pointer-events: none; z-index: 99999;',
    '  border-radius: 50%;',
    '  transform: translate(-50%, -50%);',
    '  will-change: transform, width, height, opacity;',
    '}',
    '.pp-cursor-dot {',
    '  width: 6px; height: 6px;',
    '  background: var(--cornflower, #3A67FF);',
    '  opacity: 0.85;',
    '  transition: width 0.25s cubic-bezier(.4,0,.2,1), height 0.25s cubic-bezier(.4,0,.2,1), opacity 0.25s ease;',
    '}',
    '.pp-cursor-ring {',
    '  width: 36px; height: 36px;',
    '  border: 1.5px solid var(--cornflower, #3A67FF);',
    '  opacity: 0.3;',
    '  transition: width 0.35s cubic-bezier(.4,0,.2,1), height 0.35s cubic-bezier(.4,0,.2,1),',
    '    opacity 0.35s ease, border-width 0.35s ease, background 0.35s ease;',
    '}',
    '.pp-cursor-hover .pp-cursor-ring {',
    '  width: 56px; height: 56px;',
    '  opacity: 0.18;',
    '  border-width: 2px;',
    '  background: rgba(58,103,255,0.06);',
    '}',
    '.pp-cursor-hover .pp-cursor-dot {',
    '  width: 4px; height: 4px;',
    '  opacity: 0.5;',
    '}',
    '.pp-cursor-click .pp-cursor-ring {',
    '  width: 28px !important; height: 28px !important;',
    '  opacity: 0.5;',
    '}',
    '.pp-cursor-hidden .pp-cursor-dot,',
    '.pp-cursor-hidden .pp-cursor-ring { opacity: 0 !important; }',
    '',
    '/* Hide custom cursor on touch devices */',
    '@media (hover: none) and (pointer: coarse) {',
    '  .pp-cursor-dot, .pp-cursor-ring { display: none !important; }',
    '}',
    '',
    '/* Hide default cursor when custom cursor active */',
    '@media (hover: hover) and (pointer: fine) {',
    '  html.pp-custom-cursor,',
    '  html.pp-custom-cursor * { cursor: none !important; }',
    '  html.pp-custom-cursor a,',
    '  html.pp-custom-cursor button,',
    '  html.pp-custom-cursor [role="button"],',
    '  html.pp-custom-cursor input,',
    '  html.pp-custom-cursor textarea,',
    '  html.pp-custom-cursor select { cursor: none !important; }',
    '}',
    '',
    '/* ── Scroll Reveal ── */',
    '.pp-reveal {',
    '  opacity: 0;',
    '  transform: translateY(32px);',
    '  transition: opacity 0.7s cubic-bezier(.16,1,.3,1), transform 0.7s cubic-bezier(.16,1,.3,1);',
    '}',
    '.pp-reveal.is-visible {',
    '  opacity: 1;',
    '  transform: translateY(0);',
    '}',
    '.pp-reveal-left {',
    '  opacity: 0;',
    '  transform: translateX(-40px);',
    '  transition: opacity 0.7s cubic-bezier(.16,1,.3,1), transform 0.7s cubic-bezier(.16,1,.3,1);',
    '}',
    '.pp-reveal-left.is-visible {',
    '  opacity: 1;',
    '  transform: translateX(0);',
    '}',
    '.pp-reveal-right {',
    '  opacity: 0;',
    '  transform: translateX(40px);',
    '  transition: opacity 0.7s cubic-bezier(.16,1,.3,1), transform 0.7s cubic-bezier(.16,1,.3,1);',
    '}',
    '.pp-reveal-right.is-visible {',
    '  opacity: 1;',
    '  transform: translateX(0);',
    '}',
    '.pp-reveal-scale {',
    '  opacity: 0;',
    '  transform: scale(0.92);',
    '  transition: opacity 0.6s cubic-bezier(.16,1,.3,1), transform 0.6s cubic-bezier(.16,1,.3,1);',
    '}',
    '.pp-reveal-scale.is-visible {',
    '  opacity: 1;',
    '  transform: scale(1);',
    '}',
    '',
    '/* Staggered children */',
    '.pp-stagger > * { transition-delay: calc(var(--i, 0) * 0.08s); }',
    '',
    '/* ── Magnetic button hover ── */',
    '.pp-magnetic {',
    '  transition: transform 0.3s cubic-bezier(.4,0,.2,1);',
    '}',
    '',
    '/* ── Smooth gradient glow on hero headings ── */',
    '@keyframes pp-text-shimmer {',
    '  0%   { background-position: -200% center; }',
    '  100% { background-position: 200% center; }',
    '}',
    '.pp-shimmer {',
    '  background: linear-gradient(90deg,',
    '    var(--ink, #111) 0%, var(--ink, #111) 40%,',
    '    var(--cornflower, #3A67FF) 50%,',
    '    var(--ink, #111) 60%, var(--ink, #111) 100%);',
    '  background-size: 200% auto;',
    '  -webkit-background-clip: text;',
    '  background-clip: text;',
    '  -webkit-text-fill-color: transparent;',
    '  animation: pp-text-shimmer 4s ease-in-out infinite;',
    '}',
  ].join('\n');

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ================================================================
     2. CUSTOM CURSOR
     ================================================================ */
  if (!isTouchDevice) {
    document.documentElement.classList.add('pp-custom-cursor');

    var dot = document.createElement('div');
    dot.className = 'pp-cursor-dot';
    var ring = document.createElement('div');
    ring.className = 'pp-cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var mouseX = -100, mouseY = -100;
    var ringX = -100, ringY = -100;
    var isHovering = false;
    var isHidden = false;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px) translate(-50%, -50%)';

      if (isHidden) {
        isHidden = false;
        document.body.classList.remove('pp-cursor-hidden');
      }
    });

    document.addEventListener('mousedown', function () {
      document.body.classList.add('pp-cursor-click');
    });
    document.addEventListener('mouseup', function () {
      document.body.classList.remove('pp-cursor-click');
    });

    document.addEventListener('mouseleave', function () {
      isHidden = true;
      document.body.classList.add('pp-cursor-hidden');
    });
    document.addEventListener('mouseenter', function () {
      isHidden = false;
      document.body.classList.remove('pp-cursor-hidden');
    });

    var interactiveSelector = 'a, button, [role="button"], input, textarea, select, .btn, .theme-toggle, .mobile-toggle';

    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(interactiveSelector)) {
        if (!isHovering) {
          isHovering = true;
          document.body.classList.add('pp-cursor-hover');
        }
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(interactiveSelector)) {
        if (isHovering && !e.relatedTarget || (e.relatedTarget && !e.relatedTarget.closest(interactiveSelector))) {
          isHovering = false;
          document.body.classList.remove('pp-cursor-hover');
        }
      }
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = 'translate(' + ringX + 'px, ' + ringY + 'px) translate(-50%, -50%)';
      requestAnimationFrame(animateRing);
    }
    animateRing();
  }

  /* ================================================================
     3. SCROLL REVEAL (IntersectionObserver)
     ================================================================ */
  function initScrollReveal() {
    var revealSelectors = [
      '.sp-card', '.sp-block', '.sp-faq-item', '.sp-tl-item',
      '.tn-card', '.tn-checklist', '.tn-section-header',
      '.yt-step', '.yt-check', '.yt-cta-panel', '.yt-hero-preview', '.yt-section-head',
      '.rss-benefit-item', '.rss-perfect-card', '.rss-cta-panel', '.rss-hero-preview', '.rss-section-head',
      '.pb-benefit', '.pb-list-wrap', '.pb-faq-shell', '.pb-section-header',
      '.pf-benefit', '.pf-list-wrap', '.pf-faq-shell', '.pf-section-header',
      '.ins-card', '.ins-step', '.ins-faq-item', '.ins-section-title',
      '.footer-grid-5',
      '.bento-card', '.pricing-card',
      'section > .sp-container > *:first-child',
    ];

    var heroSelectors = [
      '.sp-hero-inner', '.tn-hero-inner', '.yt-hero-layout',
      '.pb-hero-inner', '.pf-hero-inner',
      '.rss-hero-layout',
    ];

    var allElements = [];

    revealSelectors.forEach(function (sel) {
      var els = document.querySelectorAll(sel);
      els.forEach(function (el) {
        if (!el.classList.contains('pp-reveal')) {
          el.classList.add('pp-reveal');
          allElements.push(el);
        }
      });
    });

    heroSelectors.forEach(function (sel) {
      var els = document.querySelectorAll(sel);
      els.forEach(function (el) {
        if (!el.classList.contains('pp-reveal-scale')) {
          el.classList.add('pp-reveal-scale');
          allElements.push(el);
        }
      });
    });

    var grids = document.querySelectorAll(
      '.tn-process-grid, .tn-output-grid, .yt-steps, .yt-checklist, ' +
      '.rss-benefit-list, .rss-perfect-grid, .pb-benefits-grid, .pf-benefits-grid, ' +
      '.sp-grid, .bento-grid, .pricing-cards'
    );
    grids.forEach(function (grid) {
      grid.classList.add('pp-stagger');
      var children = grid.children;
      for (var i = 0; i < children.length; i++) {
        children[i].style.setProperty('--i', i);
      }
    });

    if (!('IntersectionObserver' in window)) {
      allElements.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    allElements.forEach(function (el) { observer.observe(el); });
  }

  /* ================================================================
     4. MAGNETIC BUTTONS
     ================================================================ */
  function initMagneticButtons() {
    if (isTouchDevice) return;

    var magneticSelectors = [
      '.btn-primary', '.tn-primary-btn', '.yt-hero-btn', '.yt-cta-btn',
      '.rss-cta-btn', '.pb-primary-btn', '.pf-primary-btn', '.ins-hero-btn', '.ins-cta-btn',
      '.sp-nav-start', '.pb-nav-start', '.pf-nav-start',
    ];

    magneticSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (btn) {
        btn.classList.add('pp-magnetic');

        btn.addEventListener('mousemove', function (e) {
          var rect = btn.getBoundingClientRect();
          var x = e.clientX - rect.left - rect.width / 2;
          var y = e.clientY - rect.top - rect.height / 2;
          btn.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
        });

        btn.addEventListener('mouseleave', function () {
          btn.style.transform = '';
        });
      });
    });
  }

  /* ================================================================
     5. BOOT
     ================================================================ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  function boot() {
    initScrollReveal();
    initMagneticButtons();
  }

})();
