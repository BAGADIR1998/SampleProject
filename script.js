// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            
            // Toggle menu visibility
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Update ARIA attribute
            navToggle.setAttribute('aria-expanded', !isExpanded);
        });
        
        // Close menu when clicking on a nav link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navToggle.contains(event.target) || navMenu.contains(event.target);
            
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Keyboard navigation for menu
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.focus();
        }
    });
});

// Smooth scrolling to sections
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const sectionTop = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
        
        // Update focus for accessibility
        section.focus();
        section.setAttribute('tabindex', '-1');
    }
}

// Update active navigation item based on scroll position
function updateActiveNavItem() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    const headerHeight = document.querySelector('header').offsetHeight;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.removeAttribute('aria-current');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.setAttribute('aria-current', 'page');
        }
    });
}

// Throttled scroll event listener
let ticking = false;
function requestTick() {
    if (!ticking) {
        requestAnimationFrame(function() {
            updateActiveNavItem();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);

// High contrast toggle for accessibility
function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
    
    // Save preference to localStorage
    const isHighContrast = document.body.classList.contains('high-contrast');
    localStorage.setItem('highContrast', isHighContrast);
    
    // Update button text for screen readers
    const button = document.querySelector('.accessibility-toggle');
    if (button) {
        button.setAttribute('aria-pressed', isHighContrast);
        
        // Announce the change to screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = isHighContrast ? 'High contrast mode enabled' : 'High contrast mode disabled';
        document.body.appendChild(announcement);
        
        // Remove announcement after it's been read
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

// Load saved high contrast preference
document.addEventListener('DOMContentLoaded', function() {
    const savedPreference = localStorage.getItem('highContrast');
    if (savedPreference === 'true') {
        document.body.classList.add('high-contrast');
        const button = document.querySelector('.accessibility-toggle');
        if (button) {
            button.setAttribute('aria-pressed', 'true');
        }
    }
});

// Keyboard navigation enhancements
document.addEventListener('keydown', function(event) {
    // Enable keyboard navigation for custom elements
    const focusableElements = document.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    
    const focusedElement = document.activeElement;
    const focusedIndex = Array.prototype.indexOf.call(focusableElements, focusedElement);
    
    // Skip to main content with keyboard shortcut
    if (event.altKey && event.key === 'm') {
        event.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.focus();
            mainContent.setAttribute('tabindex', '-1');
        }
    }
    
    // Navigate sections with arrow keys when focused on navigation
    if (focusedElement && focusedElement.closest('.nav-menu')) {
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
            event.preventDefault();
            const nextIndex = (focusedIndex + 1) % focusableElements.length;
            const nextElement = focusableElements[nextIndex];
            if (nextElement && nextElement.closest('.nav-menu')) {
                nextElement.focus();
            }
        } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
            event.preventDefault();
            const prevIndex = (focusedIndex - 1 + focusableElements.length) % focusableElements.length;
            const prevElement = focusableElements[prevIndex];
            if (prevElement && prevElement.closest('.nav-menu')) {
                prevElement.focus();
            }
        }
    }
});

// Add click handlers for navigation links with smooth scrolling
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
});

// Intersection Observer for better performance on scroll animations
if ('IntersectionObserver' in window) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '-80px 0px -80px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
                
                navLinks.forEach(link => {
                    link.removeAttribute('aria-current');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.setAttribute('aria-current', 'page');
                    }
                });
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Announce page changes to screen readers
function announcePageChange(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        if (document.body.contains(announcement)) {
            document.body.removeChild(announcement);
        }
    }, 1000);
}

// Form validation and accessibility (if forms are added later)
function enhanceFormAccessibility() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Add required field indicators
            if (input.hasAttribute('required')) {
                const label = form.querySelector(`label[for="${input.id}"]`);
                if (label && !label.querySelector('.required-indicator')) {
                    const indicator = document.createElement('span');
                    indicator.className = 'required-indicator';
                    indicator.setAttribute('aria-label', 'required');
                    indicator.textContent = ' *';
                    label.appendChild(indicator);
                }
            }
            
            // Add error message containers
            if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message sr-only';
                errorDiv.setAttribute('role', 'alert');
                errorDiv.id = `${input.id}-error`;
                input.setAttribute('aria-describedby', errorDiv.id);
                input.parentNode.insertBefore(errorDiv, input.nextSibling);
            }
        });
    });
}

// Initialize accessibility enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    enhanceFormAccessibility();
    
    // Announce that the page is ready for screen readers
    setTimeout(() => {
        announcePageChange('Page loaded and ready for navigation');
    }, 500);
});