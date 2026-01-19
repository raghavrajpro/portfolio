  // Fix for mobile viewport height
        function setVH() {
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }

        // Initialize on load
        window.addEventListener('load', function() {
            setVH();
            
            // Preloader
            const preloader = document.querySelector('.preloader');
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });

        // Update on resize
        window.addEventListener('resize', setVH);

        // Initialize AOS animation
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-in-out',
            offset: 50
        });

        // Mobile Menu Toggle (with ARIA)
        const menuToggle = document.getElementById('menu-toggle');
        const navLinks = document.getElementById('nav-links');
        const navClose = document.getElementById('nav-close');

        // initialize aria-expanded for accessibility
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');

        function toggleMenu() {
            const isActive = navLinks.classList.toggle('active');
            document.body.style.overflow = isActive ? 'hidden' : 'auto';
            if (menuToggle) menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        }

        menuToggle.addEventListener('click', toggleMenu);
        navClose.addEventListener('click', toggleMenu);

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') &&
                !e.target.closest('.nav-links') &&
                !e.target.closest('.menu-toggle')) {
                navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Header scroll effect
        const header = document.querySelector('header');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Typing Effect (looping roles: type + delete)
        const typingElement = document.querySelector('.typing');
        const roles = ['Web Developer', 'Artist', 'Film maker', 'Creative Technologist'];
        let roleIndex = 0;
        let charIndex = 0;
        let typing = true; // true = typing, false = deleting
        const typeSpeed = 100;
        const deleteSpeed = 50;
        const pauseBetween = 1400;

        function typeLoop() {
            const current = roles[roleIndex];
            if (typing) {
                if (charIndex < current.length) {
                    typingElement.textContent += current.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeLoop, typeSpeed);
                } else {
                    typing = false;
                    setTimeout(typeLoop, pauseBetween);
                }
            } else {
                if (charIndex > 0) {
                    typingElement.textContent = current.substring(0, charIndex - 1);
                    charIndex--;
                    setTimeout(typeLoop, deleteSpeed);
                } else {
                    typing = true;
                    roleIndex = (roleIndex + 1) % roles.length;
                    setTimeout(typeLoop, 300);
                }
            }
        }

        // Start looping typing after a short delay
        setTimeout(typeLoop, 500);

        // Back to Top Button
        const topBtn = document.getElementById("topBtn");

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                topBtn.classList.add('visible');
            } else {
                topBtn.classList.remove('visible');
            }
        });

        topBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Portfolio Filter
        const filterBtns = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                portfolioItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });

        // **FIXED** Contact Form Submission with Fetch
        const contactForm = document.getElementById('contactForm');
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const form = e.target;
            const data = new FormData(form);
            const action = form.action;
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;

            // Check if form action is set correctly
            if (action.includes('YOUR_FORM_ID_HERE')) {
                alert('Please update the form action URL with your actual Formspree form ID');
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
                return;
            }

            fetch(action, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    alert('Thank you! Your message has been sent successfully. I\'ll get back to you soon.');
                    form.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            alert(data["errors"].map(error => error["message"]).join(", "));
                        } else {
                            alert('Oops! There was a problem submitting your form. Please try again.');
                        }
                    })
                }
            }).catch(error => {
                alert('Oops! There was a network error. Please try again.');
            }).finally(() => {
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            });
        });

        // Newsletter Form
        const newsletterForm = document.querySelector('.newsletter-form');

        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            alert(`Thank you for subscribing with ${email}! You'll receive updates on my latest work.`);
            this.reset();
        });

        // Counter Animation
        const statNumbers = document.querySelectorAll('.stat-number');

        function animateCounters() {
            statNumbers.forEach(stat => {
                if (stat.hasAttribute('data-count')) {
                    const target = parseInt(stat.getAttribute('data-count'));
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;

                    const counter = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            clearInterval(counter);
                            current = target;
                        }
                        stat.textContent = Math.floor(current) + (stat.textContent.includes('%') ? '%' : '+');
                    }, 16);

                    stat.removeAttribute('data-count');
                }
            });
        }

        // Intersection Observer for counters
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelector('.about-stats').querySelectorAll('.stat-item').forEach(item => {
            observer.observe(item);
        });

        // Project Modal
        const projectLinks = document.querySelectorAll('.portfolio-link');
        const projectModal = document.getElementById('projectModal');
        const modalClose = document.getElementById('modalClose');
        const modalContent = document.getElementById('modalContent');

        // Accessibility: focus trap helper for modals
        let _previousActiveElement = null;
        function openProjectModal() {
            // Store the element that was focused before opening the modal
            _previousActiveElement = document.activeElement;
            
            // Show the modal
            projectModal.classList.add('active');
            projectModal.setAttribute('aria-hidden', 'false');
            
            // Prevent page scrolling while modal is open
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = getScrollbarWidth() + 'px';
            
            // Get all focusable elements (improved selector)
            const focusable = Array.from(
                projectModal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                )
            ).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
            
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            
            // Focus the modal to announce it to screen readers
            projectModal.focus();
            
            // Then focus the close button after a brief delay
            setTimeout(() => modalClose.focus(), 100);
            
            // Handle keyboard interactions
            function handleKeyDown(e) {
                // Close on escape
                if (e.key === 'Escape') {
                    e.preventDefault();
                    closeProjectModal();
                    return;
                }
                
                // Tab trap
                if (e.key === 'Tab') {
                    if (focusable.length === 0) {
                        e.preventDefault();
                        return;
                    }
                    
                    // Shift + Tab
                    if (e.shiftKey) {
                        if (document.activeElement === first) {
                            e.preventDefault();
                            last.focus();
                        }
                    } 
                    // Tab
                    else {
                        if (document.activeElement === last) {
                            e.preventDefault();
                            first.focus();
                        }
                    }
                }
            }
            
            projectModal._handleKeyDown = handleKeyDown;
            document.addEventListener('keydown', handleKeyDown);
            
            // Announce modal to screen readers
            announceToScreenReader('Project details modal opened');
        }

        // Helper function to get scrollbar width
        function getScrollbarWidth() {
            return window.innerWidth - document.documentElement.clientWidth;
        }

        // Helper function for screen reader announcements
        function announceToScreenReader(message) {
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'sr-only';
            announcement.textContent = message;
            document.body.appendChild(announcement);
            setTimeout(() => announcement.remove(), 1000);
        }

        function closeProjectModal() {
            // Hide the modal
            projectModal.classList.remove('active');
            projectModal.setAttribute('aria-hidden', 'true');
            
            // Restore page scrolling
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = '0';
            
            // Remove keyboard event listener
            if (projectModal._handleKeyDown) {
                document.removeEventListener('keydown', projectModal._handleKeyDown);
                delete projectModal._handleKeyDown;
            }
            
            // Restore focus to the previous element
            if (_previousActiveElement && typeof _previousActiveElement.focus === 'function') {
                setTimeout(() => _previousActiveElement.focus(), 0);
            }
            
            // Announce modal closure to screen readers
            announceToScreenReader('Project details modal closed');
        }

        projectLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const projectId = this.getAttribute('data-project');

                // In a real implementation, you would fetch project details based on the ID
                // For this example, we'll use placeholder content
                let content = '';

                switch (projectId) {
                    case '1':
                        content = `
                            <h2>E-commerce Platform</h2>
                            <p class="project-category">Web Development</p>
                            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                                alt="E-commerce Website" class="project-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">
                            <div class="project-details">
                                <p>A full-featured online store built with React, Node.js, and MongoDB. The platform includes product listings, shopping cart functionality, user authentication, and payment processing.</p>
                                <h3>Technologies Used</h3>
                                <ul>
                                    <li>React.js</li>
                                    <li>Node.js</li>
                                    <li>MongoDB</li>
                                    <li>Stripe API</li>
                                    <li>Tailwind CSS</li>
                                </ul>
                                <a href="#" class="btn btn-primary" style="margin-top: 1.5rem; display:inline-block;">
                                    <i class="fas fa-external-link-alt"></i> Visit Live Site
                                </a>
                            </div>
                        `;
                        break;
                    case '2':
                        content = `
                            <h2>Character Design Series</h2>
                            <p class="project-category">Digital Art</p>
                            <img src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1458&q=80" 
                                alt="Character Design" class="project-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">
                            <div class="project-details">
                                <p>A collection of original fantasy character illustrations created for a role-playing game. Each character has a unique backstory and personality that's reflected in their design.</p>
                                <h3>Tools Used</h3>
                                <ul>
                                    <li>Adobe Photoshop</li>
                                    <li>Procreate</li>
                                    <li>Wacom Cintiq</li>
                                </ul>
                                <a href="#" class="btn btn-primary" style="margin-top: 1.5rem; display:inline-block;">
                                    <i class="fas fa-images"></i> View Full Gallery
                                </a>
                            </div>
                        `;
                        break;
                    // Add cases for other projects...
                    default:
                        content = `<h2>Project Details</h2><p>Detailed information about this project will be displayed here.</p>`;
                }

                modalContent.innerHTML = content;
                openProjectModal();
            });
        });

        modalClose.addEventListener('click', () => closeProjectModal());

        // Close modal with Escape key for accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && projectModal.classList.contains('active')) {
                closeProjectModal();
            }
        });

        // Close modal when clicking outside content
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                closeProjectModal();
            }
        });

        // Animate progress bars when they come into view
        const progressBars = document.querySelectorAll('.progress-fill');
        let progressAnimationFrame;

        // Store original widths before animation
        progressBars.forEach(bar => {
            bar.dataset.width = bar.style.width;
            bar.style.width = '0';
        });

        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const finalWidth = bar.dataset.width;
                    
                    // Cancel any existing animation
                    if (bar._animationFrame) {
                        cancelAnimationFrame(bar._animationFrame);
                    }

                    // Smoothly animate the width
                    const startTime = performance.now();
                    const duration = 1000; // 1 second animation

                    function animate(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        // Easing function for smooth animation
                        const easeOutQuad = progress * (2 - progress);
                        
                        // Calculate current width
                        const currentWidth = parseFloat(finalWidth) * easeOutQuad + '%';
                        bar.style.width = currentWidth;
                        
                        // Continue animation if not complete
                        if (progress < 1) {
                            bar._animationFrame = requestAnimationFrame(animate);
                        } else {
                            delete bar._animationFrame;
                            progressObserver.unobserve(bar);
                        }
                    }
                    
                    bar._animationFrame = requestAnimationFrame(animate);
                }
            });
        }, { 
            threshold: 0.2,
            rootMargin: '50px'
        });

        // Clean up function to prevent memory leaks
        function cleanupProgressObserver() {
            if (progressObserver) {
                progressBars.forEach(bar => {
                    if (bar._animationFrame) {
                        cancelAnimationFrame(bar._animationFrame);
                    }
                    progressObserver.unobserve(bar);
                });
                progressObserver.disconnect();
            }
        }

        // Setup observation
        progressBars.forEach(bar => {
            progressObserver.observe(bar);
        });

        // Clean up on page unload
        window.addEventListener('unload', cleanupProgressObserver);

        // Image optimization and lazy loading
        document.addEventListener('DOMContentLoaded', () => {
            const images = document.querySelectorAll('img');
            
            function optimizeImage(img) {
                // Skip images that already have srcset
                if (img.hasAttribute('srcset')) return;
                
                // Skip small images or icons
                if (img.width < 100 || img.height < 100) return;
                
                const src = img.getAttribute('src');
                
                // Handle Unsplash images
                if (src.includes('unsplash.com')) {
                    const baseUrl = src.split('?')[0];
                    const srcset = [
                        `${baseUrl}?auto=format&fit=crop&w=400&q=80 400w`,
                        `${baseUrl}?auto=format&fit=crop&w=800&q=80 800w`,
                        `${baseUrl}?auto=format&fit=crop&w=1200&q=80 1200w`
                    ].join(', ');
                    
                    img.setAttribute('srcset', srcset);
                    img.setAttribute('sizes', '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw');
                    img.setAttribute('src', `${baseUrl}?auto=format&fit=crop&w=400&q=80`);
                }
                
                // Add loading="lazy" to images below the fold
                if (!img.hasAttribute('loading') && 
                    !img.classList.contains('profile-img')) {
                    img.setAttribute('loading', 'lazy');
                }
                
                // Add decoding="async" for better performance
                if (!img.hasAttribute('decoding')) {
                    img.setAttribute('decoding', 'async');
                }
                
                // Add intrinsic dimensions when missing
                if (!img.hasAttribute('width') && !img.hasAttribute('height')) {
                    img.setAttribute('width', '400');
                    img.setAttribute('height', '300');
                }
                
                // Add fetchpriority="high" to important images
                if (img.classList.contains('profile-img') || 
                    img.classList.contains('hero-img')) {
                    img.setAttribute('fetchpriority', 'high');
                }
            }
            
            // Optimize all images
            images.forEach(optimizeImage);
            
            // Create IntersectionObserver for progressive loading
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            delete img.dataset.src;
                        }
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            // Observe images for progressive loading
            images.forEach(img => {
                if (!img.classList.contains('profile-img') && 
                    !img.classList.contains('hero-img')) {
                    imageObserver.observe(img);
                }
            });
        });

        // 3D tilt effect for portfolio items
        const portfolioItemsTilt = document.querySelectorAll('.portfolio-item');
        portfolioItemsTilt.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                const dx = (x - cx) / cx;
                const dy = (y - cy) / cy;
                const tiltX = dy * 6; // tilt intensity
                const tiltY = dx * -6;
                item.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(8px)`;
                item.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = '';
                item.style.boxShadow = '';
            });
        });

       

        // Particles.js
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 60,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#f84747"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false
                },
                "size": {
                    "value": 3,
                    "random": true
                },
                "line_linked": {
                    "enable": true,
                    "distance": 120,
                    "color": "#f84747",
                    "opacity": 0.2,
                    "width": 2
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 120,
                        "line_linked": {
                            "opacity": 0.5
                        }
                    },
                    "push": {
                        "particles_nb": 3
                    }
                }
            },
            "retina_detect": true
        });