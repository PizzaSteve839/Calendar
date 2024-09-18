let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const weekday = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const calendar = document.getElementById('calendar');
const overlay = document.getElementById('overlay');

function load(){
    let dt = new Date();

    function capitalizeFirstLetter(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    if (nav !== 0){
        dt.setMonth(new Date().getMonth() + nav);
    }

    let day = dt.getDate();
    let month = dt.getMonth();
    let year = dt.getFullYear();

    let firstDayOfMonth = new Date(year, month, 1);
    let daysInMonth = new Date(year, month + 1, 0).getDate();

    let dateString = firstDayOfMonth.toLocaleDateString('es-es', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });

    let weekdayName = capitalizeFirstLetter(dateString.split(',')[0]);
    let paddingDays = weekday.indexOf(weekdayName);
    
    document.getElementById('monthDisplay').innerText = `${capitalizeFirstLetter(dt.toLocaleDateString('es-es', {month: 'long'}))} ${year}`;

    calendar.innerHTML = '';

    loadWeekdays();

    for( let i = 1; i <= paddingDays + daysInMonth; i++){
        let daySquare = document.createElement('div')
        calendar.appendChild(daySquare);
        
        if(i>paddingDays){
            daySquare.innerText = i - paddingDays;
            daySquare.classList.add('day');
            daySquare.addEventListener('click', () => openNewEventModal(`${year}-${month + 1}-${i - paddingDays}`));
            
            let eventForDay = events.find(e => e.date === `${year}-${month + 1}-${i - paddingDays}`);
            if(eventForDay){
                let eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = eventForDay.title;
                daySquare.appendChild(eventDiv);
            }
        }
        else{
            daySquare.classList.add('padding');
        }
        
        if(i-paddingDays === day && nav ===0){
            daySquare.id = 'currentDay';
        }

        let eventText = document.createElement('div');
        eventText.classList.add('event');
        daySquare.appendChild(eventText);
    }
}

function initButtons(){
    document.getElementById('nextMonth').addEventListener('click', () => {
        nav++;
        load();
    });
    document.getElementById('prevMonth').addEventListener('click', () => {
        nav--;
        load();
    });

    document.getElementById('cancelButton').addEventListener('click', () => {closeModal()});
    document.getElementById('saveEvent').addEventListener('click', () => {
        saveEvent();
        closeModal();
    });
}

function closeModal(){
    overlay.style.display = 'none';
    document.getElementById('newEventModal').style.display = 'none';
    load();
}

function saveEvent(){
    if(document.getElementById('eventInput').value){
        events.push({
            date: clicked,
            title: document.getElementById('eventInput').value
        });
    }else{
        alert('Por favor, introduce un evento antes de guardar');
    }
}

function openNewEventModal(date){
    clicked = date;
    const eventForDay = events.find(e => e.date === clicked);

    if(eventForDay){
        document.getElementById('eventInput').value = eventForDay.title;
    }else{
        document.getElementById('eventInput').value = '';
    }

    document.getElementById('newEventModal').style.display = 'block';
    overlay.style.display = 'block';
}


function loadWeekdays(){
    for(let j = 0; j < weekday.length; j++){
        let weekdays = document.createElement('div');
        calendar.appendChild(weekdays);
        weekdays.classList.add('weekday');
        if(window.innerWidth < 762){
            if(j !== 2){
                weekdays.innerText = weekday[j].charAt(0);
            }else{
                weekdays.innerText = 'X';
            }
        }else{
            weekdays.innerText = weekday[j];
        }
    }
}

window.addEventListener('resize', () => {
    loadWeekdays();
    load();
});


load();
initButtons();