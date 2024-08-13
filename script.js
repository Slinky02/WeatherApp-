document.addEventListener("DOMContentLoaded", () => {
    const apiKey = 'b159b54464fafa63fa6862689a514995'; // API key added here
    const defaultCity = 'Johannesburg';

    populateCityDropdown();

    // Initialize weather data for default city
    fetchWeatherData(defaultCity);

    // Handle city selection
    document.querySelector('#city-select').addEventListener('change', (event) => {
        const selectedCity = event.target.value;
        if (selectedCity) {
            fetchWeatherData(selectedCity);
        }
    });

    // Handle button click for manual location change
    document.querySelector('.location-button').addEventListener('click', () => {
        const newCity = prompt('Enter city name:');
        if (newCity) {
            fetchWeatherData(newCity);
        }
    });
});

const southAfricanCities = [
    'Johannesburg',
    'Cape Town',
    'Durban',
    'Pretoria',
    'Port Elizabeth',
    'Bloemfontein',
    'East London',
    'Kimberley',
    'Nelspruit',
    'Polokwane'
];

function populateCityDropdown() {
    const citySelect = document.querySelector('#city-select');
    southAfricanCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
}

function fetchWeatherData(city) {
    const apiKey = 'b159b54464fafa63fa6862689a514995'; // API key added here
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                updateWeatherUI(data);
                fetchWeeklyForecast(city);
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Failed to fetch weather data. Please try again.');
        });
}

function updateWeatherUI(data) {
    document.querySelector('.date-dayname').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    document.querySelector('.date-day').textContent = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    document.querySelector('.location').textContent = `${data.name}, ${data.sys.country}`;
    document.querySelector('.weather-temp').textContent = `${Math.round(data.main.temp)}°C`;
    document.querySelector('.weather-desc').textContent = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);

    const icon = document.querySelector('.weather-icon');
    icon.setAttribute('data-feather', getWeatherIcon(data.weather[0].main));
    feather.replace();
}

function getWeatherIcon(weatherMain) {
    switch (weatherMain) {
        case 'Clear':
            return 'sun';
        case 'Clouds':
            return 'cloud';
        case 'Snow':
            return 'cloud-snow';
        case 'Rain':
            return 'cloud-rain';
        default:
            return 'sun';
    }
}

function fetchWeeklyForecast(city) {
    const apiKey = 'b159b54464fafa63fa6862689a514995'; // API key added here
    fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&appid=${apiKey}&units=metric&cnt=7`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '200') {
                updateWeeklyForecastUI(data);
            } else {
                console.error('Error fetching weekly forecast:', data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching weekly forecast:', error);
        });
}

function updateWeeklyForecastUI(data) {
    const weekList = document.querySelector('.week-list');
    weekList.innerHTML = '';
    data.list.forEach(day => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <i class="day-icon" data-feather="${getWeatherIcon(day.weather[0].main)}"></i>
            <span class="day-name">${new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</span>
            <span class="day-temp">${Math.round(day.temp.day)}°C</span>
        `;
        weekList.appendChild(listItem);
    });
    feather.replace();
}



function fetchCurrentWeather(city) {
    const apiKey = 'b159b54464fafa63fa6862689a514995';
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                updateCurrentWeatherUI(data);
            } else {
                console.error('Error fetching current weather:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function updateCurrentWeatherUI(data) {
    const container = document.querySelector('#current-weather');
    container.innerHTML = `
        <p>Location: ${data.name}, ${data.sys.country}</p>
        <p>Temperature: ${Math.round(data.main.temp)}°C</p>
        <p>Weather: ${data.weather[0].description}</p>
    `;
}


function fetchHourlyForecast(city) {
    const apiKey = 'b159b54464fafa63fa6862689a514995';
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '200') {
                updateHourlyForecastUI(data);
            } else {
                console.error('Error fetching hourly forecast:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function updateHourlyForecastUI(data) {
    const container = document.querySelector('#hourly-forecast');
    container.innerHTML = '';
    data.list.forEach(item => {
        container.innerHTML += `
            <div>
                <p>Time: ${new Date(item.dt * 1000).toLocaleTimeString()}</p>
                <p>Temperature: ${Math.round(item.main.temp)}°C</p>
            </div>
        `;
    });
}



function fetchDailyForecast(city) {
    const apiKey = 'b159b54464fafa63fa6862689a514995';
    fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&appid=${apiKey}&units=metric&cnt=7`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '200') {
                updateDailyForecastUI(data);
            } else {
                console.error('Error fetching daily forecast:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function updateDailyForecastUI(data) {
    const container = document.querySelector('#daily-forecast');
    container.innerHTML = '';
    data.list.forEach(day => {
        container.innerHTML += `
            <div>
                <p>Date: ${new Date(day.dt * 1000).toLocaleDateString()}</p>
                <p>Temperature: ${Math.round(day.temp.day)}°C</p>
            </div>
        `;
    });
}



function fetchHistoricalWeather(lat, lon, date) {
    const apiKey = 'b159b54464fafa63fa6862689a514995';
    const timestamp = Math.floor(new Date(date).getTime() / 1000);
    fetch(`https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${timestamp}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                updateHistoricalWeatherUI(data);
            } else {
                console.error('Error fetching historical weather:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function updateHistoricalWeatherUI(data) {
    const container = document.querySelector('#historical-weather');
    container.innerHTML = `
        <p>Date: ${new Date(data.current.dt * 1000).toLocaleDateString()}</p>
        <p>Temperature: ${Math.round(data.current.temp)}°C</p>
        <p>Weather: ${data.current.weather[0].description}</p>
    `;
}



