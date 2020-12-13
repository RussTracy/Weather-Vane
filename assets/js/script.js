var cityFormEl = document.querySelector("#city-form");
var cityNameInputEl = document.querySelector("#cityname");
var currentWeatherEl = document.querySelector('#current-weather');
var searchEl = document.querySelector('#search');
var historyButtonsEl = document.querySelector("#history-buttons")
var historyCardEl = document.querySelector("#history")
var trashEl = document.querySelector("#trash")
var searchHistoryArray = []


var formSubmitHandler = function (event) {
    event.preventDefault();
    // get city name value from input element
    var cityname = cityNameInputEl.value.trim();

    // Set city name in local storage and generate history buttons
    if (cityname) {
        searchHistoryArray.push(cityname);
        localStorage.setItem("weatherSearch", JSON.stringify(searchHistoryArray));
        var searchHistoryEl = document.createElement('button');
        searchHistoryEl.className = "btn";
        searchHistoryEl.setAttribute("data-city", cityname)
        searchHistoryEl.innerHTML = cityname;
        historyButtonsEl.appendChild(searchHistoryEl);
        historyCardEl.removeAttribute("style")
        getWeatherInfo(cityname);
        cityNameInputEl.value = "";
    }
    else {
        alert("Please enter a City name");
    }

}

// Get weather information from OpenWeather
var getWeatherInfo = function (cityname) {
    var apiCityUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&appid=f97301447cbd41068af8623a398ba1fb";
    fetch(
        // Make a fetch request using city name to get latitude and longitude for city
        apiCityUrl
    )
        .then(function (cityResponse) {
            return cityResponse.json();
        })
        .then(function (cityResponse) {
            // Create variables to hold the latitude and longitude of requested city
            console.log(cityResponse)
            var latitude = cityResponse.coord.lat;
            var longitude = cityResponse.coord.lon;

            // Create variables for City name, current date and icon information for use in current Weather heading
            var city = cityResponse.name;
            var today = new Date();
            var date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
            var weatherIcon = cityResponse.weather[0].icon;
            var weatherIconLink = "<img src='http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png' />"

            // Empty Current Weather element for new data
            currentWeatherEl.textContent = "";

            // Create <h2> element for current weather card
            var cityHeaderEl = document.createElement('h2');
            cityHeaderEl.classList = "card-header";
            cityHeaderEl.id = "weather-status";
            cityHeaderEl.innerHTML = city + " (" + date + ") " + weatherIconLink;

            // Add class name 'card' to current weather card and prepend <h2> element to top of card
            currentWeatherEl.className = "card";
            currentWeatherEl.prepend(cityHeaderEl);

            // Return a fetch request to the OpenWeather using longitude and latitude from pervious fetch
            return fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=alerts,minutely&units=imperial&appid=f97301447cbd41068af8623a398ba1fb');
        })
        .then(function (response) {
            // return response in json format
            return response.json();
        })
        .then(function (response) {
            console.log(response);
            // send response data to displayWeather function for final display 
            displayWeather(response);

        });
};

// Display the weather on page
var displayWeather = function (weather) {
    // check if api returned any weather data
    if (weather.length === 0) {
        weatherContainerEl.textContent = "No weather data found.";
        return;
    }
    // Create Temperature element
    var temperature = document.createElement('p')
    temperature.id = "temperature";
    temperature.innerHTML = "<strong>Temperature:</strong> " + weather.current.temp.toFixed(1) + "°F";
    currentWeatherEl.appendChild(temperature);

    // Create Humidity element
    var humidity = document.createElement('p')
    humidity.id = "humidity";
    humidity.innerHTML = "<strong>Humidity:</strong> " + weather.current.humidity + "%";
    currentWeatherEl.appendChild(humidity);

    // Create Wind Speed element
    var windSpeed = document.createElement('p')
    windSpeed.id = "wind-speed";
    windSpeed.innerHTML = "<strong>Wind Speed:</strong> " + weather.current.wind_speed.toFixed(1) + " MPH";
    currentWeatherEl.appendChild(windSpeed);

    // Create uv-index element
    var uvIndex = document.createElement('p')
    uvIndex.id = "uv-index";
    uvIndex.innerHTML = "<strong>UV Index:</strong> " + weather.current.uvi;
    currentWeatherEl.appendChild(uvIndex);
}

// Load any past city weather searches
var loadHistory = function () {
    searchArray = JSON.parse(localStorage.getItem("weatherSearch"));

    if (searchArray) {
        searchHistoryArray = JSON.parse(localStorage.getItem("weatherSearch"));
        for (let i = 0; i < searchArray.length; i++) {
            var searchHistoryEl = document.createElement('button');
            searchHistoryEl.className = "btn";
            searchHistoryEl.setAttribute("data-city", searchArray[i])
            searchHistoryEl.innerHTML = searchArray[i];
            historyButtonsEl.appendChild(searchHistoryEl);
            historyCardEl.removeAttribute("style")
        }

    }
}

// Search weather using search history buttons
var buttonClickHandler = function (event) {
    var cityname = event.target.getAttribute("data-city")
    if (cityname) {
        getWeatherInfo(cityname);
    }
}

// Clear Search History
var clearHistory = function (event) {
    localStorage.removeItem("weatherSearch")
    historyCardEl.setAttribute("style", "display: none")
}

cityFormEl.addEventListener("submit", formSubmitHandler);
historyButtonsEl.addEventListener("click", buttonClickHandler);
trashEl.addEventListener("click", clearHistory);

loadHistory();