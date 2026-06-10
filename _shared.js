// ── SHARED JS ── sentinelarc

const TICKER_ITEMS = [
  {text:'THREAT DETECTED: Brute-force attempt blocked — 192.168.44.21', cls:''},
  {text:'SYSTEM NOMINAL: Firewall rules updated — 3,847 packets filtered', cls:'ok'},
  {text:'ALERT: Suspicious lateral movement detected — Sector 7G', cls:''},
  {text:'SCAN COMPLETE: Zero-day vulnerability patched — CVE-2026-0941', cls:'ok'},
  {text:'THREAT NEUTRALIZED: Ransomware payload quarantined — Node 14', cls:'ok'},
  {text:'MONITORING: 2,341 endpoints active — All systems operational', cls:'ok'},
  {text:'ALERT: Anomalous outbound traffic — East datacenter', cls:''},
  {text:'INCIDENT CLOSED: SQL injection attempt blocked — API Gateway', cls:'ok'},
  {text:'THREAT INTEL: New APT signature added to detection engine', cls:''},
  {text:'SYSTEM: Threat correlation engine updated — 99.97% uptime', cls:'ok'},
];

function buildTicker() {
  const ticker = document.getElementById('ticker');
  if (!ticker) return;
  const inner = document.createElement('div');
  inner.className = 'ticker-inner';
  // duplicate for seamless loop
  [...TICKER_ITEMS, ...TICKER_ITEMS].forEach(item => {
    const el = document.createElement('span');
    el.className = 'ticker-item' + (item.cls ? ' ticker-'+item.cls : '');
    el.innerHTML = `<span class="ticker-dot"></span>${item.text}`;
    inner.appendChild(el);
  });
  ticker.appendChild(inner);
}

// CURSOR
function buildCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;
  let mx=0,my=0,cx=0,cy=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
  (function tick() {
    cx += (mx-cx)*0.14; cy += (my-cy)*0.14;
    cursor.style.left = cx+'px'; cursor.style.top = cy+'px';
    requestAnimationFrame(tick);
  })();
  document.querySelectorAll('a,button,.panel,.stat-card,.team-card,.service-card,.project-card,.contact-item').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

// SCRAMBLE
const CHARS = '!@#$%^&*<>[]{}|\\/#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
class Scramble {
  constructor(el) { this.el = el; this.orig = el.innerHTML; this.plain = el.textContent; }
  run() {
    const chars = [...this.plain];
    let frame = 0;
    const total = chars.length + 14;
    const tick = () => {
      let out = '';
      chars.forEach((ch, i) => {
        const s = i*0.6, e = s+10;
        if (frame >= e || ch === ' ') out += ch;
        else if (frame >= s) out += `<span class="glitch-char">${CHARS[Math.floor(Math.random()*CHARS.length)]}</span>`;
        else out += `<span style="opacity:0">${ch}</span>`;
      });
      if (!this.el.querySelector('.accent-r,.accent-c,.accent-g')) this.el.innerHTML = out;
      else this.el.style.opacity = frame < 5 ? String(0.3+Math.random()*0.7) : '1';
      frame++;
      if (frame < total) requestAnimationFrame(tick);
      else this.el.innerHTML = this.orig;
    };
    requestAnimationFrame(tick);
  }
}

// SCROLL REVEAL (bidirectional)
function buildReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const idx = Array.from(reveals).indexOf(e.target);
        setTimeout(() => e.target.classList.add('visible'), (idx%4)*70);
      } else {
        e.target.classList.remove('visible');
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => obs.observe(el));

  const scrambles = document.querySelectorAll('.section-h, .card-title, .team-name, .stat-value');
  const sObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) new Scramble(e.target).run(); });
  }, { threshold: 0.3 });
  scrambles.forEach(el => sObs.observe(el));
}

// COUNTER ANIMATION
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const dur = 1800;
  const step = 16;
  const increment = target / (dur / step);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + increment, target);
    el.textContent = Math.floor(current).toLocaleString() + suffix;
    if (current >= target) clearInterval(timer);
  }, step);
}

function buildCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => obs.observe(el));
}

// NAV TOGGLE
function buildNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
  buildTicker();
  buildCursor();
  buildReveal();
  buildCounters();
  buildNav();
});
