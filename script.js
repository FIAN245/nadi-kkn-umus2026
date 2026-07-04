/**
 * KKN Board Control Script
 * Features: Realtime Clock, Navigation, Tooltips, Dark Mode, Countdown, Accordions, and G-Sheets Fetch.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. REALTIME CLOCK MODULE ---
    const realtimeDateEl = document.getElementById('realtimeDate');
    
    function updateRealtimeClock() {
        const currentDate = new Date();
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        
        const dateString = currentDate.toLocaleDateString('id-ID', dateOptions);
        const hoursString = String(currentDate.getHours()).padStart(2, '0');
        const minutesString = String(currentDate.getMinutes()).padStart(2, '0');
        const secondsString = String(currentDate.getSeconds()).padStart(2, '0');
        
        if (realtimeDateEl) {
            realtimeDateEl.textContent = `${dateString} | ${hoursString}:${minutesString}:${secondsString} WIB`;
        }
    }
    updateRealtimeClock(); // Initial call
    setInterval(updateRealtimeClock, 1000); // Update every second


    // --- 2. FLOATING MENU & TOOLTIP MODULE ---
    const menuToggle = document.getElementById('menuToggle');
    const navigationMenu = document.getElementById('navigationMenu');
    const navLinks = document.querySelectorAll('.navigation-menu ul li a');
    const menuHint = document.getElementById('menuHint');
    
    let hintTimeout;
    
    // Auto-hide the tooltip hint after 4.5 seconds
    if (menuHint) {
        hintTimeout = setTimeout(() => { 
            menuHint.classList.add('fade-out'); 
        }, 4500);
    }

    menuToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        navigationMenu.classList.toggle('is-active');
        
        // Hide hint immediately if user clicks the button before timeout
        if (menuHint && !menuHint.classList.contains('fade-out')) {
            menuHint.classList.add('fade-out');
            clearTimeout(hintTimeout);
        }
    });

    // Close menu when a navigation link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navigationMenu.classList.remove('is-active');
        });
    });

    // Close menu when clicking outside the menu area
    document.addEventListener('click', (event) => {
        if (!navigationMenu.contains(event.target) && event.target !== menuToggle) {
            navigationMenu.classList.remove('is-active');
        }
    });


    // --- 3. DARK MODE MODULE ---
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('kknBoardTheme');
    
    // Check local storage for existing theme preference
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


    // --- 4. COUNTDOWN TIMER MODULE ---
    // Target: End of day on August 8, 2026
    const TARGET_DATE_STRING = "August 8, 2026 23:59:59"; 
    const targetTime = new Date(TARGET_DATE_STRING).getTime();

    const countdownTimer = setInterval(() => {
        const timeDifference = targetTime - new Date().getTime();

        const calculatedDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const calculatedHours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const calculatedMinutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const calculatedSeconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        // Inject calculated values into HTML elements with double-digit formatting
        document.getElementById('days').textContent = String(calculatedDays).padStart(2, '0');
        document.getElementById('hours').textContent = String(calculatedHours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(calculatedMinutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(calculatedSeconds).padStart(2, '0');

        // Clear interval and display message when countdown finishes
        if (timeDifference < 0) {
            clearInterval(countdownTimer);
            document.getElementById('countdownDisplay').innerHTML = "<h4 style='color: #2563eb; width: 100%;'>Masa Pengabdian KKN Selesai! 🎉</h4>";
        }
    }, 1000);


    // --- 5. ACCORDION (RULES SECTION) MODULE ---
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');
    
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            this.classList.toggle('is-active');
            const panel = this.nextElementSibling;
            
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });


    // --- 6. GOOGLE SHEETS LIVE RUNDOWN MODULE ---
    // IMPORTANT: Replace the string below with your actual Google Sheet ID
    const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE'; 
    const SHEET_TITLE = 'Sheet1'; 
    const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_TITLE}&tqx=out:json`;

    async function fetchRundownData() {
        const rundownContainer = document.getElementById('dynamicRundownContainer');
        
        try {
            if (SHEET_ID === 'YOUR_GOOGLE_SHEET_ID_HERE') {
                rundownContainer.innerHTML = '<p style="color:red; text-align:center;">⚠️ Sistem belum tersambung. Masukkan ID Spreadsheet di script.js</p>';
                return;
            }

            const response = await fetch(SHEET_URL);
            const textResponse = await response.text();
            
            // Extract JSON payload from the Google Visualization API response
            const jsonString = textResponse.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\)/)[1];
            const parsedData = JSON.parse(jsonString);

            rundownContainer.innerHTML = ''; // Clear loading text

            const rows = parsedData.table.rows;
            
            // Data starts at row 2 (index 0 is considered header by Google API)
            if (!rows || rows.length === 0) {
                 rundownContainer.innerHTML = '<p style="text-align:center;">Belum ada jadwal yang ditulis oleh Divisi Acara hari ini.</p>';
                 return;
            }

            // Loop through each row and inject into HTML
            rows.forEach(row => {
                // Column A = Time, Column B = Activity, Column C = Location/PIC
                const timeStr = (row.c[0] && row.c[0].v) ? row.c[0].v : '-';
                const activityStr = (row.c[1] && row.c[1].v) ? row.c[1].v : 'Kegiatan Tidak Bernama';
                const locationStr = (row.c[2] && row.c[2].v) ? row.c[2].v : '';

                const itemHTML = `
                    <div class="rundown-item">
                        <div class="time-badge">${timeStr}</div>
                        <div class="rundown-detail">
                            <h4>${activityStr}</h4>
                            ${locationStr ? `<p>📍 ${locationStr}</p>` : ''}
                        </div>
                    </div>
                `;
                rundownContainer.innerHTML += itemHTML;
            });

        } catch (error) {
            rundownContainer.innerHTML = '<p style="color:red; text-align:center;">⚠️ Gagal memuat jadwal. Pastikan Google Sheet diset "Anyone with the link can view".</p>';
            console.error('Error fetching rundown data:', error);
        }
    }
    
    fetchRundownData();
});

// --- 7. DROPDOWN (ORGANIZATION) MODULE ---
// Defined outside DOMContentLoaded as it is triggered directly by inline HTML onclick attributes
function toggleDropdown(element) {
    element.classList.toggle('is-open');
}
