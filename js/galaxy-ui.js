/* PLUTO Jacks — UI interactions
   Nav scroll, mobile menu, reveal-on-scroll, back-to-top, count-up.
*/
(function () {
    // Mark <html> with .js so CSS can opt-in to scroll-reveal only when JS runs
    document.documentElement.classList.add('js');

    // Nav scrolled state
    const nav = document.querySelector('.galaxy-nav');
    if (nav) {
        const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // Mobile menu
    const toggle = document.querySelector('.nav-toggle-btn');
    const menu = document.querySelector('.mobile-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', () => menu.classList.toggle('open'));
    }

    // Reveal on scroll (with aggressive rootMargin + safety fallback)
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('revealed');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px 20% 0px' });
        reveals.forEach(el => io.observe(el));

        // Safety net: after 1.5s, reveal anything still hidden (static screenshots, long pages, etc.)
        const forceAll = () => {
            document.querySelectorAll('.reveal:not(.revealed)').forEach(el => el.classList.add('revealed'));
        };
        window.addEventListener('load', () => setTimeout(forceAll, 1500));
        // Also belt-and-suspenders: after 3s regardless of load event
        setTimeout(forceAll, 3000);
    } else {
        // No IO support: show everything
        reveals.forEach(el => el.classList.add('revealed'));
    }

    // Back to top
    const backTop = document.getElementById('backToTop');
    if (backTop) {
        window.addEventListener('scroll', () => {
            backTop.classList.toggle('show', window.scrollY > 600);
        }, { passive: true });
        backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // Count-up on .stat .num[data-count]
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length && 'IntersectionObserver' in window) {
        const io2 = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                const el = e.target;
                const target = parseFloat(el.getAttribute('data-count'));
                const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
                const suffix = el.getAttribute('data-suffix') || '';
                const prefix = el.getAttribute('data-prefix') || '';
                const dur = 1600;
                const start = performance.now();
                function step(t) {
                    const p = Math.min(1, (t - start) / dur);
                    const eased = 1 - Math.pow(1 - p, 3);
                    const val = target * eased;
                    el.textContent = prefix + val.toFixed(decimals) + suffix;
                    if (p < 1) requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
                io2.unobserve(el);
            });
        }, { threshold: 0.4 });
        counters.forEach(c => io2.observe(c));
    }

    // Active nav link based on current page
    const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav-links a').forEach(a => {
        const href = (a.getAttribute('href') || '').toLowerCase();
        if (href === current) a.classList.add('active');
    });
})();
