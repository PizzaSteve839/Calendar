let nav = 0;
let clicked = null;
let events = localStorage.getItem('event') ? JSON.parse(localStorage.getItem('event')) : [];

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
            
            let eventForDay = events.find(e => e.date === `${i - paddingDays}/${month + 1}/${year}`);
            if(eventForDay){
                let eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = eventForDay.title;
                daySquare.appendChild(eventDiv);
                daySquare.addEventListener('click', () => openDeleteEventModal(`${i - paddingDays}/${month + 1}/${year}`));
            }else{
                daySquare.addEventListener('click', () => openNewEventModal(`${i - paddingDays}/${month + 1}/${year}`));
            }

        }
        else{
            daySquare.classList.add('padding');
        }
        
        if(i-paddingDays === day && nav === 0){
            daySquare.id = 'currentDay';
        }
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

    document.getElementById('closeButton').addEventListener('click', () => {closeModal()});
    document.getElementById('deleteButton').addEventListener('click', () => {
        deleteEvent();
        closeModal();
    });
}

function closeModal(){
    overlay.style.display = 'none';
    document.getElementById('newEventModal').style.display = 'none';
    document.getElementById('deleteEventModal').style.display = 'none';
    load();
}

function saveEvent(){
    if(document.getElementById('eventInput').value){
        events.push({
            date: clicked,
            title: document.getElementById('eventInput').value
        });
        localStorage.setItem('event', JSON.stringify(events));
    }
    document.getElementById('eventInput').value = '';
}

function deleteEvent(){
    date = clicked;
    events = events.filter(e => e.date !== clicked);
    localStorage.setItem('event', JSON.stringify(events));
}

function openNewEventModal(date){
    clicked = date;
    document.getElementById('newEventModal').style.display = 'block';
    overlay.style.display = 'block';
}

function openDeleteEventModal(date){
    clicked = date;
    document.getElementById('deleteEventModal').style.display = 'block';
    const eventForDay = events.find(e => e.date === clicked);
    document.getElementById('eventDate').innerText = clicked;
    document.getElementById('eventId').innerText = eventForDay.title;
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

document.getElementById('eventInput').addEventListener('keypress', (e) => {
    if(e.key === 'Enter'){
        saveEvent();
        closeModal();
    }
});

load();
initButtons();