document.addEventListener('DOMContentLoaded', function() {

    var html = document.documentElement;

    // ===== Scroll Reveal Animations =====
    // Put this FIRST so it always runs, even if theme/language code errors
    var aosElements = document.querySelectorAll('[data-aos]');

    function revealElement(el) {
        if (!el.classList.contains('visible')) {
            el.classList.add('visible');
        }
    }

    function checkVisibility() {
        var windowHeight = window.innerHeight;
        aosElements.forEach(function(el) {
            var rect = el.getBoundingClientRect();
            if (rect.top < windowHeight - 50 && rect.bottom > 0) {
                var parent = el.parentElement;
                var siblings = [];
                if (parent) {
                    for (var i = 0; i < parent.children.length; i++) {
                        if (parent.children[i].hasAttribute('data-aos')) {
                            siblings.push(parent.children[i]);
                        }
                    }
                }
                var idx = siblings.indexOf(el);
                var staggerMs = idx > 0 ? idx * 100 : 0;
                setTimeout(function() { revealElement(el); }, staggerMs);
            }
        });
    }

    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('resize', checkVisibility);
    checkVisibility();
    setTimeout(checkVisibility, 100);
    setTimeout(checkVisibility, 500);

    // Fallback: reveal everything after 3s
    setTimeout(function() {
        aosElements.forEach(function(el) { revealElement(el); });
    }, 3000);

    // ===== Counter Animation =====
    function animateCounters() {
        document.querySelectorAll('.stat-number').forEach(function(el) {
            if (el.dataset.animated) return;
            var rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.dataset.animated = 'true';
                var target = parseInt(el.getAttribute('data-count'));
                var suffix = el.getAttribute('data-suffix') || '';
                var duration = 2000;
                var start = performance.now();

                function animate(now) {
                    var elapsed = now - start;
                    var progress = Math.min(elapsed / duration, 1);
                    var eased = 1 - Math.pow(1 - progress, 3);
                    var current = Math.round(eased * target);
                    el.textContent = current + suffix;
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                }

                requestAnimationFrame(animate);
            }
        });
    }

    window.addEventListener('scroll', animateCounters);
    animateCounters();
    setTimeout(animateCounters, 200);

    // ===== Theme Toggle =====
    try {
        var themeToggle = document.getElementById('themeToggle');
        var savedTheme = 'dark';
        try { savedTheme = localStorage.getItem('theme') || 'dark'; } catch(e) {}
        html.setAttribute('data-theme', savedTheme);

        themeToggle.addEventListener('click', function() {
            var current = html.getAttribute('data-theme');
            var next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            try { localStorage.setItem('theme', next); } catch(e) {}
        });
    } catch(e) { console.error('Theme error:', e); }

    // ===== Language Toggle =====
    var currentLang = 'en';
    var typedInterval = null;

    try {
        var langToggle = document.getElementById('langToggle');
        var langLabel = langToggle.querySelector('.lang-label');
        try { currentLang = localStorage.getItem('lang') || 'en'; } catch(e) {}

        function applyLanguage(lang) {
            currentLang = lang;
            langLabel.textContent = lang.toUpperCase();
            try { localStorage.setItem('lang', lang); } catch(e) {}

            document.querySelectorAll('[data-i18n]').forEach(function(el) {
                var key = el.getAttribute('data-i18n');
                var t = translations[lang];
                if (t && t[key]) {
                    if (el.children.length > 0 && key.includes('certScore')) {
                        el.innerHTML = t[key];
                    } else {
                        el.textContent = t[key];
                    }
                }
            });

            initTypedText();
        }

        langToggle.addEventListener('click', function() {
            var next = currentLang === 'en' ? 'id' : 'en';
            applyLanguage(next);
        });

        applyLanguage(currentLang);
    } catch(e) { console.error('Language error:', e); }

    // ===== Typed Text Effect =====
    function initTypedText() {
        try {
            if (typedInterval) clearTimeout(typedInterval);

            var typedEl = document.getElementById('typedText');
            if (!typedEl || !translations[currentLang]) return;
            var words = translations[currentLang].typed;
            if (!words) return;
            var wordIdx = 0;
            var charIdx = 0;
            var isDeleting = false;

            function type() {
                var word = words[wordIdx];
                var delay;

                if (isDeleting) {
                    typedEl.textContent = word.substring(0, charIdx - 1);
                    charIdx--;
                    delay = 50;
                } else {
                    typedEl.textContent = word.substring(0, charIdx + 1);
                    charIdx++;
                    delay = 80;
                }

                if (!isDeleting && charIdx === word.length) {
                    delay = 2000;
                    isDeleting = true;
                } else if (isDeleting && charIdx === 0) {
                    isDeleting = false;
                    wordIdx = (wordIdx + 1) % words.length;
                    delay = 500;
                }

                typedInterval = setTimeout(type, delay);
            }

            type();
        } catch(e) { console.error('Typed text error:', e); }
    }

    // ===== Navbar Scroll Effect =====
    try {
        var navbar = document.getElementById('navbar');
        window.addEventListener('scroll', function() {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    } catch(e) {}

    // ===== Active Nav Link =====
    try {
        var sections = document.querySelectorAll('section[id]');
        var navLinks = document.querySelectorAll('.nav-links a');

        function updateActiveLink() {
            var scrollY = window.scrollY + 100;
            sections.forEach(function(section) {
                var top = section.offsetTop;
                var height = section.offsetHeight;
                var id = section.getAttribute('id');

                if (scrollY >= top && scrollY < top + height) {
                    navLinks.forEach(function(link) {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', updateActiveLink);
        updateActiveLink();
    } catch(e) {}

    // ===== Hamburger Menu =====
    try {
        var hamburger = document.getElementById('hamburger');
        var navLinksEl = document.getElementById('navLinks');

        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinksEl.classList.toggle('open');
        });

        navLinksEl.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinksEl.classList.remove('open');
            });
        });
    } catch(e) {}

    // ===== Smooth Scroll for anchor links =====
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
