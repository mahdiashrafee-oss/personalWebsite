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
        hamburgerToggle.addEventListener('click', () => {
            // Check if menu is already active and toggle it
            const isMenuActive = mobileMenu.classList.contains('active');
            toggleMobileMenu(!isMenuActive);
        });
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
    
    // Left sidebar handling for mobile
    const sidebarToggle = document.getElementById('sidebarToggle');
    const leftSidebar = document.querySelector('.left-sidebar');
    const scrollIndicator = document.getElementById('scrollIndicator');
    
    if (sidebarToggle && leftSidebar) {
        // Toggle sidebar on click
        sidebarToggle.addEventListener('click', () => {
            leftSidebar.classList.toggle('active');
            
            // Show/hide scroll indicator based on sidebar visibility
            updateScrollIndicatorVisibility();
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (leftSidebar.classList.contains('active') && 
                !leftSidebar.contains(e.target) && 
                !sidebarToggle.contains(e.target)) {
                leftSidebar.classList.remove('active');
                
                // Hide scroll indicator when sidebar is closed
                updateScrollIndicatorVisibility();
            }
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
                animationWidth = '289px'; // Small mobile - increased to show full text
                typingElement.style.fontSize = '2.2rem';
            } else if (window.innerWidth <= 768) {
                animationWidth = '320px'; // Tablet/mobile - increased to show full text
            }
            
            // Ensure the text doesn't wrap during or after animation
            typingElement.style.whiteSpace = 'nowrap';
            
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
    
    // Scroll indicator functionality
    if (scrollIndicator && leftSidebar) {
        // Function to update scroll indicator visibility based on sidebar state
        function updateScrollIndicatorVisibility() {
            // For home page sidebar
            if (!window.location.pathname.includes('blog-')) {
                // Only show if sidebar is active (visible on mobile)
                if (window.innerWidth <= 1200 && !leftSidebar.classList.contains('active')) {
                    scrollIndicator.style.opacity = '0';
                    scrollIndicator.style.pointerEvents = 'none';
                    return;
                }
            } 
            // For blog page sidebar
            else {
                // Only show if blog sidebar is active (visible on mobile)
                const blogSidebar = document.getElementById('blogSidebar');
                if (blogSidebar && window.innerWidth <= 992 && !blogSidebar.classList.contains('active')) {
                    scrollIndicator.style.opacity = '0';
                    scrollIndicator.style.pointerEvents = 'none';
                    return;
                }
            }
            
            // If sidebar is visible, check if we need to show/hide based on scroll position
            checkScrollPosition();
        }
        
        // Check scroll position on page load
        updateScrollIndicatorVisibility();
        
        // Check scroll position when sidebar scrolls (for blog page sidebar which has overflow-y: auto)
        leftSidebar.addEventListener('scroll', updateScrollIndicatorVisibility);
        
        // Blog sidebar scroll event
        const blogSidebar = document.getElementById('blogSidebar');
        if (blogSidebar) {
            blogSidebar.addEventListener('scroll', updateScrollIndicatorVisibility);
        }
        
        // Also check on window scroll since it might affect visibility on the main page
        window.addEventListener('scroll', updateScrollIndicatorVisibility);
        
        // Check on window resize too
        window.addEventListener('resize', updateScrollIndicatorVisibility);
        
        // Function to check if user has scrolled to see all sidebar content
        function checkScrollPosition() {
            let currentSidebar = leftSidebar;
            
            // For blog page, use the blog sidebar instead
            if (window.location.pathname.includes('blog-')) {
                const blogSidebar = document.getElementById('blogSidebar');
                if (blogSidebar) {
                    currentSidebar = blogSidebar;
                }
            }
            
            // First check if the sidebar has overflow-y: auto style
            const sidebarStyle = window.getComputedStyle(currentSidebar);
            
            if (sidebarStyle.overflowY === 'auto') {
                // For sidebars with overflow-y: auto (like in blog page)
                const sidebarScrollPosition = currentSidebar.scrollTop;
                const sidebarVisibleHeight = currentSidebar.clientHeight;
                const sidebarTotalHeight = currentSidebar.scrollHeight;
                
                // Threshold - when we're close to the bottom of the sidebar
                const threshold = 50;
                
                // If we're at the bottom of the sidebar content
                if (sidebarScrollPosition + sidebarVisibleHeight >= sidebarTotalHeight - threshold) {
                    scrollIndicator.style.opacity = '0';
                    scrollIndicator.style.pointerEvents = 'none';
                } else {
                    scrollIndicator.style.opacity = '1';
                    scrollIndicator.style.pointerEvents = 'auto';
                }
            } else {
                // For sidebars that might be taller than viewport (like on home page)
                // Get the bottom position of the sidebar content
                const sidebarRect = currentSidebar.getBoundingClientRect();
                const lastElement = currentSidebar.lastElementChild;
                const lastElementRect = lastElement ? lastElement.getBoundingClientRect() : null;
                
                // If there's no last element, exit early
                if (!lastElementRect) return;
                
                // Check if the bottom of the last element is visible in the viewport
                const bottomVisible = lastElementRect.bottom <= window.innerHeight;
                
                // Threshold - consider bottom visible if we're within this many pixels
                const threshold = 50;
                
                if (bottomVisible || lastElementRect.bottom - window.innerHeight < threshold) {
                    scrollIndicator.style.opacity = '0';
                    scrollIndicator.style.pointerEvents = 'none';
                } else {
                    scrollIndicator.style.opacity = '1';
                    scrollIndicator.style.pointerEvents = 'auto';
                }
            }
        }
        
        // Scroll down when clicked - determine which element to scroll
        scrollIndicator.addEventListener('click', function() {
            let currentSidebar = leftSidebar;
            
            // For blog page, use the blog sidebar instead
            if (window.location.pathname.includes('blog-')) {
                const blogSidebar = document.getElementById('blogSidebar');
                if (blogSidebar) {
                    currentSidebar = blogSidebar;
                }
            }
            
            const sidebarStyle = window.getComputedStyle(currentSidebar);
            
            if (sidebarStyle.overflowY === 'auto') {
                // For sidebars with overflow-y: auto (like in blog page)
                currentSidebar.scrollBy({
                    top: 200, // Scroll 200px at a time
                    behavior: 'smooth'
                });
            } else {
                // For the main page, scroll the window
                window.scrollBy({
                    top: 200, // Scroll 200px at a time
                    behavior: 'smooth'
                });
            }
        });
    }
});
