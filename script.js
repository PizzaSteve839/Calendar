let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const weekday = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const calendar = document.getElementById('calendar');

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

    for(i=1; i<=paddingDays + daysInMonth; i++){
        let daySquare = document.createElement('div')
        calendar.appendChild(daySquare);
        
        if(i>paddingDays){
            daySquare.innerText = i - paddingDays;
            daySquare.classList.add('day');
        }
        else{
            daySquare.classList.add('padding');
        }
        
        if(i-paddingDays === day && nav ===0){
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
}

load();
initButtons();