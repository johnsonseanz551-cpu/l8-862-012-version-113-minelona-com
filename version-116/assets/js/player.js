function initializeMoviePlayer(sourceUrl) {
    var video = document.getElementById('movie-player');
    var cover = document.querySelector('.player-cover');

    if (!video || !sourceUrl) {
        return;
    }

    var prepared = false;
    var hlsInstance = null;

    function hideCover() {
        if (cover) {
            cover.classList.add('is-hidden');
        }
    }

    function playVideo() {
        var attempt = video.play();

        if (attempt && typeof attempt.catch === 'function') {
            attempt.catch(function () {});
        }
    }

    function preparePlayback() {
        if (prepared) {
            hideCover();
            playVideo();
            return;
        }

        prepared = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = sourceUrl;
            hideCover();
            playVideo();
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hlsInstance.loadSource(sourceUrl);
            hlsInstance.attachMedia(video);
            hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                hideCover();
                playVideo();
            });
            return;
        }

        video.src = sourceUrl;
        hideCover();
        playVideo();
    }

    if (cover) {
        cover.addEventListener('click', preparePlayback);
    }

    video.addEventListener('click', function () {
        if (video.paused) {
            preparePlayback();
        }
    });

    video.addEventListener('play', hideCover);

    window.addEventListener('beforeunload', function () {
        if (hlsInstance && typeof hlsInstance.destroy === 'function') {
            hlsInstance.destroy();
        }
    });
}
