(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var boxes = Array.prototype.slice.call(document.querySelectorAll(".player-box"));

    boxes.forEach(function (box) {
      var video = box.querySelector("video");
      var cover = box.querySelector(".player-cover");
      var stream = box.getAttribute("data-stream");
      var loaded = false;

      if (!video || !stream) {
        return;
      }

      function loadStream() {
        if (loaded) {
          return;
        }

        loaded = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
          box.hlsInstance = hls;
          return;
        }

        video.src = stream;
      }

      function start() {
        loadStream();

        if (cover) {
          cover.classList.add("is-hidden");
        }

        video.controls = true;
        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {});
        }
      }

      if (cover) {
        cover.addEventListener("click", start);
      }

      video.addEventListener("click", function () {
        if (!loaded) {
          start();
        }
      });
    });
  });
})();
