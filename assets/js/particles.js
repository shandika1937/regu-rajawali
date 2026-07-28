// ===== REGU RAJAWALI 1 - Particle System =====

(function() {
    'use strict';

    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = -1000;
    let mouseY = -1000;
    let animationId;

    // Responsive particle count
    let particleCount = Math.min(Math.floor(window.innerWidth * 0.1), 80);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particleCount = Math.min(Math.floor(window.innerWidth * 0.1), 80);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = this.getColor();
            this.life = Math.random() * 200 + 100;
            this.maxLife = this.life;
        }

        getColor() {
            const colors = [
                '0, 212, 255',   // cyan/blue
                '124, 58, 237',   // purple
                '255, 215, 0',    // gold
                '0, 245, 255',    // neon cyan
                '108, 99, 255'    // indigo
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            // Mouse interaction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 150) {
                const force = (150 - dist) / 150;
                this.x -= dx * force * 0.01;
                this.y -= dy * force * 0.01;
            }

            this.x += this.speedX;
            this.y += this.speedY;
            this.life--;

            // Wrap around
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.y > canvas.height + 10) this.y = -10;

            // Reset when life ends
            if (this.life <= 0) {
                this.reset();
            }
        }

        draw() {
            const lifeRatio = this.life / this.maxLife;
            const currentOpacity = this.opacity * lifeRatio;
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${currentOpacity})`;
            ctx.fill();

            // Glow effect
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${currentOpacity * 0.15})`;
            ctx.fill();
        }
    }

    // Initialize particles
    function init() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Draw connections between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const opacity = (1 - dist / 120) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        drawConnections();

        animationId = requestAnimationFrame(animate);
    }

    // Mouse tracking
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
        mouseX = -1000;
        mouseY = -1000;
    });

    // Touch support
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
        }
    }, { passive: true });

    document.addEventListener('touchend', () => {
        mouseX = -1000;
        mouseY = -1000;
    });

    // Start
    init();
    animate();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (animationId) cancelAnimationFrame(animationId);
    });

    // Re-init on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resizeCanvas();
            init();
        }, 500);
    });

})();
