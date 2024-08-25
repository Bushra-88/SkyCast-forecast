function refreshWeather(response) {
  let cityElement = document.querySelector("#city");
  let city = response.data.city;

  let timeElement = document.querySelector("#time");
  let date = new Date(response.data.time * 1000);

  let descriptionElement = document.querySelector("#description");
  let description = response.data.condition.description;

  let humidityElement = document.querySelector("#humidity");
  let humidity = `${response.data.temperature.humidity}%`;

  let windSpeedElement = document.querySelector("#wind-speed");
  let windSpeed = `${response.data.wind.speed} km/h`;

  let temperatureElement = document.querySelector("#temperature");
  let temperature = response.data.temperature.current;

  let iconElement = document.querySelector("#icon");

  cityElement.innerHTML = city;
  timeElement.innerHTML = formatDate(date);
  descriptionElement.innerHTML = description;
  humidityElement.innerHTML = humidity;
  windSpeedElement.innerHTML = windSpeed;
  temperatureElement.innerHTML = Math.round(temperature);
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}"class="weather-app-icon" />`;

  getForecast(response.data.city);
}

function formatDate(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    " Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (hours < 10) {
    hours = `0${hours}`;
  }
  return `${day} ${hours}:${minutes}`;
}

function searchCity(city) {
  let apiKey = "6b8a7398o06094tf908737c5b44dce83";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(refreshWeather);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");

  searchCity(searchInput.value);
}

//Get the forecast data
function getForecast(city) {
  let apiKey = "6b8a7398o06094tf908737c5b44dce83";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

  axios(apiUrl).then(displayForecast);
}

//Get format day
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[(date.getDay() + 1) % 7]; // +1 to make sure the forecast start from the next day 'not today' and the %7 to  ensure that the day of the week wraps around to Sunday (0)
}

//Build the forecast
function displayForecast(response) {
  let forecastHtml = "";
  //Use the loop to create html for each day
  response.data.daily.forEach(function (day, index) {
    if (index < 6) {
      forecastHtml =
        forecastHtml +
        `
      <div class="weather-forecast-day">
             <div class="weather-forecast-date">${formatDay(day.time)}</div>
             <div>
             <img src= "${
               day.condition.icon_url
             }"  class="weather-forecast-icon"/>
             </div>
             <div class="weather-forecast-temperatures">
               <div class="weather-forecast-temperature">
                 <strong>${Math.round(day.temperature.maximum)}</strong>
               </div>
               <div class="weather-forecast-temperature">${Math.round(
                 day.temperature.minimum
               )}</div>
             </div>
           </div>
     `;
    }
  });
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);
searchCity("Ghent");
