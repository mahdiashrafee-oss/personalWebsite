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
        btn.addEventListener('click', () => 
            btn.closest('.modal')?.classList.remove('active')));

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
            document.querySelector('.modal.active')?.classList.remove('active');
        }
    });
});
