document.addEventListener('DOMContentLoaded', () => {
    // Set current year
    if (document.getElementById('year')) {
        document.getElementById('year').textContent = new Date().getFullYear();
    }

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const setTheme = isDark => {
            document.body.classList[isDark ? 'add' : 'remove']('dark-theme');
            document.body.classList[!isDark ? 'add' : 'remove']('light-theme');
            
            // Update theme indicator in header
            const themeIcon = themeToggle.querySelector('i');
            themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            
            // Update statusbar theme indicator if it exists
            const statusThemeIndicator = document.querySelector('.theme-indicator');
            if (statusThemeIndicator) {
                const statusThemeIcon = statusThemeIndicator.querySelector('i');
                const statusThemeText = statusThemeIndicator.querySelector('span');
                
                if (statusThemeIcon) {
                    statusThemeIcon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
                }
                
                if (statusThemeText) {
                    statusThemeText.textContent = isDark ? 'DARK' : 'LIGHT';
                }
            }
            
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        };
    
        // Check localStorage for user preference, but default to dark theme if not set
        const userPreference = localStorage.getItem('theme');
        // Default to dark theme unless explicitly set to light
        const defaultToDark = userPreference !== 'light';
        
        setTheme(defaultToDark);
        
        themeToggle.addEventListener('click', () => 
            setTheme(!document.body.classList.contains('dark-theme')));
    } else {
        // For pages without theme toggle button (like blog pages)
        // Just apply the theme from localStorage
        const userPreference = localStorage.getItem('theme');
        const isDark = userPreference !== 'light';
        
        document.body.classList[isDark ? 'add' : 'remove']('dark-theme');
        document.body.classList[!isDark ? 'add' : 'remove']('light-theme');
        
        // Update statusbar theme indicator if it exists
        const statusThemeIndicator = document.querySelector('.theme-indicator');
        if (statusThemeIndicator) {
            const statusThemeIcon = statusThemeIndicator.querySelector('i');
            const statusThemeText = statusThemeIndicator.querySelector('span');
            
            if (statusThemeIcon) {
                statusThemeIcon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
            }
            
            if (statusThemeText) {
                statusThemeText.textContent = isDark ? 'DARK' : 'LIGHT';
            }
        }
    }

    // Mobile menu handling
    const hamburgerToggle = document.getElementById('hamburger-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileClose = document.getElementById('mobile-close');
    
    // Function to toggle mobile menu
    const toggleMobileMenu = (show) => {
        document.body.style.overflow = show ? 'hidden' : '';
        
        if (show) {
            mobileMenu.classList.add('active');
            mobileOverlay.classList.add('active');
        } else {
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
        }
    };

    // Event listeners for mobile menu
    if (hamburgerToggle && mobileMenu && mobileOverlay && mobileClose) {
        hamburgerToggle.addEventListener('click', () => toggleMobileMenu(true));
        mobileClose.addEventListener('click', () => toggleMobileMenu(false));
        mobileOverlay.addEventListener('click', () => toggleMobileMenu(false));

        // Event delegation for mobile menu buttons
        document.querySelectorAll('.mobile-menu-button').forEach(btn => {
            btn.addEventListener('click', () => {
                toggleMobileMenu(false);
                
                // Open the respective modal
                const modal = document.querySelector(btn.getAttribute('data-modal-target'));
                if (modal) {
                    modal.classList.add('active');
                }
            });
        });
    }

    // Handle Escape key on blog pages to navigate back to home
    if (window.location.pathname.includes('blog-') && !document.querySelector('.modal')) {
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                window.location.href = 'index.html';
            }
        });
    }

    // Modal handling for buttons and links
    document.querySelectorAll('[data-modal-target]').forEach(btn => 
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.querySelector(btn.getAttribute('data-modal-target'));
            if (modal) {
                document.body.style.overflow = 'hidden';
                modal.classList.add('active');
            }
        }));

    document.querySelectorAll('.close-button').forEach(btn => 
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) {
                document.body.style.overflow = 'auto';
                modal.classList.remove('active');
            }
        }));

    document.querySelectorAll('.modal').forEach(modal => 
        modal.addEventListener('click', e => {
            if (e.target === modal) {
                document.body.style.overflow = 'auto';
                modal.classList.remove('active');
            }
        }));

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.body.style.overflow = 'auto';
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) activeModal.classList.remove('active');
            toggleMobileMenu(false);
        }
    });

    // Typing Animation
    const typingElement = document.querySelector('.typing-animation');
    
    if (typingElement) {
        // Function to restart the typing animation
        function restartTypingAnimation() {
            typingElement.style.animation = 'none';
            typingElement.style.width = '0';
            typingElement.classList.remove('completed');
            void typingElement.offsetWidth; // Trigger reflow
            
            let animationWidth = '380px';
            
            // Adjust animation width based on screen size
            if (window.innerWidth <= 480) {
                animationWidth = '300px'; // Small mobile
                typingElement.style.fontSize = '2.2rem';
            } else if (window.innerWidth <= 768) {
                animationWidth = '350px'; // Tablet/mobile
            }
            
            // Set animation with custom width (show blink at end)
            typingElement.style.animation = `typing 1.2s steps(14, end) forwards, blink-cursor 1s step-end infinite`;
            
            // Ensure proper centering on mobile
            if (window.innerWidth <= 768) {
                typingElement.style.margin = '0 auto';
                typingElement.style.display = 'block';
                typingElement.style.textAlign = 'center';
            }
            
            // Add completed class but keep cursor blinking
            setTimeout(() => {
                typingElement.classList.add('completed');
                typingElement.style.width = animationWidth;
                typingElement.style.animation = 'blink-cursor 1s step-end infinite';
            }, 1300); // Timeout adjusted to match the animation duration
        }
        
        // Initially restart the animation
        restartTypingAnimation();
        
        // Set up intersection observer to restart when in view
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        restartTypingAnimation();
                    }
                });
            },
            { threshold: 0.5 }
        );
        
        observer.observe(typingElement);
    }

    // Handle responsive breakpoints
    const handleResponsiveLayout = () => {
        const windowWidth = window.innerWidth;
        const slideButtons = document.querySelectorAll('.slide-in-button-container');
        const hamburgerMenu = document.getElementById('hamburger-toggle');
        
        if (windowWidth <= 1150) {
            slideButtons.forEach(container => container.style.display = 'none');
            if (hamburgerMenu) hamburgerMenu.style.display = 'block';
        } else {
            slideButtons.forEach(container => container.style.display = 'flex');
            if (hamburgerMenu) hamburgerMenu.style.display = 'none';
            
            // Close mobile menu if screen is resized larger
            toggleMobileMenu(false);
        }
    };
    
    // Initial check and event listener for window resize
    handleResponsiveLayout();
    window.addEventListener('resize', handleResponsiveLayout);
});
