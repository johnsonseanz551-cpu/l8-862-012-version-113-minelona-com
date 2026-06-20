(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mainNav = document.querySelector("[data-main-nav]");

    if (menuButton && mainNav) {
      menuButton.addEventListener("click", function () {
        mainNav.classList.toggle("is-open");
      });
    }

    var hero = document.querySelector("[data-hero]");

    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var activeIndex = 0;
      var timer = null;

      function showSlide(index) {
        if (!slides.length) {
          return;
        }

        activeIndex = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === activeIndex);
        });

        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === activeIndex);
        });
      }

      function startTimer() {
        window.clearInterval(timer);
        timer = window.setInterval(function () {
          showSlide(activeIndex + 1);
        }, 5200);
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
          startTimer();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          showSlide(activeIndex - 1);
          startTimer();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          showSlide(activeIndex + 1);
          startTimer();
        });
      }

      showSlide(0);
      startTimer();
    }

    var params = new URLSearchParams(window.location.search);
    var queryValue = params.get("q") || "";
    var searchPageInput = document.querySelector("[data-search-page-input]");

    if (searchPageInput && queryValue) {
      searchPageInput.value = queryValue;
    }

    var filterInputs = Array.prototype.slice.call(document.querySelectorAll("[data-filter-input]"));
    var filterLists = Array.prototype.slice.call(document.querySelectorAll("[data-filter-list]"));

    function applyFilter(value) {
      var terms = String(value || "").trim().toLowerCase().split(/\s+/).filter(Boolean);

      filterLists.forEach(function (list) {
        var cards = Array.prototype.slice.call(list.children);

        cards.forEach(function (card) {
          var haystack = String(card.getAttribute("data-search") || card.textContent || "").toLowerCase();
          var visible = terms.every(function (term) {
            return haystack.indexOf(term) !== -1;
          });

          card.setAttribute("data-search-hidden", visible ? "false" : "true");
        });
      });
    }

    filterInputs.forEach(function (input) {
      if (queryValue && !input.value) {
        input.value = queryValue;
      }

      input.addEventListener("input", function () {
        applyFilter(input.value);
      });
    });

    if (queryValue) {
      applyFilter(queryValue);
    }

    var playScroll = document.querySelector("[data-play-scroll]");
    var playerBox = document.querySelector(".player-box");

    if (playScroll && playerBox) {
      playScroll.addEventListener("click", function (event) {
        event.preventDefault();
        playerBox.scrollIntoView({ behavior: "smooth", block: "center" });
        var cover = playerBox.querySelector(".player-cover");
        if (cover) {
          window.setTimeout(function () {
            cover.click();
          }, 350);
        }
      });
    }
  });
})();
