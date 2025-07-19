// Aviation Career Website JavaScript
class AviationWebsite {
    constructor() {
        this.currentPage = 'home';
        this.currentStep = 1;
        this.maxSteps = 4;
        this.selectedPackage = null;
        this.packagePrices = {
            basic: 99,
            premium: 299,
            linkedin: 99
        };
        this.packageNames = {
            basic: 'Basic Resume Review',
            premium: 'Premium Resume Rewrite',
            linkedin: 'LinkedIn Profile Tune-Up'
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTestimonialCarousel();
        this.setupMobileMenu();
        this.setupBookingForm();
        this.setupContactForms();
        this.handleInitialNavigation();
    }

    setupEventListeners() {
        // Navigation links
        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-page')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.navigateToPage(page);
            }

            // Package selection buttons
            if (e.target.hasAttribute('data-package')) {
                e.preventDefault();
                const packageType = e.target.getAttribute('data-package');
                this.selectPackageAndNavigate(packageType);
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            const page = e.state?.page || 'home';
            this.navigateToPage(page, false);
        });
    }

    navigateToPage(page, updateHistory = true) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        
        // Show target page
        const targetPage = document.getElementById(`${page}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = page;
            
            // Update browser history
            if (updateHistory) {
                const url = page === 'home' ? '/' : `/${page}`;
                history.pushState({ page }, '', url);
            }
            
            // Update navigation active states
            this.updateNavigation();
            
            // Scroll to top
            window.scrollTo(0, 0);
        }
    }

    updateNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            const page = link.getAttribute('data-page');
            if (page === this.currentPage) {
                link.style.color = 'white';
                link.style.fontWeight = 'bold';
            } else {
                link.style.color = 'rgba(255, 255, 255, 0.9)';
                link.style.fontWeight = '500';
            }
        });
    }

    handleInitialNavigation() {
        const path = window.location.pathname;
        let page = 'home';
        
        if (path === '/services') page = 'services';
        else if (path === '/booking') page = 'booking';
        else if (path === '/testimonials') page = 'testimonials';
        else if (path === '/resources') page = 'resources';
        else if (path === '/contact') page = 'contact';
        
        this.navigateToPage(page, false);
    }

    setupMobileMenu() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.querySelector('.navbar__menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
            
            // Close menu when clicking on links
            navMenu.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link') || e.target.classList.contains('btn')) {
                    navMenu.classList.remove('active');
                }
            });
        }
    }

    setupTestimonialCarousel() {
        const cards = document.querySelectorAll('.testimonial-card');
        const buttons = document.querySelectorAll('.carousel-btn');
        let currentSlide = 0;

        if (cards.length === 0) return;

        const showSlide = (index) => {
            // Hide all cards
            cards.forEach(card => card.classList.remove('active'));
            buttons.forEach(btn => btn.classList.remove('active'));
            
            // Show current card
            if (cards[index]) {
                cards[index].classList.add('active');
            }
            if (buttons[index]) {
                buttons[index].classList.add('active');
            }
        };

        // Setup button clicks
        buttons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });

        // Auto-rotate carousel
        setInterval(() => {
            currentSlide = (currentSlide + 1) % cards.length;
            showSlide(currentSlide);
        }, 5000);

        // Initialize first slide
        showSlide(0);
    }

    selectPackageAndNavigate(packageType) {
        this.selectedPackage = packageType;
        this.navigateToPage('booking');
        
        // Pre-select the package in the booking form
        setTimeout(() => {
            const packageInput = document.querySelector(`input[name="package"][value="${packageType}"]`);
            if (packageInput) {
                packageInput.checked = true;
                this.updatePackageSelection();
            }
        }, 100);
    }

    setupBookingForm() {
        const form = document.getElementById('booking-form');
        if (!form) return;

        // Package selection handling
        const packageInputs = document.querySelectorAll('input[name="package"]');
        packageInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updatePackageSelection();
            });
        });

        // Form validation
        this.setupFormValidation();
    }

    updatePackageSelection() {
        const selectedInput = document.querySelector('input[name="package"]:checked');
        if (selectedInput) {
            this.selectedPackage = selectedInput.value;
            this.updatePaymentSummary();
        }
    }

    updatePaymentSummary() {
        if (!this.selectedPackage) return;

        const packageName = this.packageNames[this.selectedPackage];
        const packagePrice = this.packagePrices[this.selectedPackage];

        const packageNameEl = document.getElementById('selected-package');
        const packagePriceEl = document.getElementById('package-price');
        const totalPriceEl = document.getElementById('total-price');

        if (packageNameEl) packageNameEl.textContent = packageName;
        if (packagePriceEl) packagePriceEl.textContent = `$${packagePrice}`;
        if (totalPriceEl) totalPriceEl.textContent = `$${packagePrice}`;
    }

    setupFormValidation() {
        const form = document.getElementById('booking-form');
        if (!form) return;

        // Email validation
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateEmail(input);
            });
        });

        // Phone validation
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.formatPhoneNumber(input);
            });
        });

        // Credit card formatting
        const cardInput = document.querySelector('input[placeholder*="1234"]');
        if (cardInput) {
            cardInput.addEventListener('input', () => {
                this.formatCreditCard(cardInput);
            });
        }

        // Expiry date formatting
        const expiryInput = document.querySelector('input[placeholder="MM/YY"]');
        if (expiryInput) {
            expiryInput.addEventListener('input', () => {
                this.formatExpiryDate(expiryInput);
            });
        }
    }

    validateEmail(input) {
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            this.showFieldError(input, 'Please enter a valid email address');
            return false;
        } else {
            this.clearFieldError(input);
            return true;
        }
    }

    formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length >= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        } else if (value.length >= 3) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        }
        input.value = value;
    }

    formatCreditCard(input) {
        let value = input.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        input.value = value;
    }

    formatExpiryDate(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
        }
        input.value = value;
    }

    showFieldError(input, message) {
        input.classList.add('error');
        
        // Remove existing error message
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.textContent = message;
        input.parentNode.appendChild(errorEl);
    }

    clearFieldError(input) {
        input.classList.remove('error');
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    setupContactForms() {
        // Contact form submission
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactFormSubmission(contactForm);
            });
        }

        // Feedback form submission
        const feedbackForm = document.querySelector('.feedback-form');
        if (feedbackForm) {
            feedbackForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFeedbackFormSubmission(feedbackForm);
            });
        }
    }

    handleContactFormSubmission(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            // Reset loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            
            // Show success message
            this.showSuccessMessage(form, 'Thank you for your message! We\'ll get back to you within 24 hours.');
            
            // Reset form
            form.reset();
        }, 2000);
    }

    handleFeedbackFormSubmission(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            // Reset loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            
            // Show success message
            this.showSuccessMessage(form, 'Thank you for sharing your success story!');
            
            // Reset form
            form.reset();
        }, 2000);
    }

    showSuccessMessage(form, message) {
        // Remove existing success messages
        const existingSuccess = form.querySelector('.success-message');
        if (existingSuccess) {
            existingSuccess.remove();
        }
        
        // Create success message
        const successEl = document.createElement('div');
        successEl.className = 'success-message';
        successEl.textContent = message;
        successEl.style.textAlign = 'center';
        successEl.style.padding = '16px';
        successEl.style.marginTop = '16px';
        successEl.style.backgroundColor = `rgba(${getComputedStyle(document.documentElement).getPropertyValue('--color-success-rgb')}, 0.1)`;
        successEl.style.border = `1px solid var(--color-success)`;
        successEl.style.borderRadius = 'var(--radius-base)';
        
        form.appendChild(successEl);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successEl.remove();
        }, 5000);
    }

    validateCurrentStep() {
        const currentStepEl = document.querySelector('.form-step.active');
        if (!currentStepEl) return false;

        const requiredInputs = currentStepEl.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                this.showFieldError(input, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(input);
                
                // Additional validation for email
                if (input.type === 'email') {
                    isValid = this.validateEmail(input) && isValid;
                }
            }
        });

        // Validate package selection on step 1
        if (this.currentStep === 1) {
            const packageSelected = document.querySelector('input[name="package"]:checked');
            if (!packageSelected) {
                const packageSection = document.querySelector('.package-selection');
                if (packageSection) {
                    // Add error styling to package selection
                    packageSection.style.border = '2px solid var(--color-error)';
                    packageSection.style.borderRadius = 'var(--radius-base)';
                    packageSection.style.padding = '16px';
                    
                    setTimeout(() => {
                        packageSection.style.border = '';
                        packageSection.style.padding = '';
                    }, 3000);
                }
                isValid = false;
            }
        }

        return isValid;
    }

    updateProgressIndicator() {
        const progressSteps = document.querySelectorAll('.progress-step');
        progressSteps.forEach((step, index) => {
            if (index + 1 <= this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    showFormStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });

        // Show current step
        const currentStepEl = document.getElementById(`step-${stepNumber}`);
        if (currentStepEl) {
            currentStepEl.classList.add('active');
        }

        this.currentStep = stepNumber;
        this.updateProgressIndicator();
    }
}

// Global functions for button clicks
function nextStep() {
    if (window.aviationSite.validateCurrentStep()) {
        const nextStep = Math.min(window.aviationSite.currentStep + 1, window.aviationSite.maxSteps);
        
        if (nextStep === 3) {
            // Update payment summary before showing payment step
            window.aviationSite.updatePaymentSummary();
        }
        
        if (nextStep === 4) {
            // Submit the form to send email with resume
            const form = document.getElementById('booking-form');
            const submitBtn = document.querySelector('.form-step.active .btn--primary');
            if (submitBtn && form) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Processing Payment...';
                
                // Submit the form after a brief delay to show processing
                setTimeout(() => {
                    form.submit();
                }, 1000);
                return;
            }
        }
        
        window.aviationSite.showFormStep(nextStep);
    }
}

function prevStep() {
    const prevStep = Math.max(window.aviationSite.currentStep - 1, 1);
    window.aviationSite.showFormStep(prevStep);
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aviationSite = new AviationWebsite();
    
    // Add some interactive enhancements
    addScrollEffects();
    addHoverEffects();
    addParallaxEffect();
});

function addScrollEffects() {
    // Add scroll-based animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.service-card, .testimonial-item, .article-card, .stat-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function addHoverEffects() {
    // Add dynamic hover effects to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = e.offsetX + 'px';
            ripple.style.top = e.offsetY + 'px';
            ripple.style.width = ripple.style.height = '20px';
            ripple.style.marginLeft = ripple.style.marginTop = '-10px';
            
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

function addParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Apply parallax transform to the hero pseudo-element background
        hero.style.setProperty('--parallax-y', `${rate}px`);
    });
}