(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const selectors = [
    '.identity > *',
    '.directions > *',
    '.hero-content > *',
    '.hero-copy > *',
    '.hero-foot > *',
    '.reel-frame',
    '.section-head',
    '.section-heading > *',
    '.direct-copy > *',
    '.service-grid > *',
    '.bts-grid > *',
    '.approach-copy > *',
    '.cases-intro > *',
    '.film-poster',
    '.project-gallery-two > *',
    '.project-gallery-three > *',
    '.editorial-grid > *',
    '.project-visuals > *',
    '.project-info > *',
    '.dop-content > *',
    '.work-grid > *',
    '.contact-grid > *',
    '.contact.section > *',
    '.hero-image',
    '.intro-grid > *',
    '.film > *',
    '.gallery-grid > *',
    '.process-grid > *',
    '.story-grid > *',
    '.wide-photo',
    '.hole-grid > *',
    '.section-footnote > *',
    '.course-example > *',
    '.process-top > *',
    '.steps > *',
    '.collage-heading > *',
    '.photo-collage > *:not([hidden])',
    '.gallery-actions',
    '.gallery-credit',
    '.package-grid > *',
    '.package-note',
    '.weather-note > *'
  ];

  const candidates = [...new Set(document.querySelectorAll(selectors.join(',')))]
    .filter((element) => !element.closest('[hidden], dialog, .film-modal'));

  const parentCounts = new Map();
  candidates.forEach((element) => {
    const parent = element.parentElement;
    const count = parentCounts.get(parent) || 0;
    parentCounts.set(parent, count + 1);

    element.classList.add('reveal-item');
    if (element.matches('figure, button, .hero-image, .reel-frame, .film-frame, .film-poster, .film-card, .bts-shot, .hole, .package')) {
      element.classList.add('reveal-media');
    }
    element.style.setProperty('--reveal-delay', `${Math.min(count, 4) * 70}ms`);
  });

  root.classList.add('reveal-js');

  if (reducedMotion || !('IntersectionObserver' in window)) {
    candidates.forEach((element) => element.classList.add('reveal-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('reveal-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -7% 0px'
  });

  requestAnimationFrame(() => candidates.forEach((element) => observer.observe(element)));

  const hiddenPhotos = document.querySelectorAll('.collage-photo[hidden]');
  if (hiddenPhotos.length) {
    const hiddenObserver = new MutationObserver((mutations) => {
      mutations.forEach(({ target }) => {
        if (target.hidden || target.classList.contains('reveal-item')) return;
        target.classList.add('reveal-item', 'reveal-media');
        requestAnimationFrame(() => observer.observe(target));
      });
    });
    hiddenPhotos.forEach((photo) => hiddenObserver.observe(photo, { attributes: true, attributeFilter: ['hidden'] }));
  }
})();
