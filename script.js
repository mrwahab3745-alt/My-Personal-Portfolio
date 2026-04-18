// --- 1. Scroll Animations (Intersection Observer) ---
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
elementsToAnimate.forEach(el => observer.observe(el));


// --- 2. Mobile Menu Toggle Logic ---
const menuBtn = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    // Menu ko open/close karo
    navLinks.classList.toggle('active');
    
    // Button ko 'X' animation do
    menuBtn.classList.toggle('active');
});

// --- 3. Close menu when a link is clicked (Mobile UX) ---
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuBtn.classList.remove('active');
    });
});


// --- 4. Form Submission Alert ---
const contactForm = document.querySelector('form'); 
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Thank you! Form functionality is coming soon. Please contact me at: mrwahab3745-alt@example.com");
    contactForm.reset(); // Form ko saaf karne ke liye
});
const roles = ["Front-end Developer", "Freelancer"]

// --- 5. Typing Effect ---
const texts = ["Frontend Developer", "UI/UX Designer", "Web Developer", "Freelancer"];
let index = 0;
let charIndex = 0;
let isDeleting = false;

const typingElement = document.getElementById("typing");

function typeEffect() {
  const currentText = texts[index];

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  typingElement.textContent = currentText.substring(0, charIndex);

  let speed = isDeleting ? 50 : 100;

  if (!isDeleting && charIndex === currentText.length) {
    speed = 1500; // pause after typing
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    index = (index + 1) % texts.length;
    speed = 500;
  }

  setTimeout(typeEffect, speed);
}

typeEffect();