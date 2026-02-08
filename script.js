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
    // 3. MAIN ANIMATIONS (UPDATED: ALL DEVICES)
    // ------------------------------------------------
    function initAnimations() {
        
        // A. Reveal Text
        const texts = document.querySelectorAll(".reveal-text");
        texts.forEach(text => {
            let split = new SplitType(text, { types: 'lines, words' });
            gsap.from(split.words, {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.05,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: text,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        // B. Horizontal Scroll (ENABLED FOR ALL DEVICES)
        // Removed width check so it works on mobile too
        let sections = gsap.utils.toArray(".work-card");
        let track = document.querySelector(".horizontal-track");
        
        if (track && sections.length > 0) {
            gsap.to(sections, {
                xPercent: -100 * (sections.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: ".work-section",
                    pin: true,
                    scrub: 1,
                    // Use function for 'end' to recalculate correctly on mobile resize
                    end: () => "+=" + track.scrollWidth
                }
            });
        }

        // C. Stacking Cards (ENABLED FOR ALL DEVICES)
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

        // E. Mega Hero Reveal
        gsap.fromTo(".mega-brand-img", 
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.5, ease: "power4.out", delay: 0.5 }
        );
        
        gsap.to(".mega-brand-img", {
            yPercent: 20, 
            ease: "none",
            scrollTrigger: {
                trigger: "#mega-hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        // F. Agency About - Fade In
        gsap.from(".img-frame", {
            y: 50,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".agency-about-section",
                start: "top 70%"
            }
        });
        
        gsap.from(".stat-box", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: ".stats-wrapper",
                start: "top 85%"
            }
        });

        // G. 3D HERO TILT EFFECT (Desktop Only - Mouse Interaction)
        const tiltCard = document.querySelector('.tilt-card');
        const tiltInner = document.querySelector('.tilt-inner');

        if (tiltCard && window.innerWidth > 1024) {
            tiltCard.addEventListener('mousemove', (e) => {
                const rect = tiltCard.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const xPct = x / rect.width;
                const yPct = y / rect.height;
                const xRot = (yPct - 0.5) * -20;
                const yRot = (xPct - 0.5) * 20;
                
                gsap.to(tiltInner, {
                    rotationX: xRot,
                    rotationY: yRot,
                    duration: 0.5,
                    ease: "power2.out",
                    transformPerspective: 1000
                });
            });

            tiltCard.addEventListener('mouseleave', () => {
                gsap.to(tiltInner, {
                    rotationX: 0,
                    rotationY: 0,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.5)"
                });
            });
        }
    }

    // ------------------------------------------------
    // 4. MAGNETIC CURSOR & MENU
    // ------------------------------------------------
    // const cursor = document.querySelector('.cursor-circle');
    // const dot = document.querySelector('.cursor-dot');
    // const magnets = document.querySelectorAll('[data-magnetic]');

    // document.addEventListener('mousemove', (e) => {
    //     gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1 });
    //     gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.3 });
    // });

    // magnets.forEach(el => {
    //     el.addEventListener('mouseenter', () => {
    //         gsap.to(cursor, { scale: 1.5, duration: 0.3 });
    //         document.body.classList.add('hovered');
    //     });
    //     el.addEventListener('mouseleave', () => {
    //         gsap.to(cursor, { scale: 1, duration: 0.3 });
    //         document.body.classList.remove('hovered');
    //     });
    // });

    // ------------------------------------------------
    // 4. BRAND CURSOR (GSAP Movement)
    // ------------------------------------------------
    // const brandCursor = document.querySelector('.brand-cursor');
    
    // // Move the cursor using GSAP for performance
    // // xPercent/yPercent -50 ensures the image is centered on the mouse pointer
    // const xTo = gsap.quickTo(brandCursor, "x", {duration: 0.3, ease: "power3"});
    // const yTo = gsap.quickTo(brandCursor, "y", {duration: 0.3, ease: "power3"});

    // window.addEventListener("mousemove", (e) => {
    //     xTo(e.clientX);
    //     yTo(e.clientY);
    // });

    // // Hover Logic: Switch from White to Orange on interactive elements
    // // We select links, buttons, and specific interactive cards
    // const hoverTargets = document.querySelectorAll('a, button, .service-card, .work-card, input, textarea, .progress-wrap');

    // hoverTargets.forEach(el => {
    //     el.addEventListener('mouseenter', () => {
    //         document.body.classList.add('hovered'); // Triggers CSS opacity change
    //     });
    //     el.addEventListener('mouseleave', () => {
    //         document.body.classList.remove('hovered');
    //     });
    // });

    // ------------------------------------------------
    // 4. BRAND CURSOR (SMART CONTRAST)
    // ------------------------------------------------
    const brandCursor = document.querySelector('.brand-cursor');
    
    const xTo = gsap.quickTo(brandCursor, "x", {duration: 0.3, ease: "power3"});
    const yTo = gsap.quickTo(brandCursor, "y", {duration: 0.3, ease: "power3"});

    window.addEventListener("mousemove", (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
    });

    // 4A. Standard Hover (Cursor turns Orange)
    // For white/dark backgrounds
    const standardTargets = document.querySelectorAll('a:not(.btn-pill):not(.footer-email), button, .work-card, .service-card:not(.orange-card), input, textarea');

    standardTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.remove('hover-contrast', 'hover-dark');
            document.body.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovered'));
    });

    // 4B. High Contrast Hover (Cursor stays White)
    // For Orange backgrounds (Cards, Buttons)
    const contrastTargets = document.querySelectorAll('.service-card.orange-card, .btn-pill, .menu-overlay');

    contrastTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.remove('hovered', 'hover-dark');
            document.body.classList.add('hover-contrast');
        });
        el.addEventListener('mouseleave', () => document.body.classList.remove('hover-contrast'));
    });

    // 4C. Dark Contrast Hover (Cursor turns Brown) [NEW FIX]
    // For the Footer Email (Cream background + Orange Text = Needs Dark Cursor)
    const darkTargets = document.querySelectorAll('.footer-email');

    darkTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.remove('hovered', 'hover-contrast');
            document.body.classList.add('hover-dark');
        });
        el.addEventListener('mouseleave', () => document.body.classList.remove('hover-dark'));
    });

    // 4D. Footer Area Detection (Cursor turns Orange) [NEW FIX]
    // When inside the footer (Cream BG), the default cursor should be Orange, not White.
    const footerSection = document.querySelector('footer');

    if (footerSection) {
        footerSection.addEventListener('mouseenter', () => {
            document.body.classList.add('footer-cursor-mode');
        });
        
        footerSection.addEventListener('mouseleave', () => {
            document.body.classList.remove('footer-cursor-mode');
        });
    }

    // 4E. Progress Button Logic (Conditional Color)
    // Rules: Beige normally, Orange when in Footer
    const scrollBtn = document.querySelector('.progress-wrap');
    
    if (scrollBtn) {
        scrollBtn.addEventListener('mouseenter', () => {
            // Check if the button has the 'on-footer' class (added by our scroll logic below)
            if (scrollBtn.classList.contains('on-footer')) {
                // In Footer -> Turn Orange (Standard Hover)
                document.body.classList.remove('hover-contrast', 'hover-dark');
                document.body.classList.add('hovered');
            } else {
                // Not in Footer -> Keep Beige (High Contrast Hover)
                document.body.classList.remove('hovered', 'hover-dark');
                document.body.classList.add('hover-contrast');
            }
        });
        
        scrollBtn.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovered', 'hover-contrast');
        });
    }

    // Menu Toggle
    const toggle = document.querySelector('.menu-toggle');
    const overlay = document.querySelector('.menu-overlay');
    const links = document.querySelectorAll('.menu-link');
    const navbar = document.querySelector('.navbar'); // [ADDED] Select Navbar
    let isOpen = false;

    toggle.addEventListener('click', () => {
        isOpen = !isOpen;
        overlay.classList.toggle('active');
        navbar.classList.toggle('nav-open'); // [ADDED] Toggle class to fix color
        
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
            navbar.classList.remove('nav-open'); // [ADDED] Remove class
            gsap.to(document.querySelectorAll('.hamburger span'), { rotation: 0, y: 0 });
        });
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

    // ------------------------------------------------
    // 5. THEME SWITCHER (Dark / Light)
    // ------------------------------------------------
    const themeBtn = document.getElementById('themeBtn');
    const themeIcon = themeBtn.querySelector('i');
    
    // 1. Check if user already chose a theme
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }

    // 2. Click Event
    themeBtn.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        
        if (theme === 'light') {
            // Switch to Dark
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            
            // Spin Icon: Moon -> Sun
            gsap.to(themeIcon, {
                rotation: 360,
                duration: 0.5,
                onStart: () => {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                },
                onComplete: () => gsap.set(themeIcon, { rotation: 0 })
            });
            
        } else {
            // Switch to Light
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            
            // Spin Icon: Sun -> Moon
            gsap.to(themeIcon, {
                rotation: 360,
                duration: 0.5,
                onStart: () => {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                },
                onComplete: () => gsap.set(themeIcon, { rotation: 0 })
            });
        }
    });
});