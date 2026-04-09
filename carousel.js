function initCarousel(root) {
    const track = root.querySelector('.carousel-track');
    const items = root.querySelectorAll('.carousel-item');
    const totalItems = items.length;
    let index = 0;
    let autoSlideTimeout;

    // Create indicators
    const indicators = document.createElement('div');
    indicators.className = 'carousel-indicators';
    for (let i = 0; i < totalItems; i++) {
        const dot = document.createElement('span');
        dot.className = 'carousel-dot';
        dot.addEventListener('click', () => showSlide(i));
        indicators.appendChild(dot);
    }
    root.appendChild(indicators);

    // Create arrows
    const prevArrow = document.createElement('button');
    prevArrow.className = 'carousel-arrow carousel-arrow-prev';
    prevArrow.innerHTML = '&#10094;'; // Left arrow
    prevArrow.addEventListener('click', () => showSlide(index - 1));
    root.appendChild(prevArrow);

    const nextArrow = document.createElement('button');
    nextArrow.className = 'carousel-arrow carousel-arrow-next';
    nextArrow.innerHTML = '&#10095;'; // Right arrow
    nextArrow.addEventListener('click', () => showSlide(index + 1));
    root.appendChild(nextArrow);

    // Show/hide controls on hover
    root.addEventListener('mouseenter', () => {
        root.classList.add('show-controls');
    });
    root.addEventListener('mouseleave', () => {
        root.classList.remove('show-controls');
    });

    function showSlide(i) {
        if (i < 0) index = totalItems - 1;
        else if (i >= totalItems) index = 0;
        else index = i;

        const translateX = -index * 100;
        track.style.transform = `translateX(${translateX}%)`;

        // Update indicators
        const dots = indicators.querySelectorAll('.carousel-dot');
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === index);
        });

        const video = items[index].querySelector('video');
        if (video) {
            clearTimeout(autoSlideTimeout);
            video.currentTime = 0;
            video.play();
            video.onended = () => showSlide(index + 1); // Immediately go to next after video ends
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