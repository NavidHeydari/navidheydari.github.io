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

// Hamburger menu navigation
const nav = document.querySelector('nav');
const hamburger = document.getElementById('hamburgerMenu');

function isMenuOpen() {
    return nav.classList.contains('menu-open');
}

function openMenu() {
    nav.classList.add('menu-open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

function closeMenu(returnFocus) {
    nav.classList.remove('menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (returnFocus) {
        hamburger.focus();
    }
}

// Toggle menu on hamburger click
hamburger.addEventListener('click', function(e) {
    e.stopPropagation();
    if (isMenuOpen()) {
        closeMenu(false);
    } else {
        openMenu();
    }
});

// Close menu when a nav link is clicked
nav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
        closeMenu(false);
    });
});

// Close menu on Escape key and return focus to hamburger
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isMenuOpen()) {
        closeMenu(true);
    }
});

// Close menu when focus leaves the nav (keyboard tab-out)
nav.addEventListener('focusout', function() {
    setTimeout(function() {
        if (!nav.contains(document.activeElement) && isMenuOpen()) {
            closeMenu(false);
        }
    }, 0);
});

// Close menu when clicking outside the nav
document.addEventListener('click', function(e) {
    if (!nav.contains(e.target) && isMenuOpen()) {
        closeMenu(false);
    }
});

// Reset menu state if window is resized above the mobile breakpoint
window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && isMenuOpen()) {
        closeMenu(false);
    }
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
