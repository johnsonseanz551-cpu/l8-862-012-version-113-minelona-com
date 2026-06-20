(function () {
    var menuToggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero-carousel]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        function showSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
            });
        });

        if (slides.length > 0) {
            showSlide(0);
            window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }
    }

    var filterPanels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));

    filterPanels.forEach(function (panel) {
        var searchInput = panel.querySelector('[data-site-search]');
        var typeSelect = panel.querySelector('[data-filter-type]');
        var genreSelect = panel.querySelector('[data-filter-genre]');
        var list = document.querySelector('[data-card-list]');
        var emptyState = document.querySelector('[data-empty-state]');

        if (!list) {
            return;
        }

        var cards = Array.prototype.slice.call(list.querySelectorAll('[data-movie-card]'));
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q') || '';

        if (searchInput && initialQuery) {
            searchInput.value = initialQuery;
        }

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function applyFilters() {
            var query = normalize(searchInput ? searchInput.value : '');
            var typeValue = normalize(typeSelect ? typeSelect.value : '');
            var genreValue = normalize(genreSelect ? genreSelect.value : '');
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = normalize(card.getAttribute('data-search'));
                var typeText = normalize(card.getAttribute('data-type'));
                var genreText = normalize(card.getAttribute('data-genre'));
                var matchesQuery = !query || haystack.indexOf(query) !== -1;
                var matchesType = !typeValue || typeText.indexOf(typeValue) !== -1;
                var matchesGenre = !genreValue || genreText.indexOf(genreValue) !== -1;
                var shouldShow = matchesQuery && matchesType && matchesGenre;

                card.hidden = !shouldShow;

                if (shouldShow) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle('is-visible', visible === 0);
            }
        }

        [searchInput, typeSelect, genreSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilters);
                control.addEventListener('change', applyFilters);
            }
        });

        applyFilters();
    });
})();
