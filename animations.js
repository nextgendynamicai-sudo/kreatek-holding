/**
 * KREATEK HOLDING - Animation Engine
 * Scroll-triggered reveals, counters, tilt effects, and micro-interactions
 */

// ============================================
// Intersection Observer - Scroll Reveal
// ============================================
class ScrollReveal {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    const options = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Don't unobserve to allow re-animation if needed
        }
      });
    }, options);

    // Observe all reveal elements
    const revealElements = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale'
    );
    revealElements.forEach((el) => this.observer.observe(el));
  }
}

// ============================================
// Counter Animation
// ============================================
class CounterAnimation {
  constructor() {
    this.counters = document.querySelectorAll('[data-count]');
    this.animated = new Set();
    this.init();
  }

  init() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.animated.has(entry.target)) {
            this.animated.add(entry.target);
            this.animateCounter(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    this.counters.forEach((counter) => observer.observe(counter));
  }

  animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'), 10);
    const duration = 2000;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      element.textContent = current + '+';

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }
}

// ============================================
// 3D Tilt Effect
// ============================================
class TiltEffect {
  constructor() {
    this.cards = document.querySelectorAll('[data-tilt]');
    this.init();
  }

  init() {
    this.cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => this.handleMove(e, card));
      card.addEventListener('mouseleave', (e) => this.handleLeave(e, card));
    });
  }

  handleMove(e, card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.02)`;
  }

  handleLeave(e, card) {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    setTimeout(() => {
      card.style.transition = '';
    }, 500);
  }
}

// ============================================
// Hero Animations - Entry Sequence
// ============================================
class HeroAnimations {
  constructor() {
    this.init();
  }

  init() {
    // Wait for loader to finish
    setTimeout(() => {
      this.animateHero();
    }, 2200);
  }

  animateHero() {
    const badge = document.getElementById('hero-badge');
    const title = document.getElementById('hero-title');
    const subtitle = document.getElementById('hero-subtitle');
    const actions = document.getElementById('hero-actions');

    const elements = [badge, title, subtitle, actions];
    
    elements.forEach((el, i) => {
      if (el) {
        setTimeout(() => {
          el.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
                                 transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)`;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, i * 200);
      }
    });
  }
}

// ============================================
// Magnetic Button Effect
// ============================================
class MagneticButtons {
  constructor() {
    this.buttons = document.querySelectorAll('[data-hover]');
    this.init();
  }

  init() {
    this.buttons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.3s ease';
        setTimeout(() => {
          btn.style.transition = '';
        }, 300);
      });
    });
  }
}

// ============================================
// Smooth Scroll
// ============================================
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
          const navHeight = document.getElementById('navbar').offsetHeight;
          const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
          
          window.scrollTo({
            top: targetPos,
            behavior: 'smooth',
          });

          // Close mobile menu if open
          const navLinks = document.getElementById('nav-links');
          if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
          }
        }
      });
    });
  }
}

// ============================================
// Text Scramble Effect
// ============================================
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.frame = 0;
    this.queue = [];
    this.resolve = null;
    this.frameRequest = null;
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span style="color: var(--color-neon-cyan); opacity: 0.6">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(() => this.update());
      this.frame++;
    }
  }
}

// ============================================
// Initialize All Animations
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Wait a tiny bit to ensure DOM is fully ready
  requestAnimationFrame(() => {
    new ScrollReveal();
    new CounterAnimation();
    new TiltEffect();
    new HeroAnimations();
    new MagneticButtons();
    new SmoothScroll();
  });
});
