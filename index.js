const loadingMsg = document.getElementById("loadingMsg");
const mainContainer = document.querySelector(".main-container");
const weatherImg1 = document.getElementsByClassName("weatherImg")[0];
const weatherType = document.getElementById("weatherType");
function geolocate() {
    navigator.geolocation.watchPosition(setCoords);
}
async function setCoords(position) {
    let lat = position.coords.latitude;
    let log = position.coords.longitude;
    console.log(`Geolocated with Latitude: ${lat} Longitude: ${log}`)
    console.log("Fetching data from Openweathermap...")
    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${log}&units=imperial&appid=943f1223b9996ecae3cb1fe9233e975b`);
    if (!response.ok) {
        loadingMsg.innerText = (`Error ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    else {
        const weatherData = await response.json();
        loadingMsg.classList.add("hidden");
        mainContainer.classList.remove("hidden");
        setMainData(weatherData);
    }
}

function setMainData(weatherData) {
    console.log(weatherData);
    const date = document.getElementById("date");
    const location = document.getElementById("location");
    const temperature = document.getElementById("temperature");
    const humidity = document.getElementById("humidity");
    const wind = document.getElementById("wind");
    const currentDate = new Date();
    date.textContent = currentDate;
    temperature.textContent = `${Math.round(weatherData.main.temp)}° F (${Math.round(weatherData.main.temp_max)}°/${Math.round(weatherData.main.temp_min)}°)`;
    location.textContent = weatherData.name;
    weatherType.textContent = `${weatherData.weather[0].description}`;
    humidity.textContent = ` ${weatherData.main.humidity}%`;
    wind.textContent = ` ${Math.round(weatherData.wind.speed)}mph`;
    iconSelector(weatherData.weather[0].main, weatherImg1, currentDate);
}

function iconSelector(weatherDesc, img, currentDate) {
    switch (weatherDesc) {
        case "Thunderstorm":
            img.add("pe-is-w-mix-rainfall-2");
            break;
        case "Drizzle":
            img.classList.add("pe-is-w-drizzle");
            break;
        case "Rain":
            img.classList.add("pe-is-w-rain-1");
            break;
        case "Snow":
            img.classList.add("pe-is-w-snow");
            break;
        case "Mist":
        case "Smoke":
        case "Haze":
        case "Dust":
        case "Sand":
        case "Ash":
        case "Squall":
            img.classList.add("pe-is-w-mist");
            break;
        case "Fog":
            img.classList.add("pe-is-w-fog-1");
            break;
        case "Tornado":
            img.classList.add("pe-is-w-tornado-1");
            break;
        case "Clear":
            img.classList.add("pe-is-w-sun-1 pe-spin");
            break;
        case "Clouds":
            img.classList.add("pe-is-w-mostly-cloudy-1");
            break;
    }
}
function hamUIAnimate(state) {
    if (state == 1) {
        document.getElementById("hamUI").classList.remove("hamAnimateBack");
        document.getElementById("hamUI").classList.remove("hidden");
        document.getElementById("hamUI").classList.add("hamAnimateStart");
    }
    else {
        document.getElementById("hamUI").classList.remove("hamAnimateStart");
        document.getElementById("hamUI").classList.add("hamAnimateBack");
        setTimeout(() => {
            document.getElementById("hamUI").classList.add("hidden");
        }, 500);
    }
}

geolocate();
    //Add if statements in cases for checking time of day to set the icon to the moon/sun
    //Add a analog clock that detects the date and get hourly weather icons to attach to the hands of the clock to work as an hourly weather clock for the day