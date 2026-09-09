/* =====================================================
   GIFT BEATS — SCRIPT
   Navbar scroll, mobile menu, scroll reveal, audio player,
   smooth scroll, active nav state, floating particles.
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -----------------------------------------------------
     NAVBAR SCROLL BEHAVIOR
     Darkens/opacifies the nav after scrolling past the hero.
  ----------------------------------------------------- */
  const nav = document.getElementById('nav');
  const toggleNavState = () => {
    if (window.scrollY > 60) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  };
  toggleNavState();
  window.addEventListener('scroll', toggleNavState, { passive: true });

  /* -----------------------------------------------------
     MOBILE MENU
  ----------------------------------------------------- */
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  const closeMobileMenu = () => {
    mobileMenu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  const openMobileMenu = () => {
    mobileMenu.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('is-open');
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* -----------------------------------------------------
     ACTIVE NAVIGATION STATE (based on scroll position)
  ----------------------------------------------------- */
  const sections = ['top', 'services', 'pricing', 'showcase', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const navLinks = document.querySelectorAll('.nav__link');

  const setActiveLink = () => {
    let currentId = sections[0] ? sections[0].id : '';
    const scrollPos = window.scrollY + window.innerHeight * 0.3;

    sections.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      const target = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', target === currentId);
    });
  };
  setActiveLink();
  window.addEventListener('scroll', setActiveLink, { passive: true });

  /* -----------------------------------------------------
     SMOOTH SCROLL for in-page anchor links
     (CSS handles most of this via scroll-behavior, this
     covers browsers/edge-cases and accounts for nav height)
  ----------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('nav').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* -----------------------------------------------------
     SCROLL REVEAL ANIMATIONS
     Adds .is-visible to .reveal / .reveal-up elements
     as they enter the viewport.
  ----------------------------------------------------- */
  const revealTargets = document.querySelectorAll('.reveal, .reveal-up');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    // No IntersectionObserver support, or reduced motion requested:
    // show everything immediately.
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  /* -----------------------------------------------------
     BEAT SHOWCASE — AUDIO PLAYER
     Only one track plays at a time. Clicking the active
     track's button pauses it.
  ----------------------------------------------------- */
  const playButtons = document.querySelectorAll('.beat-card__play');
  const nowPlayingEl = document.getElementById('nowPlaying');
  let currentAudio = null;
  let currentButton = null;

  const stopCurrent = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    if (currentButton) {
      currentButton.classList.remove('is-playing');
    }
    currentAudio = null;
    currentButton = null;
    if (nowPlayingEl) nowPlayingEl.textContent = '';
  };

  playButtons.forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.beat-card');
      const audio = card ? card.querySelector('.beat-audio') : null;
      if (!audio) return;

      const isThisPlaying = currentButton === button;

      // Stop whatever is currently playing first
      stopCurrent();

      if (isThisPlaying) {
        // User clicked the already-playing track's button: just stop it.
        return;
      }

      audio.play().then(() => {
        button.classList.add('is-playing');
        currentAudio = audio;
        currentButton = button;
        if (nowPlayingEl) {
          nowPlayingEl.textContent = 'Now playing: ' + (button.dataset.title || 'Track');
        }
      }).catch(() => {
        // Audio file not yet available (placeholder). Fail quietly.
        if (nowPlayingEl) {
          nowPlayingEl.textContent = 'Audio coming soon: ' + (button.dataset.title || 'Track');
        }
      });

      audio.addEventListener('ended', stopCurrent, { once: true });
    });
  });

  /* -----------------------------------------------------
     FLOATING PARTICLES
     Lightweight decorative particles rising through the page.
  ----------------------------------------------------- */
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer && !prefersReducedMotion) {
    const particleCount = window.innerWidth < 640 ? 12 : 24;
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.animationDuration = (12 + Math.random() * 14) + 's';
      p.style.animationDelay = (Math.random() * 16) + 's';
      p.style.opacity = (0.15 + Math.random() * 0.3).toFixed(2);
      particlesContainer.appendChild(p);
    }
  }

});
