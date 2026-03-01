/**
 * Sreeraj Dabbiru — Portfolio (Advanced)
 * Vanilla JS: scroll reveal with stagger, nav, smooth scroll, counter, form UI
 */

(function () {
  'use strict';

  // --- Lucide Icons ---
  function initIcons() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIcons);
  } else {
    initIcons();
  }
  setTimeout(initIcons, 100);

  // --- Navbar: sticky + scroll state ---
  const navbar = document.getElementById('navbar');
  if (navbar) {
    function updateNavbar() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();
  }

  // --- Mobile nav toggle ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      const icon = navToggle.querySelector('[data-lucide]');
      if (icon) {
        icon.setAttribute('data-lucide', navLinks.classList.contains('open') ? 'x' : 'menu');
        initIcons();
      }
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        const icon = navToggle.querySelector('[data-lucide]');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          initIcons();
        }
      });
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- IntersectionObserver: section reveal with optional stagger delay ---
  const revealOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.08
  };

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.getAttribute('data-delay'), 10) || 0;
      if (delay > 0) {
        setTimeout(function () {
          el.classList.add('revealed');
        }, delay);
      } else {
        el.classList.add('revealed');
      }
    });
  }, revealOptions);

  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    revealObserver.observe(el);
  });

  // --- Counter animation for hero stat ---
  const statNum = document.querySelector('.stat-num');
  if (statNum) {
    const target = parseInt(statNum.getAttribute('data-count'), 10) || 0;
    const duration = 1800;
    const startTime = performance.now();
    let rafId;

    function updateCount(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(easeOut * target);
      statNum.textContent = value;
      if (progress < 1) {
        rafId = requestAnimationFrame(updateCount);
      } else {
        statNum.textContent = target;
      }
    }

    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !statNum.classList.contains('counted')) {
          statNum.classList.add('counted');
          rafId = requestAnimationFrame(updateCount);
        }
      });
    }, { threshold: 0.5 });

    counterObserver.observe(statNum.closest('.hero') || document.body);
  }

  // --- Contact form: UI only ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Message sent (demo)';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = originalText;
        btn.disabled = false;
        contactForm.reset();
      }, 2000);
    });
  }
})();
