class SpiderWebEffect {
    constructor() {
        this.canvas = document.getElementById('webCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.hero = document.querySelector('.hero');
        this.mouse = { x: 0, y: 0 };
        this.circles = [];
        this.isMouseInHero = false;

        this.darkConfig = {
            circleCount: 80,
            minRadius: 2,
            maxRadius: 6,
            maxDistance: 150,
            lineWidth: 0.8,
            colors: [
                '#ffeb3b', '#ff5722', '#e91e63', '#9c27b0',
                '#673ab7', '#3f51b5', '#2196f3', '#03a9f4',
                '#00bcd4', '#009688', '#4caf50', '#8bc34a',
                '#cddc39', '#ffc107', '#ff9800', '#ff5722'
            ]
        };
        this.lightConfig = {
            circleCount: 60,
            minRadius: 3,
            maxRadius: 7,
            maxDistance: 200,
            lineWidth: 1,
            colors: [
                '#667eea', '#764ba2', '#f093fb', '#f5576c',
                '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
                '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3',
                '#d299c2', '#fef9d7', '#667eea', '#764ba2'
            ]
        };
        this.config = this.darkConfig;
        this.init();
    }

    init() {
        this.setupCanvas();
        this.generateCircles();
        this.setupEventListeners();
        this.animate();
    }
    updateTheme(isLightMode) {
        this.config = isLightMode ? this.lightConfig : this.darkConfig;
        this.generateCircles();
    }
    setupCanvas() {
        const rect = this.hero.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        window.addEventListener('resize', () => {
            const rect = this.hero.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
            this.generateCircles();
        });
    }
    generateCircles() {
        this.circles = [];
        for (let i = 0; i < this.config.circleCount; i++) {
            this.circles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * (this.config.maxRadius - this.config.minRadius) + this.config.minRadius,
                color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.8 + 0.2,
                pulseSpeed: Math.random() * 0.02 + 0.01
            });
        }
    }
    setupEventListeners() {
        this.hero.addEventListener('mousemove', (e) => {
            const rect = this.hero.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            this.isMouseInHero = true;
        });
        this.hero.addEventListener('mouseleave', () => {
            this.isMouseInHero = false;
        });
        this.hero.addEventListener('mouseenter', () => {
            this.isMouseInHero = true;
        });
    }
    calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    drawCircle(circle) {
        this.ctx.beginPath();
        this.ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        const pulseOpacity = circle.opacity + Math.sin(Date.now() * circle.pulseSpeed) * 0.3;
        this.ctx.fillStyle = circle.color;
        this.ctx.globalAlpha = pulseOpacity;
        this.ctx.fill();
        this.ctx.shadowColor = circle.color;
        this.ctx.shadowBlur = 15;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        this.ctx.globalAlpha = 1;
    }
    drawLine(fromX, fromY, toX, toY, color, opacity = 1) {
        this.ctx.beginPath();
        this.ctx.moveTo(fromX, fromY);
        this.ctx.lineTo(toX, toY);
        this.ctx.strokeStyle = color;
        this.ctx.globalAlpha = opacity;
        this.ctx.lineWidth = this.config.lineWidth;
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
    }
    updateCircles() {
        this.circles.forEach(circle => {
            circle.x += circle.vx;
            circle.y += circle.vy;
            if (circle.x < circle.radius || circle.x > this.canvas.width - circle.radius) {
                circle.vx *= -1;
            }
            if (circle.y < circle.radius || circle.y > this.canvas.height - circle.radius) {
                circle.vy *= -1;
            }
            circle.x = Math.max(circle.radius, Math.min(this.canvas.width - circle.radius, circle.x));
            circle.y = Math.max(circle.radius, Math.min(this.canvas.height - circle.radius, circle.y));
        });
    }
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateCircles();
        this.circles.forEach(circle => {
            this.drawCircle(circle);
        });
        if (this.isMouseInHero) {
            this.circles.forEach(circle => {
                const distance = this.calculateDistance(
                    this.mouse.x, this.mouse.y,
                    circle.x, circle.y
                );
                if (distance < this.config.maxDistance) {
                    const opacity = 1 - (distance / this.config.maxDistance);
                    this.drawLine(
                        this.mouse.x, this.mouse.y,
                        circle.x, circle.y,
                        circle.color,
                        opacity
                    );
                }
            });
            this.ctx.beginPath();
            this.ctx.arc(this.mouse.x, this.mouse.y, 3, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.fill();
        }
        requestAnimationFrame(() => this.animate());
    }
}

let spiderWebEffect;
document.addEventListener('DOMContentLoaded', () => {
    spiderWebEffect = new SpiderWebEffect();
    initNavigation();
    checkThemePreference();

    // Typing effect for your REAL name
    const nameElement = document.getElementById('typedName');
    if (nameElement) {
        setTimeout(() => {
            typeWriter("D. R. V. Sai Siddarth", nameElement, 150);
        }, 500);
    }
});

function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    navMenu.classList.toggle('active');
    menuToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenu = document.getElementById('navMenu');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
                const toggle = document.querySelector('.mobile-menu-toggle');
                if (toggle) toggle.textContent = '☰';
            }
        });
    });
}

// THEME TOGGLE
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');
    const themeText = document.querySelector('.theme-text');
    body.classList.toggle('light-mode');
    const isLightMode = body.classList.contains('light-mode');
    if (isLightMode) {
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light Mode';
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'dark');
    }
    if (spiderWebEffect) {
        spiderWebEffect.updateTheme(isLightMode);
    }
}

function checkThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');
    const themeText = document.querySelector('.theme-text');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        if (themeIcon) themeIcon.textContent = '☀️';
        if (themeText) themeText.textContent = 'Light Mode';
        if (spiderWebEffect) spiderWebEffect.updateTheme(true);
    }
}

// TYPING EFFECT
function typeWriter(text, element, speed = 100) {
    let i = 0;
    element.textContent = '';
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Word Animation (optional)
document.addEventListener('DOMContentLoaded', function() {
    const words = document.querySelectorAll('.animated-word');
    let currentIndex = 0;
    if (words.length > 0) {
        function rotateWords() {
            words[currentIndex].style.opacity = '0';
            words[currentIndex].style.transform = 'translateY(-20px)';
            setTimeout(() => {
                words[currentIndex].classList.remove('active');
                currentIndex = (currentIndex + 1) % words.length;
                words[currentIndex].classList.add('active');
                words[currentIndex].style.opacity = '1';
                words[currentIndex].style.transform = 'translateY(0)';
            }, 300);
        }
        setInterval(rotateWords, 2500);
    }
});
