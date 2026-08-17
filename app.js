/**
 * KREATEK HOLDING - Main Application
 * Custom cursor, navbar, loader, and global interactions
 */

// ============================================
// Loading Screen
// ============================================
class Loader {
  constructor() {
    this.loader = document.getElementById('loader');
    this.progress = document.getElementById('loader-progress');
    this.percent = document.getElementById('loader-percent');
    this.currentPercent = 0;
    this.init();
  }

  init() {
    this.animatePercent();
    
    // Remove loader after animation
    setTimeout(() => {
      this.loader.classList.add('loaded');
      document.body.style.overflow = '';
    }, 2100);
  }

  animatePercent() {
    const duration = 2000;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 2);
      this.currentPercent = Math.round(eased * 100);
      
      if (this.percent) {
        this.percent.textContent = this.currentPercent + '%';
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }
}

// ============================================
// Custom Cursor
// ============================================
class CustomCursor {
  constructor() {
    this.dot = document.getElementById('cursor-dot');
    this.ring = document.getElementById('cursor-ring');
    this.pos = { x: 0, y: 0 };
    this.mouse = { x: 0, y: 0 };
    this.speed = 0.15;
    
    // Check if device supports hover
    if (window.matchMedia('(hover: hover)').matches) {
      this.init();
    }
  }

  init() {
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    // Hover state for interactive elements
    const hoverTargets = document.querySelectorAll(
      'a, button, [data-hover], .company-card, .executor-card, .dev-card, .holding-card, .dna-card'
    );

    hoverTargets.forEach((target) => {
      target.addEventListener('mouseenter', () => {
        this.ring.classList.add('hover');
      });
      target.addEventListener('mouseleave', () => {
        this.ring.classList.remove('hover');
      });
    });

    this.animate();
  }

  animate() {
    // Smooth lerp for ring
    this.pos.x += (this.mouse.x - this.pos.x) * this.speed;
    this.pos.y += (this.mouse.y - this.pos.y) * this.speed;

    // Dot follows mouse directly
    if (this.dot) {
      this.dot.style.left = this.mouse.x - 4 + 'px';
      this.dot.style.top = this.mouse.y - 4 + 'px';
    }

    // Ring follows with delay
    if (this.ring) {
      this.ring.style.left = this.pos.x - 20 + 'px';
      this.ring.style.top = this.pos.y - 20 + 'px';
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ============================================
// Navbar Hide/Show on Scroll
// ============================================
class Navbar {
  constructor() {
    this.nav = document.getElementById('navbar');
    this.toggle = document.getElementById('nav-toggle');
    this.links = document.getElementById('nav-links');
    this.lastScroll = 0;
    this.ticking = false;
    this.init();
  }

  init() {
    // Scroll behavior
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        requestAnimationFrame(() => {
          this.handleScroll();
          this.ticking = false;
        });
        this.ticking = true;
      }
    });

    // Mobile toggle
    if (this.toggle) {
      this.toggle.addEventListener('click', () => {
        this.links.classList.toggle('active');
        this.toggle.classList.toggle('active');
      });
    }
  }

  handleScroll() {
    const currentScroll = window.scrollY;

    if (currentScroll > 100) {
      if (currentScroll > this.lastScroll) {
        // Scrolling down
        this.nav.classList.add('hidden');
      } else {
        // Scrolling up
        this.nav.classList.remove('hidden');
      }
    } else {
      this.nav.classList.remove('hidden');
    }

    this.lastScroll = currentScroll;
  }
}

// ============================================
// Parallax Effect for Orbs
// ============================================
class ParallaxOrbs {
  constructor() {
    this.orbs = document.querySelectorAll('.hero__orb');
    this.init();
  }

  init() {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      this.orbs.forEach((orb, i) => {
        const speed = (i + 1) * 15;
        const rotateSpeed = (i + 1) * 5;
        orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    });
  }
}

// ============================================
// Active Section Highlight
// ============================================
class SectionHighlight {
  constructor() {
    this.sections = document.querySelectorAll('section[id]');
    this.navLinks = document.querySelectorAll('.nav__link');
    this.init();
  }

  init() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.navLinks.forEach((link) => {
              link.style.color = '';
              if (link.getAttribute('href') === `#${entry.target.id}`) {
                link.style.color = 'var(--color-neon-cyan)';
              }
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    this.sections.forEach((section) => observer.observe(section));
  }
}

// ============================================
// Hierarchy Connection Animation
// ============================================
class HierarchyPulse {
  constructor() {
    this.connectors = document.querySelectorAll('.hierarchy__connector');
    this.init();
  }

  init() {
    // Add periodic glow pulse to connectors
    this.connectors.forEach((connector, i) => {
      setInterval(() => {
        connector.style.boxShadow = '0 0 15px rgba(0, 245, 255, 0.3)';
        setTimeout(() => {
          connector.style.boxShadow = '';
        }, 1000);
      }, 3000 + i * 500);
    });
  }
}

// ============================================
// Card Click Effect - Ripple
// ============================================
class RippleEffect {
  constructor() {
    this.cards = document.querySelectorAll(
      '.company-card, .executor-card, .dev-card, .holding-card, .dna-card'
    );
    this.init();
  }

  init() {
    this.cards.forEach((card) => {
      card.addEventListener('click', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('div');
        ripple.style.cssText = `
          position: absolute;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 245, 255, 0.3), transparent);
          transform: translate(-50%, -50%);
          left: ${x}px;
          top: ${y}px;
          pointer-events: none;
          z-index: 1;
        `;

        card.style.position = 'relative';
        card.appendChild(ripple);

        ripple.animate(
          [
            { width: '0px', height: '0px', opacity: 1 },
            { width: '400px', height: '400px', opacity: 0 },
          ],
          {
            duration: 700,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          }
        ).onfinish = () => ripple.remove();
      });
    });
  }
}

// ============================================
// Typing effect for the hero badge
// ============================================
class TypingEffect {
  constructor() {
    this.element = document.querySelector('.hero__badge');
    // Badge already has content, just add the cursor
  }
}

// ============================================
// Initialize Everything
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Prevent scroll during load
  document.body.style.overflow = 'hidden';

  // Initialize core modules
  new Loader();
  new CustomCursor();
  new Navbar();
  new ParallaxOrbs();
  new SectionHighlight();
  new HierarchyPulse();
  new RippleEffect();
});

// ============================================
// Performance: Reduce animations when tab not visible
// ============================================
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.body.style.animationPlayState = 'paused';
  } else {
    document.body.style.animationPlayState = 'running';
  }
});
