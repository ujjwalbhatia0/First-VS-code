        // Loading Screen
        window.addEventListener('load', () => {
            const loading = document.getElementById('loading');
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.style.display = 'none';
            }, 500);
        });

        // Scroll Indicator
        window.addEventListener('scroll', () => {
            const scrollIndicator = document.getElementById('scrollIndicator');
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            scrollIndicator.style.width = scrolled + '%';
        });

        // Navbar Scroll Effect
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Floating Particles
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            for (let i = 0; i < 15; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.width = particle.style.height = Math.random() * 10 + 5 + 'px';
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = Math.random() * 4 + 4 + 's';
                particlesContainer.appendChild(particle);
            }
        }
        createParticles();

        // Smooth Scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                
                if (targetId === '#home') {
                    // For home link, scroll to very top
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } else {
                    const target = document.querySelector(targetId);
                    if (target) {
                        // Get navbar height for offset
                        const navbar = document.querySelector('.navbar');
                        const navbarHeight = navbar.offsetHeight;
                        
                        // Calculate position with navbar offset
                        const targetPosition = target.offsetTop - navbarHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });

        // Fade In Animation on Scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Product Card Hover Effects
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Feature Card Animation
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.querySelector('.feature-icon').style.animation = 'none';
                this.querySelector('.feature-icon').offsetHeight; // Trigger reflow
                this.querySelector('.feature-icon').style.animation = 'bounce 0.6s ease';
            });
        });

        // Add bounce animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bounce {
                0%, 20%, 60%, 100% { transform: translateY(0) scale(1); }
                40% { transform: translateY(-10px) scale(1.1); }
                80% { transform: translateY(-5px) scale(1.05); }
            }
        `;
        document.head.appendChild(style);

        // Parallax Effect for Hero Section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });

        // Dynamic gradient animation for CTA button
        const ctaButton = document.querySelector('.cta-button');
        ctaButton.addEventListener('mousemove', (e) => {
            const rect = ctaButton.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            ctaButton.style.background = `radial-gradient(circle at ${x}% ${y}%, #F4A460, #8B4513)`;
        });

        ctaButton.addEventListener('mouseleave', () => {
            ctaButton.style.background = 'linear-gradient(135deg, #8B4513 0%, #DEB887 50%, #F4A460 100%)';
        });
        // Force scroll to top on page load
        window.addEventListener('beforeunload', function() {
            window.scrollTo(0, 0);
        });

        // Also ensure we start at top when page loads
        if (history.scrollRestoration) {
            history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);

        // Logo click to reload page
        document.querySelector('.logo').addEventListener('click', function(e) {
            e.preventDefault();
            // Scroll to top first, then reload
            window.scrollTo(0, 0);
            setTimeout(() => {
                window.location.reload();
            }, 100);
        });
        
        // Add some extra interactivity
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                // Remove active class from all links
                document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                this.classList.add('active');
            });
        });