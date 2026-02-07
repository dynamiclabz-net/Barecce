document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Loader ---
    const loader = document.querySelector('.loader');
    const progress = document.querySelector('.loader-progress');
    let width = 0;
    
    // Simulate loading
    const interval = setInterval(() => {
        width += Math.random() * 15;
        if(width > 100) width = 100;
        progress.style.width = width + '%';
        
        if(width === 100) {
            clearInterval(interval);
            gsap.to(loader, {
                yPercent: -100,
                duration: 1,
                ease: "power4.inOut",
                onComplete: initSite
            });
        }
    }, 100);

    // --- 2. Initialize Lenis (Smooth Scroll) ---
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

    // --- 3. GSAP Animations ---
    gsap.registerPlugin(ScrollTrigger);

    function initSite() {
        document.body.classList.add('loaded');

        // A. Hero Text Reveal (Staggered Characters)
        gsap.from('.char', {
            y: 200,
            opacity: 0,
            duration: 1.5,
            stagger: 0.05,
            ease: "power4.out",
            delay: 0.2
        });

        // B. Image Parallax (The "Floating" Effect)
        gsap.utils.toArray('.work-img-wrapper').forEach(wrapper => {
            const img = wrapper.querySelector('.parallax-img');
            gsap.to(img, {
                yPercent: 20, // Move image down slightly as we scroll
                ease: "none",
                scrollTrigger: {
                    trigger: wrapper,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });

        // C. Section Headline Reveals
        gsap.utils.toArray('.section-headline').forEach(text => {
            gsap.from(text, {
                y: 50,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: text,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }

    // --- 4. Custom Cursor ---
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        gsap.to(dot, { x: x, y: y, duration: 0.1 });
        gsap.to(outline, { x: x - 20, y: y - 20, duration: 0.5 }); // Slower follow
    });

    // Hover effect
    const hoverables = document.querySelectorAll('a, .work-item, .service-row');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(outline, { scale: 1.5, borderColor: '#F17E25', duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(outline, { scale: 1, borderColor: 'rgba(255,255,255,0.2)', duration: 0.3 });
        });
    });
});