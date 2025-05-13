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
            themeToggle.querySelector('i').className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        };
        
        setTheme(localStorage.getItem('theme') === 'dark' || 
                (localStorage.getItem('theme') !== 'light' && 
                window.matchMedia('(prefers-color-scheme: dark)').matches));
        
        themeToggle.addEventListener('click', () => 
            setTheme(!document.body.classList.contains('dark-theme')));
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
            mobileMenu.style.right = '0';
            mobileOverlay.style.opacity = '1';
        } else {
            mobileMenu.style.right = '-280px';
            mobileOverlay.style.opacity = '0';
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

    // Modal handling
    document.querySelectorAll('.slide-in-button').forEach(btn => 
        btn.addEventListener('click', () => {
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
                document.body.style.overflow = '';
                modal.classList.remove('active');
            }
        }));

    document.querySelectorAll('.modal').forEach(modal => 
        modal.addEventListener('click', e => {
            if (e.target === modal) {
                document.body.style.overflow = '';
                modal.classList.remove('active');
            }
        }));

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.body.style.overflow = '';
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) activeModal.classList.remove('active');
            toggleMobileMenu(false);
        }
    });
});
