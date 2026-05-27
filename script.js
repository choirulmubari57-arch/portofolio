/* ============================================
   PORTOFOLIO — script.js
   Menangani: nav scroll, efek mengetik,
   scroll reveal, counter angka, modal
============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Efek blur navigasi saat scroll ────────
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });


  // ── 2. Smooth scroll untuk link navigasi ─────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ── 3. Efek mengetik di terminal ──────────────
  const typedCmd = document.getElementById('typedCmd');
  const perintah = [
    'bangun_portofolio --stack=react,node',
    'otomasi_laporan --sumber=api --output=csv',
    'deploy --env=produksi --force',
    'scraping_data --url=target.com --limit=5000',
    'jalankan tes && push origin main',
  ];

  let cmdIndex    = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let typingDelay = 90;

  function efekMengetik() {
    const current = perintah[cmdIndex];

    if (!isDeleting) {
      typedCmd.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        typingDelay = 1800; // jeda sebelum hapus
      } else {
        typingDelay = 70 + Math.random() * 40;
      }
    } else {
      typedCmd.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        cmdIndex = (cmdIndex + 1) % perintah.length;
        typingDelay = 400;
      } else {
        typingDelay = 40;
      }
    }

    setTimeout(efekMengetik, typingDelay);
  }

  // Mulai mengetik setelah animasi hero selesai
  setTimeout(efekMengetik, 1400);


  // ── 4. Scroll reveal (IntersectionObserver) ───
  const revealItems = document.querySelectorAll('.skill-card, .project-card');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const index = parseInt(el.dataset.index) || 0;

        setTimeout(() => {
          el.classList.add('visible');
        }, index * 120);

        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealItems.forEach(el => revealObserver.observe(el));


  // ── 5. Animasi counter angka ──────────────────
  const counters = document.querySelectorAll('.counter');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animasiCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  function animasiCounter(el) {
    const target    = parseInt(el.dataset.target, 10);
    const durasi    = 1600;
    const langkah   = 16;
    const steps     = durasi / langkah;
    const increment = target / steps;
    let current     = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target.toLocaleString("id-ID");
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current).toLocaleString("id-ID");
      }
    }, langkah);
  }


  // ── 6. Modal rekrut saya ──────────────────────
  const hireMeBtn    = document.getElementById('hireMeBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose   = document.getElementById('modalClose');

  function bukaModal() {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function tutupModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hireMeBtn.addEventListener('click', bukaModal);
  modalClose.addEventListener('click', tutupModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) tutupModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') tutupModal();
  });


  // ── 7. Highlight nav link aktif saat scroll ───
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => sectionObserver.observe(section));

});
// Render proyek dari dashboard
const proyekData = JSON.parse(localStorage.getItem('proyek') || '[]');

const katLabel = {
  web: 'web development',
  data: 'otomasi data',
  webdata: 'web + data'
};

const list = document.querySelector('.projects__list');
if (proyekData.length > 0) {
  list.innerHTML = proyekData.map((p, i) => `
    <article class="project-card" data-index="${i}">
      <div class="project-card__number">00${i+1}</div>
      <div class="project-card__content">
        <span class="project-card__type">${katLabel[p.kat]}</span>
        <h3 class="project-card__title">${p.nama}</h3>
        <p class="project-card__desc">${p.deskripsi}</p>
        ${p.foto1 || p.foto2 ? `
          <div class="project-images">
            ${p.foto1 ? `<img src="${p.foto1}" class="project-image">` : ''}
            ${p.foto2 ? `<img src="${p.foto2}" class="project-image">` : ''}
          </div>` : ''}
        ${p.demo ? `<a href="${p.demo}" target="_blank" class="project-demo">demo</a>` : ''}
        <div class="project-card__stack">
          ${p.tags.map(t => `<span>${t}</span>`).join('')}
        </div>
      </div>
      <div class="project-card__links">
        ${p.demo ? `<a href="${p.demo}" target="_blank" class="project-card__link">&#8599;</a>` : ''}
        ${p.github ? `<a href="${p.github}" target="_blank" class="project-card__link">&#60;/&#62;</a>` : ''}
      </div>
    </article>
  `).join('');
}
