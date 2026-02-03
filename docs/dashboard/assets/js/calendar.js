// ===== HORMONAL CALENDAR - POPRAWIONY =====
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Inicjalizacja kalendarza
function initCalendar() {
    console.log('calendar.js: initCalendar() wywołana');
    
    // Użyj istniejących przycisków z HTML
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    
    console.log('calendar.js: prevBtn znaleziony:', !!prevBtn);
    console.log('calendar.js: nextBtn znaleziony:', !!nextBtn);
    
    if (prevBtn) prevBtn.addEventListener('click', prevMonth);
    if (nextBtn) nextBtn.addEventListener('click', nextMonth);
    
    // Wyrenderuj kalendarz
    renderCalendar();
    
    // Podświetl dzisiaj
    highlightToday();
}

// Render kalendarza
function renderCalendar() {
    console.log('calendar.js: renderCalendar() wywołana');
    
    const calendarContainer = document.getElementById('calendarContainer');
    const monthYearElement = document.getElementById('currentMonth');
    
    console.log('calendar.js: calendarContainer:', calendarContainer);
    console.log('calendar.js: monthYearElement:', monthYearElement);
    
    if (!calendarContainer || !monthYearElement) {
        console.error('calendar.js: Brak wymaganych elementów w HTML!');
        console.error('calendar.js: Potrzebujesz: <div id="calendarContainer"> i <span id="currentMonth">');
        return;
    }
    
    // Aktualizuj nazwę miesiąca
    const monthNames = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
                       'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
    
    // POPRAWIONE: Poprawna składnia
    monthYearElement.textContent = monthNames[currentMonth] + ' ' + currentYear;
    
    // Usuń poprzednią siatkę
    const existingGrid = calendarContainer.querySelector('.calendar-grid');
    if (existingGrid) existingGrid.remove();
    
    // Stwórz nową siatkę
    const grid = document.createElement('div');
    grid.className = 'calendar-grid';
    
    // Dni tygodnia
    const dayLabels = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb'];
    dayLabels.forEach(label => {
        const dayLabel = document.createElement('div');
        dayLabel.className = 'calendar-day-label';
        dayLabel.textContent = label;
        grid.appendChild(dayLabel);
    });
    
    // Oblicz dni
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Puste dni na początku
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        grid.appendChild(emptyDay);
    }
    
    // Dni miesiąca
    for (let day = 1; day <= daysInMonth; day++) {
        grid.appendChild(createDayElement(day));
    }
    
    calendarContainer.appendChild(grid);
    console.log('calendar.js: Kalendarz wyrenderowany');
}

// Pusty dzień
function createEmptyDay() {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day empty';
    return emptyDay;
}

// Dzień z warstwami hormonalnymi
function createDayElement(dayNumber) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    
    // Podświetl dzisiaj
    const today = new Date();
    if (currentYear === today.getFullYear() && 
        currentMonth === today.getMonth() && 
        dayNumber === today.getDate()) {
        dayElement.classList.add('today');
    }
    
    // Numer dnia
    const dayNumberSpan = document.createElement('div');
    dayNumberSpan.className = 'calendar-day-number';
    dayNumberSpan.textContent = dayNumber;
    dayElement.appendChild(dayNumberSpan);
    
    // Warstwy hormonalne
    const layersContainer = document.createElement('div');
    layersContainer.className = 'calendar-layers';
    
    // Dni cyklu od 1 do 28
    const dayOfCycle = ((dayNumber - 1) % 28) + 1;
    
    // Warstwa hormonalna
    if ((dayOfCycle >= 6 && dayOfCycle <= 12) || (dayOfCycle >= 21 && dayOfCycle <= 28)) {
        const hormonalLayer = document.createElement('div');
        hormonalLayer.className = 'calendar-layer layer-hormonal';
        layersContainer.appendChild(hormonalLayer);
    }
    
    // Histamina
    if (dayOfCycle >= 18 && dayOfCycle <= 24) {
        const histamineLayer = document.createElement('div');
        histamineLayer.className = 'calendar-layer layer-histamine';
        layersContainer.appendChild(histamineLayer);
    }
    
    // Menopauza
    if (Math.random() > 0.7) {
        const menopauseLayer = document.createElement('div');
        menopauseLayer.className = 'calendar-layer layer-menopause';
        layersContainer.appendChild(menopauseLayer);
    }
    
    // Dodaj kontener warstw tylko jeśli są jakieś warstwy
    if (layersContainer.children.length > 0) {
        dayElement.appendChild(layersContainer);
    }
    
    // Kliknięcie = szczegóły
    dayElement.addEventListener('click', function() {
        showDayDetails(dayNumber, dayOfCycle);
    });
    
    // Tooltip
    dayElement.title = 'Dzień ' + dayNumber + ' (Cykl: ' + dayOfCycle + ') - Kliknij po szczegóły';
    
    return dayElement;
}

// Szczegóły dnia
function showDayDetails(dayNumber, dayOfCycle) {
    let predictions = [];
    let phaseName = '';
    
    // Faza cyklu
    if (dayOfCycle <= 5) {
        phaseName = 'Miesiączka';
        predictions.push('• Faza miesiączki: Potrzebujesz więcej żelaza');
    } else if (dayOfCycle <= 12) {
        phaseName = 'Folikularna';
        predictions.push('• Faza folikularna: Rośnie energia');
    } else if (dayOfCycle <= 15) {
        phaseName = 'Owulacja';
        predictions.push('• Owulacja: Szczyt płodności');
    } else {
        phaseName = 'Lutealna';
        predictions.push('• Faza lutealna: Progesteron rośnie');
    }
    
    // Specjalne alerty dla dni
    if (dayOfCycle === 14) {
        predictions.push('• 🥚 Dzień owulacji - największa płodność');
    }
    if (dayOfCycle >= 18 && dayOfCycle <= 24) {
        predictions.push('• ⚠️ Uwaga na histaminę (faza lutealna)');
    }
    if (dayOfCycle === 28 || dayOfCycle === 1) {
        predictions.push('• 🔄 Przejście do nowego cyklu');
    }
    
    // Podpowiedzi dietetyczne
    const foodTips = {
        'Miesiączka': 'Ciepłe posiłki, bogate w żelazo (np. polski bigos!)',
        'Folikularna': 'Świeże warzywa, białko, eksperymentuj z nowymi smakami',
        'Owulacja': 'Lekkie posiłki, bogate w przeciwutleniacze',
        'Lutealna': 'Ciepłe zupy, magnez (orzechy, gorzka czekolada), unikaj histaminy'
    };
    
    predictions.push('• 🍲 ' + (foodTips[phaseName] || 'Słuchaj swojego ciała'));
    
    const predictionsText = predictions.join('\n');
    alert('📅 Dzień ' + dayNumber + ' (Cykl: ' + dayOfCycle + ')\n📊 Faza: ' + phaseName + '\n\n💡 Podpowiedzi:\n' + predictionsText + '\n\n✨ To dane demonstracyjne. Prawdziwe przewidywania będą z AI Aegisens!');
}

// Podświetlenie dzisiaj
function highlightToday() {
    const today = new Date();
    if (currentYear === today.getFullYear() && currentMonth === today.getMonth()) {
        setTimeout(() => {
            const todayElement = document.querySelector('.calendar-day.today');
            if (todayElement) {
                todayElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 500);
    }
}

// Poprzedni miesiąc
function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
    highlightToday();
}

// Następny miesiąc
function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
    highlightToday();
}

// ===== WAŻNE: AUTOSTART =====
// DODAJ TO NA SAMYM KOŃCU PLIKU calendar.js:

// Opcja 1: Gdy DOM się załaduje
document.addEventListener('DOMContentLoaded', function() {
    console.log('calendar.js: DOM załadowany - uruchamiam initCalendar()');
    initCalendar();
});

// Opcja 2: Ręczne wywołanie z poziomu HTML
window.initCalendar = initCalendar;
window.prevMonth = prevMonth;
window.nextMonth = nextMonth;

console.log('calendar.js: Plik załadowany pomyślnie');
