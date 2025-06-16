// Smooth scrolling and animations
document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserverOptions = {
        threshold: 0.2, // Trigger when 20% of the section is visible
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // For gallery items, stagger animation
                if (entry.target.classList.contains('gallery-item')) {
                    const index = Array.from(document.querySelectorAll('.gallery-item')).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            } else {
                // Optional: remove animate class when out of view to re-trigger on scroll back
                // entry.target.classList.remove('animate');
            }
        });
    }, observerOptions);

    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelector('.container, .hero-content').classList.add('animate');
            } else {
                // Optional: remove animate class for sections too
                // entry.target.querySelector('.container, .hero-content').classList.remove('animate');
            }
        });
    }, sectionObserverOptions);

    // Observe timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        observer.observe(item);
    });

    // Observe gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        observer.observe(item);
    });

    // Observe sections for overall content fade-in
    const sections = document.querySelectorAll('section:not(.footer)'); // Exclude footer from section animations
    sections.forEach(section => {
        sectionObserver.observe(section);
    });


    // Lightbox para imagens do carrossel
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const carouselImages = document.querySelectorAll('.carousel-image');
    
    let currentLightboxIndex = 0;
    const lightboxImages = [];
    
    // Coletar todas as imagens do carrossel
    carouselImages.forEach((img, index) => {
        lightboxImages.push({
            src: img.src,
            alt: img.alt,
            title: img.closest('.carousel-slide').querySelector('.slide-title')?.textContent || `Imagem ${index + 1}`,
            description: img.closest('.carousel-slide').querySelector('.slide-description')?.textContent || ''
        });
    });
    
    // Função para abrir lightbox
    function openLightbox(index) {
        currentLightboxIndex = index;
        const imageData = lightboxImages[index];
        
        lightboxImage.src = imageData.src;
        lightboxImage.alt = imageData.alt;
        
        // Adicionar informações da imagem
        updateLightboxInfo(imageData);
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Previne scroll da página
        
        // Animação de entrada
        setTimeout(() => {
            lightbox.classList.add('loaded');
        }, 50);
    }
    
    // Função para fechar lightbox
    function closeLightbox() {
        lightbox.classList.remove('loaded');
        setTimeout(() => {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Restaura scroll da página
        }, 300);
    }
    
    // Função para atualizar informações do lightbox
    function updateLightboxInfo(imageData) {
        let infoDiv = lightbox.querySelector('.lightbox-info');
        if (!infoDiv) {
            infoDiv = document.createElement('div');
            infoDiv.className = 'lightbox-info';
            lightbox.querySelector('.lightbox-content').appendChild(infoDiv);
        }
        
        infoDiv.innerHTML = `
            <h3 class="lightbox-title">${imageData.title}</h3>
            <p class="lightbox-description">${imageData.description}</p>
            <div class="lightbox-counter">${currentLightboxIndex + 1} / ${lightboxImages.length}</div>
        `;
    }
    
    // Função para navegar no lightbox
    function navigateLightbox(direction) {
        if (direction === 'next') {
            currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
        } else {
            currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
        }
        
        const imageData = lightboxImages[currentLightboxIndex];
        
        // Animação de transição
        lightboxImage.style.opacity = '0';
        setTimeout(() => {
            lightboxImage.src = imageData.src;
            lightboxImage.alt = imageData.alt;
            updateLightboxInfo(imageData);
            lightboxImage.style.opacity = '1';
        }, 150);
    }
    
    // Event listeners para abrir lightbox
    carouselImages.forEach((img, index) => {
        img.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openLightbox(index);
        });
        
        // Adicionar cursor pointer
        img.style.cursor = 'pointer';
    });
    
    // Event listener para fechar lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    
    // Fechar ao clicar fora da imagem
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Navegação por teclado no lightbox
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    navigateLightbox('prev');
                    break;
                case 'ArrowRight':
                    navigateLightbox('next');
                    break;
            }
        }
    });
    
    // Adicionar botões de navegação ao lightbox
    function addLightboxNavigation() {
        const lightboxContent = lightbox.querySelector('.lightbox-content');
        
        // Botão anterior
        const prevBtn = document.createElement('button');
        prevBtn.className = 'lightbox-nav lightbox-prev';
        prevBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
        `;
        prevBtn.addEventListener('click', () => navigateLightbox('prev'));
        
        // Botão próximo
        const nextBtn = document.createElement('button');
        nextBtn.className = 'lightbox-nav lightbox-next';
        nextBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
        `;
        nextBtn.addEventListener('click', () => navigateLightbox('next'));
        
        lightboxContent.appendChild(prevBtn);
        lightboxContent.appendChild(nextBtn);
    }
    
    // Inicializar navegação do lightbox
    addLightboxNavigation();
    
    // Suporte para gestos de swipe no lightbox
    let lightboxStartX = 0;
    let lightboxEndX = 0;
    
    lightbox.addEventListener('touchstart', (e) => {
        lightboxStartX = e.touches[0].clientX;
    });
    
    lightbox.addEventListener('touchmove', (e) => {
        lightboxEndX = e.touches[0].clientX;
    });
    
    lightbox.addEventListener('touchend', () => {
        const threshold = 50;
        const diff = lightboxStartX - lightboxEndX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                navigateLightbox('next'); // Swipe esquerda = próxima
            } else {
                navigateLightbox('prev'); // Swipe direita = anterior
            }
        }
    });
    });

    // Parallax effect for hero section (improved)
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        // Apply parallax to all sections with background-attachment: fixed
        document.querySelectorAll('section[style*="background-image"]').forEach(section => {
            const speed = 0.3; // Adjust for more/less parallax
            section.style.backgroundPositionY = `${-scrolled * speed}px`;
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll indicator functionality
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const storySection = document.getElementById('story');
            if (storySection) {
                storySection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }

    // Animate numbers or counters (if needed) - Keeping for potential future use
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }

    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('.gallery-item, .timeline-item, .social-link, .scroll-indicator');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)'; // More noticeable hover
            this.style.boxShadow = '0 15px 30px rgba(212, 175, 55, 0.4)'; // Add glow on hover
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none'; // Reset shadow
        });
    });

    // Add loading animation (Initial hero content reveal)
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Trigger hero animations
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroDate = document.querySelector('.hero-date');
        const couplePhoto = document.querySelector('.couple-photo');
        
        setTimeout(() => {
            if (heroTitle) heroTitle.style.opacity = '1';
        }, 300);
        
        setTimeout(() => {
            if (heroSubtitle) heroSubtitle.style.opacity = '1';
        }, 600);
        
        setTimeout(() => {
            if (heroDate) heroDate.style.opacity = '1';
        }, 900);
        
        setTimeout(() => {
            if (couplePhoto) couplePhoto.style.opacity = '1';
        }, 1200);
    });

    // Add ceramic animation rotation (on ceramic-icon)
    const ceramicIcons = document.querySelectorAll('.ceramic-icon');
    ceramicIcons.forEach(icon => {
        let rotation = 0;
        setInterval(() => {
            rotation += 0.5; // Slower rotation
            icon.style.transform = `rotate(${rotation}deg)`;
        }, 50);
    });

    // Add pottery wheel animation (on message section scroll into view)
    const potteryWheel = document.querySelector('.pottery-wheel');
    if (potteryWheel) {
        const potteryObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    potteryWheel.classList.add('spinning');
                } else {
                    potteryWheel.classList.remove('spinning'); // Stop spinning when out of view
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% of pottery wheel is visible
        
        potteryObserver.observe(potteryWheel);
    }

    // Add touch support for mobile devices for full-page scroll
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 70; // Increased threshold for deliberate swipes
        const diff = touchStartY - touchEndY;
                
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe up - scroll to next section
                scrollToNextSection();
            } else {
                // Swipe down - scroll to previous section
                scrollToPreviousSection();
            }
        }
    }

    function scrollToNextSection() {
        const sections = document.querySelectorAll('section');
        const currentSection = getCurrentSection();
        const currentIndex = Array.from(sections).indexOf(currentSection);
        
        if (currentIndex < sections.length - 1) {
            sections[currentIndex + 1].scrollIntoView({
                behavior: 'smooth'
            });
        }
    }

    function scrollToPreviousSection() {
        const sections = document.querySelectorAll('section');
        const currentSection = getCurrentSection();
        const currentIndex = Array.from(sections).indexOf(currentSection);
        
        if (currentIndex > 0) {
            sections[currentIndex - 1].scrollIntoView({
                behavior: 'smooth'
            });
        }
    }

    function getCurrentSection() {
        const sections = document.querySelectorAll('section');
        // Get the section that is most in view
        let bestMatch = sections[0];
        let maxVisibleHeight = 0;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
            if (visibleHeight > maxVisibleHeight) {
                maxVisibleHeight = visibleHeight;
                bestMatch = section;
            }
        });
        return bestMatch;
    }

    // Add typewriter effect for romantic messages
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.innerHTML = ''; // Clear content before typing
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Apply typewriter effect to romantic text when visible
    const romanticTexts = document.querySelectorAll('.romantic-text, .romantic-message');
    const typewriterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('typed')) {
                const originalText = entry.target.textContent;
                typeWriter(entry.target, originalText, 30);
                entry.target.classList.add('typed');
            }
        });
    }, { threshold: 0.7 }); // Increased threshold for typing to start later

    romanticTexts.forEach(text => {
        typewriterObserver.observe(text);
    });

    // Add floating hearts animation
    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 4 + 3) + 's'; // Longer duration
        heart.style.opacity = 0; // Start invisible
        heart.style.fontSize = Math.random() * 15 + 15 + 'px'; // Larger hearts
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';
        heart.classList.add('floating-heart');
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, parseFloat(heart.style.animationDuration) * 1000);
    }

    // Add CSS for floating hearts (moved to styles.css)

    // Create floating hearts periodically
    setInterval(createFloatingHeart, 2000); // More frequent hearts


    // Add scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.width = '0%';
    progressBar.style.height = '4px'; // Slightly thicker
    progressBar.style.background = 'linear-gradient(90deg, #D4AF37, #CD853F)'; /* Gold to ceramic gradient */
    progressBar.style.zIndex = '9999';
    progressBar.style.transition = 'width 0.2s ease-out';
    progressBar.classList.add('progress-bar'); // Add class for styling
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight; // Use document.documentElement for consistent height
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // Add image lazy loading (update data-src attributes if needed)
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src'); // Remove data-src once loaded
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    }, { threshold: 0.01 }); // Load images as soon as they are almost visible

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // Add ceramic texture animation (subtle background for the whole page)
    function addCeramicTexture() {
        const textureOverlay = document.createElement('div');
        textureOverlay.style.position = 'fixed';
        textureOverlay.style.top = '0';
        textureOverlay.style.left = '0';
        textureOverlay.style.width = '100%';
        textureOverlay.style.height = '100%';
        textureOverlay.style.pointerEvents = 'none';
        textureOverlay.style.opacity = '0.02'; // Very subtle
        textureOverlay.style.zIndex = '0'; // Ensure it's behind content
        textureOverlay.style.backgroundImage = `
            radial-gradient(circle at 25% 25%, rgba(205, 133, 63, 0.1) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(212, 175, 55, 0.1) 1px, transparent 1px)
        `; // Ceramic-toned dots
        textureOverlay.style.backgroundSize = '80px 80px'; // Larger texture pattern
        textureOverlay.style.animation = 'textureMove 40s linear infinite'; // Slower movement
        textureOverlay.classList.add('ceramic-texture'); // Add class for potential styling
        
        document.body.appendChild(textureOverlay);
    }

    // Add CSS for texture animation (moved to styles.css)

    addCeramicTexture();

    // Add sound effects (optional - requires audio files) - Keep commented unless files are provided
    // function playSound(soundName) {
    //     const audio = new Audio(`sounds/${soundName}.mp3`);
    //     audio.volume = 0.3;
    //     audio.play().catch(e => {
    //         console.log('Audio playback prevented by browser policy');
    //     });
    // }

    // Add click sound to interactive elements - Keep commented unless sound files are provided
    // document.querySelectorAll('.gallery-item, .social-link, .timeline-item').forEach(element => {
    //     element.addEventListener('click', () => {
    //         playSound('click');
    //     });
    // });

    // Add resize handler for responsive adjustments
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Recalculate animations and positions after resize
            const galleryItems = document.querySelectorAll('.gallery-item');
            galleryItems.forEach((item, index) => {
                item.style.transitionDelay = (index * 0.1) + 's';
            });
            // Re-evaluate current section for swipe logic on resize
            getCurrentSection();
        }, 250);
    });

    // Add performance optimization
    let ticking = false;
    
    function updateAnimations() {
        // Update scroll-based animations here if any are directly controlled by JS on scroll, not just IntersectionObserver
        // For parallax, we already have a direct listener, which is efficient enough for fixed backgrounds.
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateAnimations);
            ticking = true;
        }
    });

    // Add accessibility improvements
    document.addEventListener('keydown', function(e) {
        // Add keyboard navigation
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });

    // Add focus styles for keyboard navigation (moved to styles.css)

    console.log('🎉 Site das Bodas de Cerâmica carregado com sucesso!');


// Service Worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Add custom cursor effect
document.addEventListener('mousemove', function(e) {
    let cursor = document.querySelector('.custom-cursor');
    if (!cursor) {
        cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.position = 'fixed';
        cursor.style.width = '30px'; // Larger cursor
        cursor.style.height = '30px';
        cursor.style.borderRadius = '50%';
        cursor.style.background = 'rgba(212, 175, 55, 0.4)'; /* Gold, semi-transparent */
        cursor.style.border = '1px solid rgba(212, 175, 55, 0.7)'; /* Gold border */
        cursor.style.pointerEvents = 'none';
        cursor.style.zIndex = '9999';
        cursor.style.transition = 'transform 0.1s ease-out, opacity 0.2s ease-out';
        cursor.style.willChange = 'transform'; // Performance hint
        document.body.appendChild(cursor);
    }
    
    cursor.style.left = e.clientX - cursor.offsetWidth / 2 + 'px';
    cursor.style.top = e.clientY - cursor.offsetHeight / 2 + 'px';

    // Add hover effect for interactive elements (cursor changes size/opacity)
    const target = e.target;
    if (target.closest('.gallery-item, .timeline-item, .social-link, a, button, input, textarea, select')) {
        cursor.style.transform = 'scale(1.5)'; // Enlarge on interactive elements
        cursor.style.opacity = '0.8';
    } else {
        cursor.style.transform = 'scale(1)';
        cursor.style.opacity = '1';
    }
});

// Controle de música aprimorado
document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('background-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicMessage = document.getElementById('music-message');
    let isPlaying = false;
    let messageShown = true;

    // Função para esconder a mensagem
    function hideMessage() {
        if (messageShown) {
            musicMessage.classList.add('hidden');
            setTimeout(() => {
                musicMessage.style.display = 'none';
            }, 500);
            messageShown = false;
        }
    }   

    

    // Controle do botão de música
    musicToggle.addEventListener('click', function() {
        hideMessage();
        
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            musicToggle.classList.remove('playing');
        } else {
            audio.play().then(() => {
                isPlaying = true;
                musicToggle.classList.add('playing');
            }).catch((error) => {
                console.log('Erro ao tocar música:', error);
            });
        }
    });

    // Esconder mensagem ao clicar em qualquer lugar da página
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.music-control')) {
            hideMessage();
        }
    });

    // Esconder mensagem após 10 segundos automaticamente
    setTimeout(hideMessage, 10000);

    // Controlar volume
    audio.volume = 0.4;
    
    // Fade in do volume quando começar a tocar
    audio.addEventListener('play', function() {
        let vol = 0;
        audio.volume = 0;
        const fadeIn = setInterval(() => {
            if (vol < 0.4) {
                vol += 0.02;
                audio.volume = vol;
            } else {
                clearInterval(fadeIn);
            }
        }, 50);
    });
});

// Carrossel da Galeria
document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const indicators = document.querySelectorAll('.indicator');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoSlideInterval;
    
    // Função para mostrar slide
    function showSlide(index) {
        // Remove active de todos os slides e indicadores
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Adiciona active ao slide e indicador atual
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        // Move o track
        track.style.transform = `translateX(-${index * 100}%)`;
        
        currentSlide = index;
    }
    
    // Função para próximo slide
    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        showSlide(next);
    }
    
    // Função para slide anterior
    function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prev);
    }
    
    
    
    // Event listeners para botões
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoSlide();
        startAutoSlide(); // Reinicia o autoplay
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoSlide();
        startAutoSlide(); // Reinicia o autoplay
    });
    
    // Event listeners para indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            stopAutoSlide();
            startAutoSlide(); // Reinicia o autoplay
        });
    });
    
    // Pausar autoplay quando mouse estiver sobre o carrossel
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', stopAutoSlide);
    carouselContainer.addEventListener('mouseleave', startAutoSlide);
    
    // Suporte para touch/swipe em dispositivos móveis
    let startX = 0;
    let endX = 0;
    
    carouselContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        stopAutoSlide();
    });
    
    carouselContainer.addEventListener('touchmove', (e) => {
        endX = e.touches[0].clientX;
    });
    
    carouselContainer.addEventListener('touchend', () => {
        const threshold = 50; // Mínimo de pixels para considerar um swipe
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextSlide(); // Swipe para esquerda = próximo
            } else {
                prevSlide(); // Swipe para direita = anterior
            }
        }
        startAutoSlide(); // Reinicia o autoplay
    });
    
    // Suporte para navegação por teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        }
    });
    
    // Inicializar o carrossel
    showSlide(0);
    startAutoSlide();
    
    // Intersection Observer para pausar quando não estiver visível
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startAutoSlide();
            } else {
                stopAutoSlide();
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(carouselContainer);
});