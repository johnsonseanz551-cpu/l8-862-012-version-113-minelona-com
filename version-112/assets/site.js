(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
            });
        }

        function startTimer() {
            stopTimer();
            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }

        function stopTimer() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                startTimer();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(index - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(index + 1);
                startTimer();
            });
        }

        hero.addEventListener('mouseenter', stopTimer);
        hero.addEventListener('mouseleave', startTimer);
        startTimer();
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-filter-root]')).forEach(function (root) {
        var input = root.querySelector('[data-filter-input]');
        var yearFilter = root.querySelector('[data-year-filter]');
        var typeFilter = root.querySelector('[data-type-filter]');
        var section = root.closest('.section-wrap') || document;
        var cards = Array.prototype.slice.call(section.querySelectorAll('[data-card]'));
        var empty = section.querySelector('[data-empty-state]');
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';

        if (input && query) {
            input.value = query;
        }

        function normalize(value) {
            return String(value || '').toLowerCase().replace(/\s+/g, '');
        }

        function applyFilter() {
            var keyword = normalize(input ? input.value : '');
            var yearValue = yearFilter ? yearFilter.value : '';
            var typeValue = typeFilter ? typeFilter.value : '';
            var visible = 0;

            cards.forEach(function (card) {
                var text = normalize(card.getAttribute('data-search'));
                var yearOk = !yearValue || card.getAttribute('data-year') === yearValue;
                var typeOk = !typeValue || card.getAttribute('data-type') === typeValue;
                var keywordOk = !keyword || text.indexOf(keyword) !== -1;
                var shouldShow = yearOk && typeOk && keywordOk;
                card.style.display = shouldShow ? '' : 'none';
                if (shouldShow) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('show', visible === 0);
            }
        }

        [input, yearFilter, typeFilter].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilter);
                control.addEventListener('change', applyFilter);
            }
        });

        applyFilter();
    });

    Array.prototype.slice.call(document.querySelectorAll('[data-player-box]')).forEach(function (box) {
        var video = box.querySelector('video[data-source]');
        var button = box.querySelector('[data-play-button]');
        var source = video ? video.getAttribute('data-source') : '';
        var hlsInstance = null;

        function attachSource() {
            if (!video || !source) {
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                if (!hlsInstance) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hlsInstance.loadSource(source);
                    hlsInstance.attachMedia(video);
                }
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                if (!video.src) {
                    video.src = source;
                }
            } else if (!video.src) {
                video.src = source;
            }
        }

        function playVideo() {
            attachSource();
            if (button) {
                button.classList.add('is-hidden');
            }
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {
                    if (button) {
                        button.classList.remove('is-hidden');
                    }
                });
            }
        }

        if (video) {
            attachSource();
            video.addEventListener('play', function () {
                if (button) {
                    button.classList.add('is-hidden');
                }
            });
            video.addEventListener('pause', function () {
                if (button && video.currentTime === 0) {
                    button.classList.remove('is-hidden');
                }
            });
        }

        if (button && video) {
            button.addEventListener('click', playVideo);
        }
    });
}());
