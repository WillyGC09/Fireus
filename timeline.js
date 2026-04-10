const timelineItems = document.querySelectorAll('.timeline-item');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0, rootMargin: '0px 0px -30% 0px' });

timelineItems.forEach(item => {
    observer.observe(item);
});