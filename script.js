const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');

            observer.unobserve(entry.target);
        }
    });
}, observerOptions);


const elementsToAnimate = document.querySelectorAll('.fade-in, .service-card, .project-card');

elementsToAnimate.forEach(el => {
    observer.observe(el);
});
