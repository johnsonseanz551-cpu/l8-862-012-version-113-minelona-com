(function () {
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function bindMenu() {
    var button = document.querySelector('.menu-toggle');
    var menu = document.querySelector('.mobile-menu');
    if (!button || !menu) {
      return;
    }
    button.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  function bindSearchForms() {
    var forms = document.querySelectorAll('.site-search-form');
    forms.forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input[name="q"]');
        var q = input ? input.value.trim() : '';
        if (q) {
          window.location.href = 'search.html?q=' + encodeURIComponent(q);
        } else {
          window.location.href = 'search.html';
        }
      });
    });
  }

  function bindHero() {
    var hero = document.querySelector('.hero');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var previous = hero.querySelector('[data-hero="prev"]');
    var next = hero.querySelector('[data-hero="next"]');
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer;
    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }
    function restart() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(index + 1);
      }, 5200);
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        restart();
      });
    });
    if (previous) {
      previous.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }
    show(0);
    restart();
  }

  function bindFilters() {
    var filter = document.querySelector('.page-filter');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    if (!filter || !cards.length) {
      return;
    }
    var keyword = filter.querySelector('[data-filter="keyword"]');
    var year = filter.querySelector('[data-filter="year"]');
    var type = filter.querySelector('[data-filter="type"]');
    var empty = document.querySelector('.empty-state');
    function apply() {
      var q = normalize(keyword ? keyword.value : '');
      var y = normalize(year ? year.value : '');
      var t = normalize(type ? type.value : '');
      var visible = 0;
      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-search'));
        var cardYear = normalize(card.getAttribute('data-year'));
        var cardType = normalize(card.getAttribute('data-type'));
        var ok = (!q || text.indexOf(q) >= 0) && (!y || cardYear === y) && (!t || cardType.indexOf(t) >= 0);
        card.style.display = ok ? '' : 'none';
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }
    [keyword, year, type].forEach(function (item) {
      if (item) {
        item.addEventListener('input', apply);
        item.addEventListener('change', apply);
      }
    });
    apply();
  }

  function bindSearchPage() {
    var page = document.querySelector('[data-search-page]');
    if (!page) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';
    var input = page.querySelector('[data-filter="keyword"]');
    if (input) {
      input.value = q;
    }
    bindFilters();
  }

  window.setupMoviePlayer = function (videoId, streamUrl) {
    onReady(function () {
      var video = document.getElementById(videoId);
      var overlay = document.querySelector('[data-player-for="' + videoId + '"]');
      var initialized = false;
      if (!video) {
        return;
      }
      function attach() {
        if (initialized) {
          return;
        }
        initialized = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(streamUrl);
          hls.attachMedia(video);
        } else {
          video.src = streamUrl;
        }
      }
      function start() {
        attach();
        video.controls = true;
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
        var play = video.play();
        if (play && play.catch) {
          play.catch(function () {});
        }
      }
      if (overlay) {
        overlay.addEventListener('click', start);
      }
      video.addEventListener('click', function () {
        if (!initialized) {
          start();
        }
      });
    });
  };

  onReady(function () {
    bindMenu();
    bindSearchForms();
    bindHero();
    if (!document.querySelector('[data-search-page]')) {
      bindFilters();
    }
    bindSearchPage();
  });
}());
