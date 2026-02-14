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

        // C. Stacking Cards (ALL DEVICES)
        const cards = gsap.utils.toArray(".service-card");
        cards.forEach((card, i) => {
            ScrollTrigger.create({
                trigger: card,
                // Start pinning when card hits 120px from top
                start: "top top+=120", 
                pin: true, 
                pinSpacing: false, 
                // End pinning when the WHOLE section finishes scrolling
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

        // E. Mega Hero Reveal (MULTI-DEVICE VIDEO UPDATE)
        // Select ALL videos (both desktop and mobile)
        const heroVideos = document.querySelectorAll(".mega-brand-video");
        
        if (heroVideos.length > 0) {
            heroVideos.forEach(video => {
                // 1. Start Playing
                // We try to play both; the browser handles the hidden one efficiently.
                video.play().catch(e => console.log("Video autoplay failed:", e));

                // 2. Animate (Same animation for both)
                gsap.fromTo(video, 
                    { scale: 0.8, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 1.5, ease: "power4.out", delay: 0.5 }
                );
                
                // 3. Parallax Scroll Effect
                gsap.to(video, {
                    yPercent: 20, 
                    ease: "none",
                    scrollTrigger: {
                        trigger: "#mega-hero",
                        start: "top top",
                        end: "bottom top",
                        scrub: true
                    }
                });
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
    // 9. PROJECT MODAL DATA & LOGIC (UPDATED: GALLERY SUPPORT)
    // ------------------------------------------------
    
    // DATA STRUCTURE UPDATE: 
    // Instead of 'src' and 'type', we now use a 'media' array.
    // You can add as many images/videos as you want for each client.
    const portfolioData = {
        1: {
            title: "Logo & Brand Identity",
            projects: [
                { 
                    client: "Barecce", 
                    media: [
                        { src: "images/brand-logo-orange.PNG", type: "image" },
                        { src: "images/brand-logo-white.PNG", type: "image" } // Example 2nd image
                    ]
                },
                { 
                    client: "Tara Bakes", 
                    media: [
                        { src: "https://placehold.co/600x600/png?text=Tara+Bakes+1", type: "image" },
                        { src: "https://placehold.co/600x600/png?text=Tara+Bakes+Logo", type: "image" }
                    ]
                },
                { 
                    client: "Bakers Hub", 
                    media: [{ src: "https://placehold.co/600x600/png?text=Bakers+Hub", type: "image" }]
                },
                { 
                    client: "SNX", 
                    media: [{ src: "videos/snx/1769031656754893.MP4", type: "video" }]
                },
                { 
                    client: "Aqua Valley", 
                    media: [{ src: "videos/aqua-valley/Aqua Valley reel 4.mp4", type: "video" }]
                },
                { 
                    client: "Melo Kidzz", 
                    media: [{ src: "https://placehold.co/600x600/png?text=Melo+Kidzz", type: "image" }]
                },
                { 
                    client: "Purvanchal", 
                    media: [{ src: "https://placehold.co/600x600/png?text=Purvanchal", type: "image" }]
                },
                { 
                    client: "Russamed", 
                    media: [{ src: "https://placehold.co/600x600/png?text=Russamed", type: "image" }]
                }
            ]
        },
        2: {
            title: "Video Content Strategy",
            projects: [
                { 
                    client: "Aqua Valley", 
                    media: [
                        { src: "videos/aqua-valley/Aqua Valley reel 2 changes.mp4", type: "video" },
                        { src: "videos/aqua-valley/Aqua Valley reel 4.mp4", type: "video" } // Example: 2 Videos
                    ]
                },
                { 
                    client: "Sweetmist", 
                    media: [{ src: "https://placehold.co/600x600/png?text=Sweetmist", type: "image" }]
                },
                { 
                    client: "Bakers Hub", 
                    media: [{ src: "https://placehold.co/600x600/png?text=Bakers+Hub", type: "image" }]
                }
            ]
        },
        // ... Keep adding 'media: [...]' for other categories (3, 4, 5, 6) similarly ...
        3: {
            title: "Event Marketing",
            projects: [
                { client: "Emprado Beauty Land", media: [{ src: "videos/emprado/Emprado reel 1 revised.MP4", type: "video" }] },
                { client: "Vibe with the Night", media: [{ src: "https://placehold.co/600x600/png?text=Vibe+Event", type: "image" }] }
            ]
        },
        4: {
            title: "Social Media Feed",
            projects: [
                { client: "Aqua Valley", media: [{ src: "videos/aqua-valley/Aqua Valley reel 2 changes.MP4", type: "video" }] },
                { client: "Aahvi", media: [{ src: "videos/aahvi/1767615942371132.MP4", type: "video" }] },
                { client: "Bakers Hub", media: [{ src: "https://placehold.co/600x600/png?text=Bakers+Hub", type: "image" }] }
            ]
        },
        5: {
            title: "Print Media",
            projects: [
                { client: "Brochure Design", media: [{ src: "https://placehold.co/600x600/png?text=Brochure", type: "image" }] },
                { client: "Packaging", media: [{ src: "https://placehold.co/600x600/png?text=Packaging", type: "image" }] },
                { client: "Flyer Design", media: [{ src: "https://placehold.co/600x600/png?text=Flyer", type: "image" }] }
            ]
        },
        6: {
            title: "Designs & Creatives",
            projects: [
                { client: "Social Creative", media: [{ src: "https://placehold.co/600x600/png?text=Social+Post", type: "image" }] },
                { client: "Ad Banner", media: [{ src: "https://placehold.co/600x600/png?text=Ad+Banner", type: "image" }] },
                { client: "Campaign", media: [{ src: "https://placehold.co/600x600/png?text=Campaign", type: "image" }] }
            ]
        }
    };

    // --- STATE VARIABLES FOR LIGHTBOX ---
    let currentMediaArray = []; // Stores the current list of images/videos
    let currentMediaIndex = 0;  // Which one are we showing?

    // OPEN MODAL GRID
    window.openProjectModal = function (id) {
        const modal = document.getElementById('project-modal');
        const titleEl = document.getElementById('modal-title');
        const contentEl = document.getElementById('modal-content');

        const data = portfolioData[id];
        if (!data) return;

        if (window.lenis) window.lenis.stop();
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        titleEl.textContent = data.title;
        contentEl.innerHTML = '';

        const grid = document.createElement('div');
        grid.className = 'project-grid';

        data.projects.forEach(proj => {
            const item = document.createElement('div');
            item.className = 'project-item';
            
            // Get Thumbnail (First item in media array)
            const thumb = proj.media[0];

            let mediaHtml = '';
            if (thumb.type === 'video') {
                // Muted video thumbnail
                mediaHtml = `<video src="${thumb.src}" muted playsinline loop onmouseover="this.play()" onmouseout="this.pause()"></video>`;
            } else {
                mediaHtml = `<img src="${thumb.src}" alt="${proj.client}">`;
            }

            // Indicator if multiple images exist
            let multiIcon = proj.media.length > 1 
                ? `<div style="position:absolute; bottom:10px; right:10px; background:rgba(246,136,35,0.9); color:#fff; padding:4px 8px; border-radius:4px; font-size:0.7rem;"><i class="fas fa-layer-group"></i> ${proj.media.length}</div>` 
                : '';

            item.innerHTML = `
                <div class="project-media">
                    ${mediaHtml}
                    ${multiIcon}
                    <div style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.6); color: #fff; padding: 5px 8px; border-radius: 4px; font-size: 0.8rem;">
                        <i class="fas fa-expand"></i>
                    </div>
                </div>
                <div class="project-client-name">${proj.client}</div>
            `;

            // CLICK EVENT: Open Lightbox with ALL media for this client
            item.onclick = () => window.initLightbox(proj.media);

            grid.appendChild(item);
        });

        contentEl.appendChild(grid);
        modal.classList.add('open');

        gsap.fromTo(".project-item",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.3 }
        );
    };

    window.closeProjectModal = function () {
        const modal = document.getElementById('project-modal');
        modal.classList.remove('open');
        if (window.lenis) window.lenis.start();
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    };

    // ------------------------------------------------
    // 10. UNIFIED LIGHTBOX LOGIC (Fixed & Robust)
    // ------------------------------------------------
    
    // 1. Initialize Lightbox
    window.initLightbox = function(mediaArray) {
        currentMediaArray = mediaArray;
        currentMediaIndex = 0;
        
        const lightbox = document.getElementById('lightbox');
        // Force display flex via class
        lightbox.classList.add('active');
        window.updateLightboxContent();
    };

    // 2. Close Lightbox (Updated with Modal Check)
    window.closeLightbox = function () {
        const lightbox = document.getElementById('lightbox');
        const wrapper = document.getElementById('lightbox-wrapper');
        const video = wrapper ? wrapper.querySelector('video') : null;

        if (lightbox) lightbox.classList.remove('active');
        if (video) video.pause();

        setTimeout(() => {
            if (wrapper) wrapper.innerHTML = '';
            
            // --- LOGIC FIX: CHECK FOR MODAL ---
            // Only unlock scrolling if the Project Modal is ALSO closed.
            const projectModal = document.getElementById('project-modal');
            const isModalOpen = projectModal && projectModal.classList.contains('open');

            if (!isModalOpen) {
                // Safe to unlock scroll (No modal is open)
                if (window.lenis) window.lenis.start();
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
            }
            // If modal is open, we do nothing (keep scroll locked)
            // -------------------------------------

        }, 300);
    };

    // 3. Update Content (Image/Video + Counter)
    window.updateLightboxContent = function() {
        const wrapper = document.getElementById('lightbox-wrapper');
        const counter = document.getElementById('lb-counter');
        const prevBtn = document.getElementById('lb-prev');
        const nextBtn = document.getElementById('lb-next');
        
        if (!wrapper) return;

        const item = currentMediaArray[currentMediaIndex];
        const total = currentMediaArray.length;

        wrapper.innerHTML = ''; 

        // Render Media
        let element;
        if (item.type === 'video') {
            element = document.createElement('video');
            element.src = item.src;
            element.controls = true;
            element.autoplay = true;
            element.playsInline = true;
            // Style for max fit
            element.style.maxWidth = "100%";
            element.style.maxHeight = "85vh";
        } else {
            element = document.createElement('img');
            element.src = item.src;
            element.style.maxWidth = "100%";
            element.style.maxHeight = "85vh";
            element.style.objectFit = "contain";
        }
        
        gsap.fromTo(element, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.3 });
        wrapper.appendChild(element);

        // Update Counter
        if (counter) {
            counter.textContent = total > 1 ? `${currentMediaIndex + 1} / ${total}` : '';
            counter.style.display = total > 1 ? 'block' : 'none';
        }

        // Update Navigation Buttons
        if (prevBtn && nextBtn) {
            if (total <= 1) {
                prevBtn.classList.add('disabled');
                nextBtn.classList.add('disabled');
            } else {
                // Show/Hide based on index
                if (currentMediaIndex === 0) prevBtn.classList.add('disabled');
                else prevBtn.classList.remove('disabled');

                if (currentMediaIndex === total - 1) nextBtn.classList.add('disabled');
                else nextBtn.classList.remove('disabled');
            }
        }
    };

    // 4. Navigation Functions
    window.nextSlide = function() {
        if (currentMediaIndex < currentMediaArray.length - 1) {
            currentMediaIndex++;
            window.updateLightboxContent();
        }
    };

    window.prevSlide = function() {
        if (currentMediaIndex > 0) {
            currentMediaIndex--;
            window.updateLightboxContent();
        }
    };

    // ------------------------------------------------
    // 11. EVENT LISTENERS (Capture Phase - Priority Fix)
    // ------------------------------------------------
    // Using 'true' at the end ensures these fire BEFORE anything else blocks them.
    
    document.addEventListener('click', function(e) {
        // A. Close Button Click
        if (e.target.closest('#lb-close')) {
            e.preventDefault();
            e.stopPropagation();
            window.closeLightbox();
            return;
        }

        // B. Overlay Background Click
        if (e.target.id === 'lightbox') {
            e.preventDefault();
            window.closeLightbox();
            return;
        }

        // C. Previous Button
        if (e.target.closest('#lb-prev')) {
            e.preventDefault();
            e.stopPropagation();
            window.prevSlide();
            return;
        }

        // D. Next Button
        if (e.target.closest('#lb-next')) {
            e.preventDefault();
            e.stopPropagation();
            window.nextSlide();
            return;
        }
    }, true); // <--- Capture Phase Enabled

    // Keyboard Shortcuts (Updated for Modal + Lightbox)
    document.addEventListener('keydown', (e) => {
        
        // 1. LIGHTBOX PRIORITY (Check this first)
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                window.closeLightbox();
                return; // STOP HERE (Don't close the modal yet)
            }
            if (e.key === 'ArrowRight') window.nextSlide();
            if (e.key === 'ArrowLeft') window.prevSlide();
            return;
        }

        // 2. PROJECT MODAL (Check this second)
        const projectModal = document.getElementById('project-modal');
        if (projectModal && projectModal.classList.contains('open')) {
            if (e.key === 'Escape') {
                window.closeProjectModal();
            }
        }
    });

    // ------------------------------------------------
    // 12. PHONE INPUT VALIDATION
    // ------------------------------------------------
    const phoneInput = document.getElementById('c-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }

}); // END DOMContentLoaded