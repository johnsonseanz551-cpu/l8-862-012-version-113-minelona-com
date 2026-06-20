(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('open');
    });
  }

  var base = document.body.getAttribute('data-base') || './';
  var normalizedBase = base.endsWith('/') ? base : base + '/';

  document.querySelectorAll('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input[name="q"]');
      var value = input ? input.value.trim() : '';
      var target = normalizedBase + 'search.html';
      window.location.href = value ? target + '?q=' + encodeURIComponent(value) : target;
    });
  });

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;
    var timer = null;

    var show = function (next) {
      if (!slides.length) {
        return;
      }
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    };

    var start = function () {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5600);
    };

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        window.clearInterval(timer);
        show(dotIndex);
        start();
      });
    });

    show(0);
    start();
  }

  var applyFilter = function (scope) {
    var input = scope.querySelector('[data-filter-input]');
    var type = scope.querySelector('[data-filter-type]');
    var year = scope.querySelector('[data-filter-year]');
    var list = document.querySelector('[data-filter-list]');

    if (!list) {
      return;
    }

    var query = input ? input.value.trim().toLowerCase() : '';
    var typeValue = type ? type.value.trim().toLowerCase() : '';
    var yearValue = year ? year.value.trim() : '';

    list.querySelectorAll('[data-title]').forEach(function (item) {
      var haystack = [
        item.getAttribute('data-title'),
        item.getAttribute('data-region'),
        item.getAttribute('data-type'),
        item.getAttribute('data-year'),
        item.getAttribute('data-genre'),
        item.getAttribute('data-tags')
      ].join(' ').toLowerCase();
      var itemType = (item.getAttribute('data-type') || '').toLowerCase();
      var itemYear = item.getAttribute('data-year') || '';
      var matchedQuery = !query || haystack.indexOf(query) !== -1;
      var matchedType = !typeValue || itemType.indexOf(typeValue) !== -1;
      var matchedYear = !yearValue || itemYear.indexOf(yearValue) !== -1;
      item.classList.toggle('is-hidden', !(matchedQuery && matchedType && matchedYear));
    });
  };

  document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
    var input = scope.querySelector('[data-filter-input]');
    var controls = scope.querySelectorAll('input, select');

    if (scope.hasAttribute('data-query-sync') && input) {
      var query = new URLSearchParams(window.location.search).get('q');
      if (query) {
        input.value = query;
      }
    }

    controls.forEach(function (control) {
      control.addEventListener('input', function () {
        applyFilter(scope);
      });
      control.addEventListener('change', function () {
        applyFilter(scope);
      });
    });

    applyFilter(scope);
  });
})();
