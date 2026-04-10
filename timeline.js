const timelineItems = document.querySelectorAll('.timeline-item');

const enterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { 
    threshold: 0,
    rootMargin: '-20% 0px -20% 0px'
});

const exitObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            entry.target.classList.remove('visible');
        }
    });
}, { 
    threshold: 0,
    rootMargin: '-17% 0px -17% 0px'
});

timelineItems.forEach(item => {
    enterObserver.observe(item);
    exitObserver.observe(item);
});