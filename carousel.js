function initCarousel(root) {
    const track = root.querySelector('.carousel-track');
    const items = root.querySelectorAll('.carousel-item');
    const totalItems = items.length;
    let index = 0;
    let autoSlideTimeout;

    function showSlide(i) {
        if (i < 0) index = totalItems - 1;
        else if (i >= totalItems) index = 0;
        else index = i;

        const translateX = -index * 100;
        track.style.transform = `translateX(${translateX}%)`;

        const video = items[index].querySelector('video');
        if (video) {
            clearTimeout(autoSlideTimeout);
            video.currentTime = 0;
            setTimeout(() => video.play(), 1000);
            video.onended = () => startAutoSlide();
        } else {
            startAutoSlide();
        }
    }

    function startAutoSlide() {
        clearTimeout(autoSlideTimeout);
        autoSlideTimeout = setTimeout(() => showSlide(index + 1), 5000);
    }

    if (totalItems > 0) {
        showSlide(0);
    }

}