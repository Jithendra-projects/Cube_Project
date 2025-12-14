

document.addEventListener('DOMContentLoaded', () => {

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

(function initHamburger() {
  const hamburger = $('#hamburger');
  const nav = $('.nav') || $('#mainNav');

  if (!hamburger || !nav) return;

  hamburger.setAttribute('aria-expanded', 'false');

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));

    if (isOpen) {
      nav.style.display = 'flex';
      nav.style.flexDirection = 'column';
      nav.style.gap = '12px';
      nav.style.padding = '12px';
    } else {s
      nav.style.display = '';
      nav.style.flexDirection = '';
      nav.style.gap = '';
      nav.style.padding = '';
    }
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !hamburger.contains(e.target) && nav.classList.contains('nav-open')) {
      nav.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');

      nav.style.display = '';
      nav.style.flexDirection = '';
      nav.style.gap = '';
      nav.style.padding = '';
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 840) {
      nav.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');

      nav.style.display = '';
      nav.style.flexDirection = '';
      nav.style.gap = '';
      nav.style.padding = '';
    }
  });
})();

  (function initGallery() {

    let mainImg = $('#mainImage') || $('.viewer img') || $('.hero .main-image');
    if (!mainImg) {
      return;
    }

    const thumbEls = $$('.thumb');
    const images = [];

    if (thumbEls.length > 0) {
      thumbEls.forEach((t) => {
        const s = t.dataset.src || t.getAttribute('src');
        if (s) images.push(s);
      });
    } else {
      const galleryContainer = mainImg.closest('.gallery') || mainImg.closest('.viewer') || document.querySelector('.gallery');
      if (galleryContainer) {
        const slideImgs = $$('img[data-slide-src]', galleryContainer);
        if (slideImgs.length) {
          slideImgs.forEach(i => images.push(i.dataset.slideSrc || i.getAttribute('data-slide-src')));
        }
      }
      if (!images.length) images.push(mainImg.getAttribute('src'));
    }

    const uniqImages = images.filter((v, i, a) => v && a.indexOf(v) === i);
    if (!uniqImages.length) return;

    const prevBtn = $('#prev') || $('.arrow.left');
    const nextBtn = $('#next') || $('.arrow.right');
    const dotsContainer = $('#dots') || $('.dots');
    const thumbsContainer = thumbEls.length ? thumbEls : $$('.thumb');


    let index = 0;
    const setIndex = (i) => {
      index = ((i % uniqImages.length) + uniqImages.length) % uniqImages.length;
      updateUI();
    };

    function updateUI() {
      const src = uniqImages[index];
      try {
        mainImg.src = src;
      } catch (err) {

      }

      thumbsContainer.forEach((t, i) => {
        if (+t.dataset.index === index || i === index) t.classList.add('active');
        else t.classList.remove('active');
      });


      if (dotsContainer) {

        if (!dotsContainer.querySelector('.dot')) {
          dotsContainer.innerHTML = '';
          uniqImages.forEach((_, i) => {
            const d = document.createElement('div');
            d.className = 'dot' + (i === index ? ' active' : '');
            d.dataset.index = String(i);
            d.setAttribute('role', 'button');
            d.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dotsContainer.appendChild(d);
          });
        } else {
          $$('.dot', dotsContainer).forEach((d, i) => d.classList.toggle('active', i === index));
        }
      }
    }


    if (prevBtn) prevBtn.addEventListener('click', () => setIndex(index - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => setIndex(index + 1));


    if (dotsContainer) {
      dotsContainer.addEventListener('click', (e) => {
        const d = e.target.closest('.dot');
        if (!d) return;
        const i = parseInt(d.dataset.index, 10);
        if (!Number.isNaN(i)) setIndex(i);
      });
    }

    thumbsContainer.forEach((t, i) => {
      t.dataset.index = t.dataset.index || String(i);
      t.addEventListener('click', () => setIndex(i));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') setIndex(index - 1);
      if (e.key === 'ArrowRight') setIndex(index + 1);
    });

    const viewer = mainImg.closest('.viewer') || mainImg.parentElement;
    if (viewer) {
      let startX = null;
      viewer.addEventListener('touchstart', (ev) => {
        startX = ev.touches && ev.touches[0] && ev.touches[0].clientX;
      }, {passive: true});
      viewer.addEventListener('touchend', (ev) => {
        if (startX === null) return;
        const endX = ev.changedTouches && ev.changedTouches[0] && ev.changedTouches[0].clientX;
        const diff = endX - startX;
        if (Math.abs(diff) > 40) {
          setIndex(diff > 0 ? index - 1 : index + 1);
        }
        startX = null;
      }, {passive: true});
    }

    updateUI();
  })();

  (function initAddToCart() {
    const form = $('#optionsForm') || document.querySelector('form[data-options="true"]');
    const addToCart = $('#addToCart') || $('.add-to-cart') || $('a[data-role="add-to-cart"]');

    if (!addToCart) {
    
    }

    if (!form) return;

    const getCheckedValue = (name) => {
      const input = form.querySelector(`input[name="${name}"]:checked`);
      return input ? input.value : null;
    };

    function buildLink(fragrance, purchase) {

      const f = encodeURIComponent(fragrance || 'default');
      const p = encodeURIComponent(purchase || 'one-time');
      return `https://example.com/cart?f=${f}&p=${p}`;
    }

    function updateLink() {
      const fragrance = getCheckedValue('fragrance') || 'floral';
      const purchase = getCheckedValue('purchase') || 'one-time';
      const url = buildLink(fragrance, purchase);
      if (addToCart) addToCart.href = url;

      if (addToCart) addToCart.dataset.variant = `${fragrance}|${purchase}`;
    }


    form.addEventListener('change', () => {
      updateLink();
      toggleSubscriptionsByForm(form);
    });


    updateLink();
  })();


  function toggleSubscriptionsByForm(form) {
    if (!form) form = $('#optionsForm');
    if (!form) return;
    const purchase = (form.querySelector('input[name="purchase"]:checked') || {}).value;
    const single = $('#singleSub');
    const doubleP = $('#doubleSub');

    if (single) {
      if (purchase === 'single-sub') {
        single.setAttribute('aria-hidden', 'false');
        single.style.display = 'block';
      } else {
        single.setAttribute('aria-hidden', 'true');
        single.style.display = 'none';
      }
    }
    if (doubleP) {
      if (purchase === 'double-sub') {
        doubleP.setAttribute('aria-hidden', 'false');
        doubleP.style.display = 'block';
      } else {
        doubleP.setAttribute('aria-hidden', 'true');
        doubleP.style.display = 'none';
      }
    }
  }

  (function initSubscriptionInit() {
    const form = $('#optionsForm');
    if (!form) return;
    toggleSubscriptionsByForm(form);
  })();


  (function initCountUp() {
    const els = $$('[data-target], .count, .num').filter(el => {
      return el.dataset && el.dataset.target || /\d/.test((el.textContent || '').trim());
    });

    if (!els.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        let target = 0;
        if (el.dataset && el.dataset.target) target = parseInt(el.dataset.target, 10) || 0;
        else {
          const found = (el.textContent || '').match(/(\d[\d,]*)/);
          target = found ? parseInt(found[1].replace(/,/g, ''), 10) : 0;
        }
        if (isNaN(target) || target <= 0) {
          observer.unobserve(el);
          return;
        }
        if (el.dataset.started === 'true') {
          observer.unobserve(el);
          return;
        }
        el.dataset.started = 'true';
        let duration = 1400;
        if (target > 1000) duration = 1800;
        const startTime = performance.now();
        const startValue = 0;
        function step(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = easeOutCubic(progress);
          const value = Math.floor(startValue + (target - startValue) * eased);

          const suffix = (el.dataset.suffix || (/\D+$/.test(el.textContent || '') ? (el.textContent || '').replace(/^.*?(\D+)$/, '$1') : '')) || '';
          el.textContent = value.toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(step);
          else {

            el.textContent = target.toLocaleString() + (suffix || '');
            observer.unobserve(el);
          }
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    els.forEach(el => observer.observe(el));
  })();


  (function smallHelpers() {
    function handleFirstTab(e) {
      if (e.key === 'Tab') {
        document.documentElement.classList.add('user-is-tabbing');
        window.removeEventListener('keydown', handleFirstTab);
      }
    }
    window.addEventListener('keydown', handleFirstTab);

    window._debounce = function(fn, wait = 100) {
      let t = null;
      return function(...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
      };
    };
  })();

  window.GTG = window.GTG || {};
  window.GTG.toggleSubscriptions = () => toggleSubscriptionsByForm($('#optionsForm'));
  window.GTG.updateAddToCart = () => {
    const form = $('#optionsForm');
    if (!form) return;
    const f = (form.querySelector('input[name="fragrance"]:checked') || {}).value || 'floral';
    const p = (form.querySelector('input[name="purchase"]:checked') || {}).value || 'one-time';
    const anchor = $('#addToCart') || $('a[data-role="add-to-cart"]') || null;
    if (anchor) anchor.href = `https://example.com/cart?f=${encodeURIComponent(f)}&p=${encodeURIComponent(p)}`;
  };

});
