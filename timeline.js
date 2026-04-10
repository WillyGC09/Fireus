const timelineItems = document.querySelectorAll('.timeline-item');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {

        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            entry.target.classList.remove('visible');
        }

    });
}, { 
    threshold: 0,
    rootMargin: '-20% 0px -20% 0px'
});

timelineItems.forEach(item => {
    observer.observe(item);
});