document.addEventListener('DOMContentLoaded', () => {

    // --- Set Current Year in Footer ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Modal Handling ---
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-button');
    const slideInButtons = document.querySelectorAll('.slide-in-button'); // Select the slide-in buttons
    const body = document.body;

    // Function to open modal
    const openModal = (modal) => {
        if (modal) {
            body.style.overflow = 'hidden';
            modal.classList.add('active');
            const focusableElement = modal.querySelector('.close-button') || modal;
            if (focusableElement) focusableElement.focus();
        }
    }

    // Function to close modal
    const closeModal = (modal) => {
        if (modal && modal.classList.contains('active')) {
            body.style.overflow = '';
            modal.classList.remove('active');
        }
    }

    // Add listeners to slide-in buttons to open modals
    slideInButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal-target');
            const modal = document.querySelector(modalId);
            openModal(modal);
        });
    });

    // Add listeners to close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });

    // Add listener to close modal when clicking the background overlay
    modals.forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Optional: Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            closeModal(activeModal);
        }
    });


    // --- Intersection Observer for Slide-In Animation ---
    const observerOptions = {
        root: null, // Use the viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% visible (might trigger immediately for fixed pos)
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            // For fixed position elements, they are technically always intersecting
            // if they have dimensions. We rely more on the initial opacity/transform
            // and the 'visible' class being added once.
             if (!entry.target.classList.contains('visible')) {
                // Add visible class if it's not already there
                 entry.target.classList.add('visible');
                 // No need to unobserve fixed elements if we want them always there
                 // observer.unobserve(entry.target);
             }
        });
    };

    const slideInObserver = new IntersectionObserver(observerCallback, observerOptions);

    // Observe each slide-in button
    slideInButtons.forEach(button => {
        slideInObserver.observe(button);
        // For fixed elements that should appear immediately on load,
        // you could potentially add the 'visible' class right away or after a short delay
        // instead of purely relying on the observer, but the observer should work.
        // Example: setTimeout(() => button.classList.add('visible'), 100);
    });

}); // End of DOMContentLoaded