/* ============================================================
   M3LON · VISUAL STORYBOARD · script.js
   The 5 Watermelons · OPSC6311 · March 2026
   Watermelon Bot Eye Tracking, Scroll Reveal, Phone 3D Tilt,
   Bar animations, XP bar, Pie chart, Nav tooltips
   ============================================================ */

'use strict';

/* ================================================
   1. SCROLL REVEAL — panels fade up into view
   ================================================ */
const revealEls = document.querySelectorAll('.reveal');

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Once revealed, stop observing
      revealObs.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -50px 0px'
});

revealEls.forEach(el => revealObs.observe(el));

/* Also trigger screen-panel reveals */
const screenPanels = document.querySelectorAll('.screen-panel');
const spObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, 80);
      spObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.06 });

screenPanels.forEach(sp => {
  sp.style.opacity = '0';
  sp.style.transform = 'translateY(28px)';
  sp.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
  spObs.observe(sp);
});

/* ================================================
   2. WATERMELON BOT EYE TRACKING
   ================================================ */
document.addEventListener('mousemove', (e) => {
  const allEyes = document.querySelectorAll('.wm-eye');
  allEyes.forEach(eye => {
    const rect = eye.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = e.clientX - cx;
    const dy   = e.clientY - cy;
    const dist = Math.min(2.5, Math.sqrt(dx * dx + dy * dy) / 75);
    const angle = Math.atan2(dy, dx);
    eye.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
  });
});

/* ================================================
   3. WATERMELON BOT RANDOM BLINK
   ================================================ */
function scheduleRandomBlink() {
  const delay = Math.random() * 3500 + 1500;
  setTimeout(() => {
    // pick a random wm-eye pair to blink
    const allBots  = document.querySelectorAll('.wm-inner, .sm-inner');
    if (allBots.length) {
      const bot  = allBots[Math.floor(Math.random() * allBots.length)];
      const eyes = bot.querySelectorAll('.wm-eye');
      eyes.forEach(e => {
        e.style.transform = 'scaleY(0.12)';
        setTimeout(() => { e.style.transform = ''; }, 110);
      });
    }
    scheduleRandomBlink();
  }, delay);
}
scheduleRandomBlink();

/* ================================================
   4. PHONE 3D TILT ON HOVER
   ================================================ */
const phones = document.querySelectorAll('.phone');
phones.forEach(phone => {
  phone.addEventListener('mousemove', (e) => {
    const rect = phone.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    phone.style.transform = `
      perspective(700px)
      rotateY(${x * 14}deg)
      rotateX(${-y * 9}deg)
      translateY(-8px) scale(1.02)
    `;
  });
  phone.addEventListener('mouseleave', () => {
    phone.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
    phone.style.transform  = '';
    setTimeout(() => { phone.style.transition = ''; }, 420);
  });
});

/* ================================================
   5. ANIMATE BARS WHEN SCROLLED INTO VIEW
   ================================================ */

/* Budget progress bar in home screen */
const budgetFills = document.querySelectorAll('.phb-fill');
budgetFills.forEach(fill => {
  const target = fill.style.width || '0%';
  fill.style.width = '0%';
  fill.style.transition = 'none';
  const bfObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        requestAnimationFrame(() => {
          fill.style.transition = 'width 1.6s cubic-bezier(0.4, 0, 0.2, 1)';
          fill.style.width = target;
        });
        bfObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  bfObs.observe(fill.closest('.phone') || fill);
});

/* XP bar */
const xpFills = document.querySelectorAll('.ppr-xp-fill');
xpFills.forEach(fill => {
  fill.style.width = '0%';
  fill.style.transition = 'none';
  const xpObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          fill.style.transition = 'width 1.8s cubic-bezier(0.4, 0, 0.2, 1)';
          fill.style.width = '65%';
        }, 300);
        xpObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  xpObs.observe(fill.closest('.phone') || fill);
});

/* Password strength bar */
const pwFills = document.querySelectorAll('.pw-str-fill');
pwFills.forEach(fill => {
  fill.style.width = '0%';
  const pwObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          fill.style.transition = 'width 1.2s ease';
          fill.style.width = '60%';
        }, 200);
        pwObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  pwObs.observe(fill.closest('.phone') || fill);
});

/* Summary bars */
const sumFills = document.querySelectorAll('.psu-fill');
sumFills.forEach(fill => {
  const target = fill.style.width || '0%';
  fill.style.width = '0%';
  const sfObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          fill.style.transition = 'width 1.4s ease';
          fill.style.width = target;
        }, 150);
        sfObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  sfObs.observe(fill.closest('.phone') || fill);
});

/* Year summary mini-bars */
const ybFills = document.querySelectorAll('.yb-fill');
ybFills.forEach((fill, i) => {
  const target = fill.style.width || '0%';
  fill.style.width = '0%';
  const ybObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          fill.style.transition = `width 1s ease ${i * 0.1}s`;
          fill.style.width = target;
        }, 200);
        ybObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  ybObs.observe(fill.closest('.phone') || fill);
});

/* ================================================
   6. PIE CHART ANIMATION — stroke-dasharray draw-in
   ================================================ */
const pieCircles = document.querySelectorAll('.psu-pie circle, .pgr-svg circle');
pieCircles.forEach((circle, i) => {
  const origDash   = circle.getAttribute('stroke-dasharray');
  const origOffset = circle.getAttribute('stroke-dashoffset');
  circle.setAttribute('stroke-dasharray', '0 999');
  const pcObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          circle.style.transition = `stroke-dasharray 0.9s ease ${i * 0.18}s, stroke-dashoffset 0.9s ease ${i * 0.18}s`;
          circle.setAttribute('stroke-dasharray',  origDash);
          circle.setAttribute('stroke-dashoffset', origOffset);
        }, 200);
        pcObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  pcObs.observe(circle.closest('.phone') || circle);
});

/* ================================================
   7. LINE GRAPH PATH DRAW
   ================================================ */
const linePaths = document.querySelectorAll('.pgr-svg path');
linePaths.forEach(path => {
  const len = 350; // approximate path length
  path.style.strokeDasharray  = `${len}`;
  path.style.strokeDashoffset = `${len}`;
  const lpObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        path.style.transition = 'stroke-dashoffset 2.2s cubic-bezier(0.4, 0, 0.2, 1)';
        path.style.strokeDashoffset = '0';
        lpObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  lpObs.observe(path.closest('.phone') || path);
});

/* ================================================
   8. HERO TYPEWRITER EFFECT
   ================================================ */
function typeWriter(el, speed = 16) {
  const full = el.innerHTML;
  el.innerHTML = '';
  el.style.opacity = '1';
  let i = 0;
  let inTag = false;
  let tagBuf = '';

  function step() {
    if (i >= full.length) return;
    const ch = full[i];
    if (ch === '<') { inTag = true; tagBuf = '<'; }
    else if (ch === '>' && inTag) { inTag = false; tagBuf += '>'; el.innerHTML += tagBuf; tagBuf = ''; }
    else if (inTag)  { tagBuf += ch; }
    else             { el.innerHTML += ch; }
    i++;
    setTimeout(step, speed);
  }
  step();
}

const heroTxt = document.getElementById('heroText');
if (heroTxt) {
  setTimeout(() => typeWriter(heroTxt, 14), 900);
}

/* ================================================
   9. COLOUR SWATCHES — click to copy hex
   ================================================ */
const swatches = document.querySelectorAll('.cp-swatch');
swatches.forEach(sw => {
  sw.addEventListener('click', () => {
    const hexSpan = sw.querySelector('span:first-child');
    if (!hexSpan) return;
    const hex = hexSpan.textContent.trim();
    navigator.clipboard.writeText(hex).then(() => {
      const orig = hexSpan.textContent;
      hexSpan.textContent = 'Copied!';
      sw.style.boxShadow = '0 0 18px rgba(74,191,170,0.6)';
      setTimeout(() => {
        hexSpan.textContent = orig;
        sw.style.boxShadow = '';
      }, 1200);
    }).catch(() => {});
  });
  sw.title = 'Click to copy HEX';
  sw.style.cursor = 'pointer';
});

/* ================================================
   10. BADGE HOVER BOUNCE
   ================================================ */
const earnedBadges = document.querySelectorAll('.earned-pb, .earned-badge');
earnedBadges.forEach(badge => {
  badge.addEventListener('mouseenter', () => {
    badge.style.transform  = 'scale(1.35) rotate(12deg)';
    badge.style.transition = 'transform 0.2s ease';
    badge.style.zIndex     = '20';
  });
  badge.addEventListener('mouseleave', () => {
    badge.style.transform = '';
    badge.style.zIndex    = '';
  });
});

/* ================================================
   11. NAV FLOW NODES — click highlight + tooltip
   ================================================ */
const flowNodes = document.querySelectorAll('.fv-node');
flowNodes.forEach(node => {
  node.addEventListener('click', () => {
    node.style.background   = 'rgba(74,191,170,0.18)';
    node.style.borderColor  = 'var(--teal-brand)';
    node.style.boxShadow    = '0 0 25px rgba(74,191,170,0.45)';
    setTimeout(() => {
      node.style.background  = '';
      node.style.borderColor = '';
      node.style.boxShadow   = '';
    }, 550);
  });
});

/* ================================================
   12. FEATURE CARDS STAGGER ENTRANCE
   ================================================ */
const featCards = document.querySelectorAll('.feat-card, .innov-item, .fr-card, .nfr-item');
featCards.forEach((card, i) => {
  card.style.opacity   = '0';
  card.style.transform = 'translateY(18px)';
  const fcObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          card.style.transition = `opacity 0.5s ease ${(i % 6) * 0.08}s, transform 0.5s ease ${(i % 6) * 0.08}s`;
          card.style.opacity    = '1';
          card.style.transform  = 'translateY(0)';
        }, 50);
        fcObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  fcObs.observe(card);
});

/* ================================================
   13. TECH SPEC ROW — stagger chip entrance
   ================================================ */
const tcChips = document.querySelectorAll('.team-chips span');
tcChips.forEach((chip, i) => {
  chip.style.opacity   = '0';
  chip.style.transform = 'scale(0.85)';
  setTimeout(() => {
    chip.style.transition = `opacity 0.4s ease ${i * 0.1}s, transform 0.4s ease ${i * 0.1}s`;
    chip.style.opacity    = '1';
    chip.style.transform  = 'scale(1)';
  }, 1400 + i * 80);
});

/* ================================================
   14. SPLASH LOADING BAR LOOP (inside phone screens)
   ================================================ */
// Already handled via CSS animation @keyframes loadFill in styles.css

/* ================================================
   15. CATEGORY RING FILL ANIMATION ON SCROLL
   ================================================ */
const catRings = document.querySelectorAll('.phc-ring');
catRings.forEach(ring => {
  const orig = ring.style.background;
  ring.style.background = 'rgba(255,255,255,0.06)';
  const crObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          ring.style.transition = 'background 1.2s ease';
          ring.style.background = orig;
        }, 400);
        crObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  crObs.observe(ring.closest('.phone') || ring);
});

/* ================================================
   16. CONSOLE EASTER EGG
   ================================================ */
console.log('%c🍉 M3LON · OPSC6311 · The 5 Watermelons',
  'color:#4ABFAA;font-family:monospace;font-size:18px;font-weight:bold;background:#101010;padding:4px 8px;border-radius:4px;');
console.log('%c// Smart Banking · Sliced Simple',
  'color:#E8635A;font-family:monospace;font-size:12px;');
console.log('%cTeam: Zandile · Tshiamo · Muhluri · Matlhogonolo · Ndabezinhle',
  'color:#405060;font-family:monospace;font-size:10px;');
console.log('%c🤖 MELON-BOT is operational. All systems nominal. Zero blue detected ✓',
  'color:#E8B84B;font-family:monospace;font-size:11px;');
console.log('%cColours: #101010 | #4ABFAA | #E8635A | #E8B84B | #70C0A0 | #C0392B',
  'color:#7ABFB0;font-family:monospace;font-size:10px;');