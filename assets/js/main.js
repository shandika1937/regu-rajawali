// ===== REGU RAJAWALI 1 - Main JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ========== LOADING SCREEN ==========
    const loadingScreen = document.getElementById('loading-screen');
    
    function hideLoading() {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 800);
        }
    }

    // Hide loading after everything loads
    window.addEventListener('load', () => {
        setTimeout(hideLoading, 2000);
    });

    // Fallback: hide loading after 4 seconds regardless
    setTimeout(hideLoading, 4000);

    // ========== CUSTOM CURSOR ==========
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    if (cursor && window.innerWidth > 768) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });

        // Smooth cursor ring follow
        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            cursorRing.style.transform = `translate(${cursorX - 20}px, ${cursorY - 20}px)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effects on interactive elements
        const hoverables = document.querySelectorAll('a, button, .btn, .member-card, .gallery-item, .stat-card');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('active'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
        });
    }

    // ========== MOUSE GLOW ==========
    const glow = document.querySelector('.mouse-glow');
    if (glow) {
        document.addEventListener('mousemove', (e) => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        });
    }

    // ========== MOUSE TRAIL ==========
    const trailDots = [];
    const trailCount = 12;
    
    if (window.innerWidth > 768) {
        for (let i = 0; i < trailCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'mouse-trail';
            dot.style.opacity = (1 - i / trailCount) * 0.4;
            dot.style.transform = `scale(${1 - i / trailCount})`;
            document.body.appendChild(dot);
            trailDots.push(dot);
        }

        let trailIndex = 0;
        document.addEventListener('mousemove', (e) => {
            const dot = trailDots[trailIndex];
            if (dot) {
                dot.style.left = e.clientX + 'px';
                dot.style.top = e.clientY + 'px';
                dot.style.opacity = '0.5';
                setTimeout(() => {
                    dot.style.opacity = '0';
                }, 200);
            }
            trailIndex = (trailIndex + 1) % trailCount;
        });
    }

    // ========== NAVBAR ==========
    const navbar = document.querySelector('.navbar');
    const toggle = document.querySelector('.navbar-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    let lastScroll = 0;

    // Scroll handler
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Add/remove scrolled class
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav link based on scroll position
        updateActiveNavLink(scrollY);

        lastScroll = scrollY;
    });

    // Mobile menu toggle
    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close menu on link click
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    // Update active nav link
    function updateActiveNavLink(scrollY) {
        const sections = document.querySelectorAll('.section[id], .hero[id], #hero');
        const navLinks = document.querySelectorAll('.nav-link');

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ========== RIPPLE EFFECT ==========
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a, button, .btn');
        if (link) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const rect = link.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
            link.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        }
    });

    // ========== CONFETTI ==========
    function triggerConfetti() {
        const colors = ['#00d4ff', '#ffd700', '#7c3aed', '#ff6b6b', '#10b981', '#f59e0b'];
        for (let i = 0; i < 50; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + 'vw';
            piece.style.width = Math.random() * 8 + 4 + 'px';
            piece.style.height = Math.random() * 8 + 4 + 'px';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            piece.style.animationDuration = Math.random() * 2 + 2 + 's';
            piece.style.animationDelay = Math.random() * 0.5 + 's';
            document.body.appendChild(piece);
            setTimeout(() => piece.remove(), 4000);
        }
    }

    // Trigger confetti on certain buttons
    document.querySelectorAll('[data-confetti]').forEach(btn => {
        btn.addEventListener('click', triggerConfetti);
    });

    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ========== TYPING ANIMATION ==========
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        const texts = [
            'Solid • Disiplin • Kompak',
            'Siap Berkarya • Pantang Menyerah',
            'Rajawali • Terbang Tinggi'
        ];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let currentText = '';

        function typeEffect() {
            const fullText = texts[textIndex];
            
            if (isDeleting) {
                currentText = fullText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                currentText = fullText.substring(0, charIndex + 1);
                charIndex++;
            }

            typingElement.textContent = currentText;

            let typeSpeed = isDeleting ? 40 : 80;

            if (!isDeleting && charIndex === fullText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500;
            }

            setTimeout(typeEffect, typeSpeed);
        }

        setTimeout(typeEffect, 2000);
    }

    // ========== GSAP ANIMATIONS (Basic) ==========
    if (typeof gsap !== 'undefined') {
        // Hero animations
        const heroTl = gsap.timeline({ delay: 2.5 });
        
        heroTl
            .from('.hero-badge', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' })
            .from('.hero-title .line', { 
                opacity: 0, y: 50, duration: 0.8, stagger: 0.15, ease: 'power3.out' 
            }, '-=0.4')
            .from('.hero-subtitle', { 
                opacity: 0, y: 30, duration: 0.6, ease: 'power3.out' 
            }, '-=0.4')
            .from('.tagline-item', { 
                opacity: 0, y: 20, duration: 0.4, stagger: 0.1, ease: 'back.out(1.7)' 
            }, '-=0.3')
            .from('.hero-actions .btn', { 
                opacity: 0, y: 20, duration: 0.5, stagger: 0.15, ease: 'back.out(1.7)' 
            }, '-=0.2')
            .from('.scroll-indicator', { 
                opacity: 0, y: 20, duration: 0.5, ease: 'power3.out' 
            }, '-=0.1');

        // Scroll-triggered animations
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 40,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        // Member cards stagger
        gsap.utils.toArray('.member-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 60,
                rotationX: 10,
                duration: 0.6,
                delay: i * 0.08,
                ease: 'back.out(1.7)'
            });
        });

        // Stat cards
        gsap.utils.toArray('.stat-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%'
                },
                opacity: 0,
                y: 40,
                scale: 0.9,
                duration: 0.5,
                delay: i * 0.1,
                ease: 'back.out(1.7)'
            });
        });
    }

    // ========== IMAGE LAZY LOAD ==========
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.remove('img-shimmer');
                imageObserver.unobserve(img);
            }
        });
    }, { rootMargin: '100px' });

    lazyImages.forEach(img => imageObserver.observe(img));

    // ========== PARALLAX ON SCROLL ==========
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Hero parallax
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
            heroContent.style.opacity = 1 - (scrolled * 0.002);
        }
    });

    // ========== 3D TILT ON MEMBER CARDS ==========
    const cards = document.querySelectorAll('.member-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 12;
            const rotateY = (centerX - x) / 12;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            
            // Glow follows mouse
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.left = (x / rect.width * 100) + '%';
                glow.style.top = (y / rect.height * 100) + '%';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });

    // ========== INTERSECTION OBSERVER FOR SCROLL REVEAL ==========
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    console.log('%c🦅 REGU RAJAWALI 1', 'font-size: 24px; font-weight: bold; color: #00d4ff;');
    console.log('%cSolid • Disiplin • Kompak • Siap Berkarya', 'font-size: 14px; color: #ffd700;');
});
