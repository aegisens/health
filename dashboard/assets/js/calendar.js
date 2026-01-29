// ===== HORMONAL CALENDAR =====
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Initialize calendar
function initCalendar() {
    renderCalendar();
    
    // Add event listeners for navigation
    document.getElementById('prevMonth')?.addEventListener('click', prevMonth);
    document.getElementById('nextMonth')?.addEventListener('click', nextMonth);
    
    // Set today's date
    highlightToday();
}

// Render calendar for current month
function renderCalendar() {
    const calendarContainer = document.getElementById('calendarContainer');
    const monthYearElement = document.getElementById('currentMonth');
    
    if (!calendarContainer || !monthYearElement) return;
    
    // Update month/year display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    monthYearElement.textContent = ${monthNames[currentMonth]} ${currentYear};
    
    // Clear container
    calendarContainer.innerHTML = '';
    
    // Get first day of month and total days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Add day labels (optional)
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayLabels.forEach(label => {
        const dayLabel = document.createElement('div');
        dayLabel.className = 'calendar-day-label';
        dayLabel.textContent = label;
        calendarContainer.appendChild(dayLabel);
    });
    
    // Add empty cells for days before first day
    for (let i = 0; i < firstDay; i++) {
        calendarContainer.appendChild(createEmptyDay());
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        calendarContainer.appendChild(createDayElement(day));
    }
}

// Create an empty day cell
function createEmptyDay() {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day empty';
    return emptyDay;
}

// Create a day element with hormonal layers
function createDayElement(dayNumber) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    
    // Check if today
    const today = new Date();
    if (currentYear === today.getFullYear() && 
        currentMonth === today.getMonth() && 
        dayNumber === today.getDate()) {
        dayElement.classList.add('today');
    }
    
    // Add day number
    const dayNumberSpan = document.createElement('div');
    dayNumberSpan.className = 'calendar-day-number';
    dayNumberSpan.textContent = dayNumber;
    dayElement.appendChild(dayNumberSpan);
    
    // Add hormonal layers (simulated data)
    const layersContainer = document.createElement('div');
    layersContainer.className = 'calendar-layers';
    
    // Simulate hormonal data based on day of cycle
    // This is demo data - replace with real logic later
    const dayOfCycle = (dayNumber % 28) + 1;
    
    // Hormonal layer (strong in days 1-7, 21-28)
    if ((dayOfCycle >= 1 && dayOfCycle <= 7) || (dayOfCycle >= 21 && dayOfCycle <= 28)) {
        const hormonalLayer = document.createElement('div');
        hormonalLayer.className = 'calendar-layer layer-hormonal';
        layersContainer.appendChild(hormonalLayer);
    }
    
    // Histamine layer (peaks around ovulation ~day 14)
    if (Math.abs(dayOfCycle - 14) <= 3) {
        const histamineLayer = document.createElement('div');
        histamineLayer.className = 'calendar-layer layer-histamine';
        layersContainer.appendChild(histamineLayer);
    }
    
    // Menopause layer (random for demo)
    if (Math.random() > 0.7) {
		const menopauseLayer = document.createElement('div');
        menopauseLayer.className = 'calendar-layer layer-menopause';
        layersContainer.appendChild(menopauseLayer);
    }
    
    dayElement.appendChild(layersContainer);
    
    // Add click event
    dayElement.addEventListener('click', function() {
        showDayDetails(dayNumber);
    });
    
    // Add tooltip
    dayElement.title = Day ${dayNumber} - Click for details;
    
    return dayElement;
}

// Show details for a specific day
function showDayDetails(dayNumber) {
    const dayOfCycle = (dayNumber % 28) + 1;
    let predictions = [];
    
    // Demo predictions based on day of cycle
    if (dayOfCycle <= 7) {
        predictions.push('Menstrual phase: Higher iron needs');
    } else if (dayOfCycle <= 14) {
        predictions.push('Follicular phase: Rising energy');
    } else if (dayOfCycle <= 21) {
        predictions.push('Ovulation: Peak fertility');
    } else {
        predictions.push('Luteal phase: Progesterone rising');
    }
    
    // Add random predictions for demo
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
    
    // Add 1-2 random predictions
    const randomCount = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < randomCount; i++) {
        const randomPred = allPredictions[Math.floor(Math.random() * allPredictions.length)];
        if (!predictions.includes(randomPred)) {
            predictions.push(randomPred);
        }
    }
    
    // Show in a modal or alert
    const predictionsText = predictions.map(p => • ${p}).join('\n');
    alert(Day ${dayNumber} Predictions:\n\n${predictionsText}\n\nThis is demo data. Real predictions will come from Aegisens AI.);
}

// Highlight today's date
function highlightToday() {
    const today = new Date();
    if (currentYear === today.getFullYear() && currentMonth === today.getMonth()) {
        // Today will already be highlighted via CSS class
        // Scroll to today if possible
        setTimeout(() => {
            const todayElement = document.querySelector('.calendar-day.today');
            if (todayElement) {
                todayElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 500);
    }
}

// Navigate to previous month
function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

// Navigate to next month
function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

// Make functions available globally
window.initCalendar = initCalendar;
window.prevMonth = prevMonth;
window.nextMonth = nextMonth;
