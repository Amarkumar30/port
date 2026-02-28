/* =============================================================
   AMAR KUMAR — DATA SCIENTIST PORTFOLIO
   JavaScript: Interactions, Animations, Canvas
   ============================================================= */

(function () {
  'use strict';

  /* ────────────── SCROLL PROGRESS BAR ────────────── */
  const scrollProgressEl = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgressEl.style.width = progress + '%';
  }

  /* ────────────── CUSTOM CURSOR ────────────── */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  // Track whether we're on a device that supports hover (non-touch)
  const supportsHover = window.matchMedia('(hover: hover)').matches;

  if (supportsHover) {
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    // Smooth ring follow
    function animateCursorRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateCursorRing);
    }
    animateCursorRing();

    // Hover enlargement on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .project-card, .cert-card, .blog-card, .trait');
    hoverTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-hover'); });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-hover'); });
    });
  }

  /* ────────────── NAVBAR SCROLL BEHAVIOR ────────────── */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* ────────────── MOBILE MENU ────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  // Create overlay element
  const navOverlay = document.createElement('div');
  navOverlay.classList.add('nav-overlay');
  document.body.appendChild(navOverlay);

  function toggleMobileMenu() {
    const isOpen = navLinks.classList.contains('open');
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
    navOverlay.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  function closeMobileMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    navOverlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMobileMenu);
  navOverlay.addEventListener('click', closeMobileMenu);

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ────────────── TYPEWRITER EFFECT ────────────── */
  const typewriterEl = document.getElementById('typewriterText');
  const phrases = [
    'Data Scientist in the Making',
    'Engineer. Analyst. Problem Solver.',
    'Turning Data into Decisions.'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function typewrite() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause at end of phrase
      typeSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 500;
    }

    setTimeout(typewrite, typeSpeed);
  }

  // Start after a brief delay
  setTimeout(typewrite, 1000);

  /* ────────────── SCROLL-TRIGGERED REVEALS ────────────── */
  function revealOnScroll() {
    var elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    var windowHeight = window.innerHeight;

    elements.forEach(function (el, index) {
      var rect = el.getBoundingClientRect();
      var revealPoint = windowHeight * 0.88;

      if (rect.top < revealPoint && !el.classList.contains('revealed')) {
        // Stagger animations for siblings
        var parent = el.parentElement;
        var siblings = parent ? parent.querySelectorAll('.reveal-up, .reveal-left, .reveal-right') : [];
        var siblingIndex = Array.from(siblings).indexOf(el);
        var delay = siblingIndex >= 0 ? siblingIndex * 100 : 0;

        setTimeout(function () {
          el.classList.add('revealed');
        }, delay);
      }
    });
  }

  /* ────────────── SKILL BAR ANIMATION ────────────── */
  function animateSkillBars() {
    var bars = document.querySelectorAll('.skill-bar-fill');
    var windowHeight = window.innerHeight;

    bars.forEach(function (bar) {
      var rect = bar.getBoundingClientRect();
      if (rect.top < windowHeight * 0.9 && bar.style.width === '0%') {
        bar.style.width = bar.getAttribute('data-width') + '%';
      }
    });
  }

  /* ────────────── COUNTING ANIMATION (ABOUT STATS) ────────────── */
  var statsCounted = false;

  function animateStats() {
    if (statsCounted) return;
    var statsSection = document.querySelector('.about-stats');
    if (!statsSection) return;

    var rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      statsCounted = true;
      var counters = document.querySelectorAll('.stat-number');
      counters.forEach(function (counter) {
        var target = parseInt(counter.getAttribute('data-target'), 10);
        var duration = 1500;
        var start = 0;
        var startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          // Ease-out
          var eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.floor(eased * target);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            counter.textContent = target;
          }
        }
        requestAnimationFrame(step);
      });
    }
  }

  /* ────────────── ACTIVE NAV LINK HIGHLIGHTING ────────────── */
  var sections = document.querySelectorAll('section[id]');

  function highlightActiveNav() {
    var scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.querySelectorAll('a').forEach(function (a) {
          a.classList.remove('active-link');
        });
        var activeLink = navLinks.querySelector('a[href="#' + id + '"]');
        if (activeLink) activeLink.classList.add('active-link');
      }
    });
  }

  /* ────────────── HERO CANVAS — FLOATING DATA NODES ────────────── */
  var canvas = document.getElementById('heroCanvas');
  var ctx = canvas.getContext('2d');
  var particles = [];
  var particleCount = 55;
  var connectionDistance = 140;

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2
    };
  }

  function initParticles() {
    particles = [];
    for (var i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          var alpha = (1 - dist / connectionDistance) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(0, 212, 170, ' + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (var k = 0; k < particles.length; k++) {
      var p = particles[k];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 212, 170, ' + p.opacity + ')';
      ctx.fill();

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges gently
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    }

    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  initParticles();
  drawParticles();

  window.addEventListener('resize', function () {
    resizeCanvas();
    initParticles();
  });

  /* ────────────── CONTACT FORM (CLIENT-SIDE ONLY) ────────────── */
  var contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('contactName').value.trim();
    var email = document.getElementById('contactEmail').value.trim();
    var message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !message) {
      alert('Please fill in all required fields.');
      return;
    }

    // Simple email validation
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Simulate send
    var btn = contactForm.querySelector('button[type="submit"]');
    var originalHTML = btn.innerHTML;
    btn.innerHTML = '<span>Sent!</span> <i class="fa-solid fa-check"></i>';
    btn.style.background = '#10b981';
    btn.disabled = true;

    setTimeout(function () {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 3000);
  });

  /* ────────────── UNIFIED SCROLL HANDLER ────────────── */
  function onScroll() {
    updateScrollProgress();
    handleNavbarScroll();
    revealOnScroll();
    animateSkillBars();
    animateStats();
    highlightActiveNav();
  }

  // Use passive listener for performance
  window.addEventListener('scroll', onScroll, { passive: true });

  // Run once on load
  window.addEventListener('DOMContentLoaded', function () {
    onScroll();
    revealOnScroll();
  });

  // Also run on load event for images etc.
  window.addEventListener('load', function () {
    onScroll();
    revealOnScroll();
  });

})();
