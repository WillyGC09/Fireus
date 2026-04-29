const panels = document.querySelectorAll('.panel');
const total = panels.length;
const centerIndex = Math.floor(total / 2) - 1;

panels.forEach((panel, i) => {
    if (i === centerIndex) {
        panel.style.animation = 'linea-sube 1.6s cubic-bezier(0.22, 1, 0.36, 1) both';
        panel.style.animationDelay = '0.4s';
    } else {
        const dist = Math.abs(i - centerIndex);
        const delay = 1.8 + (dist - 1) * 0.2;
        panel.style.animation = 'caer 0.8s cubic-bezier(0.22, 1, 0.36, 1) both';
        panel.style.animationDelay = `${delay}s`;
    }
});