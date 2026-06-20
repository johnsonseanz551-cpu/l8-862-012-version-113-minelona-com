(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
            return;
        }
        document.addEventListener("DOMContentLoaded", fn);
    }

    function setupMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var menu = document.querySelector("[data-menu]");
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener("click", function () {
            menu.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var root = document.querySelector("[data-hero]");
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
        var prev = root.querySelector("[data-hero-prev]");
        var next = root.querySelector("[data-hero-next]");
        if (!slides.length) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                show(dotIndex);
                start();
            });
        });
        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                start();
            });
        }
        root.addEventListener("mouseenter", stop);
        root.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function setupFilters() {
        var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
        scopes.forEach(function (scope) {
            var input = scope.querySelector("[data-search-input]");
            var year = scope.querySelector("[data-year-filter]");
            var region = scope.querySelector("[data-region-filter]");
            var type = scope.querySelector("[data-type-filter]");
            var list = document.querySelector("[data-card-list]");
            if (!list) {
                return;
            }
            var cards = Array.prototype.slice.call(list.querySelectorAll("[data-card]"));

            function apply() {
                var keyword = input ? input.value.trim().toLowerCase() : "";
                var selectedYear = year ? year.value : "";
                var selectedRegion = region ? region.value : "";
                var selectedType = type ? type.value : "";
                cards.forEach(function (card) {
                    var haystack = (card.getAttribute("data-search") || "").toLowerCase();
                    var cardYear = card.getAttribute("data-year") || "";
                    var cardRegion = card.getAttribute("data-region") || "";
                    var cardType = card.getAttribute("data-type") || "";
                    var visible = true;
                    if (keyword && haystack.indexOf(keyword) === -1) {
                        visible = false;
                    }
                    if (selectedYear && cardYear !== selectedYear) {
                        visible = false;
                    }
                    if (selectedRegion && cardRegion !== selectedRegion) {
                        visible = false;
                    }
                    if (selectedType && cardType !== selectedType) {
                        visible = false;
                    }
                    card.classList.toggle("is-hidden", !visible);
                });
            }

            [input, year, region, type].forEach(function (control) {
                if (!control) {
                    return;
                }
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            });
        });
    }

    function setupPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll(".js-player"));
        players.forEach(function (player) {
            var video = player.querySelector("video");
            var trigger = player.querySelector(".player-trigger");
            var streamUrl = player.getAttribute("data-play");
            var hlsInstance = null;
            if (!video || !streamUrl) {
                return;
            }

            function attachStream() {
                if (video.getAttribute("data-ready") === "yes") {
                    return;
                }
                if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hlsInstance.loadSource(streamUrl);
                    hlsInstance.attachMedia(video);
                } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = streamUrl;
                } else {
                    video.src = streamUrl;
                }
                video.setAttribute("data-ready", "yes");
            }

            function play() {
                attachStream();
                if (trigger) {
                    trigger.classList.add("is-hidden");
                }
                video.controls = true;
                var promise = video.play();
                if (promise && typeof promise.catch === "function") {
                    promise.catch(function () {
                        video.controls = true;
                    });
                }
            }

            if (trigger) {
                trigger.addEventListener("click", play);
            }
            video.addEventListener("click", function () {
                if (video.paused) {
                    play();
                }
            });
            video.addEventListener("play", function () {
                if (trigger) {
                    trigger.classList.add("is-hidden");
                }
            });
            window.addEventListener("beforeunload", function () {
                if (hlsInstance) {
                    hlsInstance.destroy();
                    hlsInstance = null;
                }
            });
        });
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupFilters();
        setupPlayers();
    });
}());
