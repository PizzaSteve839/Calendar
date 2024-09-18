let display = document.getElementById('display');
const buttons = document.getElementById('keys').querySelectorAll('button');

function displayInput(input){
    display.value += input;
}

function clearDisplay(){
    display.value = '';
}

function calculate(){
    try{
        display.value = eval(display.value);
    }
    catch(Error){
        display.value = 'Error'
    }
}

function initButtons(){
    buttons.forEach(b => {
        if (b.classList.contains('numberKey') || b.classList.contains('decimalDot')){
            b.addEventListener('click', () => displayInput(b.innerText));
        }
        else if (b.id === 'clearKey'){
            b.addEventListener('click', () => clearDisplay());
        }
        else if (b.classList.contains('operator')){
            b.addEventListener('click', () => displayInput(
                ' ' + b.innerText + ' '));
        }
        else if (b.id === 'calculateKey'){
            b.addEventListener('click', () => calculate())
        }
    }); 
}

initButtons();