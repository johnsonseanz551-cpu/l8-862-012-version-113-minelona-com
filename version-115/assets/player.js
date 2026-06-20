function initMoviePlayer(streamUrl) {
  document.querySelectorAll('[data-player]').forEach(function (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('[data-play-button]');
    var loaded = false;
    var hlsInstance = null;

    var playVideo = function () {
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    };

    var loadVideo = function () {
      if (!video || loaded) {
        playVideo();
        return;
      }

      loaded = true;

      if (button) {
        button.classList.add('hidden');
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        video.addEventListener('loadedmetadata', playVideo, { once: true });
        video.load();
        playVideo();
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
        return;
      }

      video.src = streamUrl;
      video.addEventListener('loadedmetadata', playVideo, { once: true });
      video.load();
      playVideo();
    };

    if (button) {
      button.addEventListener('click', loadVideo);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (!loaded) {
          loadVideo();
        }
      });
    }

    window.addEventListener('pagehide', function () {
      if (hlsInstance && typeof hlsInstance.destroy === 'function') {
        hlsInstance.destroy();
      }
    });
  });
}
