// Dropdown Navigation Toggle
document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.querySelector('.nav-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (navToggle && dropdownMenu) {
        navToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!navToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });

        // Close dropdown when clicking a link
        const dropdownLinks = dropdownMenu.querySelectorAll('a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', function () {
                dropdownMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Advisor Carousel Auto-Scroll
    const carousel = document.getElementById('advisorCarousel');
    const leftArrow = document.querySelector('.carousel-arrow-left');
    const rightArrow = document.querySelector('.carousel-arrow-right');

    if (carousel && leftArrow && rightArrow) {
        let currentIndex = 0;
        const cards = carousel.querySelectorAll('.advisor-card');
        const totalCards = cards.length;
        let autoScrollInterval;

        function scrollToCard(index) {
            if (index < 0) index = totalCards - 1;
            if (index >= totalCards) index = 0;
            currentIndex = index;

            const cardWidth = cards[0].offsetWidth;
            const gap = 32; // 2rem gap
            const scrollPosition = (cardWidth + gap) * currentIndex;

            carousel.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }

        function nextCard() {
            scrollToCard(currentIndex + 1);
        }

        function prevCard() {
            scrollToCard(currentIndex - 1);
        }

        // Arrow click handlers
        leftArrow.addEventListener('click', () => {
            prevCard();
            resetAutoScroll();
        });

        rightArrow.addEventListener('click', () => {
            nextCard();
            resetAutoScroll();
        });

        // Auto-scroll every 6 seconds
        function startAutoScroll() {
            autoScrollInterval = setInterval(nextCard, 6000); // 6 seconds
        }

        function resetAutoScroll() {
            clearInterval(autoScrollInterval);
            startAutoScroll();
        }

        // Start auto-scroll
        startAutoScroll();

        // Pause auto-scroll on hover
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoScrollInterval);
        });

        carousel.addEventListener('mouseleave', () => {
            startAutoScroll();
        });
    }

    // Back to Top Button
    const backToTopButton = document.getElementById('backToTop');

    if (backToTopButton) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        // Scroll to top when clicked
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth scroll for project navigation links
    const projectNavLinks = document.querySelectorAll('.project-nav a[href^="#"]');

    projectNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100; // Offset for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});
