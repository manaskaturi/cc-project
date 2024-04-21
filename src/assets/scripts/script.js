// API key
const API_KEY = '1bdadfc9d804abc0714be16f00a8482f'; // Replace 'YOUR_API_KEY_HERE' with your actual API key

let city = '';
let state = '';
let country = '';
let url = '';
let env = '';

if(window.location.href.includes('netlify')) {
    env = 'production'
} else {
    env = 'local'
}

const ROOT = document.querySelector('main');
const STATS = document.getElementById('_stats');
const loader = document.getElementById('loader-wrapper');

function getCityName(val) {
    city = val;
}

function getStateName(val) {
    state = val;
}

function getCountryName(val) {
    country = val;
}

function showNextCard(prevCard) {
    const card = document.getElementById(prevCard);
    if(card.value != '') {
        if (prevCard == 'city-name') {
            document.getElementById('city-card').style.display = 'none';
            document.getElementById('state-card').style.display = 'block';
        } else {
            document.getElementById('state-card').style.display = 'none';
            document.getElementById('country-card').style.display = 'block';
        }
    } else {
        card.style.outline = "5px solid red";
        card.setAttribute('placeholder', 'Required');
    }
}

function checkLength(id) {
    const card = document.getElementById(id);
    if(card.value.length >= 2) {
        card.style.outline = '5px solid green';
    }
}

function getResult() {
    STATS.style.display = 'none';
    loader.style.display = 'flex';
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},${country}&appid=${API_KEY}&units=metric`;
    fetch(url)
        .then((response) => {
            if(response.status == '200') {
                return response.json();
            } else {
                return 'Error';
            }
        })
        .then((json) => {
            renderResult('success', json);
        })
        .catch(error => {
            console.error(error);
            renderResult('failure', error);
        });
}

function renderResult(status, data) {
    loader.style.display = 'none';
    STATS.style.display = 'flex';
    STATS.innerHTML = '';
    switch(status) {
        case 'success':
            successCard(data);
            break;
        
        case 'failure':
            failureCard(data);
            break;
        default: 
            //
    }
}

function successCard(data) {
    STATS.innerHTML = `
    <div class="stat-card">
    <h1>${data.name}</h1>
    <span class="separator">
        &#9679;
    </span>
    <h4>City</h4>
    </div>
    <div class="stat-card">
    <h1>${data.main.temp} &#176;C</h1>
    <span class="separator">
        &#9679;
    </span>
    <h4>Temperature</h4>
    </div>
    <div class="stat-card">
    <h1>${data.main.humidity}%</h1>
    <span class="separator">
        &#9679;
    </span>
    <h4>Humidity</h4>
    </div>
    <div class="stat-card">
    <h1>${data.wind.speed}m/s</h1>
    <span class="separator">
        &#9679;
    </span>
    <h4>Wind speed</h4>
    </div>
    `;
}

function failureCard(data) {
    STATS.innerHTML = `
    <p style="width: 100%;">
        Failed to fetch data. Please try again.
    </p>
    `;
}
