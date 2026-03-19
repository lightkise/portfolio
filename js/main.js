// 手风琴
document.querySelectorAll('.acc-header').forEach(header => {
  const item = header.parentElement;
  header.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    item.closest('.accordion').querySelectorAll('.acc-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// 导航高亮
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 80) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
});

// 技能标签联动
document.querySelectorAll('.skill-tag-work').forEach(tag => {
  const targetId = tag.dataset.target;
  const card = document.getElementById(targetId);
  tag.addEventListener('mouseenter', () => {
    document.querySelectorAll('.skill-work-card').forEach(c => c.classList.remove('highlighted'));
    document.querySelectorAll('.skill-tag-work').forEach(t => t.classList.remove('active'));
    if (card) card.classList.add('highlighted');
    tag.classList.add('active');
  });
  tag.addEventListener('mouseleave', () => {
    if (card) card.classList.remove('highlighted');
    tag.classList.remove('active');
  });
});

// 技能灯箱
function openSkillLightbox(src) {
  document.getElementById('skill-lightbox-img').src = src;
  document.getElementById('skill-lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeSkillLightbox() {
  document.getElementById('skill-lightbox').classList.remove('active');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSkillLightbox();
});

// 3D 照片旋转木马
(function() {
  const cards = [
    document.getElementById('c0'),
    document.getElementById('c1'),
    document.getElementById('c2'),
  ];
  if (!cards[0]) return;

  let offset = 0;
  let rafId = null;

  const POS = [
    { x: 120, y: 0,  z: 0,   rotY: 0,   scale: 1,    opacity: 1,    zIndex: 3, shadow: '0 20px 56px rgba(0,0,0,0.18)' },
    { x: 290, y: 30, z: -100, rotY: -38, scale: 0.74, opacity: 0.8,  zIndex: 2, shadow: '0 8px 24px rgba(0,0,0,0.12)' },
    { x: -50, y: 30, z: -100, rotY: 38,  scale: 0.74, opacity: 0.8,  zIndex: 2, shadow: '0 8px 24px rgba(0,0,0,0.12)' },
  ];

  function getSlot(i) {
    const angle = ((i * 120 - offset) % 360 + 360) % 360;
    if (angle < 60 || angle >= 300) return 0;
    if (angle >= 60 && angle < 180) return 1;
    return 2;
  }

  function applyPositions() {
    cards.forEach((card, i) => {
      const p = POS[getSlot(i)];
      card.style.transform = `translate(${p.x}px, ${p.y}px) translateZ(${p.z}px) rotateY(${p.rotY}deg) scale(${p.scale})`;
      card.style.opacity = p.opacity;
      card.style.zIndex = p.zIndex;
      card.style.boxShadow = p.shadow;
    });
  }

  function snapLoop() {
    const snap = Math.round(offset / 120) * 120;
    const diff = snap - offset;
    if (Math.abs(diff) > 0.2) {
      offset += diff * 0.1;
      applyPositions();
      rafId = requestAnimationFrame(snapLoop);
    } else {
      offset = snap;
      applyPositions();
    }
  }

  const stage = document.getElementById('carouselStage');

  stage.addEventListener('mousemove', e => {
    cancelAnimationFrame(rafId);
    const rect = stage.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const target = (pct - 0.5) * 2 * 180;
    offset += (target - offset) * 0.12;
    applyPositions();
  });

  stage.addEventListener('mouseleave', () => {
    rafId = requestAnimationFrame(snapLoop);
  });

  // 触摸
  let touchStartX = 0;
  let touchOffset = 0;

  stage.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchOffset = offset;
    cancelAnimationFrame(rafId);
  });

  stage.addEventListener('touchmove', e => {
    e.preventDefault();
    const dx = e.touches[0].clientX - touchStartX;
    offset = touchOffset - dx * 0.5;
    applyPositions();
  }, { passive: false });

  stage.addEventListener('touchend', () => {
    rafId = requestAnimationFrame(snapLoop);
  });

  applyPositions();
})();