document.getElementById('search-icon').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    if (city) {
        getWeather(city);
    } else {
        alert('Please enter a city name');
    }
});

function getWeather(city) {
    let id = '9505fd1df737e20152fbd78cdb289b6a';
    let url = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + id + '&q=' + city;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            document.getElementById('weather-display').innerHTML = `<p>${error.message}</p>`;
        });
}

function displayWeather(data) {
    const weatherDisplay = document.getElementById('weather-display');
    const { name, main, weather } = data;
    const icon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    weatherDisplay.innerHTML = `
        <h2>${name}</h2>
        <img src="${icon}" alt="${weather[0].description}">
        <p>${weather[0].description}</p>
        <p>Temperature: ${main.temp}°C</p>
        <p>Humidity: ${main.humidity}%</p>
    `;
}




document.getElementById('city-input').addEventListener('input', function() {
    const query = this.value;
    if (query.length > 2) { // Start showing suggestions after 3 characters
        getCitySuggestions(query);
    } else {
        document.getElementById('suggestions').style.display = 'none';
    }
});

function getCitySuggestions(query) {
    let id = '9505fd1df737e20152fbd78cdb289b6a';
    let url = `https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&sort=population&cnt=5&appid=${id}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            showSuggestions(data.list);
        })
        .catch(error => {
            console.error('Error fetching suggestions:', error);
        });
}

function showSuggestions(cities) {
    const suggestionsBox = document.getElementById('suggestions');
    suggestionsBox.innerHTML = ''; // Clear previous suggestions
    if (cities.length === 0) {
        suggestionsBox.style.display = 'none';
        return;
    }

    cities.forEach(city => {
        const suggestionItem = document.createElement('p');
        suggestionItem.textContent = `${city.name}, ${city.sys.country}`;
        suggestionItem.addEventListener('click', function() {
            document.getElementById('city-input').value = city.name;
            document.getElementById('suggestions').style.display = 'none';
            getWeather(city.name); // Fetch weather for the selected city
        });
        suggestionsBox.appendChild(suggestionItem);
    });

    suggestionsBox.style.display = 'block';
}

