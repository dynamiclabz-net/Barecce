document.addEventListener("DOMContentLoaded", () => {

    // ------------------------------------------------
    // 1. HINDI CHAR SEQUENCE LOADER
    // ------------------------------------------------
    const loaderText = document.querySelector(".loader-text");
    const loaderLogo = document.querySelector(".loader-logo");

    // The Sequence: First 6 Hindi Vowels
    const hindiChars = ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ'];
    let charIndex = 0;

    function runLoaderSequence() {
        if (charIndex < hindiChars.length) {
            // 1. Update Character
            loaderText.textContent = hindiChars[charIndex];

            // Optional: minimal animation for each char change
            gsap.fromTo(loaderText,
                { opacity: 0.7, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.4 }
            );

            charIndex++;
            // Speed of letters (400ms per letter)
            setTimeout(runLoaderSequence, 400);

        } else {
            // 2. Sequence Finished -> Show Logo
            loaderText.style.display = 'none';
            loaderLogo.style.display = 'block';

            // Animate Logo Entrance (Pop effect)
            gsap.fromTo(loaderLogo,
                { scale: 0.5, opacity: 0, rotation: -10 },
                { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: "back.out(1.7)" }
            );

            // 3. Lift Curtain after Logo is seen for a moment
            setTimeout(() => {
                gsap.to(".preloader", {
                    yPercent: -100,
                    duration: 1.2,
                    ease: "power4.inOut",
                    onComplete: initAnimations // Start site animations
                });
            }, 1400); // Logo stays visible for 1.2 seconds
        }
    }

    // Start the sequence
    runLoaderSequence();

    // ------------------------------------------------
    // 2. SETUP LENIS (Smooth Scroll) - GLOBAL FIX
    // ------------------------------------------------
    // We attach lenis to 'window' so it can be accessed by the modal functions later
    window.lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
    });

    function raf(time) {
        window.lenis.raf(time);
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
                    end: () => "+=" + track.scrollWidth
                }
            });
        }

        // C. Stacking Cards
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
        // gsap.fromTo(".mega-brand-img",
        //     { scale: 0.8, opacity: 0 },
        //     { scale: 1, opacity: 1, duration: 1.5, ease: "power4.out", delay: 0.5 }
        // );

        // gsap.to(".mega-brand-img", {
        //     yPercent: 20,
        //     ease: "none",
        //     scrollTrigger: {
        //         trigger: "#mega-hero",
        //         start: "top top",
        //         end: "bottom top",
        //         scrub: true
        //     }
        // });

        // E. Mega Hero Reveal (VIDEO UPDATE)
        const heroVideo = document.querySelector(".mega-brand-video");
        
        if (heroVideo) {
            // 1. Start Playing the video immediately when animations init
            heroVideo.play().catch(e => console.log("Video autoplay failed:", e));

            // 2. Animate it fading in and scaling up
            gsap.fromTo(heroVideo, 
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 1.5, ease: "power4.out", delay: 0.5 }
            );
            
            // 3. Parallax Scroll Effect (Moves down as you scroll)
            gsap.to(heroVideo, {
                yPercent: 20, 
                ease: "none",
                scrollTrigger: {
                    trigger: "#mega-hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });
        }

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

        // G. 3D HERO TILT EFFECT (Desktop Only)
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

        // I. Karigar (Founders) Image Reveal
        gsap.from(".founder-visual", {
            y: 60,
            opacity: 0,
            duration: 1.5,
            stagger: 0.3,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".founders-section",
                start: "top 75%",
                toggleActions: "play none none reverse"
            }
        });

        // J. Vertical Line Reveal
        gsap.from(".founder-divider", {
            height: 0,
            opacity: 0,
            duration: 1.5,
            ease: "power3.inOut",
            scrollTrigger: {
                trigger: ".founders-section",
                start: "top 70%"
            }
        });

        // ------------------------------------------------
        // 8. CLIENTELE TABS LOGIC
        // ------------------------------------------------
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.client-panel');

        if (tabBtns.length > 0) {
            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    tabBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    tabPanels.forEach(panel => panel.classList.remove('active-panel'));

                    const targetId = btn.getAttribute('data-tab');
                    const targetPanel = document.getElementById(targetId);
                    if (targetPanel) {
                        targetPanel.classList.add('active-panel');
                        gsap.fromTo(targetPanel.children,
                            { opacity: 0, y: 20 },
                            { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 }
                        );
                    }
                });
            });
        }
    }

    // ------------------------------------------------
    // 4. BRAND CURSOR (SMART CONTRAST)
    // ------------------------------------------------
    const brandCursor = document.querySelector('.brand-cursor');
    const xTo = gsap.quickTo(brandCursor, "x", { duration: 0.3, ease: "power3" });
    const yTo = gsap.quickTo(brandCursor, "y", { duration: 0.3, ease: "power3" });

    window.addEventListener("mousemove", (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
    });

    const standardTargets = document.querySelectorAll('a:not(.btn-pill):not(.footer-email):not(.btn-reveal), button, .work-card, .service-card:not(.orange-card), input, textarea');
    standardTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.remove('hover-contrast', 'hover-dark');
            document.body.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovered'));
    });

    const contrastTargets = document.querySelectorAll('.service-card.orange-card, .btn-pill, .menu-overlay, .btn-reveal');
    contrastTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.remove('hovered', 'hover-dark');
            document.body.classList.add('hover-contrast');
        });
        el.addEventListener('mouseleave', () => document.body.classList.remove('hover-contrast'));
    });

    const darkTargets = document.querySelectorAll('.footer-email, .modal-container');
    darkTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.remove('hovered', 'hover-contrast');
            document.body.classList.add('hover-dark');
        });
        el.addEventListener('mouseleave', () => document.body.classList.remove('hover-dark'));
    });

    const creamSections = document.querySelectorAll('footer, .founders-section');
    creamSections.forEach(section => {
        section.addEventListener('mouseenter', () => document.body.classList.add('footer-cursor-mode'));
        section.addEventListener('mouseleave', () => document.body.classList.remove('footer-cursor-mode'));
    });

    // Menu Toggle
    const toggle = document.querySelector('.menu-toggle');
    const overlay = document.querySelector('.menu-overlay');
    const links = document.querySelectorAll('.menu-link');
    const navbar = document.querySelector('.navbar');
    let isOpen = false;

    toggle.addEventListener('click', () => {
        isOpen = !isOpen;
        overlay.classList.toggle('active');
        navbar.classList.toggle('nav-open');

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
            navbar.classList.remove('nav-open');
            gsap.to(document.querySelectorAll('.hamburger span'), { rotation: 0, y: 0 });
        });
    });

    // ==========================================
    // MAGNETIC PROGRESS BUTTON LOGIC
    // ==========================================
    const progressPath = document.querySelector('.progress-wrap path');
    const pathLength = progressPath.getTotalLength();

    progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
    progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';

    const updateProgress = function () {
        const scroll = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const progress = pathLength - (scroll * pathLength / height);
        progressPath.style.strokeDashoffset = progress;
    }

    updateProgress();
    window.addEventListener('scroll', updateProgress);

    const offset = 50;
    const progressWrap = document.querySelector('.progress-wrap');
    const mainContent = document.querySelector('main');

    window.addEventListener('scroll', function () {
        if (window.scrollY > offset) {
            progressWrap.classList.add('active-progress');
        } else {
            progressWrap.classList.remove('active-progress');
        }

        if (mainContent) {
            const mainBottom = mainContent.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            if (mainBottom < windowHeight) {
                progressWrap.classList.add('on-footer');
            } else {
                progressWrap.classList.remove('on-footer');
            }
        }
    });

    progressWrap.addEventListener('click', function (event) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ------------------------------------------------
    // 5. THEME SWITCHER
    // ------------------------------------------------
    const themeBtn = document.getElementById('themeBtn');
    const themeIcon = themeBtn.querySelector('i');

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.classList.remove('fa-lightbulb');
        themeIcon.classList.add('fa-moon');
    }

    themeBtn.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            gsap.to(themeIcon, {
                rotation: 360,
                duration: 0.5,
                onStart: () => {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-lightbulb');
                },
                onComplete: () => gsap.set(themeIcon, { rotation: 0 })
            });
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            gsap.to(themeIcon, {
                rotation: 360,
                duration: 0.5,
                onStart: () => {
                    themeIcon.classList.remove('fa-lightbulb');
                    themeIcon.classList.add('fa-moon');
                },
                onComplete: () => gsap.set(themeIcon, { rotation: 0 })
            });
        }
    });

    // ------------------------------------------------
    // 9. PROJECT MODAL DATA & LOGIC (FIXED)
    // ------------------------------------------------
    const portfolioData = {
        1: {
            title: "Logo & Brand Identity",
            projects: [
                { client: "Barecce", src: "images/brand-logo-orange.PNG", type: "image" },
                { client: "Tara Bakes", src: "images/asset3.jpeg", type: "image" },
                { client: "Bakers Hub", src: "images/asset1.jpeg", type: "image" },
                { client: "SNX", src: "images/asset4.jpeg", type: "image" },
                { client: "Aqua Valley", src: "images/asset2.jpeg", type: "image" },
                { client: "Melo Kidzz", src: "https://placehold.co/600x600/png?text=Melo+Kidzz", type: "image" },
                { client: "Purvanchal", src: "https://placehold.co/600x600/png?text=Purvanchal", type: "image" },
                { client: "Russamed", src: "https://placehold.co/600x600/png?text=Russamed", type: "image" }
            ]
        },
        2: {
            title: "Video Content Strategy",
            projects: [
                { client: "Aqua Valley", src: "images/asset2.jpeg", type: "image" },
                { client: "Sweetmist", src: "https://placehold.co/600x600/png?text=Sweetmist", type: "image" },
                { client: "Bakers Hub", src: "images/asset1.jpeg", type: "image" }
            ]
        },
        3: {
            title: "Event Marketing",
            projects: [
                { client: "Emprado Beauty Land", src: "images/asset4.jpeg", type: "image" },
                { client: "Vibe with the Night", src: "https://placehold.co/600x600/png?text=Vibe", type: "image" }
            ]
        },
        4: {
            title: "Social Media Feed",
            projects: [
                { client: "Aqua Valley", src: "images/asset2.jpeg", type: "image" },
                { client: "Aahvi", src: "https://placehold.co/600x600/png?text=Aahvi", type: "image" },
                { client: "Bakers Hub", src: "images/asset3.jpeg", type: "image" }
            ]
        },
        5: {
            title: "Print Media",
            projects: [
                { client: "Brochure Design", src: "images/asset1.jpeg", type: "image" },
                { client: "Packaging Mockup", src: "images/asset2.jpeg", type: "image" },
                { client: "Flyer Design", src: "images/asset4.jpeg", type: "image" }
            ]
        },
        6: {
            title: "Designs & Creatives",
            projects: [
                { client: "Social Creative 1", src: "images/service-2.png", type: "image" },
                { client: "Ad Banner", src: "images/service-3.png", type: "image" },
                { client: "Campaign Post", src: "images/service-5.png", type: "image" }
            ]
        }
    };

    // OPEN MODAL
    window.openProjectModal = function (id) {
        const modal = document.getElementById('project-modal');
        const titleEl = document.getElementById('modal-title');
        const contentEl = document.getElementById('modal-content');

        const data = portfolioData[id];
        if (!data) return;

        // 1. Pause Main Scroll (Global Lenis)
        if (window.lenis) window.lenis.stop();

        // 2. Lock Body AND HTML to prevent background scroll
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        // Populate Content
        titleEl.textContent = data.title;
        contentEl.innerHTML = '';

        const grid = document.createElement('div');
        grid.className = 'project-grid';

        data.projects.forEach(proj => {
            const item = document.createElement('div');
            item.className = 'project-item';

            item.style.cursor = 'pointer';
            item.onclick = () => window.openLightbox(proj.src, proj.type);

            let mediaHtml = '';
            if (proj.type === 'video') {
                mediaHtml = `<video src="${proj.src}" autoplay loop muted playsinline style="pointer-events: none;"></video>`;
            } else {
                mediaHtml = `<img src="${proj.src}" alt="${proj.client}">`;
            }

            item.innerHTML = `
                <div class="project-media">
                    ${mediaHtml}
                    <div style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.6); color: #fff; padding: 5px 8px; border-radius: 4px; font-size: 0.8rem;">
                        <i class="fas fa-expand"></i>
                    </div>
                </div>
                <div class="project-client-name">${proj.client}</div>
            `;
            grid.appendChild(item);
        });

        contentEl.appendChild(grid);
        modal.classList.add('open');

        gsap.fromTo(".project-item",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.3 }
        );
    };

    // CLOSE MODAL (THIS WAS MISSING!)
    window.closeProjectModal = function () {
        const modal = document.getElementById('project-modal');
        modal.classList.remove('open');

        // Resume Scroll
        if (window.lenis) window.lenis.start();

        // Unlock Body
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    };

    // --- NEW: LIGHTBOX FUNCTIONS ---

    window.openLightbox = function (src, type) {
        const lightbox = document.getElementById('lightbox');
        const wrapper = document.getElementById('lightbox-wrapper');

        wrapper.innerHTML = '';

        if (type === 'video') {
            const video = document.createElement('video');
            video.src = src;
            video.controls = true;
            video.autoplay = true;
            video.style.maxWidth = "100%";
            video.style.maxHeight = "90vh";
            wrapper.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = src;
            wrapper.appendChild(img);
        }

        lightbox.classList.add('active');
    };

    window.closeLightbox = function () {
        const lightbox = document.getElementById('lightbox');
        const wrapper = document.getElementById('lightbox-wrapper');

        lightbox.classList.remove('active');

        setTimeout(() => {
            wrapper.innerHTML = '';

            // Fix focus so modal controls work immediately
            const modalContent = document.getElementById('modal-content');
            if (modalContent) {
                modalContent.focus();
            }
        }, 300);
    };

    // Close on clicking outside
    document.getElementById('project-modal').addEventListener('click', (e) => {
        if (e.target.id === 'project-modal') {
            window.closeProjectModal();
        }
    });

    // ------------------------------------------------
    // FIX: LIGHTBOX CLOSE BUTTON LISTENER
    // ------------------------------------------------
    const lightboxCloseBtn = document.querySelector('.lightbox-close');
    
    if (lightboxCloseBtn) {
        lightboxCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent double-firing with overlay
            window.closeLightbox();
        });
    }
});