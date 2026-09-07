/* ============================================================
   AIRTEL AFRICA + TRANCE AI — STRATEGIC PITCH DECK ENGINE
   Full Keyboard Navigation, Touch Swiping, Interactive Counters,
   Progress Bar, and Morphic Slide Animations.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const deck = document.querySelector('.deck');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const progressBar = document.getElementById('progress');
  const dotsContainer = document.getElementById('dots');
  const pageIndicator = document.getElementById('chrome-page-num');

  let currentIndex = 0;
  let isScrolling = false;

  // Initialize Side Dots
  slides.forEach((slide, index) => {
    const btn = document.createElement('button');
    btn.setAttribute('aria-label', `Go to slide ${index + 1}`);
    btn.addEventListener('click', () => scrollToSlide(index));
    dotsContainer.appendChild(btn);
  });

  const dots = Array.from(dotsContainer.querySelectorAll('button'));

  function updateDeckState(index) {
    if (index < 0 || index >= slides.length) return;
    currentIndex = index;

    // Update slides visibility classes
    slides.forEach((slide, i) => {
      if (i === currentIndex) {
        slide.classList.add('visible');
        slide.classList.remove('exiting');
        triggerCounters(slide);
      } else {
        slide.classList.remove('visible');
      }
    });

    // Update Dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });

    // Update Progress Bar
    const progressPercent = ((currentIndex + 1) / slides.length) * 100;
    if (progressBar) {
      progressBar.style.width = `${progressPercent}%`;
    }

    // Update Page Number
    if (pageIndicator) {
      pageIndicator.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    }
  }

  function scrollToSlide(index) {
    if (index < 0 || index >= slides.length) return;
    slides[index].scrollIntoView({ behavior: 'smooth' });
    updateDeckState(index);
  }

  // Scroll Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        const index = slides.indexOf(entry.target);
        if (index !== -1 && index !== currentIndex) {
          updateDeckState(index);
        }
      }
    });
  }, { threshold: 0.5 });

  slides.forEach(slide => observer.observe(slide));

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'ArrowRight', 'Space', 'PageDown'].includes(e.code)) {
      e.preventDefault();
      if (currentIndex < slides.length - 1) scrollToSlide(currentIndex + 1);
    } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.code)) {
      e.preventDefault();
      if (currentIndex > 0) scrollToSlide(currentIndex - 1);
    } else if (e.code === 'Home') {
      e.preventDefault();
      scrollToSlide(0);
    } else if (e.code === 'End') {
      e.preventDefault();
      scrollToSlide(slides.length - 1);
    }
  });

  // Touch Swipe Handling
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diffY = touchStartY - touchEndY;
    if (Math.abs(diffY) > 50) {
      if (diffY > 0 && currentIndex < slides.length - 1) {
        scrollToSlide(currentIndex + 1);
      } else if (diffY < 0 && currentIndex > 0) {
        scrollToSlide(currentIndex - 1);
      }
    }
  }, { passive: true });

  // Animated Counter Logic
  function triggerCounters(container) {
    const counters = container.querySelectorAll('.counter[data-target]');
    counters.forEach(counter => {
      if (counter.dataset.animated) return;
      counter.dataset.animated = "true";

      const target = parseFloat(counter.getAttribute('data-target'));
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
      const duration = 1500;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = (target * easeProgress).toFixed(decimals);

        counter.textContent = `${prefix}${currentVal}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
        }
      }
      requestAnimationFrame(update);
    });
  }

  // Initial state setup
  updateDeckState(0);
});
