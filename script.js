document.addEventListener('DOMContentLoaded', () => {
    
    // 0. Page Loader
    const loader = document.getElementById('page-loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 1000);
        }, 2200); // Wait for progress bar animation
    }

    // 1. Set current year in footer
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 1.5 Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
            });
        });
    }

    // 2. Custom Cursor, Parallax Floating Words & Hero Parallax
    const cursorGlow = document.querySelector('.cursor-glow');
    const cursorDot = document.querySelector('.cursor-dot');
    const floatWords = document.querySelectorAll('.float-word');
    const globalBg = document.getElementById('global-bg');
    
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            // Update Cursor Position
            if (cursorGlow && cursorDot) {
                cursorGlow.style.left = e.clientX + 'px';
                cursorGlow.style.top = e.clientY + 'px';
                
                // small delay for dot for smooth trail effect
                setTimeout(() => {
                    cursorDot.style.left = e.clientX + 'px';
                    cursorDot.style.top = e.clientY + 'px';
                }, 50);
            }
            
            // Floating Words Parallax Effect
            const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
            const yPos = (e.clientY / window.innerHeight - 0.5) * 20;
            
            floatWords.forEach((word, index) => {
                const speed = (index + 1) * 2;
                word.style.transform = `translate(${xPos * speed}px, ${yPos * speed}px)`;
            });
        });

        // Hover effects for links and buttons
        const interactables = document.querySelectorAll('a, button, .service-card, .blog-card, .cert-card, .contact-item, .highlight-item, .stat-box, .chart-wrapper, .chart-wrapper-full');
        interactables.forEach(item => {
            item.addEventListener('mouseenter', () => {
                if (cursorGlow) {
                    cursorGlow.style.width = '70px';
                    cursorGlow.style.height = '70px';
                    cursorGlow.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
                    cursorGlow.style.borderColor = 'rgba(255, 215, 0, 0.8)';
                }
            });
            item.addEventListener('mouseleave', () => {
                if (cursorGlow) {
                    cursorGlow.style.width = '40px';
                    cursorGlow.style.height = '40px';
                    cursorGlow.style.backgroundColor = 'transparent';
                    cursorGlow.style.borderColor = 'rgba(255, 215, 0, 0.5)';
                }
            });
        });
    }

    // 3. Scroll Progress Line & Sticky Navbar & Parallax Bg
    const scrollLine = document.getElementById('scrollLine');
    const navbar = document.getElementById('navbar');
    const navAnchors = document.querySelectorAll('.nav-links a');
    
    // Active nav link helper
    const sections = document.querySelectorAll('section[id], header[id]');
    const updateActiveLink = () => {
        let currentId = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 120;
            if (window.scrollY >= top) {
                currentId = sec.id;
            }
        });
        navAnchors.forEach(a => {
            a.classList.toggle('active-link', a.getAttribute('href') === `#${currentId}`);
        });
    };
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // Progress Line
        if (scrollLine) {
            scrollLine.style.width = scrollPercent + '%';
        }
        
        // Sticky Navbar
        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('solid-nav');
            } else {
                navbar.classList.remove('solid-nav');
            }
        }
        
        // Global Background Parallax (moves slower than scroll)
        if (globalBg) {
            globalBg.style.transform = `translateY(${scrollTop * 0.15}px)`;
        }

        // Active nav link
        updateActiveLink();
    });
    updateActiveLink(); // run on load

    // 3.5 Profile Card Parallax Tilt on Mouse Move
    const profileCard = document.querySelector('.glass-profile-card');
    if (profileCard) {
        profileCard.addEventListener('mousemove', (e) => {
            const rect = profileCard.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            profileCard.style.transform = `perspective(1000px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-6px) scale(1.02)`;
        });
        profileCard.addEventListener('mouseleave', () => {
            profileCard.style.transform = '';
        });
    }


    // 4. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 5. Stats Counter Animation
    const statsSection = document.querySelector('.stats-container');
    const counters = document.querySelectorAll('.stat-number');
    let started = false;

    if (statsSection) {
        const countObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !started) {
                started = true;
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2500; // ms
                    const increment = target / (duration / 16); // 60fps
                    
                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCounter();
                });
            }
        }, { threshold: 0.3 });
        
        countObserver.observe(statsSection);
    }
    
    // 6. Generate Floating Particles
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = Math.random() * 4 + 1 + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = '#FFD700';
            particle.style.borderRadius = '50%';
            particle.style.boxShadow = '0 0 10px #FFD700';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            
            // Random animation
            const duration = Math.random() * 20 + 10; // 10s to 30s
            particle.animate([
                { transform: `translate(0, 0) scale(1)`, opacity: 0 },
                { opacity: Math.random() * 0.8 + 0.2, offset: 0.1 },
                { transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * -300 - 100}px) scale(0)`, opacity: 0 }
            ], {
                duration: duration * 1000,
                iterations: Infinity,
                delay: Math.random() * 5000
            });
            
            particlesContainer.appendChild(particle);
        }
    }
    
    // 7. Initialize TradingView Widgets
    if (typeof TradingView !== 'undefined') {
        
        // Common TV Config
        const getTVConfig = (symbol, container_id) => ({
            "autosize": true,
            "symbol": symbol,
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "enable_publishing": false,
            "backgroundColor": "rgba(0, 0, 0, 1)",
            "gridColor": "rgba(255, 255, 255, 0.05)",
            "hide_top_toolbar": true,
            "hide_legend": true,
            "save_image": false,
            "container_id": container_id
        });

        // SPLIT CHARTS
        if (document.getElementById('tv_btc_split')) {
            new TradingView.widget(getTVConfig("BINANCE:BTCUSDT", "tv_btc_split"));
        }
        if (document.getElementById('tv_eur_split')) {
            new TradingView.widget(getTVConfig("OANDA:EURUSD", "tv_eur_split"));
        }
    }

    // 8. Image Modal Logic
    const certImages = document.querySelectorAll('.cert-img-wrapper img');
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    if (imageModal && modalImage) {
        certImages.forEach(img => {
            img.addEventListener('click', () => {
                modalImage.src = img.src;
                imageModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            });
        });

        const closeModal = () => {
            imageModal.classList.remove('active');
            document.body.style.overflow = '';
            // Wait for transition before clearing src
            setTimeout(() => {
                modalImage.src = '';
            }, 400);
        };

        modalCloseBtn.addEventListener('click', closeModal);
        
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                closeModal();
            }
        });
    }
});
