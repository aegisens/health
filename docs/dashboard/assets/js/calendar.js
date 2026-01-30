// ===== HORMONAL CALENDAR - PEŁNA KOMPATYBILNOŚĆ Z TWOIM HTML =====
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Inicjalizacja kalendarza (używa istniejący HTML)
function initCalendar() {
    // Użyj istniejących przycisków z HTML
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    
    if (prevBtn) prevBtn.addEventListener('click', prevMonth);
    if (nextBtn) nextBtn.addEventListener('click', nextMonth);
    
    // Wyrenderuj kalendarz
    renderCalendar();
    
    // Podświetl dzisiaj
    highlightToday();
}

// Render kalendarza (używa TWÓJ header i legendę)
function renderCalendar() {
    const calendarContainer = document.getElementById('calendarContainer');
    const monthYearElement = document.getElementById('currentMonth');
    
    if (!calendarContainer || !monthYearElement) {
        console.log('Brak elementów kalendarza');
        return;
    }
    
    // Aktualizuj nazwę miesiąca w TWOIM headerze
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    monthYearElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Usuń poprzednią siatkę (zachowaj header i legendę)
    const existingGrid = calendarContainer.querySelector('.calendar-grid');
    if (existingGrid) existingGrid.remove();
    
    // Stwórz nową siatkę
    const grid = document.createElement('div');
    grid.className = 'calendar-grid';
    grid.id = 'calendarGrid';
    
    // Dni tygodnia
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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
        grid.appendChild(createEmptyDay());
    }
    
    // Dni miesiąca
    for (let day = 1; day <= daysInMonth; day++) {
        grid.appendChild(createDayElement(day));
    }
    
    calendarContainer.appendChild(grid);
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
    
    const dayOfCycle = (dayNumber % 28) || 28;
    
    // Warstwa hormonalna (dni 1-7, 21-28)
    if ((dayOfCycle >= 1 && dayOfCycle <= 7) || (dayOfCycle >= 21 && dayOfCycle <= 28)) {
        const hormonalLayer = document.createElement('div');
        hormonalLayer.className = 'calendar-layer layer-hormonal';
        layersContainer.appendChild(hormonalLayer);
    }
    
    // Histamina (owulacja ~dzień 14)
    if (Math.abs(dayOfCycle - 14) <= 3) {
        const histamineLayer = document.createElement('div');
        histamineLayer.className = 'calendar-layer layer-histamine';
        layersContainer.appendChild(histamineLayer);
    }
    
    // Menopauza (losowo)
    if (Math.random() > 0.7) {
        const menopauseLayer = document.createElement('div');
        menopauseLayer.className = 'calendar-layer layer-menopause';
        layersContainer.appendChild(menopauseLayer);
    }
    
    dayElement.appendChild(layersContainer);
    
    // Kliknięcie = szczegóły
    dayElement.addEventListener('click', function() {
        showDayDetails(dayNumber);
    });
    
    dayElement.title = `Day ${dayNumber} - Click for details`;
    
    return dayElement;
}

// Szczegóły dnia
function showDayDetails(dayNumber) {
    const dayOfCycle = (dayNumber % 28) || 28;
    let predictions = [];
    
    if (dayOfCycle <= 7) {
        predictions.push('Menstrual phase: Higher iron needs');
    } else if (dayOfCycle <= 14) {
        predictions.push('Follicular phase: Rising energy');
    } else if (dayOfCycle <= 21) {
        predictions.push('Ovulation: Peak fertility');
    } else {
        predictions.push('Luteal phase: Progesterone rising');
    }
    
    const allPredictions = [
        'Low histamine day - safe for fermented foods',
        'High histamine risk - avoid leftovers',
        'Good day for intense exercise',
        'Rest and recovery recommended',
        'Brain fog risk elevated',
        'Optimal day for creative work',
        'Social energy high',
        'Need for alone time'
    ];
    
    const randomCount = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < randomCount; i++) {
        const randomPred = allPredictions[Math.floor(Math.random() * allPredictions.length)];
        if (!predictions.includes(randomPred)) {
            predictions.push(randomPred);
        }
    }
    
    const predictionsText = predictions.map(p => `• ${p}`).join('\n');
    alert(`Day ${dayNumber} Predictions:\n\n${predictionsText}\n\nThis is demo data. Real predictions will come from Aegisens AI.`);
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

// Ustaw funkcje globalnie
window.initCalendar = initCalendar;
window.prevMonth = prevMonth;
window.nextMonth = nextMonth;
