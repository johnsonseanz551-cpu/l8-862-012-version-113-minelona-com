document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector("[data-nav-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (toggle && mobileNav) {
        toggle.addEventListener("click", function () {
            mobileNav.classList.toggle("open");
        });
    }

    var hero = document.querySelector("[data-hero]");

    if (hero) {
        var slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
        var current = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === current);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
            });
        });

        setInterval(function () {
            showSlide(current + 1);
        }, 5600);
    }

    var searchInput = document.querySelector("[data-page-search]");
    var cardList = document.querySelector("[data-card-list]");
    var emptyState = document.querySelector("[data-empty-state]");
    var chips = Array.from(document.querySelectorAll("[data-filter-value]"));

    if (searchInput && cardList) {
        var cards = Array.from(cardList.querySelectorAll(".movie-card, .horizontal-card"));
        var activeFilter = "all";

        if (searchInput.hasAttribute("data-search-from-query")) {
            var params = new URLSearchParams(window.location.search);
            var query = params.get("q") || "";
            searchInput.value = query;
        }

        function normalize(value) {
            return String(value || "").toLowerCase().trim();
        }

        function applyFilter() {
            var query = normalize(searchInput.value);
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute("data-title"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-category"),
                    card.textContent
                ].join(" "));
                var matchQuery = !query || haystack.indexOf(query) !== -1;
                var matchFilter = activeFilter === "all" || haystack.indexOf(normalize(activeFilter)) !== -1;
                var isVisible = matchQuery && matchFilter;

                card.classList.toggle("hidden-card", !isVisible);

                if (isVisible) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle("show", visible === 0);
            }
        }

        searchInput.addEventListener("input", applyFilter);

        chips.forEach(function (chip) {
            chip.addEventListener("click", function () {
                chips.forEach(function (item) {
                    item.classList.remove("active");
                });

                chip.classList.add("active");
                activeFilter = chip.getAttribute("data-filter-value") || "all";
                applyFilter();
            });
        });

        applyFilter();
    }
});

function initMoviePlayer(source) {
    var video = document.getElementById("movie-player");
    var overlay = document.querySelector("[data-player-overlay]");
    var hlsInstance = null;
    var initialized = false;

    if (!video || !source) {
        return;
    }

    function startPlayback() {
        if (!initialized) {
            initialized = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        if (overlay) {
            overlay.classList.add("hidden");
        }

        video.play().catch(function () {});
    }

    if (overlay) {
        overlay.addEventListener("click", startPlayback);
    }

    video.addEventListener("click", function () {
        if (video.paused) {
            startPlayback();
        }
    });

    video.addEventListener("play", function () {
        if (overlay) {
            overlay.classList.add("hidden");
        }
    });

    window.addEventListener("pagehide", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
