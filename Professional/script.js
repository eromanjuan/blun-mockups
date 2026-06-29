(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const themeToggleButtons = document.querySelectorAll('[data-theme-toggle]');

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');

    const label = isDark ? 'Light' : 'Dark';
    const icon = isDark ? 'light_mode' : 'dark_mode';

    const btns = [toggle, ...themeToggleButtons].filter(Boolean);
    btns.forEach((b) => {
      b.setAttribute('aria-pressed', String(isDark));
      const iconEl = b.querySelector('.theme-icon');
      const labelEl = b.querySelector('.theme-label');
      if (iconEl) iconEl.textContent = icon;
      if (labelEl) labelEl.textContent = label;
    });

    try {
      localStorage.setItem('blun-theme', theme);
    } catch {}
  }

  function getInitialTheme() {
    try {
      const saved = localStorage.getItem('blun-theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {}
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  const initialTheme = getInitialTheme();
  applyTheme(initialTheme);

  function toggleTheme() {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  if (toggle) toggle.addEventListener('click', toggleTheme);
  themeToggleButtons.forEach((b) => b.addEventListener('click', toggleTheme));

  // Mobile menu
  const navToggle = document.querySelector('.nav-toggle');
  const mobilePanel = document.querySelector('.mobile-panel');
  const mobileLinks = mobilePanel ? mobilePanel.querySelectorAll('a') : [];

  function setExpanded(expanded) {
    navToggle?.setAttribute('aria-expanded', String(expanded));
    if (mobilePanel) mobilePanel.hidden = !expanded;
  }

  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    setExpanded(!expanded);
  });

  mobileLinks.forEach((a) => a.addEventListener('click', () => setExpanded(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setExpanded(false);
  });

  // Header elevate on scroll
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    const elevate = window.scrollY > 12;
    header.setAttribute('data-elevate', elevate ? 'true' : 'false');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Smooth anchor scroll (respect reduced motion)
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || href.length < 2) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setExpanded(false);
      });
    });
  }

  // Quick form demo
  const quickForm = document.getElementById('quickForm');
  quickForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const note = quickForm.querySelector('.form-note');
    const fd = new FormData(quickForm);
    const email = String(fd.get('email') || '').trim();
    if (note) note.textContent = email ? `Thanks! We’ll send updates to ${email} (demo).` : 'Thanks! We’ll send updates (demo).';
    quickForm.reset();
  });

  // Contact form demo
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.getElementById('contactStatus');
    if (status) status.textContent = 'Message captured locally for demo purposes. Connect this form to your backend when ready.';
    contactForm.reset();
  });

  // Donation pills
  const amountEl = document.getElementById('selectedAmount');
  const pills = document.querySelectorAll('.pill');
  pills.forEach((p) => {
    p.addEventListener('click', () => {
      pills.forEach((x) => x.classList.remove('pill--active'));
      p.classList.add('pill--active');
      if (amountEl) amountEl.textContent = p.textContent.trim();
    });
  });

  // Footer year
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();