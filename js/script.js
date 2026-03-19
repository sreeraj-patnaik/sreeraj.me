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
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    function setNavState(open) {
      navLinks.classList.toggle('open', open);
      navLinks.setAttribute('aria-hidden', String(!open));
      navToggle.setAttribute('aria-expanded', String(open));
      const icon = navToggle.querySelector('[data-lucide]');
      if (icon) {
        icon.setAttribute('data-lucide', open ? 'x' : 'menu');
        initIcons();
      }
    }

    navToggle.addEventListener('click', function () {
      setNavState(!navLinks.classList.contains('open'));
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setNavState(false);
      });
    });

    // Close nav when focus leaves the menu (keyboard/mobile)
    navLinks.addEventListener('focusout', function (event) {
      if (!navLinks.contains(event.relatedTarget)) {
        setNavState(false);
      }
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

  // --- Active nav link highlighting ---
  const sections = document.querySelectorAll('main section[id]');
  const navLinksList = Array.from(document.querySelectorAll('.nav-links a'));
  if (sections.length && navLinksList.length) {
    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinksList.forEach(function (link) {
              if (link.getAttribute('href') === `#${id}`) {
                link.setAttribute('aria-current', 'page');
              } else {
                link.removeAttribute('aria-current');
              }
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  // --- Scroll-to-top button ---
  const scrollTopBtn = document.querySelector('.scroll-to-top');
  if (scrollTopBtn) {
    function updateScrollTopVisibility() {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', updateScrollTopVisibility, { passive: true });
    updateScrollTopVisibility();
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
