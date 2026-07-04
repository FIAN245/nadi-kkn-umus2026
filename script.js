/**
 * KKN Board Control Script
 * Handling Navigations, Dark Mode, Countdown, Realtime Clock, Dropdowns, and Accordions.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. REALTIME CLOCK & DATE ---
    const realtimeDateEl = document.getElementById('realtimeDate');
    
    function updateRealtimeClock() {
        const sekarang = new Date();
        
        // Format Bahasa Indonesia
        const opsiTanggal = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const tanggalStr = sekarang.toLocaleDateString('id-ID', opsiTanggal);
        
        // Format Jam (HH:MM:SS)
        const jamStr = String(sekarang.getHours()).padStart(2, '0');
        const menitStr = String(sekarang.getMinutes()).padStart(2, '0');
        const detikStr = String(sekarang.getSeconds()).padStart(2, '0');
        
        if (realtimeDateEl) {
            realtimeDateEl.textContent = `${tanggalStr} | ${jamStr}:${menitStr}:${detikStr} WIB`;
        }
    }
    
    updateRealtimeClock(); 
    setInterval(updateRealtimeClock, 1000); 


    // --- 2. FLOATING NAVIGATION & TOOLTIP HINT ---
    const menuToggle = document.getElementById('menuToggle');
    const navigationMenu = document.getElementById('navigationMenu');
    const navLinks = document.querySelectorAll('.navigation-menu ul li a');
    
    const menuHint = document.getElementById('menuHint');
    let hintTimeout;

    // Petunjuk hilang otomatis setelah 4.5 detik
    if (menuHint) {
        hintTimeout = setTimeout(() => {
            menuHint.classList.add('fade-out');
        }, 4500);
    }

    // Toggle Menu Klik
    menuToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        navigationMenu.classList.toggle('is-active');
        
        // Hapus petunjuk seketika saat tombol ditekan
        if (menuHint && !menuHint.classList.contains('fade-out')) {
            menuHint.classList.add('fade-out');
            clearTimeout(hintTimeout);
        }
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


    // --- 3. THEME CONTROLLER ---
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


    // --- 4. COUNTDOWN TIMER ---
    // Target akhir KKN diset pada detik terakhir tanggal 8 Agustus 2026
    const TARGET_DATE_STRING = "August 8, 2026 23:59:59"; 
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


    // --- 5. ACCORDION CONTROLLER ---
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

// --- 6. DROPDOWN CONTROLLER ---
// Fungsi ini dipanggil secara inline (onclick) pada HTML
function toggleDropdown(element) {
    element.classList.toggle('is-open');
}
