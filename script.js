// ============================
// Header scroll effect & Page Top Button
// ============================
const header = document.getElementById('site-header');
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('main-nav');
const pageTop = document.getElementById('page-top');

window.addEventListener('scroll', () => {
  // Header shadow
  if (window.scrollY > 80) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  // Page top button visibility
  if (pageTop) {
    if (window.scrollY > 400) {
      pageTop.classList.add('visible');
    } else {
      pageTop.classList.remove('visible');
    }
  }
}, { passive: true });

if (pageTop) {
  pageTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================
// Hamburger menu (モバイルファースト)
// ============================
function closeMenu() {
  hamburger.classList.remove('active');
  mainNav.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

hamburger.addEventListener('click', () => {
  const isOpen = mainNav.classList.contains('open');
  if (isOpen) {
    closeMenu();
  } else {
    hamburger.classList.add('active');
    mainNav.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
  }
});

// ナビリンクをタップしたら閉じる
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    closeMenu();
  });
});

// メニュー外タップで閉じる
document.addEventListener('click', (e) => {
  if (
    mainNav.classList.contains('open') &&
    !mainNav.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    closeMenu();
  }
});

// リサイズ時にデスクトップ幅になったらメニューを閉じる
window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) {
    closeMenu();
  }
}, { passive: true });



// ============================
// Scroll reveal animations
// ============================
const revealElements = document.querySelectorAll(
  '.section-label, .section-title, .section-sub, ' +
  '.about-grid, .gift-intro, .gift-cards, .gift-image-section, ' +
  '.rakuten-main, .osonae-banner, .insta-wrap, .shopinfo-grid, ' +
  '.rakuten-notice'
);

revealElements.forEach(el => {
  el.classList.add('reveal');
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -32px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ============================
// Gift cards staggered animation
// ============================
const giftCards = document.querySelectorAll('.gift-card');
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // モバイルではi=0から順に、PCでは行ごとにずらす
      const delay = i * 70;
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, delay);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

giftCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  cardObserver.observe(card);
});

// ============================
// Feature items staggered animation
// ============================
const featureItems = document.querySelectorAll('.feature-item');
const featureObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
      }, i * 90);
      featureObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

featureItems.forEach(item => {
  item.style.opacity = '0';
  item.style.transform = 'translateX(-16px)';
  item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  featureObserver.observe(item);
});

// ============================
// Smooth anchor scroll with header offset
// ============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const headerHeight = header.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  });
});

// ============================
// Rakuten link tracking (analytics-ready)
// ============================
const rakutenLinks = document.querySelectorAll('a[href*="rakuten.co.jp"]');
rakutenLinks.forEach(link => {
  link.addEventListener('click', function() {
    const id = this.id || 'unknown';
    console.log('Rakuten link clicked:', id);
  });
});

// ============================
// Gift cards expand/collapse accordion logic
// ============================
const accordionCards = document.querySelectorAll('.gift-card');
accordionCards.forEach(card => {
  card.addEventListener('click', () => {
    const isOpen = card.classList.contains('is-open');
    card.classList.toggle('is-open');
    card.setAttribute('aria-expanded', !isOpen);
  });

  // キーボード操作対応 (Enter or Space)
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});

// ============================
// Image Slideshows (Gift & Online Shop)
// ============================
function initSlider(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const slides = container.querySelectorAll('.slide');
  if (slides.length <= 1) return;
  
  let currentIndex = 0;
  setInterval(() => {
    slides[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add('active');
  }, 5000);
}

// 読み込み完了後にスライダー初期化
window.addEventListener('DOMContentLoaded', () => {
  initSlider('gift-slider');
  initSlider('rakuten-slider');
});
