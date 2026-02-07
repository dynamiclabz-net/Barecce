// ==========================================
// PRELOADER
// ==========================================
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 1500);
});

// ==========================================
// NAVIGATION
// ==========================================
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');

// Sticky navbar on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Active link on scroll
const sections = document.querySelectorAll('section[id]');

function highlightNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector(`.nav-menu a[href*=${sectionId}]`)?.classList.add('active');
        } else {
            document.querySelector(`.nav-menu a[href*=${sectionId}]`)?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', highlightNav);

// ==========================================
// GSAP ANIMATIONS
// ==========================================
gsap.registerPlugin(ScrollTrigger);

// Hero animations
gsap.from('.hero-title .line', {
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power4.out',
    delay: 1.5
});

gsap.from('.hero-label', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 1.3
});

gsap.from('.hero-subtitle', {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 2
});

gsap.from('.hero-buttons', {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 2.3
});

gsap.from('.floating-card', {
    scale: 0,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'back.out(1.7)',
    delay: 2.5
});

// Brand Statement animation
gsap.from('.statement-icon', {
    scrollTrigger: {
        trigger: '.brand-statement',
        start: 'top 80%'
    },
    scale: 0,
    rotation: 180,
    duration: 0.8,
    ease: 'back.out(1.7)'
});

gsap.from('.statement-text', {
    scrollTrigger: {
        trigger: '.brand-statement',
        start: 'top 80%'
    },
    x: -50,
    opacity: 0,
    duration: 1,
    delay: 0.3
});

gsap.from('.statement-description', {
    scrollTrigger: {
        trigger: '.brand-statement',
        start: 'top 80%'
    },
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 0.5
});

// Brand Showcase animation
gsap.from('.showcase-title', {
    scrollTrigger: {
        trigger: '.brand-showcase',
        start: 'top 80%'
    },
    y: 50,
    opacity: 0,
    duration: 1
});

gsap.from('.showcase-subtitle', {
    scrollTrigger: {
        trigger: '.brand-showcase',
        start: 'top 80%'
    },
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 0.3
});

// Section animations
gsap.utils.toArray('section').forEach(section => {
    const header = section.querySelector('.section-header');
    if (header) {
        gsap.from(header, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'top 30%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 1
        });
    }
});

// Service cards animation
gsap.from('.service-card', {
    scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 80%'
    },
    y: 80,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
});

// Project cards animation
gsap.from('.project-card', {
    scrollTrigger: {
        trigger: '.projects-grid',
        start: 'top 80%'
    },
    scale: 0.8,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power2.out'
});

// New project cards animation
gsap.from('.project-card-new', {
    scrollTrigger: {
        trigger: '.projects-grid-new',
        start: 'top 80%'
    },
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
});

// CTA Section animation
gsap.from('.cta-pre', {
    scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 80%'
    },
    y: 30,
    opacity: 0,
    duration: 0.8
});

gsap.from('.cta-title', {
    scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 80%'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.2
});

gsap.from('.cta-section .btn-large', {
    scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 80%'
    },
    scale: 0.8,
    opacity: 0,
    duration: 0.8,
    delay: 0.4,
    ease: 'back.out(1.7)'
});

// About section animation
gsap.from('.about-image', {
    scrollTrigger: {
        trigger: '.about-wrapper',
        start: 'top 80%'
    },
    x: -100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
});

gsap.from('.about-content', {
    scrollTrigger: {
        trigger: '.about-wrapper',
        start: 'top 80%'
    },
    x: 100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
});

// Stats counter animation
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + '+';
    }, 16);
}

ScrollTrigger.create({
    trigger: '.about-stats',
    start: 'top 80%',
    onEnter: () => {
        document.querySelectorAll('.stat-number').forEach(animateCounter);
    },
    once: true
});

// Contact form animation
gsap.from('.contact-info', {
    scrollTrigger: {
        trigger: '.contact-wrapper',
        start: 'top 80%'
    },
    x: -100,
    opacity: 0,
    duration: 1
});

gsap.from('.contact-form', {
    scrollTrigger: {
        trigger: '.contact-wrapper',
        start: 'top 80%'
    },
    x: 100,
    opacity: 0,
    duration: 1
});

// ==========================================
// TESTIMONIALS SLIDER
// ==========================================
const testimonialsSwiper = new Swiper('.testimonials-slider', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    },
    breakpoints: {
        768: {
            slidesPerView: 1
        }
    }
});

// ==========================================
// CONTACT FORM
// ==========================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Here you would typically send the form data to a server
    // For now, we'll just show an alert
    alert(`Thank you ${name}! Your message has been sent. We'll get back to you soon.`);
    
    // Reset form
    contactForm.reset();
});

// ==========================================
// GO TO TOP BUTTON
// ==========================================
const goToTopBtn = document.getElementById('goToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        goToTopBtn.classList.add('visible');
    } else {
        goToTopBtn.classList.remove('visible');
    }
});

goToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// PARALLAX EFFECT FOR HERO GRADIENT
// ==========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroGradient = document.querySelector('.hero-gradient');
    
    if (heroGradient) {
        heroGradient.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ==========================================
// HOVER EFFECTS FOR SERVICE CARDS
// ==========================================
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        gsap.to(this, {
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    card.addEventListener('mouseleave', function() {
        gsap.to(this, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// ==========================================
// PROJECT CARD TILT EFFECT
// ==========================================
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            duration: 0.5,
            ease: 'power2.out',
            transformPerspective: 1000
        });
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: 'power2.out'
        });
    });
});

// ==========================================
// FORM INPUT ANIMATIONS
// ==========================================
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        gsap.to(this, {
            borderColor: '#FF8C42',
            duration: 0.3
        });
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            gsap.to(this, {
                borderColor: 'rgba(255, 255, 255, 0.3)',
                duration: 0.3
            });
        }
    });
});

// ==========================================
// CURSOR ANIMATION (OPTIONAL - DESKTOP ONLY)
// ==========================================
if (window.innerWidth > 768) {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    
    const cursorStyle = document.createElement('style');
    cursorStyle.innerHTML = `
        .custom-cursor {
            width: 20px;
            height: 20px;
            border: 2px solid #FF8C42;
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.2s ease;
            mix-blend-mode: difference;
        }
        
        .custom-cursor.active {
            transform: scale(1.5);
            background: rgba(255, 140, 66, 0.3);
        }
    `;
    document.head.appendChild(cursorStyle);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        const distX = mouseX - cursorX;
        const distY = mouseY - cursorY;
        
        cursorX += distX * 0.1;
        cursorY += distY * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Add active class on clickable elements
    const clickables = document.querySelectorAll('a, button, .service-card, .project-card');
    
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
}

// ==========================================
// SCROLL REVEAL ANIMATIONS
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// ==========================================
// LOADING OPTIMIZATION
// ==========================================
// Lazy load images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ==========================================
// PREVENT CONTEXT MENU ON IMAGES (OPTIONAL)
// ==========================================
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
});

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll event
const optimizedScroll = debounce(() => {
    highlightNav();
}, 10);

window.addEventListener('scroll', optimizedScroll);

// ==========================================
// CONSOLE MESSAGE
// ==========================================
console.log('%c Designed & Developed by Dynamic Labz ', 'background: #FF8C42; color: #fff; padding: 10px 20px; font-size: 16px; font-weight: bold;');
console.log('%c Visit us at: [Add Link Here] ', 'background: #1a1a1a; color: #FF8C42; padding: 5px 10px; font-size: 12px;');
