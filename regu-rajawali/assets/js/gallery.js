// ===== REGU RAJAWALI 1 - Gallery Module =====

(function() {
    'use strict';

    const galleryGrid = document.getElementById('gallery-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const loadMoreBtn = document.getElementById('gallery-load-more');

    if (!galleryGrid) return;

    // Sample gallery data (replace with actual photos)
    const galleryData = [
        { src: 'assets/images/gallery/placeholder-1.jpg', title: 'Kebersamaan Regu', subtitle: 'Foto bersama setelah latihan' },
        { src: 'assets/images/gallery/placeholder-2.jpg', title: 'Diskusi Kelompok', subtitle: 'Belajar bersama di kelas' },
        { src: 'assets/images/gallery/placeholder-3.jpg', title: 'Upacara Bendera', subtitle: 'Senin pagi yang penuh semangat' },
        { src: 'assets/images/gallery/placeholder-4.jpg', title: 'Kegiatan Olahraga', subtitle: 'Olahraga bersama di lapangan' },
        { src: 'assets/images/gallery/placeholder-5.jpg', title: 'Belajar Informatika', subtitle: 'Praktik coding di lab komputer' },
        { src: 'assets/images/gallery/placeholder-6.jpg', title: 'Istirahat Bersama', subtitle: 'Makan bersama saat jam istirahat' },
        { src: 'assets/images/gallery/placeholder-7.jpg', title: 'Kerja Bakti', subtitle: 'Membersihkan kelas bersama' },
        { src: 'assets/images/gallery/placeholder-8.jpg', title: 'Presentasi', subtitle: 'Presentasi tugas kelompok' },
        { src: 'assets/images/gallery/placeholder-9.jpg', title: 'Ekstrakurikuler', subtitle: 'Kegiatan setelah pulang sekolah' },
        { src: 'assets/images/gallery/placeholder-10.jpg', title: 'Wisuda', subtitle: 'Momen perpisahan yang berkesan' }
    ];

    let currentIndex = 0;
    let currentImages = [];
    let itemsPerPage = 6;
    let loadedCount = 0;

    // Generate placeholder SVG if image not found
    function generatePlaceholder(index) {
        const colors = ['#00d4ff', '#7c3aed', '#ffd700', '#ff6b6b', '#10b981', '#f59e0b'];
        const color = colors[index % colors.length];
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
            <defs>
                <linearGradient id="g${index}">
                    <stop offset="0%" stop-color="${color}" stop-opacity="0.2"/>
                    <stop offset="100%" stop-color="${color}" stop-opacity="0.05"/>
                </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#g${index})"/>
            <text x="200" y="145" text-anchor="middle" fill="${color}" font-size="48">+</text>
            <text x="200" y="175" text-anchor="middle" fill="${color}" font-size="14" opacity="0.7">Foto Regu Rajawali 1</text>
        </svg>`;
        return `data:image/svg+xml,${encodeURIComponent(svg)}`;
    }

    function createGalleryItem(item, index) {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.dataset.index = index;
        
        const img = document.createElement('img');
        img.src = generatePlaceholder(index);
        img.alt = item.title;
        img.loading = 'lazy';
        
        img.onerror = function() {
            this.src = generatePlaceholder(index);
        };

        // Try to load actual image
        const realImg = new Image();
        realImg.onload = function() {
            img.src = item.src;
            img.classList.remove('img-shimmer');
        };
        realImg.src = item.src;

        const overlay = document.createElement('div');
        overlay.className = 'gallery-overlay';
        overlay.innerHTML = `
            <div class="gallery-title">${item.title}</div>
            <div class="gallery-subtitle">${item.subtitle}</div>
        `;

        div.appendChild(img);
        div.appendChild(overlay);

        div.addEventListener('click', () => openLightbox(index));

        return div;
    }

    function loadMoreItems() {
        const endIndex = Math.min(loadedCount + itemsPerPage, currentImages.length);
        
        for (let i = loadedCount; i < endIndex; i++) {
            const item = createGalleryItem(currentImages[i], i);
            galleryGrid.appendChild(item);
            
            // Animate in
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                requestAnimationFrame(() => {
                    item.style.transition = 'all 0.5s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                });
            }, (i - loadedCount) * 80);
        }

        loadedCount = endIndex;

        if (loadedCount >= currentImages.length && loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
        }
    }

    function initGallery(images) {
        currentImages = images || galleryData;
        loadedCount = 0;
        galleryGrid.innerHTML = '';
        loadMoreItems();
    }

    // ========== LIGHTBOX ==========
    function openLightbox(index) {
        if (!lightbox || !lightboxImg) return;
        currentIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function updateLightboxImage() {
        if (!lightboxImg) return;
        const item = currentImages[currentIndex];
        lightboxImg.src = item.src;
        lightboxImg.alt = item.title;
        
        // Try to load actual image, fallback to placeholder
        lightboxImg.onerror = function() {
            this.src = generatePlaceholder(currentIndex);
        };
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        currentIndex = (currentIndex + direction + currentImages.length) % currentImages.length;
        updateLightboxImage();
        
        // Animate transition
        if (lightboxImg) {
            lightboxImg.style.transform = 'scale(0.95)';
            lightboxImg.style.opacity = '0.5';
            setTimeout(() => {
                lightboxImg.style.transform = 'scale(1)';
                lightboxImg.style.opacity = '1';
            }, 50);
        }
    }

    // Lightbox controls
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));

    // Close on overlay click
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox?.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // Load more button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreItems);
    }

    // Initialize
    initGallery();

    // Expose for external use
    window.GalleryModule = {
        init: initGallery,
        openLightbox,
        closeLightbox
    };

})();
