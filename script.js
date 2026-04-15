/* ============================================================
   M3LON · VISUAL STORYBOARD · script.js
   The 5 Watermelons · OPSC6311 · March 2026
   ============================================================ */

'use strict';

// ===== SCROLL REVEAL =====
const panels = document.querySelectorAll('.comic-panel');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 100);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

panels.forEach(panel => revealObserver.observe(panel));

// ===== ROBOT EYES TRACK MOUSE =====
const robotHeads = document.querySelectorAll('.robot-head');

document.addEventListener('mousemove', (e) => {
  robotHeads.forEach(head => {
    const rect = head.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const angle = Math.atan2(dy, dx);

    const dist = Math.min(2, Math.sqrt(dx * dx + dy * dy) / 80);

    const offsetX = Math.cos(angle) * dist;
    const offsetY = Math.sin(angle) * dist;

    head.querySelectorAll('.robot-eye').forEach(eye => {
      eye.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
  });
});

// ===== TYPING EFFECT =====
function typeWriter(element, speed = 18) {
  const text = element.innerHTML;
  element.innerHTML = '';
  element.style.opacity = '1';
  let i = 0;
  let inTag = false;
  let tagBuffer = '';

  function type() {
    if (i < text.length) {
      const char = text[i];

      if (char === '<') {
        inTag = true;
        tagBuffer = '<';
      } else if (char === '>' && inTag) {
        inTag = false;
        tagBuffer += '>';
        element.innerHTML += tagBuffer;
        tagBuffer = '';
      } else if (inTag) {
        tagBuffer += char;
      } else {
        element.innerHTML += char;
      }
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Trigger typing on hero speech when visible
const heroSpeech = document.querySelector('.hero-speech .type-text');
if (heroSpeech) {
  setTimeout(() => {
    typeWriter(heroSpeech, 15);
  }, 1000);
}

// ===== PHONE HOVER 3D TILT =====
const phoneFrames = document.querySelectorAll('.phone-frame');

phoneFrames.forEach(phone => {
  phone.addEventListener('mousemove', (e) => {
    const rect = phone.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    phone.style.transform = `
      perspective(600px)
      rotateY(${x * 12}deg)
      rotateX(${-y * 8}deg)
      translateY(-6px)
      scale(1.02)
    `;
  });

  phone.addEventListener('mouseleave', () => {
    phone.style.transform = '';
    phone.style.transition = 'transform 0.4s ease';
    setTimeout(() => {
      phone.style.transition = '';
    }, 400);
  });
});

// ===== PANEL SCREEN NUMBER COUNTER =====
const panelNumbers = document.querySelectorAll('.panel-bg-number');
panelNumbers.forEach(num => {
  const parent = num.closest('.comic-panel');

  const numObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        num.style.animation = 'none';
        num.style.opacity = '0.08';
        setTimeout(() => {
          num.style.opacity = '0.05';
        }, 300);
      }
    });
  }, { threshold: 0.2 });

  if (parent) numObserver.observe(parent);
});

// ===== FLOW NODE TOOLTIPS (CLICK) =====
const flowNodes = document.querySelectorAll('.flow-node');

flowNodes.forEach(node => {
  node.addEventListener('click', () => {
    // Flash the node
    node.style.background = 'rgba(0,188,212,0.2)';
    node.style.boxShadow = '0 0 25px rgba(0,188,212,0.5)';
    setTimeout(() => {
      node.style.background = '';
      node.style.boxShadow = '';
    }, 500);
  });
});

// ===== SPEC BAR MARQUEE (duplicate content) =====
const specBar = document.querySelector('.spec-bar');
if (specBar) {
  const clone = specBar.innerHTML;
  specBar.innerHTML += clone; // Duplicate for seamless loop
}

// ===== BADGE HOVER GLOW =====
const earnedBadges = document.querySelectorAll('.badge.earned');
earnedBadges.forEach(badge => {
  badge.addEventListener('mouseenter', () => {
    badge.style.transform = 'scale(1.3) rotate(10deg)';
    badge.style.transition = 'transform 0.2s ease';
    badge.style.zIndex = '10';
  });
  badge.addEventListener('mouseleave', () => {
    badge.style.transform = '';
    badge.style.zIndex = '';
  });
});

// ===== XP BAR ANIMATE ON SCROLL =====
const xpFill = document.querySelector('.xp-fill');
if (xpFill) {
  xpFill.style.width = '0';
  const xpObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          xpFill.style.transition = 'width 1.5s ease';
          xpFill.style.width = '65%';
        }, 300);
        xpObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  xpObserver.observe(xpFill.closest('.screen-profile') || xpFill);
}

// ===== BUDGET BAR ANIMATE ON SCROLL =====
const budgetFill = document.querySelector('.budget-fill');
if (budgetFill) {
  const origWidth = budgetFill.style.width;
  budgetFill.style.width = '0';
  const budObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          budgetFill.style.transition = 'width 1.5s ease';
          budgetFill.style.width = origWidth || '93%';
        }, 500);
        budObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  budObserver.observe(budgetFill.closest('.phone-frame') || budgetFill);
}

// ===== TECH CARD STAGGER ANIMATION =====
const techCards = document.querySelectorAll('.tech-card');
techCards.forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          card.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 80);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  cardObserver.observe(card);
});

// ===== PIE CHART ANIMATION =====
const pieSegments = document.querySelectorAll('.pie-svg circle');
pieSegments.forEach((seg, i) => {
  const dashArray = seg.getAttribute('stroke-dasharray');
  const dashOffset = seg.getAttribute('stroke-dashoffset');
  seg.setAttribute('stroke-dasharray', '0 172');
  seg.setAttribute('stroke-dashoffset', '0');

  const pieObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          seg.style.transition = `stroke-dasharray 0.8s ease ${i * 0.15}s, stroke-dashoffset 0.8s ease ${i * 0.15}s`;
          seg.setAttribute('stroke-dasharray', dashArray);
          seg.setAttribute('stroke-dashoffset', dashOffset);
        }, 200);
        pieObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  pieObserver.observe(seg.closest('.pie-chart-mock') || seg);
});

// ===== MELON-BOT RANDOM BLINK =====
function randomBlink() {
  const eyes = document.querySelectorAll('.robot-eye:not(.blink):not(.glow-eye)');
  if (eyes.length) {
    const randomEye = eyes[Math.floor(Math.random() * eyes.length)];
    randomEye.style.transform = 'scaleY(0.1)';
    setTimeout(() => {
      randomEye.style.transform = '';
    }, 100);
  }
  setTimeout(randomBlink, Math.random() * 4000 + 2000);
}
randomBlink();

// ===== GRAPH LINE DRAW ANIMATION =====
const linePath = document.querySelector('.line-graph-svg path:last-of-type');
if (linePath) {
  const length = 300; // approximate
  linePath.style.strokeDasharray = length;
  linePath.style.strokeDashoffset = length;

  const pathObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        linePath.style.transition = 'stroke-dashoffset 2s ease';
        linePath.style.strokeDashoffset = '0';
        pathObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const graphArea = linePath.closest('.graph-area');
  if (graphArea) pathObserver.observe(graphArea);
}

// ===== CONSOLE EASTER EGG =====
console.log('%c🍉 M3LON · OPSC6311 · The 5 Watermelons', 'color:#00BCD4;font-family:monospace;font-size:16px;font-weight:bold;');
console.log('%c// Smart Banking · Sliced Simple', 'color:#FF6F00;font-family:monospace;font-size:12px;');
console.log('%cTeam: Zandile · Tshiamo · Muhluri · Matlhogonolo · Ndabezinhle', 'color:#78909C;font-family:monospace;font-size:10px;');
console.log('%c🤖 MELON-BOT operational. All systems go.', 'color:#4CAF50;font-family:monospace;font-size:11px;');