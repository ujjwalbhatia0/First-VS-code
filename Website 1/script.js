// Smooth scroll to collection section
        function scrollToCollection() {
            const collectionSection = document.getElementById('collection-section');
            collectionSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        
// Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Header show/hide on scroll
        let lastScrollTop = 0;
        const header = document.querySelector('.header');

        window.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
            if (scrollTop > 100) { // Show header after scrolling 100px
            header.classList.add('show');
            } else { // Hide header when at top
            header.classList.remove('show');
            }
    
            // Optional: Change header background opacity based on scroll
            if (scrollTop > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
            } else {
            header.style.background = 'rgba(0, 0, 0, 0.9)';
            }
    
            lastScrollTop = scrollTop;
        });

        // Header background on scroll
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(0, 0, 0, 0.95)';
            } else {
                header.style.background = 'rgba(0, 0, 0, 0.9)';
            }
        });

        // Image card hover effects
        document.querySelectorAll('.image-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Pagination dots functionality
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.addEventListener('click', function() {
                document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Size selection
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Product card animations
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Add to cart functionality
        document.querySelector('.add-to-cart')?.addEventListener('click', function() {
            this.innerHTML = 'Added! ✓';
            this.style.background = '#22c55e';
            setTimeout(() => {
                this.innerHTML = 'Add to Cart';
                this.style.background = '#fff';
            }, 2000);
        });

        // Newsletter form
        document.querySelector('.newsletter-form')?.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('.newsletter-btn');
            const input = this.querySelector('.newsletter-input');
            
            btn.innerHTML = 'Subscribed! ✓';
            btn.style.background = '#22c55e';
            input.value = '';
            
            setTimeout(() => {
                btn.innerHTML = '✨ Subscribe';
                btn.style.background = '#000';
            }, 3000);
        });

        // Back to top functionality
        document.querySelector('.back-to-top')?.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Social media hover effects
        document.querySelectorAll('.social-link').forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.1)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });