const timelineItems = document.querySelectorAll('.timeline-item');

if (timelineItems.length > 0) {
    // Observer for when an item enters the viewport (becomes visible)
    const enterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { 
        // Trigger when any part of the item enters the viewport,
        // but consider the root (viewport) to be 20% smaller from top/bottom.
        // This makes items visible slightly before they reach the exact edge.
        threshold: 0,
        rootMargin: '-20% 0px -20% 0px'
    });
    
    // Observer for when an item exits the viewport (becomes invisible)
    const exitObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                entry.target.classList.remove('visible');
            }
        });
    }, { 
        // Similar to enterObserver, but with a slightly different margin for exit detection.
        threshold: 0,
        rootMargin: '-17% 0px -17% 0px'
    });
    
    timelineItems.forEach(item => {
        enterObserver.observe(item);
        exitObserver.observe(item);
    });
}