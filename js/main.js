// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference or default to light
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.classList.toggle('dark-theme', savedTheme === 'dark');
    updateThemeIcon();
}

// Theme toggle click handler
themeToggle.addEventListener('click', function() {
    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
});

// Update theme icon
function updateThemeIcon() {
    const isDark = body.classList.contains('dark-theme');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label',
        isDark ? 'Switch to light theme' : 'Switch to dark theme'
    );
}

// Initialize theme icon
updateThemeIcon();

// Enhanced mobile navigation
let isMenuToggled = false;

// Add mobile menu toggle for very small screens
function createMobileMenu() {
    if (window.innerWidth <= 480 && !document.querySelector('.mobile-menu-toggle')) {
        const nav = document.querySelector('nav');
        const navUl = nav.querySelector('ul');

        // Create mobile menu toggle
        const menuToggle = document.createElement('div');
        menuToggle.className = 'mobile-menu-toggle';
        menuToggle.innerHTML = '☰';
        menuToggle.style.cssText = `
            display: block;
            text-align: center;
            padding: 1rem;
            cursor: pointer;
            font-size: 1.2rem;
            color: #666;
            user-select: none;
        `;

        // Initially hide the menu
        navUl.style.display = 'none';

        menuToggle.addEventListener('click', function() {
            isMenuToggled = !isMenuToggled;
            navUl.style.display = isMenuToggled ? 'flex' : 'none';
            menuToggle.innerHTML = isMenuToggled ? '✕' : '☰';
        });

        // Close menu when clicking on a link
        navUl.addEventListener('click', function() {
            if (window.innerWidth <= 480) {
                isMenuToggled = false;
                navUl.style.display = 'none';
                menuToggle.innerHTML = '☰';
            }
        });

        nav.insertBefore(menuToggle, navUl);
    } else if (window.innerWidth > 480) {
        // Remove mobile menu toggle on larger screens
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        if (menuToggle) {
            menuToggle.remove();
            document.querySelector('nav ul').style.display = 'flex';
        }
    }
}

// Initialize mobile menu
createMobileMenu();

// Handle window resize
window.addEventListener('resize', function() {
    createMobileMenu();
});

// Smooth scrolling with offset for fixed nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('nav').offsetHeight;
            const targetPosition = target.offsetTop - navHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced scroll animations with better performance
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Animate children with delay for better mobile performance
            const children = entry.target.querySelectorAll('.skill-item, .project-card, .timeline-item');
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('visible');
                }, window.innerWidth <= 768 ? index * 100 : index * 150);
            });
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Optimized parallax for mobile (reduced effect)
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const speed = window.innerWidth <= 768 ? scrolled * 0.1 : scrolled * 0.2;

    if (hero) {
        hero.style.transform = `translateY(${speed}px)`;
    }

    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// Enhanced timeline animation for mobile
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const index = Array.from(timelineItems).indexOf(entry.target);
            const delay = window.innerWidth <= 768 ? index * 150 : index * 200;

            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
        }
    });
}, observerOptions);

timelineItems.forEach(item => {
    timelineObserver.observe(item);
});
