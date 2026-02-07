document.addEventListener("DOMContentLoaded", () => {
    
    // ------------------------------------------------
    // 1. SIMPLE LOADER (0 to 100)
    // ------------------------------------------------
    const counter = document.querySelector(".counter");
    let count = 0;

    function updateLoader() {
        if (count === 100) return;
        
        count += Math.floor(Math.random() * 10) + 1;
        if (count > 100) count = 100;
        
        counter.textContent = count;
        
        let delay = Math.floor(Math.random() * 150) + 50;
        setTimeout(updateLoader, delay);
    }
    updateLoader();

    // Finish Loading
    setTimeout(() => {
        gsap.to(".preloader", {
            yPercent: -100,
            duration: 1.2,
            ease: "power4.inOut",
            onComplete: initAnimations // Start site
        });
    }, 3000);

    // ------------------------------------------------
    // 2. SETUP LENIS (Smooth Scroll)
    // ------------------------------------------------
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
    });
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    gsap.registerPlugin(ScrollTrigger);

    // ------------------------------------------------
    // 3. MAIN ANIMATIONS (FIXED)
    // ------------------------------------------------
    function initAnimations() {
        
        // A. Reveal Text (FIXED: Changed 'chars' to 'words')
        const texts = document.querySelectorAll(".reveal-text");
        
        texts.forEach(text => {
            // STOPPED splitting by chars. Now splitting by lines and words only.
            let split = new SplitType(text, { types: 'lines, words' });
            
            // Animate the words, not the letters
            gsap.from(split.words, {
                y: 50, // Moved to simple Y translation instead of percent for stability
                opacity: 0,
                duration: 1,
                stagger: 0.05, // Adjusted stagger for words
                ease: "power3.out",
                scrollTrigger: {
                    trigger: text,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        // B. Horizontal Scroll (Desktop Only)
        if (window.innerWidth > 768) {
            let sections = gsap.utils.toArray(".work-card");
            let track = document.querySelector(".horizontal-track");
            
            gsap.to(sections, {
                xPercent: -100 * (sections.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: ".work-section",
                    pin: true,
                    scrub: 1,
                    end: () => "+=" + track.scrollWidth
                }
            });
        }

        // C. Stacking Cards (Services)
        const cards = gsap.utils.toArray(".service-card");
        cards.forEach((card, i) => {
            ScrollTrigger.create({
                trigger: card,
                start: "top top+=120", 
                pin: true, 
                pinSpacing: false, 
                endTrigger: ".services-section",
                end: "bottom bottom",
            });
        });

        // D. Hero Image Entry
        gsap.from(".hero-img", {
            scale: 0.8,
            rotation: -10,
            opacity: 0,
            duration: 1.5,
            delay: 0.2,
            ease: "back.out(1.7)"
        });
    }

    // ------------------------------------------------
    // 4. MAGNETIC CURSOR & MENU
    // ------------------------------------------------
    const cursor = document.querySelector('.cursor-circle');
    const dot = document.querySelector('.cursor-dot');
    const magnets = document.querySelectorAll('[data-magnetic]');

    document.addEventListener('mousemove', (e) => {
        gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1 });
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.3 });
    });

    magnets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 1.5, duration: 0.3 });
            document.body.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, duration: 0.3 });
            document.body.classList.remove('hovered');
        });
    });

    // Menu Toggle
    const toggle = document.querySelector('.menu-toggle');
    const overlay = document.querySelector('.menu-overlay');
    const links = document.querySelectorAll('.menu-link');
    let isOpen = false;

    toggle.addEventListener('click', () => {
        isOpen = !isOpen;
        overlay.classList.toggle('active');
        
        const spans = document.querySelectorAll('.hamburger span');
        if (isOpen) {
            gsap.to(spans[0], { rotation: 45, y: 8 });
            gsap.to(spans[1], { rotation: -45, y: -8 });
        } else {
            gsap.to(spans, { rotation: 0, y: 0 });
        }
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            isOpen = false;
            overlay.classList.remove('active');
            gsap.to(document.querySelectorAll('.hamburger span'), { rotation: 0, y: 0 });
        });
    });
});

// ==========================================
// MAGNETIC PROGRESS BUTTON LOGIC (UPDATED)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    
    const progressPath = document.querySelector('.progress-wrap path');
    const pathLength = progressPath.getTotalLength();
    
    // Set up CSS for the SVG path
    progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
    progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
    
    const updateProgress = function() {
        const scroll = window.scrollY; // Current scroll position
        const height = document.documentElement.scrollHeight - window.innerHeight; // Total scrollable height
        const progress = pathLength - (scroll * pathLength / height);
        
        progressPath.style.strokeDashoffset = progress;
    }
    
    updateProgress();
    window.addEventListener('scroll', updateProgress);
    
    // Show/Hide Logic + Footer Color Change
    const offset = 50;
    const progressWrap = document.querySelector('.progress-wrap');
    const mainContent = document.querySelector('main'); // We check main because footer is fixed behind it
    
    window.addEventListener('scroll', function() {
        // 1. Show/Hide based on scroll top
        if (window.scrollY > offset) {
            progressWrap.classList.add('active-progress');
        } else {
            progressWrap.classList.remove('active-progress');
        }

        // 2. Detect Footer Reveal
        // Since footer is fixed behind, we check when the bottom of <main> passes the screen
        if (mainContent) {
            const mainBottom = mainContent.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            // If main bottom is higher than window bottom, footer is revealing
            if (mainBottom < windowHeight) {
                progressWrap.classList.add('on-footer');
            } else {
                progressWrap.classList.remove('on-footer');
            }
        }
    });
    
    // Click to Scroll Top
    progressWrap.addEventListener('click', function(event) {
        event.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});