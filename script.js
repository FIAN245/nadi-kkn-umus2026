/**
 * KKN Board Control Script
 * Handling Navigations, Dark Mode, Countdown, Dropdowns, and Accordions.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. FLOATING NAVIGATION CONTROLLER ---
    const menuToggle = document.getElementById('menuToggle');
    const navigationMenu = document.getElementById('navigationMenu');
    const navLinks = document.querySelectorAll('.navigation-menu ul li a');

    menuToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        navigationMenu.classList.toggle('is-active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navigationMenu.classList.remove('is-active');
        });
    });

    document.addEventListener('click', (event) => {
        if (!navigationMenu.contains(event.target) && event.target !== menuToggle) {
            navigationMenu.classList.remove('is-active');
        }
    });

    // --- 2. THEME CONTROLLER (DARK/LIGHT MODE) ---
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('kknBoardTheme');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️ Mode Terang';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            themeToggle.textContent = '☀️ Mode Terang';
            localStorage.setItem('kknBoardTheme', 'dark');
        } else {
            themeToggle.textContent = '🌙 Mode Gelap';
            localStorage.setItem('kknBoardTheme', 'light');
        }
    });

    // --- 3. COUNTDOWN TIMER CONTROLLER ---
    // Set target date for 40 days from deployment (e.g., August 10, 2026)
    const TARGET_DATE_STRING = "August 10, 2026 00:00:00"; 
    const targetTime = new Date(TARGET_DATE_STRING).getTime();

    const countdownTimer = setInterval(() => {
        const currentTime = new Date().getTime();
        const timeDifference = targetTime - currentTime;

        const calculatedDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const calculatedHours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const calculatedMinutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const calculatedSeconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(calculatedDays).padStart(2, '0');
        document.getElementById('hours').textContent = String(calculatedHours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(calculatedMinutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(calculatedSeconds).padStart(2, '0');

        if (timeDifference < 0) {
            clearInterval(countdownTimer);
            document.getElementById('countdownDisplay').innerHTML = "<h4 style='color: #2563eb; width: 100%;'>Masa Pengabdian KKN Telah Selesai! 🎉</h4>";
        }
    }, 1000);

    // --- 4. ACCORDION CONTROLLER FOR RULES SECTION ---
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');

    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            this.classList.toggle('is-active');
            const panel = this.nextElementSibling;

            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
                setTimeout(() => { panel.style.borderWidth = "0"; }, 300);
            } else {
                panel.style.borderWidth = "1px";
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });

});

// --- 5. DROPDOWN CONTROLLER FOR ORGANIZATION STRUCTURE ---
// Defined outside DOMContentLoaded as it is called via inline HTML onclick attribute
function toggleDropdown(element) {
    element.classList.toggle('is-open');
}
