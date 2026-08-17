/**
 * KREATEK HOLDING - Interactive Particle System
 * Creates a dynamic, reactive particle network background
 */

class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: -1000, y: -1000, radius: 150 };
    this.connectionDistance = 120;
    this.particleCount = 0;
    this.animationId = null;
    this.hue = 180; // Start with cyan
    
    this.resize();
    this.init();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.calculateParticleCount();
  }

  calculateParticleCount() {
    const area = this.canvas.width * this.canvas.height;
    this.particleCount = Math.min(Math.floor(area / 12000), 120);
  }

  init() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    const size = Math.random() * 2 + 0.5;
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: size,
      baseSize: size,
      opacity: Math.random() * 0.5 + 0.1,
      hueOffset: Math.random() * 60 - 30,
    };
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.init();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Slowly shift hue
    this.hue = (this.hue + 0.05) % 360;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Boundary wrapping
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      // Mouse interaction - subtle repulsion
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.mouse.radius) {
        const force = (this.mouse.radius - dist) / this.mouse.radius;
        const angle = Math.atan2(dy, dx);
        p.vx -= Math.cos(angle) * force * 0.02;
        p.vy -= Math.sin(angle) * force * 0.02;
        p.size = p.baseSize + force * 2;
      } else {
        p.size += (p.baseSize - p.size) * 0.05;
      }

      // Damping
      p.vx *= 0.999;
      p.vy *= 0.999;

      // Draw particle
      const particleHue = (this.hue + p.hueOffset + 180) % 360;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `hsla(${particleHue}, 100%, 70%, ${p.opacity})`;
      this.ctx.fill();

      // Draw connections
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const cdx = p.x - p2.x;
        const cdy = p.y - p2.y;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

        if (cdist < this.connectionDistance) {
          const connectionOpacity = (1 - cdist / this.connectionDistance) * 0.15;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `hsla(${(this.hue + 180) % 360}, 80%, 60%, ${connectionOpacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }

      // Draw mouse connections
      if (dist < this.mouse.radius * 1.5) {
        const mouseOpacity = (1 - dist / (this.mouse.radius * 1.5)) * 0.25;
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(this.mouse.x, this.mouse.y);
        this.ctx.strokeStyle = `hsla(${this.hue}, 100%, 70%, ${mouseOpacity})`;
        this.ctx.lineWidth = 0.3;
        this.ctx.stroke();
      }
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// Initialize particle system
window.particleSystem = new ParticleSystem('particles-canvas');
